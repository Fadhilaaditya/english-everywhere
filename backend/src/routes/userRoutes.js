module.exports = app => {
    const users = require("../controllers/userController");

    var router = require("express").Router();

    // Get Account Stats
    router.get("/stats", users.getStats);

    // Retrieve all Users (Student & Teacher)
    router.get("/", users.findAll);

    // Retrieve a single User by id
    router.get("/:id", users.findOne);

    // Delete User
    router.delete("/:id", users.delete);

    // Create User
    router.post("/", users.create);

    // Update User
    router.put("/:id", users.update);

    app.use('/api/users', router);
};
