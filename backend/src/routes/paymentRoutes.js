const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// Export router as factory function to attach directly in app.js if following the same pattern
module.exports = (app) => {
  // Admin Routes
  router.post("/", [verifyToken, isAdmin], paymentController.createPayment);
  router.get("/", [verifyToken, isAdmin], paymentController.getAllPayments);
  router.put("/:id/approve", [verifyToken, isAdmin], paymentController.approvePayment);
  router.delete("/:id", [verifyToken, isAdmin], paymentController.deletePayment);

  // User Routes
  router.get("/user/:studentId", [verifyToken], paymentController.getUserPayments);
  router.put("/:id/confirm", [verifyToken], paymentController.confirmPayment);

  // Register routes
  app.use("/api/payments", router);
};
