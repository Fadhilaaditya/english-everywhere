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

// 2. Ambil semua Program (Top-level only for homepage)
exports.findAll = async (req, res) => {
  try {
    const data = await Program.findAll({
      where: { parentId: null },
      include: ["levels"]
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Gagal mengambil data program.",
    });
  }
};

// 2.1 Ambil detail levels untuk sebuah program
exports.getLevels = async (req, res) => {
  const parentId = req.params.id;
  try {
    const data = await Program.findAll({
      where: { parentId: parentId }
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Gagal mengambil data levels program.",
    });
  }
};

// 2.2 Ambil satu program dengan parent dan levels (eager loading)
exports.findOne = (req, res) => {
  const id = req.params.id;
  Program.findByPk(id, {
    include: [
      { model: Program, as: 'parent' },
      { model: Program, as: 'levels' }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Program with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Program with id=" + id
      });
    });
};

// 2.1 Ambil semua jadwal (Global) dengan jumlah booking
exports.findAllGlobal = async (req, res) => {
  try {
    const data = await ProgramSchedule.findAll({
      include: [
        {
          model: db.AppointmentBooking,
          as: "bookings",
          attributes: ["id", "status"],
        },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
    res.send(data);
  } catch (err) {
    console.error("Error in findAllGlobal:", err);
    res.status(500).send({ message: "Gagal mengambil semua jadwal." });
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
      programId: programId === "null" || !programId ? null : programId,
      date: req.body.date,
      time: req.body.time,
      maxSlots: req.body.maxSlots || 1,
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
    // 1. Delete associated bookings first to avoid foreign key constraints
    await db.AppointmentBooking.destroy({
      where: { scheduleId: id },
    });

    // 2. Delete the schedule
    const num = await ProgramSchedule.destroy({
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "Jadwal berhasil dihapus." });
    } else {
      res.status(404).send({ message: "Jadwal tidak ditemukan." });
    }
  } catch (err) {
    console.error("Error in deleteSchedule:", err);
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

// 8. Update status jadwal program secara langsung (Tanpa programId di URL)
exports.updateScheduleDirectly = async (req, res) => {
  const id = req.params.scheduleId;
  try {
    const [num] = await ProgramSchedule.update(req.body, {
      where: { id: id },
    });

    if (num == 1) {
      res.send({ message: "Jadwal berhasil diperbarui." });
    } else {
      res.status(404).send({ message: "Jadwal tidak ditemukan." });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating jadwal." });
  }
};

// 9. Booking Appointment (New multi-slot logic)
exports.bookAppointment = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  try {
    const schedule = await ProgramSchedule.findByPk(scheduleId, {
      include: [{ model: db.AppointmentBooking, as: "bookings" }],
    });

    if (!schedule) {
      return res.status(404).send({ message: "Jadwal tidak ditemukan." });
    }

    const currentBookings = schedule.bookings.filter(
      (b) => b.status !== "REJECTED",
    ).length;

    if (currentBookings >= schedule.maxSlots) {
      return res.status(400).send({ message: "Slot sudah penuh." });
    }

    const booking = await db.AppointmentBooking.create({
      scheduleId: scheduleId,
      applicantName: req.body.applicantName,
      applicantGender: req.body.applicantGender,
      applicantAddress: req.body.applicantAddress,
      applicantFather: req.body.applicantFather,
      applicantMother: req.body.applicantMother,
      applicantBirthPlace: req.body.applicantBirthPlace,
      applicantBirthDate: req.body.applicantBirthDate,
      applicantPhone: req.body.applicantPhone,
      applicantEmail: req.body.applicantEmail,
      status: "PENDING",
    });

    res.status(201).send(booking);
  } catch (err) {
    res.status(500).send({ message: "Gagal melakukan booking." });
  }
};

// 10. Ambil booking untuk sebuah jadwal (Admin)
exports.getBookingsBySchedule = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  try {
    const data = await db.AppointmentBooking.findAll({
      where: { scheduleId: scheduleId },
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Gagal mengambil data booking." });
  }
};

// 11. Ambil semua booking secara global (Admin)
exports.getAllBookings = async (req, res) => {
  const status = req.query.status;
  let whereClause = {};

  if (status) {
    if (status.includes(',')) {
      whereClause.status = { [Op.in]: status.split(',') };
    } else {
      whereClause.status = status;
    }
  }

  try {
    const data = await db.AppointmentBooking.findAll({
      where: whereClause,
      include: [
        {
          model: ProgramSchedule,
          as: "schedule",
          include: [{ model: Program, as: "program" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({ message: "Gagal mengambil semua data booking." });
  }
};

// 12. Hapus individual booking
exports.deleteBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await db.AppointmentBooking.destroy({
      where: { id: id },
    });
    if (num == 1) {
      res.send({ message: "Booking berhasil dihapus." });
    } else {
      res.send({ message: `Gagal menghapus booking dengan id=${id}.` });
    }
  } catch (err) {
    res.status(500).send({ message: "Error menghapus booking." });
  }
};
// 13. Reject individual booking
exports.rejectBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const [num] = await db.AppointmentBooking.update(
      { status: "REJECTED" },
      { where: { id: id } },
    );
    if (num == 1) {
      res.send({ message: "Booking berhasil direject." });
    } else {
      res.send({ message: `Gagal mereject booking dengan id=${id}.` });
    }
  } catch (err) {
    res.status(500).send({ message: "Error mereject booking." });
  }
};
// 14. Approve individual booking (PENDING -> BOOKED)
exports.approveBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const [num] = await db.AppointmentBooking.update(
      { status: "BOOKED", isRead: false },
      { where: { id: id } },
    );
    if (num == 1) {
      res.send({ message: "Booking berhasil diapprove (Status: BOOKED)." });
    } else {
      res.send({ message: `Gagal mengapprove booking dengan id=${id}.` });
    }
  } catch (err) {
    res.status(500).send({ message: "Error mengapprove booking." });
  }
};

// 14.1 Accept individual booking (BOOKED -> ACCEPTED)
exports.acceptBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const [num] = await db.AppointmentBooking.update(
      { status: "ACCEPTED", isRead: false },
      { where: { id: id } },
    );
    if (num == 1) {
      res.send({ message: "Siswa dinyatakan lolos (Status: ACCEPTED)." });
    } else {
      res.send({ message: `Gagal memperbarui status booking dengan id=${id}.` });
    }
  } catch (err) {
    res.status(500).send({ message: "Error memperbarui status booking." });
  }
};

// 15. Mark all bookings as read for a specific status
exports.markAsRead = async (req, res) => {
  const status = req.body.status;
  const whereClause = status ? { status: status } : {};
  try {
    await db.AppointmentBooking.update(
      { isRead: true },
      { where: whereClause }
    );
    res.send({ message: "Berhasil menandai sebagai dibaca." });
  } catch (err) {
    res.status(500).send({ message: "Gagal menandai sebagai dibaca." });
  }
};
