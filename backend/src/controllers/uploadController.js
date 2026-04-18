const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config({ path: '.env.development' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        // Convert buffer to base64
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: 'english-everywhere/thumbnails',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        res.status(200).send({
            message: 'Upload successful',
            secure_url: result.secure_url
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).send({
            message: 'Failed to upload image',
            error: error.message
        });
    }
};

exports.multerUpload = upload.single('image');
