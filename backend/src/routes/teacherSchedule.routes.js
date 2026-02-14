const express = require("express");
const router = express.Router();
const teacherSchedule = require("../controllers/teacherSchedule.controller.js");

// TES: Tanpa middleware authJwt sementara
router.get("/", teacherSchedule.findAll);
router.post("/", teacherSchedule.create);
router.put("/:id", teacherSchedule.update);
router.delete("/:id", teacherSchedule.delete);

module.exports = router;
