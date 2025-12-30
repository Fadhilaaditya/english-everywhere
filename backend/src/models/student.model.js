module.exports = (sequelize, Sequelize) => {
    const Student = sequelize.define("students", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.ENUM('Male', 'Female'),
            allowNull: false
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        fatherName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        motherName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        birthPlace: {
            type: Sequelize.STRING,
            allowNull: true
        },
        birthDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    });

    return Student;
};
