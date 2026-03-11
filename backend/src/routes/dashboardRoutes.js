const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Export router as factory function to attach directly in app.js
module.exports = (app) => {
    router.get("/", dashboardController.getDashboardData);

    // Register routes
    app.use("/api/dashboard", router);
};
