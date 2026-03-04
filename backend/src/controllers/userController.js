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
