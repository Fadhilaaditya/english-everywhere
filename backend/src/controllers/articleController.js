const db = require("../models");
const Article = db.Article;
const Op = db.Sequelize.Op;

// Create and Save a new Article
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create an Article
    const article = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        intro: req.body.intro,
        sections: req.body.sections
    };

    // Save Article in the database
    Article.create(article)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Article."
            });
        });
};

// Retrieve all Articles from the database.
exports.findAll = (req, res) => {
    const { title = '', search = '', page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Use search query if provided, fallback to title for backward compatibility
    const query = search || title;
    var condition = query ? { 
        [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
        ]
    } : null;

    Article.findAndCountAll({ 
        where: condition,
        attributes: { exclude: ['sections'] },
        limit: limitNum,
        offset: offset,
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send({
                totalItems: data.count,
                articles: data.rows,
                totalPages: Math.ceil(data.count / limitNum),
                currentPage: pageNum
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving articles."
            });
        });
};

// Find a single Article with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Article.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Article with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Article with id=" + id
            });
        });
};

// Update an Article by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Article.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Article was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Article with id=${id}. Maybe Article was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Article with id=" + id
            });
        });
};

// Delete an Article with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Article.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Article was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Article with id=" + id
            });
        });
};

// Retrieve Article Summary Stats
exports.getSummary = async (req, res) => {
    try {
        const total = await Article.count();
        // For now, since there is no status column, interpret all as published
        const published = total;

        res.send({
            total,
            published
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving article summary."
        });
    }
};
