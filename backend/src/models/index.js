const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

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
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ==============================
// 1. IMPORT MODELS
// ==============================
db.User = require('./user.model.js')(sequelize, Sequelize);
db.Event = require('./event.model.js')(sequelize, Sequelize);
db.articles = require('./article.model.js')(sequelize, Sequelize);
db.Program = require('./program.model.js')(sequelize, Sequelize);
db.ProgramSchedule = require('./programSchedule.model.js')(sequelize, Sequelize);
db.Student = require('./student.model.js')(sequelize, Sequelize);
db.Teacher = require('./teacher.model.js')(sequelize, Sequelize); // <--- MODEL TEACHER DITAMBAHKAN

// ==============================
// 2. DEFINE ASSOCIATIONS (RELASI)
// ==============================

// Relasi Program & Schedule
db.Program.hasMany(db.ProgramSchedule, { as: "schedules" });
db.ProgramSchedule.belongsTo(db.Program, {
    foreignKey: "programId",
    as: "program",
});

// Relasi User & Student (One-to-One)
db.User.hasOne(db.Student, {
    foreignKey: "userId",
    as: "student"
});
db.Student.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user"
});

// Relasi User & Teacher (One-to-One)  <--- RELASI BARU DITAMBAHKAN
db.User.hasOne(db.Teacher, {
    foreignKey: "userId",
    as: "teacher"
});
db.Teacher.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user"
});

module.exports = db;