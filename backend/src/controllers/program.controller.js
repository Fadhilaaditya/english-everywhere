const db = require("../models");
const Program = db.Program;
const ProgramSchedule = db.ProgramSchedule;
const Op = db.Sequelize.Op;

// 1. Ambil semua jadwal yang sudah di-book (Lengkap dengan Judul Program)
exports.getAllBookedSchedules = async (req, res) => {
  try {
    const data = await ProgramSchedule.findAll({
      where: {
        status: { [Op.like]: "%BOOKED%" },
      },
      include: [
        {
          model: Program,
          as: "program",
          attributes: ["title"], // Mengambil kolom 'title' dari tabel programs
        },
      ],
      order: [["date", "DESC"]],
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Terjadi kesalahan saat mengambil jadwal.",
    });
  }
};

// 2. Ambil semua Program (Dropdown)
exports.findAll = async (req, res) => {
  try {
    const data = await Program.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Gagal mengambil data program.",
    });
  }
};

// 3. Ambil Jadwal berdasarkan ID Program
exports.getSchedulesByProgram = async (req, res) => {
  const programId = req.params.id;
  try {
    const data = await ProgramSchedule.findAll({
      where: { programId: programId },
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Gagal mengambil jadwal program." });
  }
};

exports.getSchedules = exports.getSchedulesByProgram;

// 4. Create Schedule (MENGGANTIKAN ERROR 501)
exports.createSchedule = async (req, res) => {
  try {
    const programId = req.params.id;

    if (!req.body.date || !req.body.time) {
      return res
        .status(400)
        .send({ message: "Tanggal dan Waktu wajib diisi!" });
    }

    const schedule = {
      programId: programId,
      date: req.body.date,
      time: req.body.time,
      status: req.body.status || "AVAILABLE",
    };

    const data = await ProgramSchedule.create(schedule);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({ message: "Gagal membuat jadwal baru." });
  }
};

// 5. Update status jadwal program
exports.updateSchedule = async (req, res) => {
  const id = req.params.scheduleId;
  try {
    const [num] = await ProgramSchedule.update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "Jadwal program berhasil diperbarui." });
    } else {
      res.status(404).send({ message: "Jadwal tidak ditemukan." });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating jadwal program." });
  }
};

// 6. Delete Schedule (MENGGANTIKAN ERROR 501)
exports.deleteSchedule = async (req, res) => {
  const id = req.params.scheduleId;
  try {
    const num = await ProgramSchedule.destroy({
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "Jadwal berhasil dihapus." });
    } else {
      res.status(404).send({ message: "Jadwal tidak ditemukan." });
    }
  } catch (err) {
    res.status(500).send({ message: "Gagal menghapus jadwal." });
  }
};

// 7. Revert/Unbook Schedule (MENGGANTIKAN ERROR 501)
exports.revertSchedule = async (req, res) => {
  const id = req.params.scheduleId;
  try {
    const [num] = await ProgramSchedule.update(
      { status: "AVAILABLE" },
      { where: { id: id } },
    );

    if (num == 1) {
      res.send({ message: "Status jadwal dikembalikan ke AVAILABLE." });
    } else {
      res.status(404).send({ message: "Jadwal tidak ditemukan." });
    }
  } catch (err) {
    res.status(500).send({ message: "Gagal mengembalikan status jadwal." });
  }
};
