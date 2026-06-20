const { env } = require('./loadEnv');

const config = {
    port: process.env.PORT || 3000,
    env: env,
};

module.exports = config;
