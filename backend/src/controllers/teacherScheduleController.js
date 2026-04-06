const db = require("../models");
const TeacherSchedule = db.TeacherSchedule;

// Ambil semua jadwal dengan Eager Loading (Program & Guru)
exports.findAll = async (req, res) => {
  const { programId, teacherId } = req.query;
  let condition = {};

  // Pastikan konversi ke Number untuk menghindari isu tipe data pada query
  if (programId) condition.programId = Number(programId);
  if (teacherId) condition.teacherId = Number(teacherId);

  try {
    const data = await TeacherSchedule.findAll({
      where: condition,
      include: [
        {
          model: db.Teacher,
          as: "teacher",
          include: [{ model: db.User, as: "user", attributes: ["fullName"] }],
        },
        {
          model: db.Program,
          as: "program",
          attributes: ["title"], // Mengambil 'title' sesuai struktur tabel programs kamu
        },
      ],
      // Tambahkan urutan agar tampilan di kalender/list rapi
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });
    res.send(data);
  } catch (err) {
    console.error("Error FindAll:", err);
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat mengambil jadwal.",
    });
  }
};

// Ambil jadwal khusus untuk guru yang sedang login
exports.findMySchedules = async (req, res) => {
  try {
    // 1. Cari profile guru berdasarkan userId (dari token)
    const teacher = await db.Teacher.findOne({
      where: { userId: req.userId }
    });

    if (!teacher) {
      return res.status(404).send({ message: "Profile guru tidak ditemukan." });
    }

    // 2. Ambil jadwal untuk teacherId tersebut
    const data = await TeacherSchedule.findAll({
      where: { teacherId: teacher.id },
      include: [
        {
          model: db.Program,
          as: "program",
          attributes: ["title"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });
    res.send(data);
  } catch (err) {
    console.error("Error findMySchedules:", err);
    res.status(500).send({ message: "Gagal mengambil jadwal Anda." });
  }
};

// Simpan jadwal baru
exports.create = async (req, res) => {
  try {
    // Validasi sederhana sebelum simpan
    if (!req.body.teacherId || (!req.body.programId && req.body.className !== 'Appointment') || !req.body.date) {
      return res
        .status(400)
        .send({ message: "ID Guru, ID Program, dan Tanggal wajib diisi!" });
    }

    const payload = {
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      teacherId: Number(req.body.teacherId),
      programId: req.body.programId ? Number(req.body.programId) : null,
      teacherName: req.body.teacherName, // Nama denormalisasi untuk pencarian cepat
      className: req.body.className, // Nama denormalisasi dari Program.title
      classroom: req.body.classroom,
      attendanceLink: req.body.attendanceLink,
      link: req.body.link,
    };

    const data = await TeacherSchedule.create(payload);
    res.status(201).send(data);
  } catch (err) {
    console.error("Error Create:", err);
    res.status(500).send({
      message: err.message || "Gagal membuat jadwal baru.",
    });
  }
};

// Update Jadwal
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    // Pastikan ID tersedia
    if (!id) return res.status(400).send({ message: "ID Jadwal diperlukan." });

    // Filter hanya field yang valid sesuai skema database
    const validFields = ['date', 'startTime', 'endTime', 'teacherId', 'programId', 'teacherName', 'className', 'classroom', 'attendanceLink', 'link'];
    const updateData = {};

    validFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Konversi tipe data jika perlu
    if (updateData.teacherId) updateData.teacherId = Number(updateData.teacherId);
    if (updateData.programId) updateData.programId = Number(updateData.programId);

    const [num] = await TeacherSchedule.update(updateData, {
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "Jadwal berhasil diperbarui." });
    } else {
      res.send({
        message: `Tidak dapat memperbarui jadwal dengan id=${id}. Mungkin data sama atau tidak ditemukan.`,
      });
    }
  } catch (err) {
    console.error("Error Update:", err);
    res.status(500).send({ message: "Gagal memperbarui jadwal." });
  }
};

// Hapus Jadwal
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await TeacherSchedule.destroy({ where: { id: id } });

    if (num == 1) {
      res.send({ message: "Jadwal berhasil dihapus." });
    } else {
      res
        .status(404)
        .send({ message: `Jadwal dengan id=${id} tidak ditemukan.` });
    }
  } catch (err) {
    console.error("Error Delete:", err);
    res.status(500).send({ message: "Gagal menghapus jadwal." });
  }
};
