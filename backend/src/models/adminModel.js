module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define(
    "admins",
    {
      // Nomor Induk Pegawai bersifat unik (jika ada)
      nip: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      // Profil Data (Sync with Teacher/Student)
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM("Male", "Female"),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      birthPlace: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Foreign Key yang menghubungkan ke tabel users
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "admins",
      timestamps: true,
    },
  );

  return Admin;
};
