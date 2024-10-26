const express = require('express');
const path = require('path');
const imageRoutes = require('./routes/imageRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', imageRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
