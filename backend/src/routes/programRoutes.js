module.exports = (app) => {
  const programs = require("../controllers/programController");
  const { verifyToken, isAdmin } = require("../middleware/authJwt");

  var router = require("express").Router();

  // 1. Retrieve all Programs
  // Memanggil exports.findAll di controller
  router.get("/", programs.findAll);

  // 1.1 Retrieve Levels for a Program
  router.get("/:id/levels", programs.getLevels);

  // 1.2 Retrieve a single Program
  router.get("/:id", programs.findOne);

  // 2.1 Retrieve all Schedules (Global)
  router.get("/schedules/global", programs.findAllGlobal);
  router.post("/schedules/global", [verifyToken, isAdmin], programs.createSchedule);

  // 3. Retrieve Schedules for a Program
  // SINKRONISASI: Di controller kamu menamainya 'getSchedulesByProgram'
  // Jika di controller kamu menambahkan 'exports.getSchedules = exports.getSchedulesByProgram', baris ini aman.
  router.get("/:id/schedules", programs.getSchedulesByProgram);

  // 4. Create a Schedule for a Program
  // Pastikan exports.createSchedule ada di controller (meskipun hanya dummy)
  router.post("/:id/schedules", [verifyToken, isAdmin], programs.createSchedule);

  // 5. Update a Schedule
  // Memanggil exports.updateSchedule di controller
  router.put("/:id/schedules/:scheduleId", [verifyToken, isAdmin], programs.updateSchedule);

  // 6. Delete a Schedule
  // Pastikan exports.deleteSchedule ada di controller
  router.delete("/:id/schedules/:scheduleId", [verifyToken, isAdmin], programs.deleteSchedule);
  router.delete("/schedules/:scheduleId", [verifyToken, isAdmin], programs.deleteSchedule); // Added to match frontend call

  // 7. Revert/Unbook Schedule
  // Pastikan exports.revertSchedule ada di controller
  router.put("/schedules/:scheduleId/revert", [verifyToken, isAdmin], programs.revertSchedule);

  // 8. Update schedule status directly
  router.put("/schedules/:scheduleId", [verifyToken, isAdmin], programs.updateScheduleDirectly);

  // 9. Book an appointment
  router.post("/schedules/:scheduleId/book", programs.bookAppointment);

  // 10. Get bookings for a schedule (Admin)
  router.get("/schedules/:scheduleId/bookings", [verifyToken, isAdmin], programs.getBookingsBySchedule);

  // 11. Get all bookings globally (Admin)
  router.get("/bookings/all", [verifyToken, isAdmin], programs.getAllBookings);

  // 12. Delete individual booking
  router.delete("/bookings/:id", [verifyToken, isAdmin], programs.deleteBooking);

  // 13. Reject individual booking
  router.put("/bookings/:id/reject", [verifyToken, isAdmin], programs.rejectBooking);

  // 14. Approve individual booking
  router.put("/bookings/:id/approve", [verifyToken, isAdmin], programs.approveBooking);

  // 14.1 Accept individual booking (Pass Test)
  router.put("/bookings/:id/accept", [verifyToken, isAdmin], programs.acceptBooking);

  // 15. Mark bookings as read
  router.put("/bookings/mark-read", [verifyToken, isAdmin], programs.markAsRead);

  app.use("/api/programs", router);
};
