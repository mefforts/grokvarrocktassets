// public/js/leaderboard.js

// DOM elements
const elements = {
    timeframeSelect: document.getElementById('timeframe-select'),
    skillSelect: document.getElementById('skill-select'),
    leaderboardBody: document.getElementById('leaderboard-body'),
    yourRankContainer: document.getElementById('your-rank-container'),
    yourRankDetails: document.getElementById('your-rank-details')
};

// Current state
let leaderboardData = [];
let userData = null;
let userRank = null;

// Initialize the leaderboard
document.addEventListener('DOMContentLoaded', function() {
    // Get user data if available
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        userData = JSON.parse(storedUserData);
    }
    
    // Add event listeners for filters
    elements.timeframeSelect.addEventListener('change', fetchLeaderboard);
    elements.skillSelect.addEventListener('change', fetchLeaderboard);
    
    // Fetch initial leaderboard data
    fetchLeaderboard();
});

// Fetch leaderboard data from the server
async function fetchLeaderboard() {
    try {
        // Show loading state
        elements.leaderboardBody.innerHTML = `
            <tr class="leaderboard-loading">
                <td colspan="7">Loading leaderboard data...</td>
            </tr>
        `;
        
        // Get selected filters
        const timeframe = elements.timeframeSelect.value;
        const sortBy = elements.skillSelect.value;
        
        // Build query parameters
        const params = new URLSearchParams({
            timeframe,
            sortBy
        });
        
        // Fetch data from API
        const response = await fetch(`/api/leaderboard?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }
        
        leaderboardData = await response.json();
        
        // Render leaderboard
        renderLeaderboard();
        
        // Find user rank if logged in
        if (userData) {
            findUserRank();
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        elements.leaderboardBody.innerHTML = `
            <tr class="leaderboard-error">
                <td colspan="7">Error loading leaderboard. Please try again later.</td>
            </tr>
        `;
    }
}

// Render the leaderboard table
function renderLeaderboard() {
    if (leaderboardData.length === 0) {
        elements.leaderboardBody.innerHTML = `
            <tr class="leaderboard-empty">
                <td colspan="7">No data available for the selected filters.</td>
            </tr>
        `;
        return;
    }
    
    const rows = leaderboardData.map((user, index) => {
        const rank = index + 1;
        const accuracy = user.questionsAnswered > 0 
            ? ((user.correctAnswers / user.questionsAnswered) * 100).toFixed(1) 
            : '0.0';
        
        return `
            <tr${userData && userData.username === user.username ? ' class="your-row"' : ''}>
                <td>${rank}</td>
                <td>${user.username}</td>
                <td>${user.level}</td>
                <td>${user.xp.toLocaleString()}</td>
                <td>${user.questionsAnswered}</td>
                <td>${user.correctAnswers}</td>
                <td>${accuracy}%</td>
            </tr>
        `;
    }).join('');
    
    elements.leaderboardBody.innerHTML = rows;
}

// Find the user's rank in the leaderboard
function findUserRank() {
    if (!userData || leaderboardData.length === 0) {
        elements.yourRankContainer.style.display = 'none';
        return;
    }
    
    // Find user in the leaderboard data
    const userIndex = leaderboardData.findIndex(user => user.username === userData.username);
    
    if (userIndex === -1) {
        // User not in top 100, need to fetch their rank
        fetchUserRank();
    } else {
        // User is in the leaderboard
        userRank = userIndex + 1;
        displayUserRank();
    }
}

// Fetch user's rank if not in top 100
async function fetchUserRank() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            elements.yourRankContainer.style.display = 'none';
            return;
        }
        
        // Get selected filters
        const timeframe = elements.timeframeSelect.value;
        const sortBy = elements.skillSelect.value;
        
        // Build query parameters
        const params = new URLSearchParams({
            timeframe,
            sortBy
        });
        
        // Fetch user's rank from API
        const response = await fetch(`/api/leaderboard/rank?${params.toString()}`, {
            headers: {
                'x-auth-token': token
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user rank');
        }
        
        const data = await response.json();
        userRank = data.rank;
        
        displayUserRank();
    } catch (error) {
        console.error('Error fetching user rank:', error);
        elements.yourRankContainer.style.display = 'none';
    }
}

// Display the user's rank
function displayUserRank() {
    if (!userData || !userRank) {
        elements.yourRankContainer.style.display = 'none';
        return;
    }
    
    const accuracy = userData.questionsAnswered > 0 
        ? ((userData.correctAnswers / userData.questionsAnswered) * 100).toFixed(1) 
        : '0.0';
    
    elements.yourRankDetails.innerHTML = `
        <div class="your-rank-item">
            <span class="rank-label">Rank:</span>
            <span class="rank-value">${userRank}</span>
        </div>
        <div class="your-rank-item">
            <span class="rank-label">Level:</span>
            <span class="rank-value">${userData.level}</span>
        </div>
        <div class="your-rank-item">
            <span class="rank-label">XP:</span>
            <span class="rank-value">${userData.xp.toLocaleString()}</span>
        </div>
        <div class="your-rank-item">
            <span class="rank-label">Questions:</span>
            <span class="rank-value">${userData.questionsAnswered}</span>
        </div>
        <div class="your-rank-item">
            <span class="rank-label">Correct:</span>
            <span class="rank-value">${userData.correctAnswers}</span>
        </div>
        <div class="your-rank-item">
            <span class="rank-label">Accuracy:</span>
            <span class="rank-value">${accuracy}%</span>
        </div>
    `;
    
    elements.yourRankContainer.style.display = 'block';
}