const imagekit = require('../config/imagekit');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}_${req.file.originalname}`,
      folder: '/isa-club',
    });

    res.status(201).json({
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    await imagekit.deleteFile(fileId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Image deletion failed', error: error.message });
  }
};

module.exports = { uploadImage, deleteImage };
