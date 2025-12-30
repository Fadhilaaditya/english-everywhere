module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    // Get Account Stats
    router.get("/stats", users.getStats);

    app.use('/api/users', router);
};
