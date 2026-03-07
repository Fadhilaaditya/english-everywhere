module.exports = (app) => {
  const programs = require("../controllers/programController");

  var router = require("express").Router();

  // 1. Retrieve all Programs
  // Memanggil exports.findAll di controller
  router.get("/", programs.findAll);

  // 2.1 Retrieve all Schedules (Global)
  router.get("/schedules/global", programs.findAllGlobal);
  router.post("/schedules/global", programs.createSchedule);

  // 3. Retrieve Schedules for a Program
  // SINKRONISASI: Di controller kamu menamainya 'getSchedulesByProgram'
  // Jika di controller kamu menambahkan 'exports.getSchedules = exports.getSchedulesByProgram', baris ini aman.
  router.get("/:id/schedules", programs.getSchedulesByProgram);

  // 4. Create a Schedule for a Program
  // Pastikan exports.createSchedule ada di controller (meskipun hanya dummy)
  router.post("/:id/schedules", programs.createSchedule);

  // 5. Update a Schedule
  // Memanggil exports.updateSchedule di controller
  router.put("/:id/schedules/:scheduleId", programs.updateSchedule);

  // 6. Delete a Schedule
  // Pastikan exports.deleteSchedule ada di controller
  router.delete("/:id/schedules/:scheduleId", programs.deleteSchedule);

  // 7. Revert/Unbook Schedule
  // Pastikan exports.revertSchedule ada di controller
  router.put("/schedules/:scheduleId/revert", programs.revertSchedule);

  // 8. Update schedule status directly
  router.put("/schedules/:scheduleId", programs.updateScheduleDirectly);

  // 9. Book an appointment
  router.post("/schedules/:scheduleId/book", programs.bookAppointment);

  // 10. Get bookings for a schedule (Admin)
  router.get("/schedules/:scheduleId/bookings", programs.getBookingsBySchedule);

  // 11. Get all bookings globally (Admin)
  router.get("/bookings/all", programs.getAllBookings);

  // 12. Delete individual booking
  router.delete("/bookings/:id", programs.deleteBooking);

  // 13. Reject individual booking
  router.put("/bookings/:id/reject", programs.rejectBooking);

  // 14. Approve individual booking
  router.put("/bookings/:id/approve", programs.approveBooking);

  // 15. Mark bookings as read
  router.put("/bookings/mark-read", programs.markAsRead);

  app.use("/api/programs", router);
};
