const app = require('../src/app');
const db = require('../src/models');

// Vercel serverless function handler
module.exports = async (req, res) => {
    try {
        // Ensure DB connection is established
        await db.sequelize.authenticate();

        // Check if we need to sync (be careful in production with force: true)
        // For this deployment, we'll assume sync is helpful as user seems to be in dev phase
        // but usually migrations are preferred. We'll skip sync to avoid timeouts unless critical.
        // await db.sequelize.sync(); 

        // Forward request to Express app
        return app(req, res);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
};
