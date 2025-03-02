// server/db/index.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Use MongoDB Atlas URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      retryWrites: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't crash the server on connection error, just log it
    return null;
  }
};

module.exports = connectDB;