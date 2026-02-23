module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define("payments", {
        transactionId: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        invoiceNo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        deadline: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('Success', 'Pending', 'Failed'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        paymentType: {
            type: Sequelize.ENUM('Lunas', 'Cicilan'),
            allowNull: false,
            defaultValue: 'Lunas'
        },
        installmentCount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
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

    return Payment;
};
