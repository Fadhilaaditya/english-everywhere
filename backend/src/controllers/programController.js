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

// Public homepage cards do not need the nested levels used by admin forms.
exports.findHomePrograms = async (req, res) => {
  try {
    const data = await Program.findAll({
      where: { parentId: null },
      attributes: ["id", "title", "desc", "image", "category"],
    });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: "Gagal mengambil data program." });
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
    const { page, limit, startDate, endDate } = req.query;
    
    let whereClause = {};
    if (startDate && endDate) {
      whereClause.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      whereClause.date = { [Op.gte]: startDate };
    } else if (endDate) {
      whereClause.date = { [Op.lte]: endDate };
    }

    const queryOptions = {
      where: whereClause,
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
      distinct: true
    };

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      const { count, rows } = await ProgramSchedule.findAndCountAll({
        ...queryOptions,
        limit: limitNum,
        offset: offset,
      });

      res.send({
        totalItems: count,
        schedules: rows,
        totalPages: Math.ceil(count / limitNum),
        currentPage: pageNum
      });
    } else {
      // Backward compatibility: return array if no pagination
      // BUT still limit to a reasonable number to prevent crashes (e.g., 500)
      const rows = await ProgramSchedule.findAll({
        ...queryOptions,
        limit: queryOptions.where.date ? undefined : 500
      });
      res.send(rows);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving schedules."
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
  const scheduleId = Number(req.params.scheduleId);
  if (!Number.isSafeInteger(scheduleId) || scheduleId < 1 || !/^[1-9]\d*$/.test(req.params.scheduleId)) {
    return res.status(400).send({ message: "ID jadwal tidak valid." });
  }
  if (typeof req.body?.applicantName !== "string" || !req.body.applicantName.trim() || req.body.applicantName.length > 255) {
    return res.status(400).send({ message: "Nama pendaftar wajib diisi (maksimal 255 karakter)." });
  }
  try {
    const result = await db.sequelize.transaction({
      isolationLevel: db.Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    }, async (transaction) => {
      // Serialize registrations for the same slot before reading its capacity.
      const schedule = await ProgramSchedule.findByPk(scheduleId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!schedule) return { status: 404, body: { message: "Jadwal tidak ditemukan." } };

      const currentBookings = await db.AppointmentBooking.count({
        where: { scheduleId, status: { [Op.ne]: "REJECTED" } },
        transaction,
      });
      if (currentBookings >= schedule.maxSlots) {
        return { status: 400, body: { message: "Slot sudah penuh." } };
      }
      const booking = await db.AppointmentBooking.create({
      scheduleId: scheduleId,
      applicantName: req.body.applicantName.trim(),
      applicantGender: req.body.applicantGender,
      applicantAddress: req.body.applicantAddress,
      applicantFather: req.body.applicantFather,
      applicantMother: req.body.applicantMother,
      applicantBirthPlace: req.body.applicantBirthPlace,
      applicantBirthDate: req.body.applicantBirthDate,
      applicantPhone: req.body.applicantPhone,
      applicantEmail: req.body.applicantEmail,
      status: "PENDING",
      }, { transaction });
      return { status: 201, body: booking };
    });
    return res.status(result.status).send(result.body);
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

// 11. Ambil semua booking (Admin) - with pagination and search
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page, limit, search } = req.query;
    let whereClause = {};

    if (status) {
      if (status.includes(',')) {
        whereClause.status = { [Op.in]: status.split(',') };
      } else {
        whereClause.status = status;
      }
    }

    if (search) {
      whereClause[Op.or] = [
        { applicantName: { [Op.like]: `%${search}%` } },
        { applicantPhone: { [Op.like]: `%${search}%` } }
      ];
    }

    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: ProgramSchedule,
          as: "schedule",
          include: [{ model: Program, as: "program" }],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true
    };

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await db.AppointmentBooking.findAndCountAll({
        ...queryOptions,
        limit: limitNum,
        offset: offset,
      });

      res.send({
        totalItems: count,
        bookings: rows,
        totalPages: Math.ceil(count / limitNum),
        currentPage: pageNum
      });
    } else {
      // Backward compatibility: return array
      const rows = await db.AppointmentBooking.findAll(queryOptions);
      res.send(rows);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving bookings."
    });
  }
};

// Small admin-only aggregate; date follows the requesting browser's local calendar.
exports.getBookingSummary = async (req, res) => {
  const { date } = req.query;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).send({ message: "Tanggal harus berformat YYYY-MM-DD." });
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    return res.status(400).send({ message: "Tanggal tidak valid." });
  }
  try {
    const relevant = { status: { [Op.in]: ["ACCEPTED", "BOOKED"] } };
    const [pendingAppointments, unreadApplicants, totalApplicants, scheduledToday] = await Promise.all([
      db.AppointmentBooking.count({ where: { status: "PENDING" } }),
      db.AppointmentBooking.count({ where: { status: "ACCEPTED", isRead: false } }),
      db.AppointmentBooking.count({ where: relevant }),
      db.AppointmentBooking.count({
        where: relevant,
        include: [{ model: ProgramSchedule, as: "schedule", attributes: [], where: { date }, required: true }],
      }),
    ]);
    return res.send({ pendingAppointments, unreadApplicants, totalApplicants, scheduledToday });
  } catch (error) {
    console.error("Failed to retrieve booking summary:", error.message);
    return res.status(500).send({ message: "Gagal mengambil ringkasan booking." });
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
