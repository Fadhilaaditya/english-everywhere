module.exports = app => {
    const payments = require("../controllers/payment.controller.js");
    var router = require("express").Router();

    // Create a new Payment
    router.post("/", payments.create);

    // Retrieve all Payments
    router.get("/", payments.findAll);

    // Retrieve Payment Summary
    router.get("/summary", payments.getSummary);

    // Retrieve a single Payment with id
    router.get("/:id", payments.findOne);

    // Update a Payment with id
    router.put("/:id", payments.update);

    // Delete a Payment with id
    router.delete("/:id", payments.delete);

    app.use('/api/payments', router);
};
