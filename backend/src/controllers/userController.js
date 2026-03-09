const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require('../models');
const User = db.User;
const Student = db.Student;

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                role: {
                    [Op.or]: ['student', 'teacher']
                }
            },
            include: [
                { model: db.Student, as: 'studentProfile' },
                { model: db.Teacher, as: 'teacherProfile' }
            ]
        });
        res.send(users);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }, // Hide password from response
            include: [
                { model: db.Student, as: 'studentProfile' },
                { model: db.Teacher, as: 'teacherProfile' }
            ]
        });

        if (user) {
            res.send(user);
        } else {
            res.status(404).send({
                message: `Cannot find User with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving User with id=" + id
        });
    }
};

exports.getStats = async (req, res) => {
    try {
        const totalAccounts = await User.count({
            where: {
                role: {
                    [Op.or]: ['student', 'teacher']
                }
            }
        });
        const totalStudents = await Student.count();
        const totalTeachers = await User.count({ where: { role: 'teacher' } });

        res.send({
            totalAccounts,
            totalStudents,
            totalTeachers
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving stats."
        });
    }
};

exports.create = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { fullName, username, password, role, photo, ...profileData } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            await transaction.rollback();
            return res.status(400).send({ message: "Username already exists!" });
        }

        // 2. Hash Password
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password || 'password123', 8);

        // 3. Create User
        const user = await User.create({
            fullName,
            username,
            password: hashedPassword,
            role,
            photo
        }, { transaction });

        // 4. Create Profile based on Role
        if (role === 'student') {
            await db.Student.create({
                userId: user.id,
                name: fullName,
                gender: profileData.gender || 'Male',
                address: profileData.address,
                phoneNumber: profileData.phone || '0',
                email: profileData.email || `${username}@example.com`,
                birthDate: profileData.birthDate,
                course: profileData.course
            }, { transaction });
        } else if (role === 'teacher') {
            await db.Teacher.create({
                userId: user.id,
                name: fullName,
                gender: profileData.gender || 'Male',
                address: profileData.address,
                phoneNumber: profileData.phone || '0',
                email: profileData.email || `${username}@example.com`,
                birthDate: profileData.birthDate,
                specialization: profileData.specialization || '',
                bio: profileData.bio || ''
            }, { transaction });
        }

        await transaction.commit();
        res.status(201).send({ message: "Account created successfully!", userId: user.id });
    } catch (err) {
        await transaction.rollback();
        console.error("Create Error:", err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Account."
        });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    const transaction = await db.sequelize.transaction();

    try {
        const user = await User.findByPk(id);
        if (!user) {
            await transaction.rollback();
            return res.status(404).send({ message: "User not found" });
        }

        const role = user.role;

        // Delete associated profiles first
        if (role === 'student') {
            await db.Student.destroy({ where: { userId: id }, transaction });
        } else if (role === 'teacher') {
            // Check if there are schedules or other dependent data if necessary
            await db.Teacher.destroy({ where: { userId: id }, transaction });
        }

        // Finally delete the user
        await User.destroy({ where: { id: id }, transaction });

        await transaction.commit();
        res.send({ message: "Account deleted successfully!" });
    } catch (err) {
        await transaction.rollback();
        res.status(500).send({
            message: "Could not delete Account with id=" + id
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const transaction = await db.sequelize.transaction();

    try {
        const user = await User.findByPk(id, {
            include: [
                { model: db.Student, as: 'studentProfile' },
                { model: db.Teacher, as: 'teacherProfile' }
            ]
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).send({ message: "User not found" });
        }

        const { fullName, username, password, role, photo, ...profileData } = req.body;

        // 1. Update User Record
        const userUpdateData = { fullName, username };
        if (photo) {
            userUpdateData.photo = photo;
        }
        if (password && password.trim() !== '') {
            const bcrypt = require("bcryptjs");
            userUpdateData.password = await bcrypt.hash(password, 8);
        }
        await user.update(userUpdateData, { transaction });

        // 2. Update Associated Profile
        if (user.role === 'student' && user.studentProfile) {
            await user.studentProfile.update({
                name: fullName,
                gender: profileData.gender,
                address: profileData.address,
                phoneNumber: profileData.phone,
                email: profileData.email,
                birthDate: profileData.birthDate,
                course: profileData.course
            }, { transaction });
        } else if (user.role === 'teacher' && user.teacherProfile) {
            await user.teacherProfile.update({
                name: fullName || user.teacherProfile.name,
                gender: profileData.gender || user.teacherProfile.gender,
                address: profileData.address || user.teacherProfile.address,
                phoneNumber: profileData.phone || user.teacherProfile.phoneNumber,
                email: profileData.email || user.teacherProfile.email,
                birthDate: profileData.birthDate || user.teacherProfile.birthDate,
                specialization: profileData.specialization || user.teacherProfile.specialization,
                bio: profileData.bio || user.teacherProfile.bio
            }, { transaction });
        }

        await transaction.commit();
        res.send({ message: "Account updated successfully!" });
    } catch (err) {
        await transaction.rollback();
        console.error("Update Error:", err);
        res.status(500).send({
            message: "Error updating Account with id=" + id
        });
    }
};
