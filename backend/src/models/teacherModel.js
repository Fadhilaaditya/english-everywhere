module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define(
    "teachers",
    {
      // Nomor Induk Pegawai bersifat unik
      nip: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      // Bidang keahlian guru
      specialization: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Deskripsi diri atau profil singkat
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      // Foreign Key yang menghubungkan ke tabel users
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users", // Nama tabel referensi
          key: "id", // Kolom referensi
        },
      },
    },
    {
      // Opsional: Memastikan nama tabel tetap 'teachers' tanpa penambahan 's' otomatis
      tableName: "teachers",
      // Memberikan timestamp (createdAt, updatedAt) secara otomatis
      timestamps: true,
    },
  );

  return Teacher;
};
