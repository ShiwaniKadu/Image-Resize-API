// index.js
const express = require('express');
const path = require('path');
const imageRoutes = require('./routes/imageRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api', imageRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
