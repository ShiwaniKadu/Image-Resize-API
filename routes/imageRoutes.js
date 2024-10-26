// routes/imageRoutes.js
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({
  dest: 'uploads/', // Directory to save uploaded files temporarily
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

// Upload and resize route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { width, height, format } = req.query; // Get width, height, and format from query params
    const imagePath = req.file.path;
    const outputFormat = format || path.extname(req.file.originalname).slice(1);

    // Resize the image
    const image = sharp(imagePath);
    if (width || height) {
      image.resize(parseInt(width), parseInt(height), { fit: 'inside' });
    }

    // Convert format if specified
    if (outputFormat) {
      image.toFormat(outputFormat);
    }

    // Generate a unique ID for the resized image and save it
    const resizedImagePath = `resized/${req.file.filename}.${outputFormat}`;
    await image.toFile(resizedImagePath);

    // Respond with the resized image's URL
    res.status(200).json({
      message: 'Image resized successfully',
      downloadUrl: `/api/download/${req.file.filename}.${outputFormat}`,
    });

    // Remove the original uploaded image
    fs.unlinkSync(imagePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
