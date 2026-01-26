const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

router.post('/', uploadController.multerUpload, uploadController.uploadImage);

module.exports = router;
