const db = require("../models");
const Teacher = db.Teacher;
const User = db.User;

// Ambil profil guru berdasarkan ID User yang login
exports.getTeacherProfile = async (req, res) => {
    try {
        // req.userId didapat dari middleware authJwt (verifyToken)
        const userId = req.userId; 

        const teacher = await Teacher.findOne({
            where: { userId: userId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['username', 'fullName', 'email'] // Ambil data user terkait
            }]
        });

        if (!teacher) {
            return res.status(404).send({ message: "Teacher profile not found." });
        }

        res.status(200).send(teacher);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update data guru (NIP, Bio, Spesialisasi)
exports.updateTeacherProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { nip, specialization, bio, fullName, phoneNumber, address } = req.body;

        // 1. Update tabel Users (untuk nama lengkap)
        if (fullName) {
            await User.update({ fullName }, { where: { id: userId } });
        }

        // 2. Update tabel Teachers
        const [updated] = await Teacher.update({
            nip,
            specialization,
            bio,
            phoneNumber,
            address
        }, {
            where: { userId: userId }
        });

        if (updated) {
            const updatedTeacher = await Teacher.findOne({ where: { userId: userId } });
            res.status(200).send({ message: "Profile updated successfully.", data: updatedTeacher });
        } else {
            res.status(404).send({ message: "Cannot update profile. Maybe Teacher was not found!" });
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};