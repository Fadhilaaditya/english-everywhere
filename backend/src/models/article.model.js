module.exports = (sequelize, Sequelize) => {
    const Article = sequelize.define("article", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING
        },
        intro: {
            type: Sequelize.JSON
        },
        sections: {
            type: Sequelize.JSON
        }
    });

    return Article;
};
