const db = require('../models');
const User = db.User;
const Student = db.Student;

exports.getStats = async (req, res) => {
    try {
        const totalAccounts = await User.count();
        const totalStudents = await Student.count(); // Count from Students table as requested
        const totalTeachers = await User.count({ where: { role: 'teacher' } }); // Teacher table doesn't exist yet

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
