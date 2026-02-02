// Try loading .env first, then .env.development
require('dotenv').config({ path: '.env.development' });

const config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    midtrans: {
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
        isProduction: process.env.NODE_ENV === 'production'
    }
};

module.exports = config;
