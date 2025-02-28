// server/routes/pages.js
const express = require('express');
const path = require('path');
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Route for the play page
router.get('/play', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'play.html'));
});

// Route for the leaderboard page
router.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'leaderboard.html'));
});

// Route for the profile page
router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'profile.html'));
});

module.exports = router;