const db = require("../models");
const Teacher = db.Teacher;
const User = db.User;

// Ambil profil guru berdasarkan ID User dari token
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { userId: req.userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "fullName", "role"],
        },
      ],
    });

    if (!teacher) {
      return res.status(404).send({ message: "Profile guru tidak ditemukan." });
    }

    res.status(200).send(teacher);
  } catch (error) {
    console.error("Error getProfile:", error);
    res.status(500).send({ message: "Terjadi kesalahan pada server." });
  }
};

// Update data NIP, Bio, Spesialisasi, dan Nama Lengkap
exports.updateTeacherProfile = async (req, res) => {
  try {
    const { nip, specialization, bio, fullName } = req.body;

    // Pastikan profil guru ada sebelum update
    const checkTeacher = await Teacher.findOne({
      where: { userId: req.userId },
    });
    if (!checkTeacher) {
      return res.status(404).send({ message: "Data guru tidak ditemukan." });
    }

    const result = await db.sequelize.transaction(async (t) => {
      // 1. Update Tabel User jika fullName dikirim
      if (fullName) {
        await User.update(
          { fullName },
          { where: { id: req.userId }, transaction: t },
        );
      }

      // 2. Update Tabel Teacher
      await Teacher.update(
        { nip, specialization, bio },
        { where: { userId: req.userId }, transaction: t },
      );

      // 3. Ambil data terbaru setelah update
      return await Teacher.findOne({
        where: { userId: req.userId },
        include: [
          { model: User, as: "user", attributes: ["fullName", "username"] },
        ],
        transaction: t,
      });
    });

    res.status(200).send({
      message: "Profil berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    console.error("Error updateProfile:", error);
    res.status(500).send({ message: error.message });
  }
};

// List semua guru (biasanya untuk dropdown atau daftar publik)
exports.findAll = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName"],
        },
      ],
      // Menghilangkan createdAt/updatedAt jika tidak perlu agar response lebih bersih
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).send(teachers);
  } catch (error) {
    res.status(500).send({ message: "Gagal mengambil daftar guru." });
  }
};
