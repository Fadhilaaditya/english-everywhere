module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define(
    "payment",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      invoiceNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      deadline: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Success", "Pending", "Failed"),
        allowNull: false,
        defaultValue: "Pending",
      },
      paymentType: {
        type: Sequelize.ENUM("Lunas", "Cicilan"),
        allowNull: false,
        defaultValue: "Lunas",
      },
      installmentCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      programId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "payments",
      timestamps: true, // Use createdAt and updatedAt
    }
  );

  return Payment;
};
