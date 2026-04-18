const { execSync } = require('child_process');
let currentBranch = 'development';
try {
  currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
} catch (e) {
  // Fallback to NODE_ENV if git fails
  currentBranch = process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

const envFile = currentBranch === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile, override: true });
require('dotenv').config(); // Fallback to .env

module.exports = {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectOptions: {
        // Only use socket path in development (local), not in production (Vercel)
        // This prevents errors where local paths like /Applications/XAMPP... are used on the cloud
        ...(process.env.NODE_ENV !== 'production' && process.env.DB_SOCKET_PATH && {
            socketPath: process.env.DB_SOCKET_PATH
        }),
    },
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
