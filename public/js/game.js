// Update to the startGame function in game.js

async function startGame() {
    // Show loading state
    elements.startGameBtn.textContent = 'Loading...';
    elements.startGameBtn.disabled = true;
    
    try {
        // First try to fetch from API
        try {
            const response = await fetch(`/api/questions?difficulty=${gameState.difficulty}&category=${gameState.category}&limit=${gameState.totalQuestions}`);
            
            if (response.ok) {
                gameState.questions = await response.json();
                console.log('Using server data');
            } else {
                // If API fails, throw error to trigger fallback
                throw new Error('API unavailable');
            }
        } catch (apiError) {
            console.log('API error, using fallback data:', apiError);
            // Use fallback data
            if (window.localQuestionData && window.localQuestionData[gameState.difficulty]) {
                gameState.questions = window.localQuestionData[gameState.difficulty];
                // Filter by category if specified
                if (gameState.category) {
                    gameState.questions = gameState.questions.filter(q => q.category === gameState.category);
                }
                console.log('Using local fallback data');
            } else {
                throw new Error('No fallback data available');
            }
        }
        
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
        alert(error.message || 'Failed to start the game. Please try again.');
        elements.startGameBtn.textContent = 'Start Game';
        elements.startGameBtn.disabled = false;
    }
}