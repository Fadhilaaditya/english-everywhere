module.exports = (sequelize, Sequelize) => {
    const AppointmentBooking = sequelize.define("appointment_bookings", {
        applicantName: { type: Sequelize.STRING, allowNull: false },
        applicantGender: { type: Sequelize.STRING },
        applicantAddress: { type: Sequelize.TEXT },
        applicantFather: { type: Sequelize.STRING },
        applicantMother: { type: Sequelize.STRING },
        applicantBirthPlace: { type: Sequelize.STRING },
        applicantBirthDate: { type: Sequelize.DATEONLY },
        applicantPhone: { type: Sequelize.STRING },
        applicantEmail: { type: Sequelize.STRING },
        status: {
            type: Sequelize.ENUM('PENDING', 'BOOKED', 'REJECTED', 'ACCEPTED'),
            allowNull: false,
            defaultValue: 'PENDING'
        },
        isRead: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    return AppointmentBooking;
};
