const db = require('../models');
const User = db.User;
const Teacher = db.Teacher; // Import Model Teacher
const Student = db.Student; // Import Model Student
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password, role, fullName } = req.body;

        // 1. Cek apakah username sudah ada
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 8);

        // 3. Buat User baru (Gunakan Transaction agar aman jika salah satu gagal)
        const result = await db.sequelize.transaction(async (t) => {
            const user = await User.create({
                username,
                password: hashedPassword,
                role,
                fullName
            }, { transaction: t });

            // 4. Buat Profile berdasarkan Role
            if (role === 'teacher') {
                // Buat profil teacher kosong yang terhubung ke user ini
                await Teacher.create({ 
                    userId: user.id,
                    // Kamu bisa isi default value lain jika perlu
                }, { transaction: t });
            } 
            else if (role === 'user') { // Asumsi role 'user' adalah murid
                await Student.create({ 
                    userId: user.id 
                }, { transaction: t });
            }

            return user;
        });

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: error.message || "Some error occurred while creating the User." });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari user
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cek password
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: 'Invalid Password!'
            });
        }

        // Buat Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours (disarankan lebih lama dari 1 jam untuk UX yang baik)
        });

        // Cari studentId jika dia murid
        let studentId = null;
        if (user.role === 'student' || user.role === 'user') {
            const studentProfile = await Student.findOne({ where: { userId: user.id } });
            if (studentProfile) {
                studentId = studentProfile.id;
            }
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            studentId: studentId, // Menambahkan ID Student untuk frontend
            accessToken: token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};