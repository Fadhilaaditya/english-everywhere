module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fullName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'nama_lengkap' // Map to database column 'nama_lengkap'
        },
        photo: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return User;
};
