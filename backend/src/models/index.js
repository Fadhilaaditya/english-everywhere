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
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Teacher = require("./teacher.model.js")(sequelize, Sequelize);
db.Student = require("./student.model.js")(sequelize, Sequelize);
db.Program = require("./program.model.js")(sequelize, Sequelize);

// Memisahkan TeacherSchedule dan ProgramSchedule karena tabelnya berbeda
db.TeacherSchedule = require("./teacherSchedule.model.js")(
  sequelize,
  Sequelize,
);
db.ProgramSchedule = require("./programSchedule.model.js")(
  sequelize,
  Sequelize,
);

// ==============================
// 2. DEFINE ASSOCIATIONS
// ==============================

// --- Relasi User <-> Teacher ---
db.User.hasOne(db.Teacher, { foreignKey: "userId", as: "teacherProfile" });
db.Teacher.belongsTo(db.User, { foreignKey: "userId", as: "user" });

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

module.exports = db;
