const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });
require('dotenv').config(); // Fallback to .env

const config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
};

module.exports = config;
