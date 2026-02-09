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
    dialectOptions: dbConfig.dialectOptions,
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
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Event = require("./event.model.js")(sequelize, Sequelize);
db.Article = require("./article.model.js")(sequelize, Sequelize);
db.Program = require("./program.model.js")(sequelize, Sequelize);
db.Student = require("./student.model.js")(sequelize, Sequelize);
db.Teacher = require("./teacher.model.js")(sequelize, Sequelize);

// Membedakan dua jenis jadwal sesuai instruksi
db.ProgramSchedule = require("./programSchedule.model.js")(
  sequelize,
  Sequelize,
); // Untuk Appointment Pendaftaran
db.TeacherSchedule = require("./teacherSchedule.model.js")(
  sequelize,
  Sequelize,
); // Untuk Jadwal Mengajar Guru

// ==============================
// 2. DEFINE ASSOCIATIONS (RELASI)
// ==============================

// --- Relasi User ke Profile (One-to-One) ---
db.User.hasOne(db.Student, { foreignKey: "userId", as: "studentProfile" });
db.Student.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.User.hasOne(db.Teacher, { foreignKey: "userId", as: "teacherProfile" });
db.Teacher.belongsTo(db.User, { foreignKey: "userId", as: "user" });

// --- Relasi ProgramSchedule (Khusus Appointment Pendaftaran) ---
db.Program.hasMany(db.ProgramSchedule, {
  foreignKey: "programId",
  as: "registrationSlots",
});
db.ProgramSchedule.belongsTo(db.Program, {
  foreignKey: "programId",
  as: "program",
});

// --- Relasi TeacherSchedule (Jadwal Mengajar) ---
// 1. Menghubungkan Jadwal ke Guru (Agar bisa filter: Jadwal milik Guru A)
db.Teacher.hasMany(db.TeacherSchedule, {
  foreignKey: "teacherId",
  as: "teachingSchedules",
});
db.TeacherSchedule.belongsTo(db.Teacher, {
  foreignKey: "teacherId",
  as: "teacher",
});

// 2. Menghubungkan Jadwal ke Program (Agar tahu jadwal ini untuk Program apa)
db.Program.hasMany(db.TeacherSchedule, {
  foreignKey: "programId",
  as: "programSlots",
});
db.TeacherSchedule.belongsTo(db.Program, {
  foreignKey: "programId",
  as: "program",
});

module.exports = db;
