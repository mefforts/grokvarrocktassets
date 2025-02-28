// public/js/game.js

// Game state
const gameState = {
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    streak: 0,
    questions: [],
    difficulty: 'Beginner',
    category: '',
    xpGained: 0,
    quizStartTime: null
};

// DOM elements
const elements = {
    // Sections
    gameSetup: document.getElementById('game-setup'),
    gamePlay: document.getElementById('game-play'),
    gameResults: document.getElementById('game-results'),
    
    // Game setup elements
    difficultyRadios: document.querySelectorAll('input[name="difficulty"]'),
    categorySelect: document.getElementById('category-select'),
    questionCount: document.getElementById('question-count'),
    startGameBtn: document.getElementById('start-game'),
    loginPrompt: document.getElementById('login-prompt'),
    
    // Game play elements
    questionCounter: document.getElementById('question-counter'),
    progressBar: document.querySelector('.progress'),
    currentDifficulty: document.getElementById('current-difficulty'),
    questionImage: document.getElementById('question-image'),
    questionText: document.getElementById('question-text'),
    answersContainer: document.getElementById('answers-container'),
    currentScore: document.getElementById('current-score'),
    currentStreak: document.getElementById('current-streak'),
    
    // Results elements
    finalScore: document.getElementById('final-score'),
    xpGained: document.getElementById('xp-gained'),
    levelProgress: document.getElementById('level-progress'),
    playAgainBtn: document.getElementById('play-again'),
    viewLeaderboardBtn: document.getElementById('view-leaderboard'),
    
    // Feedback modal
    feedbackModal: document.getElementById('feedback-modal'),
    feedbackCorrect: document.getElementById('feedback-correct'),
    feedbackIncorrect: document.getElementById('feedback-incorrect'),
    correctAnswerText: document.getElementById('correct-answer-text'),
    correctAnswer: document.getElementById('correct-answer'),
    explanationText: document.getElementById('explanation-text'),
    xpAmount: document.getElementById('xp-amount'),
    nextQuestionBtn: document.getElementById('next-question')
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    elements.startGameBtn.addEventListener('click', startGame);
    elements.nextQuestionBtn.addEventListener('click', nextQuestion);
    elements.playAgainBtn.addEventListener('click', resetGame);
    elements.viewLeaderboardBtn.addEventListener('click', () => {
        window.location.href = '/leaderboard';
    });
    
    // Set initial difficulty from radio buttons
    for (const radio of elements.difficultyRadios) {
        if (radio.checked) {
            gameState.difficulty = radio.value;
        }
        
        radio.addEventListener('change', function() {
            if (this.checked) {
                gameState.difficulty = this.value;
            }
        });
    }
    
    // Update game state when settings change
    elements.categorySelect.addEventListener('change', function() {
        gameState.category = this.value;
    });
    
    elements.questionCount.addEventListener('change', function() {
        gameState.totalQuestions = parseInt(this.value);
    });
    
    // Set default values
    gameState.totalQuestions = parseInt(elements.questionCount.value);
});

// Start the game
async function startGame() {
    // Show loading state
    elements.startGameBtn.textContent = 'Loading...';
    elements.startGameBtn.disabled = true;
    
    try {
        // Fetch questions based on selected difficulty and category
        const response = await fetch(`/api/questions?difficulty=${gameState.difficulty}&category=${gameState.category}&limit=${gameState.totalQuestions}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        
        gameState.questions = await response.json();
        
        if (gameState.questions.length === 0) {
            alert('No questions available for the selected criteria. Try a different difficulty or category.');
            elements.startGameBtn.textContent = 'Start Game';
            elements.startGameBtn.disabled = false;
            return;
        }
        
        // Reset game state
        gameState.currentQuestion = 0;
        gameState.score = 0;
        gameState.streak = 0;
        gameState.xpGained = 0;
        gameState.quizStartTime = Date.now();
        
        // Switch to game play view
        switchSection(elements.gameSetup, elements.gamePlay);
        
        // Load the first question
        loadQuestion();
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start the game. Please try again.');
        elements.startGameBtn.textContent = 'Start Game';
        elements.startGameBtn.disabled = false;
    }
}

// Load a question
function loadQuestion() {
    const question = gameState.questions[gameState.currentQuestion];
    
    // Update progress
    elements.questionCounter.textContent = `Question ${gameState.currentQuestion + 1} of ${gameState.totalQuestions}`;
    elements.progressBar.style.width = `${((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100}%`;
    
    // Update difficulty badge
    elements.currentDifficulty.textContent = question.difficulty;
    elements.currentDifficulty.className = 'difficulty-badge ' + question.difficulty.toLowerCase();
    
    // Update question
    elements.questionText.textContent = question.text;
    
    // Update image if available
    if (question.imageUrl) {
        elements.questionImage.innerHTML = `<img src="${question.imageUrl}" alt="Question Image">`;
        elements.questionImage.style.display = 'block';
    } else {
        elements.questionImage.style.display = 'none';
    }
    
    // Create answer options
    createAnswerOptions(question);
    
    // Update score and streak
    elements.currentScore.textContent = gameState.score;
    elements.currentStreak.textContent = gameState.streak;
}

// Create answer options
function createAnswerOptions(question) {
    // Clear previous answers
    elements.answersContainer.innerHTML = '';
    
    // Create array of answers including the correct one
    const answers = [...question.answers];
    
    // Shuffle answers
    shuffleArray(answers);
    
    // Create answer buttons
    answers.forEach(answer => {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'answer-btn';
        answerBtn.textContent = answer;
        answerBtn.addEventListener('click', () => checkAnswer(answer, question));
        
        elements.answersContainer.appendChild(answerBtn);
    });
}

// Check if the answer is correct
async function checkAnswer(selectedAnswer, question) {
    // Disable all answer buttons to prevent multiple selections
    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach(btn => {
        btn.disabled = true;
    });
    
    // Determine if answer is correct
    const isCorrect = selectedAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
    
    // Update game state
    if (isCorrect) {
        gameState.score++;
        gameState.streak++;
    } else {
        gameState.streak = 0;
    }
    
    // Get the user token if available
    const token = localStorage.getItem('token');
    let xpReward = 0;
    
    // If user is logged in, submit answer to server
    if (token) {
        try {
            const response = await fetch('/api/check-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    questionId: question._id,
                    answer: selectedAnswer
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                xpReward = result.xpGained;
                gameState.xpGained += xpReward;
                
                // Update user data in localStorage
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                userData.xp = result.userXp;
                userData.level = result.userLevel;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    } else {
        // For non-logged in users, calculate XP reward locally
        const xpValues = {
            'Beginner': 10,
            'Easy': 25,
            'Medium': 50,
            'Hard': 100,
            'Elite': 200,
            'Master': 500
        };
        xpReward = isCorrect ? (xpValues[question.difficulty] || 50) : 0;
        gameState.xpGained += xpReward;
    }
    
    // Show feedback modal
    showFeedback(isCorrect, question, xpReward);
}

// Show feedback modal
function showFeedback(isCorrect, question, xpReward) {
    // Show appropriate feedback section
    if (isCorrect) {
        elements.feedbackCorrect.style.display = 'block';
        elements.feedbackIncorrect.style.display = 'none';
        elements.correctAnswerText.textContent = `${question.text} ${question.explanation ? '- ' + question.explanation : ''}`;
        elements.xpAmount.textContent = xpReward;
    } else {
        elements.feedbackCorrect.style.display = 'none';
        elements.feedbackIncorrect.style.display = 'block';
        elements.correctAnswer.textContent = question.correctAnswer;
        elements.explanationText.textContent = question.explanation || '';
    }
    
    // Show the modal
    elements.feedbackModal.style.display = 'block';
}

// Go to next question
function nextQuestion() {
    // Hide feedback modal
    elements.feedbackModal.style.display = 'none';
    
    // Increment question counter
    gameState.currentQuestion++;
    
    // Check if quiz is complete
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        showResults();
    } else {
        loadQuestion();
    }
}

// Show quiz results
function showResults() {
    // Update result stats
    elements.finalScore.textContent = `${gameState.score}/${gameState.totalQuestions}`;
    elements.xpGained.textContent = `+${gameState.xpGained} XP`;
    
    // Get user data if available
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // If user is logged in, show level progress
    if (userData.level) {
        // Calculate XP for current and next level
        const currentLevelXp = calculateLevelXp(userData.level);
        const nextLevelXp = calculateLevelXp(userData.level + 1);
        const xpForNextLevel = nextLevelXp - currentLevelXp;
        const userXpInLevel = userData.xp - currentLevelXp;
        const progressPercent = (userXpInLevel / xpForNextLevel) * 100;
        
        // Update level progress display
        elements.levelProgress.innerHTML = `
            <div class="level-info">
                <span class="level-number">Level ${userData.level}</span>
                <div class="level-bar">
                    <div class="level-fill" style="width: ${progressPercent}%"></div>
                </div>
                <span class="xp-info">${userXpInLevel.toLocaleString()} / ${xpForNextLevel.toLocaleString()} XP to level ${userData.level + 1}</span>
            </div>
        `;
    } else {
        elements.levelProgress.innerHTML = `
            <div class="level-info not-logged-in">
                <p>Log in to track your progress!</p>
            </div>
        `;
    }
    
    // Switch to results view
    switchSection(elements.gamePlay, elements.gameResults);
}

// Reset game to setup screen
function resetGame() {
    switchSection(elements.gameResults, elements.gameSetup);
    elements.startGameBtn.textContent = 'Start Game';
    elements.startGameBtn.disabled = false;
}

// Switch active section
function switchSection(from, to) {
    from.classList.remove('active');
    to.classList.add('active');
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Calculate XP required for a specific level (OSRS formula)
function calculateLevelXp(level) {
    let points = 0;
    
    for (let i = 1; i < level; i++) {
        points += Math.floor(i + 300 * Math.pow(2, i / 7));
    }
    
    return Math.floor(points / 4);
}