module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("events", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATEONLY, // Using DATEONLY for YYYY-MM-DD
            allowNull: false
        },
        time: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.STRING,
            allowNull: false
        },
        desc: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        category: {
            type: Sequelize.STRING,
            allowNull: true
        },
        location: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return Event;
};
