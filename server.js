// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./server/db/index');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const apiRoutes = require('./server/routes/api');
const authRoutes = require('./server/routes/auth');
const pageRoutes = require('./server/routes/pages');

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Connect to database (but don't crash if connection fails)
connectDB().catch(err => {
  console.error('Database connection failed:', err.message);
  console.log('App will continue without database functionality');
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // Request logging

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Import and use database connection check middleware
const checkDatabaseConnection = require('./server/middleware/database');
app.use(checkDatabaseConnection);

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/', pageRoutes);

// Default route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});