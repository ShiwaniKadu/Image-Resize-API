const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const upload = multer({
  dest: 'uploads/', 
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { width, height, format } = req.query; 
    const imagePath = req.file.path;
    const outputFormat = format || path.extname(req.file.originalname).slice(1);

    const image = sharp(imagePath);
    if (width || height) {
      image.resize(parseInt(width), parseInt(height), { fit: 'inside' });
    }

    if (outputFormat) {
      image.toFormat(outputFormat);
    }

    const resizedImagePath = `resized/${req.file.filename}.${outputFormat}`;
    await image.toFile(resizedImagePath);

    res.status(200).json({
      message: 'Image resized successfully',
      downloadUrl: `/api/download/${req.file.filename}.${outputFormat}`,
    });

    fs.unlinkSync(imagePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
