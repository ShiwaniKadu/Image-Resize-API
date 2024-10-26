const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.uploadAndResize = async (req, res) => {
  try {
    const { width, height, format } = req.query; 
    const imagePath = req.file.path;
    const outputFormat = format || path.extname(req.file.originalname).slice(1);

    let image = sharp(imagePath);
    if (width || height) {
      image = image.resize(parseInt(width), parseInt(height), { fit: 'inside' });
    }

    // Optional watermark
    const watermarkText = 'Sample Watermark'; 
    image = image.composite([{
      input: Buffer.from(
        `<svg width="200" height="50">
           <text x="10" y="30" font-size="20" fill="white" opacity="0.5">${watermarkText}</text>
         </svg>`
      ),
      gravity: 'southeast',
    }]);

    if (outputFormat) {
      image = image.toFormat(outputFormat);
    }

    const resizedImagePath = `resized/${req.file.filename}.${outputFormat}`;
    await image.toFile(resizedImagePath);

    res.status(200).json({
      message: 'Image resized successfully',
      downloadUrl: `/api/download/${req.file.filename}.${outputFormat}`
    });

    fs.unlinkSync(imagePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadImage = (req, res) => {
  const imagePath = path.join(__dirname, '..', 'resized', req.params.imageId);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
};
