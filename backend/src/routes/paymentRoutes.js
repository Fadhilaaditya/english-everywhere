const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Export router as factory function to attach directly in app.js if following the same pattern
module.exports = (app) => {
  // Admin Routes
  router.post("/", paymentController.createPayment);
  router.get("/", paymentController.getAllPayments);
  router.put("/:id/approve", paymentController.approvePayment);
  router.delete("/:id", paymentController.deletePayment);

  // User Routes
  router.get("/user/:studentId", paymentController.getUserPayments);
  router.put("/:id/confirm", paymentController.confirmPayment);

  // Register routes
  app.use("/api/payments", router);
};
