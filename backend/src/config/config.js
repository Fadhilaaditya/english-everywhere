// Try loading .env first, then .env.development
require('dotenv').config({ path: '.env.development' });

const config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
};

module.exports = config;
