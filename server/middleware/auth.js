// server/middleware/database.js
const mongoose = require('mongoose');

// Middleware to check database connection
const checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
      return res.status(503).json({
        message: 'Database temporarily unavailable',
        error: 'Please try again later'
      });
    }
    // For static pages, just continue
  }
  next();
};

module.exports = checkDatabaseConnection;