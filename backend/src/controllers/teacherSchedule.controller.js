const db = require("../models");
const TeacherSchedule = db.TeacherSchedule;

// Ambil semua jadwal dengan Eager Loading (Program & Guru)
exports.findAll = async (req, res) => {
  const { programId, teacherId } = req.query;
  let condition = {};
  if (programId) condition.programId = programId;
  if (teacherId) condition.teacherId = teacherId;

  try {
    const data = await TeacherSchedule.findAll({
      where: condition,
      include: [
        {
          model: db.Teacher,
          as: "teacher",
          include: [{ model: db.User, as: "user", attributes: ["fullName"] }],
        },
        { model: db.Program, as: "program", attributes: ["name"] },
      ],
    });
    res.send(data);
  } catch (err) {
    res
      .status(500)
      .send({
        message: err.message || "Terjadi kesalahan saat mengambil jadwal.",
      });
  }
};

// Simpan jadwal baru
exports.create = async (req, res) => {
  try {
    const payload = {
      day: req.body.day,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      teacherId: req.body.teacherId,
      programId: req.body.programId,
      status: req.body.status || "Available",
    };

    const data = await TeacherSchedule.create(payload);
    res.send(data);
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "Gagal membuat jadwal baru." });
  }
};

// Update Jadwal
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await TeacherSchedule.update(req.body, {
      where: { id: id },
    });
    if (result == 1) {
      res.send({ message: "Jadwal berhasil diperbarui." });
    } else {
      res.send({ message: "Tidak ada perubahan atau jadwal tidak ditemukan." });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating jadwal." });
  }
};

// Hapus Jadwal
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await TeacherSchedule.destroy({ where: { id: id } });
    res.send({ message: "Jadwal berhasil dihapus." });
  } catch (err) {
    res.status(500).send({ message: "Gagal menghapus jadwal." });
  }
};
