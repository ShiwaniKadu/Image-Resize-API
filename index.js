require('dotenv').config();

const express = require('express');
const sharp = require('sharp');
const cors = require('cors');
const formidable = require('formidable');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/file', (req, res, next) => {
	const form = formidable();
	form.parse(req, async (err, fields, files) => {
		if (err) {
			return next(err); 
		}
		try {
			const imageInput = files.image.path;
			const contentType = files.image.type;

			const data = await sharp(imageInput)
				.resize(512, 512)
				.png()
				.toBuffer();
			
			const base64Data = data.toString('base64');
			res.status(202).json({ b64Data: base64Data, contentType: contentType, extension: 'png' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred while processing the image.' });
		}
	});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
