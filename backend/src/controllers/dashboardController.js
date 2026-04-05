const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const Payment = db.Payment;
const PaymentInstallment = db.PaymentInstallment;
const AppointmentBooking = db.AppointmentBooking;
const ProgramSchedule = db.ProgramSchedule;
const Program = db.Program;
const Event = db.Event;
const Student = db.Student;

exports.getDashboardData = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Stats
        const totalAccounts = await User.count({
            where: {
                role: {
                    [Op.or]: ['student', 'teacher']
                }
            }
        });

        const allPayments = await Payment.findAll({
            include: [{ model: PaymentInstallment, as: 'installments' }]
        });

        const totalLunasSuccess = await Payment.count({
            where: {
                status: 'Success',
                paymentType: 'Lunas'
            }
        });
        const totalInstallmentsSuccess = await PaymentInstallment.count({
            where: { status: 'Success' }
        });

        const pendingAppointmentsCount = await AppointmentBooking.count({
            where: { status: 'PENDING' }
        });

        let totalTransactions = totalLunasSuccess + totalInstallmentsSuccess;
        let overduePayments = 0;
        let pendingPayments = 0;

        allPayments.forEach(payment => {
            const hasOverdueInstallment = payment.installments && payment.installments.some(inst =>
                inst.status === 'Pending' && new Date(inst.dueDate) < today
            );
            const isMainOverdue = payment.status === 'Pending' && new Date(payment.deadline) < today;

            if (isMainOverdue || hasOverdueInstallment) {
                overduePayments++;
            } else if (payment.status === 'Pending') {
                pendingPayments++;
            }
        });

        // 2. Recent Appointments (This Month, excluding Accepted)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('en-CA');
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString('en-CA');

        const recentAppointments = await AppointmentBooking.findAll({
            where: {
                status: { [Op.ne]: 'SUCCESS' }
            },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: ProgramSchedule,
                    as: 'schedule',
                    where: {
                        date: {
                            [Op.between]: [startOfMonth, endOfMonth]
                        }
                    },
                    include: [{ model: Program, as: 'program' }]
                }
            ]
        });

        // 3. Last Transactions (Successful)
        // Fetch standalone payments (Lunas)
        const lastLunasTransactions = await Payment.findAll({
            where: {
                status: 'Success',
                paymentType: 'Lunas'
            },
            limit: 20,
            order: [['paymentDate', 'DESC']],
            include: [
                { model: Student, as: 'student', attributes: ['name'] },
                { model: Program, as: 'program', attributes: ['title'] }
            ]
        });

        // Fetch installments
        const lastInstallmentTransactions = await PaymentInstallment.findAll({
            where: { status: 'Success' },
            limit: 20,
            order: [['paymentDate', 'DESC']],
            include: [
                {
                    model: Payment,
                    as: 'payment',
                    include: [
                        { model: Student, as: 'student', attributes: ['name'] },
                        { model: Program, as: 'program', attributes: ['title'] }
                    ]
                }
            ]
        });

        // Merge and sort
        const mergedTransactions = [
            ...lastLunasTransactions.map(trx => ({
                name: trx.student?.name || 'Unknown',
                plan: trx.program?.title || 'General English',
                amount: trx.amount,
                paymentDate: trx.paymentDate
            })),
            ...lastInstallmentTransactions.map(inst => ({
                name: inst.payment?.student?.name || 'Unknown',
                plan: inst.payment?.program?.title || 'General English',
                amount: inst.amount,
                paymentDate: inst.paymentDate
            }))
        ].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
            .slice(0, 20);

        // 4. Recent Events
        const recentEvents = await Event.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            stats: {
                totalAccounts,
                totalTransactions,
                overduePayments,
                pendingPayments,
                pendingAppointments: pendingAppointmentsCount
            },
            appointments: recentAppointments.map(apt => ({
                name: apt.applicantName,
                date: apt.schedule?.date || '-',
                time: apt.schedule?.time || '-',
                test: apt.schedule?.program?.title || 'Placement Test',
                status: apt.status
            })),
            transactions: mergedTransactions.map(trx => ({
                name: trx.name,
                plan: trx.plan,
                amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(trx.amount)
            })),
            events: recentEvents
        });

    } catch (error) {
        console.error("Dashboard Data Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
