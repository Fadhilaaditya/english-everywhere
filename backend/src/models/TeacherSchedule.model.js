module.exports = (sequelize, Sequelize) => {
  const TeacherSchedule = sequelize.define("teacher_schedule", {
    day: {
      type: Sequelize.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ),
      allowNull: false,
    },
    startTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    endTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("Available", "Booked", "Canceled"),
      defaultValue: "Available",
    },
  });

  return TeacherSchedule;
};
