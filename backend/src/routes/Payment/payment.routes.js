module.exports = app => {
    const payment = require("../../controllers/Payment/payment.controller.js");
    var router = require("express").Router();

    // Create Transaction (Snap Token)
    router.post("/charge", payment.createTransaction);

    // Handle Notification Webhook
    router.post("/notification", payment.handleNotification);

    app.use('/api/payments', router);
};
