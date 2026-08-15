const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Upload an image to ImageKit (Admin only)
router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

// Delete an image from ImageKit by fileId (Admin only)
router.delete('/:fileId', protect, adminOnly, deleteImage);

module.exports = router;
