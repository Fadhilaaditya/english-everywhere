const db = require('../models');
const Payment = db.Payment;
const Student = db.Student;
const Program = db.Program;
const Installment = db.PaymentInstallment;
const Op = db.Sequelize.Op;

// Create and Save a new Payment
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.transactionId || !req.body.amount || !req.body.deadline) {
        res.status(400).send({
            message: "Transaction ID, amount, and deadline are required!"
        });
        return;
    }

    try {
        // Create a Payment
        const paymentData = {
            transactionId: req.body.transactionId,
            invoiceNo: req.body.invoiceNo,
            studentId: req.body.studentId,
            programId: req.body.programId,
            amount: req.body.amount,
            deadline: req.body.deadline,
            status: req.body.status || 'Pending',
            paymentType: req.body.paymentType || 'Lunas',
            installmentCount: req.body.installmentCount || 0,
            vaNumber: req.body.vaNumber,
            bankName: req.body.bankName,
            snapToken: req.body.snapToken,
            paymentDate: req.body.paymentDate
        };

        const payment = await Payment.create(paymentData);

        // If it's installments, bulk create them
        if (req.body.paymentType === 'Cicilan' && req.body.installments && req.body.installments.length > 0) {
            const installments = req.body.installments.map(inst => ({
                paymentId: payment.id,
                installmentNumber: inst.installmentNumber,
                amount: inst.amount,
                dueDate: inst.dueDate,
                status: 'Pending'
            }));
            await Installment.bulkCreate(installments);
        }

        res.send(payment);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Payment."
        });
    }
};

// Retrieve all Payments from the database.
exports.findAll = (req, res) => {
    Payment.findAll({
        include: [
            { model: Student, as: 'student', attributes: ['name'] },
            { model: Program, as: 'program', attributes: ['title'] }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving payments."
            });
        });
};

// Find a single Payment with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Payment.findByPk(id, {
        include: [
            { model: Student, as: 'student' },
            { model: Program, as: 'program' }
        ]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Payment with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Payment with id=" + id
            });
        });
};

// Update a Payment by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Payment.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Payment was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Payment with id=${id}. Maybe Payment was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Payment with id=" + id
            });
        });
};

// Delete a Payment with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Payment.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Payment was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Payment with id=${id}. Maybe Payment was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Payment with id=" + id
            });
        });
};

// Get Payment Summary Stats
exports.getSummary = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const totalTransaction = await Payment.count();
        const totalTransactionToday = await Payment.count({
            where: {
                createdAt: {
                    [Op.gte]: today
                }
            }
        });
        const overduePayments = await Payment.count({
            where: {
                deadline: {
                    [Op.lt]: today
                },
                status: {
                    [Op.ne]: 'Success'
                }
            }
        });
        const pendingTransactions = await Payment.count({
            where: {
                status: 'Pending'
            }
        });

        res.send({
            totalTransaction,
            totalTransactionToday,
            overduePayments,
            pendingTransactions
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving payment summary."
        });
    }
};
