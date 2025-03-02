// server/db/index.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable for MongoDB URI in production, fallback to local for development
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/osrs-trivia', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;