module.exports = (sequelize, Sequelize) => {
  const TeacherSchedule = sequelize.define(
    "teacher_schedules",
    {
      day: {
        type: Sequelize.ENUM(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ),
        allowNull: false,
      },
      date: {
        // Menyimpan tanggal spesifik (YYYY-MM-DD)
        type: Sequelize.DATEONLY,
        allowNull: false, // Disarankan false jika sistem berbasis kalender
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      teacherName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      className: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        // Walaupun sebelumnya diminta hapus, status biasanya krusial
        // untuk membedakan jadwal yang masih kosong atau sudah di-book.
        type: Sequelize.STRING,
        defaultValue: "AVAILABLE",
      },
      // Definisi Foreign Key (Opsional tapi membantu integritas)
      teacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: "teachers",
          key: "id",
        },
      },
      programId: {
        type: Sequelize.INTEGER,
        references: {
          model: "programs",
          key: "id",
        },
      },
    },
    {
      // Memastikan nama tabel konsisten dengan database
      tableName: "teacher_schedules",
      timestamps: true,
    },
  );

  return TeacherSchedule;
};
