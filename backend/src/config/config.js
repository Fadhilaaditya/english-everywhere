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

const config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
};

module.exports = config;
