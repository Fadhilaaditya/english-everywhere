module.exports = app => {
    const students = require("../controllers/student.controller.js");

    var router = require("express").Router();

    // Retrieve all Students
    router.get("/", students.findAll);

    // Create Student Account
    router.post("/account", students.createAccount);

    app.use('/api/students', router);
};
