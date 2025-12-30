const db = require('./src/models');

const updateSchema = async () => {
    try {
        console.log('Syncing database schema (alter: true)...');
        // This will update the tables to match the models (adding missing columns)
        await db.sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to sync database:', error);
        process.exit(1);
    }
};

updateSchema();
