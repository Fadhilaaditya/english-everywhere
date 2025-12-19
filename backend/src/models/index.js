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

module.exports = db;
