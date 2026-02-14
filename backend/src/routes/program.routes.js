module.exports = (app) => {
  const programs = require("../controllers/program.controller.js");

  var router = require("express").Router();

  // 1. Retrieve all Programs
  // Memanggil exports.findAll di controller
  router.get("/", programs.findAll);

  // 2. Retrieve all Booked Schedules
  // Memanggil exports.getAllBookedSchedules di controller
  // Rute statis ini diletakkan DI ATAS rute parameter :id agar tidak tertukar
  router.get("/booked/all", programs.getAllBookedSchedules);

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

  app.use("/api/programs", router);
};
