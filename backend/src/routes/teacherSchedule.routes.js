const express = require("express");
const router = express.Router();
const teacherSchedule = require("../controllers/teacherSchedule.controller.js");

const authJwt = require("../middleware/authJwt");

// Rute khusus untuk guru melihat jadwalnya sendiri
router.get("/my-schedules", [authJwt.verifyToken], teacherSchedule.findMySchedules);

router.get("/", teacherSchedule.findAll);
router.post("/", teacherSchedule.create);
router.put("/:id", teacherSchedule.update);
router.delete("/:id", teacherSchedule.delete);

module.exports = router;
