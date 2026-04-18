module.exports = app => {
    const articles = require("../controllers/articleController.js");
    const { verifyToken, isAdmin } = require("../middleware/authJwt");

    var router = require("express").Router();

    // Create a new Article
    router.post("/", [verifyToken, isAdmin], articles.create);

    // Retrieve all Articles
    router.get("/", articles.findAll);

    // Retrieve Article Summary
    router.get("/summary", articles.getSummary);

    // Retrieve a single Article with id
    router.get("/:id", articles.findOne);

    // Update a Article with id
    router.put("/:id", [verifyToken, isAdmin], articles.update);

    // Delete a Article with id
    router.delete("/:id", [verifyToken, isAdmin], articles.delete);

    app.use('/api/articles', router);
};
