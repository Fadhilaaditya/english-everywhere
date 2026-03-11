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

        let totalTransactions = allPayments.length;
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

        // 2. Recent Appointments (New Bookings)
        const recentAppointments = await AppointmentBooking.findAll({
            where: { status: 'BOOKED' },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: ProgramSchedule,
                    as: 'schedule',
                    include: [{ model: Program, as: 'program' }]
                }
            ]
        });

        // 3. Last Transactions (Successful)
        const lastTransactions = await Payment.findAll({
            where: { status: 'Success' },
            limit: 5,
            order: [['paymentDate', 'DESC']],
            include: [
                { model: Student, as: 'student', attributes: ['name'] },
                { model: Program, as: 'program', attributes: ['title'] }
            ]
        });

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
                pendingPayments
            },
            appointments: recentAppointments.map(apt => ({
                name: apt.applicantName,
                date: apt.schedule?.date || '-',
                time: apt.schedule?.time || '-',
                test: apt.schedule?.program?.title || 'Placement Test'
            })),
            transactions: lastTransactions.map(trx => ({
                name: trx.student?.name || 'Unknown',
                plan: trx.program?.title || 'General English',
                amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(trx.amount)
            })),
            events: recentEvents
        });

    } catch (error) {
        console.error("Dashboard Data Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
