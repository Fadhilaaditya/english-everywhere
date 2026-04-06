const express = require("express");
const router = express.Router();
const teacherSchedule = require("../controllers/teacherScheduleController");

const authJwt = require("../middleware/authJwt.js");

// Rute khusus untuk guru melihat jadwalnya sendiri
router.get("/my-schedules", [authJwt.verifyToken], teacherSchedule.findMySchedules);

router.get("/", [authJwt.verifyToken, authJwt.isAdmin], teacherSchedule.findAll);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], teacherSchedule.create);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], teacherSchedule.update);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], teacherSchedule.delete);

module.exports = router;
