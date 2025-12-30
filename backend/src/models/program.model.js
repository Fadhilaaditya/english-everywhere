module.exports = (sequelize, Sequelize) => {
    const Program = sequelize.define("programs", {
        title: {
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
            type: Sequelize.ENUM('REGULAR', 'INTENSIVE', 'OTHERS'),
            allowNull: false,
            defaultValue: 'REGULAR'
        }
    });

    return Program;
};
