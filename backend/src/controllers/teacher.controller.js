const db = require("../models");
const Teacher = db.Teacher;
const User = db.User;

// Ambil profil guru berdasarkan ID User yang login (dari token JWT)
exports.getTeacherProfile = async (req, res) => {
    try {
        /** * req.userId otomatis ada karena kita sudah memasang middleware authJwt.verifyToken
         * di file routes sebelum masuk ke controller ini.
         */
        const userId = req.userId; 

        const teacher = await Teacher.findOne({
            where: { userId: userId },
            include: [{
                model: User,
                as: 'user', // Pastikan alias ini sesuai dengan yang didefinisikan di models/index.js
                attributes: ['username', 'fullName', 'role'] 
            }]
        });

        if (!teacher) {
            return res.status(404).send({ message: "Teacher profile not found." });
        }

        res.status(200).send(teacher);
    } catch (error) {
        console.error("Error fetching teacher profile:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Update data guru (NIP, Bio, Spesialisasi, dsb)
exports.updateTeacherProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { nip, specialization, bio, fullName, phoneNumber, address } = req.body;

        // Gunakan transaksi agar jika salah satu update gagal, data tetap konsisten
        const result = await db.sequelize.transaction(async (t) => {
            
            // 1. Update data dasar di tabel Users (seperti FullName)
            if (fullName) {
                await User.update(
                    { fullName }, 
                    { where: { id: userId }, transaction: t }
                );
            }

            // 2. Update data spesifik di tabel Teachers
            const [updatedRows] = await Teacher.update({
                nip,
                specialization,
                bio,
                phoneNumber,
                address
            }, {
                where: { userId: userId },
                transaction: t
            });

            // Ambil data terbaru untuk dikirim kembali ke frontend
            const updatedTeacher = await Teacher.findOne({ 
                where: { userId: userId },
                include: [{ model: User, as: 'user', attributes: ['fullName'] }],
                transaction: t
            });

            return updatedTeacher;
        });

        res.status(200).send({ 
            message: "Profile updated successfully.", 
            data: result 
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).send({ message: error.message || "Failed to update profile." });
    }
};