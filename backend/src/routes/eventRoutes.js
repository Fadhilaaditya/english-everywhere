const express = require("express");
const router = express.Router();
const events = require("../controllers/eventController");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// Create a new Event
router.post("/", [verifyToken, isAdmin], events.create);

// Retrieve all Events
router.get("/", events.findAll);

// Retrieve Upcoming Events
router.get("/upcoming", events.findUpcoming);

// Retrieve Past Events
router.get("/past", events.findPast);

// Retrieve Event Summary
router.get("/summary", [verifyToken, isAdmin], events.getSummary);

// Retrieve a single Event with id
router.get("/:id", events.findOne);

// Update an Event with id
router.put("/:id", [verifyToken, isAdmin], events.update);

// Delete an Event with id
router.delete("/:id", [verifyToken, isAdmin], events.delete);

module.exports = router;
