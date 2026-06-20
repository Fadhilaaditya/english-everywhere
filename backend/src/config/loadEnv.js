const path = require('path');
const { execSync } = require('child_process');

// Determine environment with this priority:
// 1. NODE_ENV explicitly set (e.g. NODE_ENV=production npm start)
// 2. Current git branch (production -> production, anything else -> development)
// 3. Default to development
function resolveEnv() {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
        return process.env.NODE_ENV;
    }
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
            .toString()
            .trim();
        if (branch === 'production' || branch === 'main' || branch === 'master') {
            return 'production';
        }
    } catch (e) {
        // git not available, ignore
    }
    return 'development';
}

const env = resolveEnv();
const envFile = env === 'production' ? '.env.production' : '.env.development';
const envPath = path.resolve(__dirname, '..', '..', envFile);

require('dotenv').config({ path: envPath, override: true });

// Make sure NODE_ENV is set so the rest of the app sees it consistently
process.env.NODE_ENV = env;

console.log(`[CONFIG] Loaded environment "${env}" from ${envFile}`);

module.exports = { env, envFile, envPath };
