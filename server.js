const express = require('express');
const sharp = require('sharp');
const cors = require('cors');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

app.use(cors());
app.use(express.json());

if (!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR);
}

app.post('/upload', async (req, res) => {
    const form = formidable({ uploadDir: UPLOAD_DIR, keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing the file.' });
        }

        const { width, height, format } = fields;
        const file = files.image;

        if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type. Acceptable formats are JPEG, PNG, GIF, and SVG.' });
        }

        const imagePath = file.filepath;
        const outputPath = path.join(UPLOAD_DIR, `resized-${file.newFilename}`);

        try {
            let resizeOptions = { 
                width: width ? parseInt(width) : null, 
                height: height ? parseInt(height) : null,
                fit: sharp.fit.inside, 
            };

            await sharp(imagePath)
                .resize(resizeOptions)
                .toFormat(format || 'png')

            res.status(200).json({ message: 'Image resized successfully!', imageUrl: `/download/${file.newFilename}` });
        } catch (resizeErr) {
            console.error(resizeErr);
            res.status(500).json({ error: 'Error resizing the image.' });
        }
    });
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.filename);
    res.download(filePath, err => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
