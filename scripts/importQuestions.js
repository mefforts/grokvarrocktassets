// scripts/importQuestions.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../server/db');
const Question = require('../server/db/models/Question');

// Function to parse the questions from exampleQuestions.txt
const parseTextQuestions = () => {
  try {
    const filePath = path.join(__dirname, '../exampleQuestions.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Split by difficulty sections
    const sections = fileContent.split(/\n\n/);
    const questions = [];
    
    let currentDifficulty = '';
    
    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      
      // Check if this is a difficulty header
      if (lines[0].includes('Tier')) {
        currentDifficulty = lines[0].replace('Tier', '').trim();
        lines.shift(); // Remove the difficulty header
      }
      
      // Process each question in the section
      lines.forEach(line => {
        if (/^\d+\./.test(line)) { // Line starts with a number followed by a period
          const match = line.match(/^\d+\.\s*(.*?)\s*-\s*(.*?)$/);
          
          if (match) {
            const text = match[1].trim();
            const correctAnswer = match[2].trim();
            
            // Determine category based on question content
            let category = 'General';
            if (text.includes('level')) {
              category = 'Skills';
            } else if (text.includes('quest')) {
              category = 'Quests';
            } else if (text.includes('NPC') || text.includes('character')) {
              category = 'NPCs';
            } else if (text.includes('item') || text.includes('wear') || text.includes('wield')) {
              category = 'Items';
            } else if (text.includes('located') || text.includes('zone') || text.includes('area')) {
              category = 'Locations';
            }
            
            // Generate plausible incorrect answers (This is simplified)
            const generateWrongAnswers = () => {
              // For numeric answers
              if (!isNaN(parseInt(correctAnswer))) {
                const num = parseInt(correctAnswer);
                return [
                  (num - 5).toString(),
                  (num + 5).toString(),
                  (num + 10).toString()
                ];
              }
              
              // For text answers, we'd need a more sophisticated approach
              // For demo purposes, we'll return placeholder wrong answers
              return ['Wrong answer 1', 'Wrong answer 2', 'Wrong answer 3'];
            };
            
            const answers = [correctAnswer, ...generateWrongAnswers()];
            
            // Calculate XP reward based on difficulty
            const xpValues = {
              'Beginner': "10",
              'Easy': "25",
              'Medium': "50",
              'Hard': "100",
              'Elite': "200",
              'Master': "500"
            };
            
            questions.push({
              text,
              answers,
              correctAnswer,
              difficulty: currentDifficulty,
              category,
              xpReward: parseInt(xpValues[currentDifficulty] || "50")
            });
          }
        }
      });
    });
    
    return questions;
  } catch (error) {
    console.error('Error parsing text questions:', error);
    return [];
  }
};

// Function to import questions from JSON file
const importJsonQuestions = async () => {
  try {
    const filePath = path.join(__dirname, '../data/questions.json');
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`Importing ${questions.length} questions from JSON...`);
    
    // Check if questions already exist
    const existingCount = await Question.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} questions.`);
      
      const overwrite = process.argv.includes('--overwrite');
      if (!overwrite) {
        console.log('Skipping import. Use --overwrite flag to replace existing questions.');
        return;
      }
      
      console.log('Overwriting existing questions...');
      await Question.deleteMany({});
    }
    
    // Insert questions
    await Question.insertMany(questions);
    console.log(`Successfully imported ${questions.length} questions from JSON!`);
  } catch (error) {
    console.error('Error importing JSON questions:', error);
  }
};

// Function to import questions from text file
const importTextQuestions = async () => {
  try {
    const questions = parseTextQuestions();
    
    console.log(`Parsed ${questions.length} questions from text file...`);
    
    // Check if questions already exist
    const existingCount = await Question.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} questions.`);
      
      const overwrite = process.argv.includes('--overwrite');
      if (!overwrite) {
        console.log('Skipping import. Use --overwrite flag to replace existing questions.');
        return;
      }
      
      console.log('Overwriting existing questions...');
      await Question.deleteMany({});
    }
    
    // Insert questions
    await Question.insertMany(questions);
    console.log(`Successfully imported ${questions.length} questions from text file!`);
  } catch (error) {
    console.error('Error importing text questions:', error);
  }
};

// Main function
const importQuestions = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Determine import source
    const useText = process.argv.includes('--text');
    
    if (useText) {
      await importTextQuestions();
    } else {
      await importJsonQuestions();
    }
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the import
importQuestions();