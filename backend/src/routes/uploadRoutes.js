const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/authJwt');

router.post('/', [verifyToken], uploadController.multerUpload, uploadController.uploadImage);

module.exports = router;
