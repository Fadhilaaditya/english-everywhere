module.exports = app => {
    const classrooms = require("../controllers/classroomController.js");
    const { verifyToken, isAdmin } = require("../middleware/authJwt");

    var router = require("express").Router();

    // Retrieve all Classrooms
    router.get("/", [verifyToken, isAdmin], classrooms.findAll);

    app.use('/api/classrooms', router);
};
