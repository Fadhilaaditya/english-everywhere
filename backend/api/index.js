// Vercel serverless function handler
module.exports = async (req, res) => {
    try {
        // 1. Lazy load modules INSIDE the handler.
        // This prevents the function from crashing during "cold start" if environment variables are missing
        // or if the DB config is invalid. This allows us to catch the error and print it details.

        // We clear the cache to ensure we get a fresh instance if needed, though on Vercel it's usually fresh.
        // However, require(...) is cached, so we might not need to clear it, but moving it inside is the key.
        require('mysql2'); // Force inclusion of mysql2 for Vercel
        const app = require('../src/app');
        const db = require('../src/models');

        // 2. Test Connection
        // If the database variables aren't set correctly, this line (or the require above) will likely throw.
        try {
            await db.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (dbError) {
            console.error('Unable to connect to the database:', dbError);
            throw new Error(`Database connection failed: ${dbError.message}`);
        }

        // 3. Forward to Express
        return app(req, res);

    } catch (error) {
        // 4. Catch global errors (including import errors)
        console.error('Serverless Function Error:', error);

        // Return a JSON response so the user sees what happened, instead of a 500 white screen
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            db_config_check: {
                host_defined: !!process.env.DB_HOST,
                user_defined: !!process.env.DB_USER,
                db_defined: !!process.env.DB_NAME,
                pass_defined: !!process.env.DB_PASSWORD
            }
        });
    }
};
