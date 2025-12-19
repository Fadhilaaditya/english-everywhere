require('dotenv').config();
const db = require('./src/models');
const bcrypt = require('bcryptjs');

async function createStudent() {
    try {
        const username = 'student';
        const password = 'student123';
        const hashedPassword = await bcrypt.hash(password, 8);

        console.log(`Checking for user: ${username}...`);

        const [user, created] = await db.User.findOrCreate({
            where: { username: username },
            defaults: {
                username: username,
                password: hashedPassword,
                role: 'student',
                fullName: 'Student User'
            }
        });

        if (created) {
            console.log('Student user created successfully.');
        } else {
            console.log('Student user already exists. Updating password...');
            user.password = hashedPassword;
            await user.save();
            console.log('Student password updated to "student123".');
        }
    } catch (error) {
        console.error('Error creating student:', error);
    } finally {
        await db.sequelize.close();
    }
}

createStudent();
