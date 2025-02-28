// server/routes/api.js
const express = require('express');
const router = express.Router();
const Question = require('../db/models/Question');
const User = require('../db/models/User');
const auth = require('../middleware/auth');

// Get questions based on difficulty and category
router.get('/questions', async (req, res) => {
  try {
    const { difficulty, category, limit = 10 } = req.query;
    
    // Build query based on provided parameters
    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    
    // Get random questions matching the query
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(limit) } },
      { $project: { correctAnswer: 0 } } // Don't send correct answer to client
    ]);
    
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check answer
router.post('/check-answer', auth, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    
    if (!questionId || !answer) {
      return res.status(400).json({ message: 'QuestionId and answer are required' });
    }
    
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const isCorrect = question.correctAnswer.toLowerCase() === answer.toLowerCase();
    
    // Update user stats
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.questionsAnswered += 1;
      
      if (isCorrect) {
        user.correctAnswers += 1;
        user.streak += 1;
        user.xp += question.xpReward;
        
        // Check if user leveled up
        const newLevel = user.calculateLevel();
        user.level = newLevel;
        
        // Add to completed questions
        if (!user.completedQuestions.includes(questionId)) {
          user.completedQuestions.push(questionId);
        }
      } else {
        user.streak = 0;
      }
      
      user.lastActive = Date.now();
      await user.save();
    }
    
    res.json({
      isCorrect,
      correctAnswer: isCorrect ? null : question.correctAnswer,
      explanation: question.explanation,
      xpGained: isCorrect ? question.xpReward : 0,
      userLevel: user ? user.level : 1,
      userXp: user ? user.xp : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ xp: -1 })
      .limit(100)
      .select('username level xp questionsAnswered correctAnswers -_id');
    
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;