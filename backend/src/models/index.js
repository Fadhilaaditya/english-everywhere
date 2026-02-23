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

// Models
db.User = require('./user.model.js')(sequelize, Sequelize);
db.Event = require('./event.model.js')(sequelize, Sequelize);
db.articles = require('./article.model.js')(sequelize, Sequelize);
db.Program = require('./program.model.js')(sequelize, Sequelize);
db.Payment = require('./payment.model.js')(sequelize, Sequelize);
db.PaymentInstallment = require('./payment_installment.model.js')(sequelize, Sequelize);
db.ProgramSchedule = require('./programSchedule.model.js')(sequelize, Sequelize);

db.Program.hasMany(db.ProgramSchedule, { as: "schedules" });
db.ProgramSchedule.belongsTo(db.Program, {
    foreignKey: "programId",
    as: "program",
});

db.Student = require('./student.model.js')(sequelize, Sequelize);

db.User.hasOne(db.Student, {
    foreignKey: "userId",
    as: "student"
});
db.Student.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user"
});

// Payment Associations
db.Payment.belongsTo(db.Student, {
    foreignKey: "studentId",
    as: "student"
});
db.Student.hasMany(db.Payment, {
    as: "payments"
});

db.Payment.belongsTo(db.Program, {
    foreignKey: "programId",
    as: "program"
});
db.Program.hasMany(db.Payment, {
    as: "payments"
});

db.Payment.hasMany(db.PaymentInstallment, {
    as: "installments",
    foreignKey: "paymentId"
});
db.PaymentInstallment.belongsTo(db.Payment, {
    as: "payment",
    foreignKey: "paymentId"
});

module.exports = db;
