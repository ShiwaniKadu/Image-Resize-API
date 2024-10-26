// utils/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
  
    // Respond with a generic error message
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: err.message
    });
  };
  
  module.exports = errorHandler;
  