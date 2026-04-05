module.exports = (sequelize, Sequelize) => {
    const ProgramSchedule = sequelize.define("program_schedules", {
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        time: {
            type: Sequelize.STRING,
            allowNull: false
        },
        maxSlots: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        status: {
            type: Sequelize.ENUM('AVAILABLE', 'PENDING', 'BOOKED', 'ACCEPTED'),
            allowNull: false,
            defaultValue: 'AVAILABLE'
        }
    });

    return ProgramSchedule;
};
