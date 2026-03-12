module.exports = app => {
    const students = require("../controllers/studentController");
    const { verifyToken, isAdmin } = require("../middleware/authJwt");

    var router = require("express").Router();

    // Retrieve all Students
    router.get("/", [verifyToken, isAdmin], students.findAll);

    // Create Student Account
    router.post("/account", [verifyToken, isAdmin], students.createAccount);

    // Update Student
    router.put("/:id", [verifyToken, isAdmin], students.update);

    // Delete Student
    router.delete("/:id", [verifyToken, isAdmin], students.delete);

    app.use('/api/students', router);
};
