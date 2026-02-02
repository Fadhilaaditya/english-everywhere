module.exports = (sequelize, Sequelize) => {
    const Teacher = sequelize.define("teachers", {
        nip: {
            type: Sequelize.STRING,
            unique: true
        },
        specialization: {
            type: Sequelize.STRING
        },
        bio: {
            type: Sequelize.TEXT
        }
    });

    return Teacher;
};