module.exports = app => {
    const programs = require("../controllers/program.controller.js");

    var router = require("express").Router();

    // Retrieve all Programs
    router.get("/", programs.findAll);

    // Retrieve all Booked Schedules
    router.get("/booked/all", programs.getAllBookedSchedules);

    // Retrieve Schedules for a Program
    router.get("/:id/schedules", programs.getSchedules);

    // Create a Schedule for a Program
    router.post("/:id/schedules", programs.createSchedule);

    // Update a Schedule
    router.put("/:id/schedules/:scheduleId", programs.updateSchedule);

    // Delete a Schedule
    router.delete("/:id/schedules/:scheduleId", programs.deleteSchedule);

    app.use('/api/programs', router);
};
