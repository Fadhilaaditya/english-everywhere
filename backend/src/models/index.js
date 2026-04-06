const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  },
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ==============================
// 1. IMPORT MODELS
// ==============================
db.User = require("./userModel.js")(sequelize, Sequelize);
db.Teacher = require("./teacherModel.js")(sequelize, Sequelize);
db.Student = require("./studentModel.js")(sequelize, Sequelize);
db.Program = require("./programModel.js")(sequelize, Sequelize);
db.Event = require("./eventModel.js")(sequelize, Sequelize);
db.Article = require("./articleModel.js")(sequelize, Sequelize);
db.Classroom = require("./classroomModel.js")(sequelize, Sequelize);

// Memisahkan TeacherSchedule dan ProgramSchedule karena tabelnya berbeda
db.TeacherSchedule = require("./teacherScheduleModel.js")(
  sequelize,
  Sequelize,
);
db.ProgramSchedule = require("./programScheduleModel.js")(
  sequelize,
  Sequelize,
);
db.AppointmentBooking = require("./appointmentBookingModel.js")(
  sequelize,
  Sequelize,
);

// Payment models
db.Payment = require("./paymentModel.js")(sequelize, Sequelize);
db.PaymentInstallment = require("./paymentInstallmentModel.js")(sequelize, Sequelize);

// ==============================
// 2. DEFINE ASSOCIATIONS
// ==============================

// --- Relasi User <-> Teacher ---
db.User.hasOne(db.Teacher, { foreignKey: "userId", as: "teacherProfile" });
db.Teacher.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// --- Relasi User <-> Student ---
db.User.hasOne(db.Student, { foreignKey: "userId", as: "studentProfile" });
db.Student.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// --- Relasi Teacher <-> TeacherSchedule ---
// Guru memiliki banyak jadwal mengajar di tabel teacher_schedules
db.Teacher.hasMany(db.TeacherSchedule, {
  foreignKey: "teacherId",
  as: "teachingSchedules",
});
db.TeacherSchedule.belongsTo(db.Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

// --- Relasi Program <-> TeacherSchedule ---
// Satu Program (misal: Abracadabra) muncul di banyak jadwal guru
db.Program.hasMany(db.TeacherSchedule, {
  foreignKey: "programId",
  as: "teacherSchedules",
});
db.TeacherSchedule.belongsTo(db.Program, {
  foreignKey: "programId",
  as: "program",
});

// --- Relasi Program <-> ProgramSchedule ---
// Satu Program memiliki banyak jadwal pendaftaran/kursus di tabel program_schedules
db.Program.hasMany(db.ProgramSchedule, {
  foreignKey: "programId",
  as: "programSchedules",
});
db.ProgramSchedule.belongsTo(db.Program, {
  foreignKey: "programId",
  as: "program",
});

// --- Self-Referential Program Levels ---
db.Program.hasMany(db.Program, { as: 'levels', foreignKey: 'parentId' });
db.Program.belongsTo(db.Program, { as: 'parent', foreignKey: 'parentId' });

// --- Relasi ProgramSchedule <-> AppointmentBooking ---
db.ProgramSchedule.hasMany(db.AppointmentBooking, {
  foreignKey: "scheduleId",
  as: "bookings",
});
db.AppointmentBooking.belongsTo(db.ProgramSchedule, {
  foreignKey: "scheduleId",
  as: "schedule",
});

// --- Relasi Payment <-> PaymentInstallment ---
db.Payment.hasMany(db.PaymentInstallment, {
  foreignKey: "paymentId",
  as: "installments",
});
db.PaymentInstallment.belongsTo(db.Payment, {
  foreignKey: "paymentId",
  as: "payment",
});

// --- Relasi Payment <-> Student ---
db.Student.hasMany(db.Payment, {
  foreignKey: "studentId",
  as: "payments",
});
db.Payment.belongsTo(db.Student, {
  foreignKey: "studentId",
  as: "student",
});

// --- Relasi Payment <-> Program ---
db.Program.hasMany(db.Payment, {
  foreignKey: "programId",
  as: "payments",
});
db.Payment.belongsTo(db.Program, {
  foreignKey: "programId",
  as: "program",
});

db.Program.hasMany(db.Student, {
  foreignKey: "programId",
  as: "students",
});
db.Student.belongsTo(db.Program, {
  foreignKey: "programId",
  as: "program",
});

module.exports = db;
