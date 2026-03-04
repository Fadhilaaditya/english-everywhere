const db = require("../models");
const Classroom = db.Classroom;

// Retrieve all Classrooms from the database.
exports.findAll = async (req, res) => {
    try {
        const data = await Classroom.findAll({
            order: [["name", "ASC"]],
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving classrooms.",
        });
    }
};
