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
        status: {
            type: Sequelize.ENUM('AVAILABLE', 'PENDING', 'BOOKED', 'ACCEPTED'),
            allowNull: false,
            defaultValue: 'AVAILABLE'
        },
        applicantName: { type: Sequelize.STRING },
        applicantGender: { type: Sequelize.STRING },
        applicantAddress: { type: Sequelize.TEXT },
        applicantFather: { type: Sequelize.STRING },
        applicantMother: { type: Sequelize.STRING },
        applicantBirthPlace: { type: Sequelize.STRING },
        applicantBirthDate: { type: Sequelize.DATEONLY },
        applicantPhone: { type: Sequelize.STRING },
        applicantEmail: { type: Sequelize.STRING }
    });

    return ProgramSchedule;
};
