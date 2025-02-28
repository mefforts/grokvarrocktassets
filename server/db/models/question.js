// server/db/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  answers: {
    type: [String],
    required: true,
    validate: [arr => arr.length >= 1, 'At least one answer is required']
  },
  correctAnswer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Easy', 'Medium', 'Hard', 'Elite', 'Master'],
    default: 'Medium'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  explanation: {
    type: String,
    trim: true
  },
  xpReward: {
    type: Number,
    required: true,
    default: function() {
      // XP rewards based on difficulty
      const xpValues = {
        'Beginner': 10,
        'Easy': 25,
        'Medium': 50,
        'Hard': 100,
        'Elite': 200,
        'Master': 500
      };
      return xpValues[this.difficulty] || 50;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);