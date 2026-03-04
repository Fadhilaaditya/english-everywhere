module.exports = app => {
    const students = require("../controllers/studentController");

    var router = require("express").Router();

    // Retrieve all Students
    router.get("/", students.findAll);

    // Create Student Account
    router.post("/account", students.createAccount);

    // Update Student
    router.put("/:id", students.update);

    // Delete Student
    router.delete("/:id", students.delete);

    app.use('/api/students', router);
};
