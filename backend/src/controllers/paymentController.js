const db = require("../models");
const { Op } = require("sequelize");
const Payment = db.Payment;
const PaymentInstallment = db.PaymentInstallment;
const Student = db.Student;
const Program = db.Program;

// Helper to generate generic transaction ID
const generateTransactionId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRX-${year}${month}-${randomStr}`;
};

// 1. Create Payment (Admin)
exports.createPayment = async (req, res) => {
  try {
    const {
      studentId,
      programId,
      amount,
      deadline,
      publishDate,
      paymentType, // "Lunas" or "Cicilan"
      installments, // Array of objects: { dueDate, amount }
      invoiceNo,
    } = req.body;

    if (!studentId || !programId || !amount || !deadline || !publishDate) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const transactionId = generateTransactionId();

    const newPayment = await Payment.create({
      transactionId,
      invoiceNo: invoiceNo || `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
      amount,
      deadline,
      publishDate,
      paymentType: paymentType || "Lunas",
      status: "Pending",
      studentId,
      programId,
      installmentCount: installments ? installments.length : 0,
    });

    // If Cicilan, create installment records
    if (paymentType === "Cicilan" && installments && installments.length > 0) {
      const installmentRecords = installments.map((inst, index) => ({
        paymentId: newPayment.id,
        installmentNumber: index + 1,
        amount: inst.amount,
        dueDate: inst.dueDate,
        publishDate: inst.publishDate || publishDate, // Fallback to main bill send date
        status: "Pending",
      }));

      await PaymentInstallment.bulkCreate(installmentRecords);
    }

    res.status(201).json({
      message: "Tagihan berhasil dibuat",
      data: newPayment,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 2. Get All Payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    
    let whereClause = {};
    let studentWhere = {};
    
    if (search) {
      studentWhere.name = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
      include: [
        { 
          model: Student, 
          as: "student", 
          attributes: ["id", "name"],
          where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
          required: Object.keys(studentWhere).length > 0
        },
        { model: Program, as: "program", attributes: ["id", "title"] },
        { model: PaymentInstallment, as: "installments" },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true
    };

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Payment.findAndCountAll({
        ...queryOptions,
        limit: limitNum,
        offset: offset,
      });

      res.status(200).json({
        totalItems: count,
        payments: rows,
        totalPages: Math.ceil(count / limitNum),
        currentPage: pageNum
      });
    } else {
      // Backward compatibility: return array
      const payments = await Payment.findAll(queryOptions);
      res.status(200).json({ data: payments });
    }
  } catch (error) {
    console.error("Get All Payments Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 3. Get User Payments (Student)
exports.getUserPayments = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID diperlukan" });
    }

    const payments = await Payment.findAll({
      where: {
        studentId,
        publishDate: {
          [Op.lte]: new Date()
        }
      },
      include: [
        { model: Program, as: "program", attributes: ["id", "title"] },
        {
          model: PaymentInstallment,
          as: "installments",
          where: {
            publishDate: {
              [Op.lte]: new Date()
            }
          },
          required: false
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: payments });
  } catch (error) {
    console.error("Get User Payments Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 4. Confirm Payment (User marks as waiting for admin)
// Not strictly required in DB if status is just Pending vs Success, 
// usually Pending -> User transfers -> WA Admin -> Admin clicks Approve (Success).
// But if you want a "Waiting Confirmation" status, we can just update it here.
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { isInstallment } = req.body; // true if confirming a specific installment

    if (isInstallment) {
      const installment = await PaymentInstallment.findByPk(id);
      if (!installment) return res.status(404).json({ message: "Cicilan tidak ditemukan" });

      // We can keep it "Pending" until admin approves, or change to a "Checking" state if Enum allowed it.
      // Since Enum is Success, Pending, Failed: we just leave it or you can manage it via frontend state.
      // For now, let's just return a success message that they've confirmed via WA.
      return res.status(200).json({ message: "Konfirmasi diterima, mohon tunggu verifikasi admin." });
    } else {
      const payment = await Payment.findByPk(id);
      if (!payment) return res.status(404).json({ message: "Tagihan tidak ditemukan" });

      return res.status(200).json({ message: "Konfirmasi diterima, mohon tunggu verifikasi admin." });
    }
  } catch (error) {
    console.error("Confirm Payment Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 5. Approve Payment (Admin marks as Success)
exports.approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { isInstallment } = req.body;

    if (isInstallment) {
      const installment = await PaymentInstallment.findByPk(id);
      if (!installment) return res.status(404).json({ message: "Cicilan tidak ditemukan" });

      installment.status = "Success";
      installment.paymentDate = new Date();
      await installment.save();

      // Check if all installments are Success, then mark main Payment as Success
      const allInstallments = await PaymentInstallment.findAll({ where: { paymentId: installment.paymentId } });
      const allSuccess = allInstallments.every((inst) => inst.status === "Success");

      if (allSuccess) {
        await Payment.update({ status: "Success", paymentDate: new Date() }, { where: { id: installment.paymentId } });
      }

      return res.status(200).json({ message: "Cicilan berhasil disetujui", data: installment });
    } else {
      const payment = await Payment.findByPk(id);
      if (!payment) return res.status(404).json({ message: "Tagihan tidak ditemukan" });

      payment.status = "Success";
      payment.paymentDate = new Date();
      await payment.save();

      return res.status(200).json({ message: "Tagihan berhasil disetujui", data: payment });
    }
  } catch (error) {
    console.error("Approve Payment Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 6. Delete Payment (Admin)
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ message: "Tagihan tidak ditemukan" });

    // Also delete installments
    await PaymentInstallment.destroy({ where: { paymentId: id } });
    await payment.destroy();

    res.status(200).json({ message: "Tagihan berhasil dihapus" });
  } catch (error) {
    console.error("Delete Payment Error:", error);
    res.status(500).json({ message: "Gagal menghapus tagihan", error: error.message });
  }
};

// 7. Get Payment Stats (Admin)
exports.getPaymentStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalTransactions = await Payment.count();
    
    // Transactions Today
    const transactionsToday = await Payment.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    const pendingPayments = await Payment.findAll({
      where: { status: "Pending" },
      include: [{ model: PaymentInstallment, as: "installments" }]
    });

    let jatuhTempoCount = 0;
    let tertundaCount = 0;

    pendingPayments.forEach(p => {
      const deadlineDate = new Date(p.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      
      let isOverdue = deadlineDate < today;

      if (!isOverdue && p.installments && p.installments.length > 0) {
        isOverdue = p.installments.some(inst => {
          if (inst.status === "Pending") {
            const instDueDate = new Date(inst.dueDate);
            instDueDate.setHours(0, 0, 0, 0);
            return instDueDate < today;
          }
          return false;
        });
      }

      if (isOverdue) jatuhTempoCount++;
      else tertundaCount++;
    });

    res.status(200).json({
      totalTransactions,
      transactionsToday,
      jatuhTempoCount,
      tertundaCount
    });
  } catch (error) {
    console.error("Get Payment Stats Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
