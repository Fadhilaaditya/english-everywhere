const db = require('../models');
const Event = db.Event;
const Op = db.Sequelize.Op;

const parseImages = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => parseImages(item));
    }
    const eventObj = data.get ? data.get({ plain: true }) : data;
    if (eventObj.images) {
        try {
            eventObj.images = JSON.parse(eventObj.images);
        } catch (e) {
            eventObj.images = [];
        }
    } else {
        eventObj.images = [];
    }
    return eventObj;
};

// Create and Save a new Event
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create an Event
    const event = {
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        price: req.body.price,
        desc: req.body.desc,
        image: req.body.image,
        images: req.body.images ? JSON.stringify(req.body.images) : null,
        category: req.body.category,
        location: req.body.location
    };

    // Save Event in the database
    Event.create(event)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Event."
            });
        });
};

// Retrieve all Events from the database.
exports.findAll = (req, res) => {
    Event.findAll()
        .then(data => {
            const parsedData = data.map(event => {
                const eventObj = event.get({ plain: true });
                if (eventObj.images) {
                    try {
                        eventObj.images = JSON.parse(eventObj.images);
                    } catch (e) {
                        eventObj.images = [];
                    }
                } else {
                    eventObj.images = [];
                }
                return eventObj;
            });
            res.send(parsedData);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving events."
            });
        });
};

// Retrieve Upcoming Events (date >= today)
exports.findUpcoming = (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    Event.findAll({
        where: {
            date: {
                [Op.gte]: today
            }
        },
        order: [['date', 'ASC']]
    })
        .then(data => {
            res.send(parseImages(data));
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving upcoming events."
            });
        });
};

// Retrieve Past Events (date < today)
exports.findPast = (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    Event.findAll({
        where: {
            date: {
                [Op.lt]: today
            }
        },
        order: [['date', 'DESC']]
    })
        .then(data => {
            res.send(parseImages(data));
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving past events."
            });
        });
};

// Retrieve Event Summary Stats
exports.getSummary = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const total = await Event.count();
        const upcoming = await Event.count({
            where: {
                date: { [Op.gte]: today }
            }
        });
        const past = await Event.count({
            where: {
                date: { [Op.lt]: today }
            }
        });

        res.send({
            total,
            upcoming,
            past
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving event summary."
        });
    }
};

// Find a single Event with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Event.findByPk(id)
        .then(data => {
            if (data) {
                const eventObj = data.get({ plain: true });
                if (eventObj.images) {
                    try {
                        eventObj.images = JSON.parse(eventObj.images);
                    } catch (e) {
                        eventObj.images = [];
                    }
                } else {
                    eventObj.images = [];
                }
                res.send(eventObj);
            } else {
                res.status(404).send({
                    message: `Cannot find Event with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Event with id=" + id
            });
        });
};

// Update an Event by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    const updateData = { ...req.body };
    if (updateData.images && Array.isArray(updateData.images)) {
        updateData.images = JSON.stringify(updateData.images);
    }

    Event.update(updateData, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Event was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Event with id=" + id
            });
        });
};

// Delete an Event with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Event.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Event was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Event with id=" + id
            });
        });
};
