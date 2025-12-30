const db = require('../models');
const Program = db.Program;
const Op = db.Sequelize.Op;

// Retrieve all Programs from the database.
exports.findAll = (req, res) => {
    Program.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving programs."
            });
        });
};

// Retrieve Schedules for a Program
exports.getSchedules = (req, res) => {
    const id = req.params.id;

    db.ProgramSchedule.findAll({
        where: { programId: id }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving schedules."
            });
        });
};

// Create a Schedule for a Program
exports.createSchedule = (req, res) => {
    const id = req.params.id;

    // Validate request
    if (!req.body.date || !req.body.time) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const schedule = {
        programId: id,
        date: req.body.date,
        time: req.body.time,
        status: req.body.status || 'AVAILABLE'
    };

    // Check for duplicates
    db.ProgramSchedule.findOne({
        where: {
            programId: id,
            date: req.body.date,
            time: req.body.time
        }
    }).then(existing => {
        if (existing) {
            res.status(400).send({
                message: "Schedule already exists for this date and time."
            });
            return;
        }

        db.ProgramSchedule.create(schedule)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the schedule."
                });
            });
    });
};

exports.updateSchedule = async (req, res) => {
    try {
        const { id: programId, scheduleId } = req.params;
        const updates = req.body;

        const schedule = await db.ProgramSchedule.findOne({
            where: { id: scheduleId, programId: programId }
        });

        if (!schedule) {
            return res.status(404).send({ message: "Schedule not found." });
        }

        // If trying to book (change status to PENDING), check if it's currently AVAILABLE
        if (updates.status === 'PENDING' && schedule.status !== 'AVAILABLE') {
            return res.status(400).send({ message: "This schedule is no longer available." });
        }

        // If Approving (status -> BOOKED), create Student record
        if (updates.status === 'BOOKED') {
            const studentData = {
                name: updates.applicantName,
                gender: updates.applicantGender,
                address: updates.applicantAddress,
                fatherName: updates.applicantFather,
                motherName: updates.applicantMother,
                birthPlace: updates.applicantBirthPlace,
                birthDate: updates.applicantBirthDate,
                phoneNumber: updates.applicantPhone,
                email: updates.applicantEmail,
                // userId: updates.userId // TODO: If we want to link to User
            };

            // Create Student
            // We use findOrCreate to avoid duplicates if the same person books multiple times (optional logic, but good practice if email is unique)
            // For now just create.
            try {
                await db.Student.create(studentData);
            } catch (studentError) {
                console.error("Error creating student record:", studentError);
                // We don't stop the schedule update, but maybe we should log it.
            }
        }

        await schedule.update(updates);
        res.send({ message: "Schedule updated successfully.", schedule });
    } catch (err) {
        res.status(500).send({
            message: "Error updating schedule: " + err.message
        });
    }
};

// Retrieve all Booked Schedules (for Applicant Data)
exports.getAllBookedSchedules = (req, res) => {
    db.ProgramSchedule.findAll({
        where: {
            [Op.or]: [
                { status: 'BOOKED' },
                { status: 'booked' }
            ]
        },
        include: [{
            model: db.Program,
            as: 'program',
            attributes: ['title']
        }],
        order: [['date', 'DESC'], ['time', 'ASC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving booked schedules."
            });
        });
};

// Delete a Schedule
exports.deleteSchedule = (req, res) => {
    const id = req.params.scheduleId;

    db.ProgramSchedule.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Schedule was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Schedule with id=${id}. Maybe Schedule was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Schedule with id=" + id
            });
        });
};
