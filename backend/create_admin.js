require('dotenv').config();
const db = require('./src/models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const username = 'admin';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 8);

        console.log(`Checking for user: ${username}...`);

        const [user, created] = await db.User.findOrCreate({
            where: { username: username },
            defaults: {
                username: username,
                password: hashedPassword,
                role: 'admin',
                fullName: 'Administrator'
            }
        });

        if (created) {
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists. Updating password...');
            user.password = hashedPassword;
            await user.save();
            console.log('Admin password updated to "admin123".');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await db.sequelize.close();
    }
}

createAdmin();
