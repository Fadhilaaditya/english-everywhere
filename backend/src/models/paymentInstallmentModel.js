module.exports = (sequelize, Sequelize) => {
  const PaymentInstallment = sequelize.define(
    "payment_installment",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      installmentNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      dueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Success", "Pending", "Failed"),
        allowNull: false,
        defaultValue: "Pending",
      },
      vaNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      snapToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "payment_installments",
      timestamps: true, // Use createdAt and updatedAt
    }
  );

  return PaymentInstallment;
};
