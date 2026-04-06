module.exports = app => {
    const users = require("../controllers/userController");
    const { verifyToken, isAdmin, isOwnerOrAdmin } = require("../middleware/authJwt");

    var router = require("express").Router();

    // Get Account Stats
    router.get("/stats", [verifyToken, isAdmin], users.getStats);

    // Retrieve all Users (Student & Teacher)
    router.get("/", [verifyToken, isAdmin], users.findAll);

    // Retrieve a single User by id
    router.get("/:id", [verifyToken, isOwnerOrAdmin], users.findOne);

    // Delete User
    router.delete("/:id", [verifyToken, isAdmin], users.delete);

    // Import Users
    router.post("/import", [verifyToken, isAdmin], users.importBulk);

    // Create User
    router.post("/", [verifyToken, isAdmin], users.create);

    // Update User
    router.put("/:id", [verifyToken, isOwnerOrAdmin], users.update);

    app.use('/api/users', router);
};
