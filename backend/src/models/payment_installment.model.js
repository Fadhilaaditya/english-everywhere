module.exports = (sequelize, Sequelize) => {
    const PaymentInstallment = sequelize.define("payment_installments", {
        installmentNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        dueDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('Success', 'Pending', 'Failed'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        vaNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bankName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        snapToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        paymentDate: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return PaymentInstallment;
};
