module.exports = (sequelize, Sequelize) => {
    const Classroom = sequelize.define(
        "classrooms",
        {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "classrooms",
            timestamps: true, // will automatically add createdAt, updatedAt
        },
    );

    return Classroom;
};
