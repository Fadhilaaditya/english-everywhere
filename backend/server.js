const app = require('./src/app');
const config = require('./src/config/config');
const db = require('./src/models');

const PORT = config.port;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${config.env}`);

    try {
        await db.sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models with database
        await db.sequelize.sync();
        console.log('Database synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

// Force keep-alive to debug why process exits
setInterval(() => { }, 10000);

