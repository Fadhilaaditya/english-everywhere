module.exports = app => {
    const classrooms = require("../controllers/classroomController.js");

    var router = require("express").Router();

    // Retrieve all Classrooms
    router.get("/", classrooms.findAll);

    app.use('/api/classrooms', router);
};
