// server/db/index.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For development, using local MongoDB
    const conn = await mongoose.connect('mongodb://localhost:27017/osrs-trivia', {
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