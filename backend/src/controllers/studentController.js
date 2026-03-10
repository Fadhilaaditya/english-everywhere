const db = require('../models');
const Student = db.Student;
const User = db.User;
const ProgramSchedule = db.ProgramSchedule;
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is installed or use what's available (check auth controller)
// Assuming bcryptjs is available as it's common. If not we might need to check package.json

// Create Student Account
exports.createAccount = async (req, res) => {
    try {
        // Validation
        if (!req.body.username || !req.body.password || !req.body.email) {
            return res.status(400).send({ message: "Content can not be empty!" });
        }

        // Check duplicate username or email in User table
        // Note: Email checking in User table depends on if we store email there. 
        // Based on previous user.model.js, we only have username. 
        // But Student table has email.

        const existingUser = await User.findOne({
            where: { username: req.body.username }
        });

        if (existingUser) {
            return res.status(400).send({ message: "Username is already taken!" });
        }

        // Hash password
        const password = await bcrypt.hash(req.body.password, 8);

        // Create User
        const user = await User.create({
            username: req.body.username,
            password: password,
            fullName: req.body.fullName,
            role: 'student'
        });

        // Create Student linked to User
        const student = await Student.create({
            name: req.body.fullName,
            gender: req.body.gender,
            address: req.body.address,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            birthPlace: req.body.birthPlace,
            birthDate: req.body.birthDate,
            phoneNumber: req.body.phone,
            email: req.body.email,
            course: req.body.level, // Store the label
            programId: req.body.programId, // Store the actual sub-program ID
            userId: user.id
        });

        // Update Booking Status if bookingId (passed as scheduleId) is provided
        if (req.body.scheduleId) {
            await db.AppointmentBooking.update(
                { status: 'ACCEPTED' },
                { where: { id: req.body.scheduleId } }
            );
        }

        res.send({ message: "Student account created successfully!", user, student });

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the account."
        });
    }
};

// Retrieve all Students
exports.findAll = (req, res) => {
    Student.findAll({
        include: ["user"]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving students."
            });
        });
};

// Update a Student
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const student = await Student.findByPk(id, { include: ["user"] });
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }

        // Update Student fields
        await student.update({
            name: req.body.fullName,
            gender: req.body.gender,
            address: req.body.address,
            phoneNumber: req.body.phone,
            email: req.body.email,
            birthDate: req.body.birthDate,
            course: req.body.level, // Label
            programId: req.body.programId // Sub-program ID
            // Add other fields as necessary
        });

        // Update User fields if associated
        if (student.user) {
            const userUpdateData = {
                fullName: req.body.fullName,
                username: req.body.username
            };

            // Only update password if provided and not empty
            if (req.body.password && req.body.password.trim() !== '') {
                userUpdateData.password = await bcrypt.hash(req.body.password, 8);
            }

            await student.user.update(userUpdateData);
        }

        res.send({ message: "Student was updated successfully." });
    } catch (err) {
        res.status(500).send({
            message: "Error updating Student with id=" + id
        });
    }
};

// Delete a Student
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }

        // Delete the student record
        await Student.destroy({
            where: { id: id }
        });

        // If the student has an associated User account, delete it too
        if (student.userId) {
            await User.destroy({
                where: { id: student.userId }
            });
        }

        res.send({ message: "Student was deleted successfully!" });
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Student with id=" + id
        });
    }
};
