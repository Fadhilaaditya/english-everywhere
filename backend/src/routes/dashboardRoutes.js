const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// Export router as factory function to attach directly in app.js
module.exports = (app) => {
    router.get("/", [verifyToken, isAdmin], dashboardController.getDashboardData);

    // Register routes
    app.use("/api/dashboard", router);
};
