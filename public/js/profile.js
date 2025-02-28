// public/js/profile.js

// DOM elements
const elements = {
    // Quick stats
    userLevel: document.getElementById('user-level'),
    userXp: document.getElementById('user-xp'),
    questionsAnswered: document.getElementById('questions-answered'),
    
    // Progress section
    levelProgress: document.getElementById('level-progress'),
    totalQuestions: document.getElementById('total-questions'),
    correctAnswers: document.getElementById('correct-answers'),
    accuracyRate: document.getElementById('accuracy-rate'),
    bestStreak: document.getElementById('best-streak'),
    currentStreak: document.getElementById('current-streak'),
    memberSince: document.getElementById('member-since'),
    
    // Stats sections
    difficultyStats: document.getElementById('difficulty-stats'),
    categoryStats: document.getElementById('category-stats'),
    recentActivity: document.getElementById('recent-activity'),
    
    // Account settings
    settingsForm: document.getElementById('settings-form'),
    usernameInput: document.getElementById('username'),
    emailInput: document.getElementById('email'),
    changePasswordBtn: document.getElementById('change-password-btn'),
    passwordChangeFields: document.getElementById('password-change-fields'),
    currentPasswordInput: document.getElementById('current-password'),
    newPasswordInput: document.getElementById('new-password'),
    confirmPasswordInput: document.getElementById('confirm-password')
};

// Initialize the profile page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login page if not logged in
        window.location.href = '/';
        return;
    }
    
    // Setup event listeners
    elements.changePasswordBtn.addEventListener('click', togglePasswordFields);
    elements.settingsForm.addEventListener('submit', saveSettings);
    
    // Fetch user data
    fetchUserData();
    
    // Fetch additional stats
    fetchDifficultyStats();
    fetchCategoryStats();
    fetchRecentActivity();
});

// Fetch user profile data
async function fetchUserData() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/profile', {
            headers: {
                'x-auth-token': token
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update UI with user data
        updateProfileUI(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load profile data. Please try again later.');
    }
}

// Update profile UI with user data
function updateProfileUI(userData) {
    // Update quick stats
    elements.userLevel.textContent = userData.level;
    elements.userXp.textContent = userData.xp.toLocaleString();
    elements.questionsAnswered.textContent = userData.questionsAnswered;
    
    // Update progress section
    const accuracy = userData.questionsAnswered > 0 
        ? ((userData.correctAnswers / userData.questionsAnswered) * 100).toFixed(1) 
        : '0.0';
    
    elements.totalQuestions.textContent = userData.questionsAnswered;
    elements.correctAnswers.textContent = userData.correctAnswers;
    elements.accuracyRate.textContent = `${accuracy}%`;
    elements.bestStreak.textContent = userData.bestStreak || '0';
    elements.currentStreak.textContent = userData.streak || '0';
    
    // Format date
    const memberDate = new Date(userData.createdAt);
    elements.memberSince.textContent = memberDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Update level progress
    updateLevelProgress(userData);
    
    // Update account settings
    elements.usernameInput.value = userData.username;
    elements.emailInput.value = userData.email;
}

// Update level progress bar
function updateLevelProgress(userData) {
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
}

// Fetch difficulty stats
async function fetchDifficultyStats() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/profile/difficulty-stats', {
            headers: {
                'x-auth-token': token
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch difficulty stats');
        }
        
        const stats = await response.json();
        
        // Render difficulty stats
        renderDifficultyStats(stats);
    } catch (error) {
        console.error('Error fetching difficulty stats:', error);
        elements.difficultyStats.innerHTML = `
            <div class="stats-error">Error loading difficulty stats. Please try again later.</div>
        `;
    }
}

// Render difficulty stats
function renderDifficultyStats(stats) {
    if (!stats || stats.length === 0) {
        elements.difficultyStats.innerHTML = `
            <div class="stats-empty">No difficulty data available yet. Start playing to see your stats!</div>
        `;
        return;
    }
    
    const difficultyOrder = ['Beginner', 'Easy', 'Medium', 'Hard', 'Elite', 'Master'];
    
    // Create difficulty bars
    const difficultyBars = difficultyOrder.map(difficulty => {
        const stat = stats.find(s => s.difficulty === difficulty) || {
            difficulty,
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0
        };
        
        const difficultyClass = difficulty.toLowerCase();
        
        return `
            <div class="difficulty-bar">
                <div class="difficulty-name ${difficultyClass}">${difficulty}</div>
                <div class="difficulty-progress">
                    <div class="difficulty-progress-bar ${difficultyClass}" style="width: ${stat.accuracy}%"></div>
                </div>
                <div class="difficulty-stats">
                    <span>${stat.correctAnswers}/${stat.totalQuestions}</span>
                    <span>${stat.accuracy}%</span>
                </div>
            </div>
        `;
    });
    
    elements.difficultyStats.innerHTML = difficultyBars.join('');
}

// Fetch category stats
async function fetchCategoryStats() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/profile/category-stats', {
            headers: {
                'x-auth-token': token
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch category stats');
        }
        
        const stats = await response.json();
        
        // Render category stats
        renderCategoryStats(stats);
    } catch (error) {
        console.error('Error fetching category stats:', error);
        elements.categoryStats.innerHTML = `
            <div class="stats-error">Error loading category stats. Please try again later.</div>
        `;
    }
}

// Render category stats
function renderCategoryStats(stats) {
    if (!stats || stats.length === 0) {
        elements.categoryStats.innerHTML = `
            <div class="stats-empty">No category data available yet. Start playing to see your stats!</div>
        `;
        return;
    }
    
    // Sort categories by progress
    stats.sort((a, b) => b.progress - a.progress);
    
    // Create category cards
    const categoryCards = stats.map(category => {
        return `
            <div class="category-card">
                <div class="category-icon">
                    <img src="images/ui/categories/${category.category.toLowerCase()}.png" alt="${category.category}">
                </div>
                <div class="category-info">
                    <div class="category-name">${category.category}</div>
                    <div class="category-progress-bar">
                        <div class="category-progress-fill" style="width: ${category.progress}%"></div>
                    </div>
                    <div class="category-progress-text">${category.progress}% Complete</div>
                </div>
            </div>
        `;
    });
    
    elements.categoryStats.innerHTML = `
        <div class="category-grid">
            ${categoryCards.join('')}
        </div>
    `;
}

// Fetch recent activity
async function fetchRecentActivity() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/profile/recent-activity', {
            headers: {
                'x-auth-token': token
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recent activity');
        }
        
        const activity = await response.json();
        
        // Render recent activity
        renderRecentActivity(activity);
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        elements.recentActivity.innerHTML = `
            <div class="activity-error">Error loading recent activity. Please try again later.</div>
        `;
    }
}

// Render recent activity
function renderRecentActivity(activity) {
    if (!activity || activity.length === 0) {
        elements.recentActivity.innerHTML = `
            <div class="activity-empty">No recent activity available yet. Start playing to see your activity!</div>
        `;
        return;
    }
    
    // Create activity items
    const activityItems = activity.map(item => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let activityContent = '';
        
        if (item.type === 'quiz') {
            activityContent = `
                <div class="activity-icon quiz">
                    <img src="images/ui/${item.difficulty.toLowerCase()}_clue.png" alt="${item.difficulty}">
                </div>
                <div class="activity-details">
                    <div class="activity-title">Completed ${item.difficulty} Quiz</div>
                    <div class="activity-description">Score: ${item.score}/${item.total} (${item.xp} XP)</div>
                </div>
            `;
        } else if (item.type === 'level-up') {
            activityContent = `
                <div class="activity-icon level-up">
                    <img src="images/ui/level_up.png" alt="Level Up">
                </div>
                <div class="activity-details">
                    <div class="activity-title">Level Up!</div>
                    <div class="activity-description">Reached level ${item.level}</div>
                </div>
            `;
        }
        
        return `
            <div class="activity-item">
                ${activityContent}
                <div class="activity-time">${formattedDate}</div>
            </div>
        `;
    });
    
    elements.recentActivity.innerHTML = activityItems.join('');
}

// Toggle password change fields
function togglePasswordFields() {
    const isVisible = elements.passwordChangeFields.style.display !== 'none';
    elements.passwordChangeFields.style.display = isVisible ? 'none' : 'block';
    elements.changePasswordBtn.textContent = isVisible ? 'Change Password' : 'Cancel';
}

// Save user settings
async function saveSettings(e) {
    e.preventDefault();
    
    // Get form values
    const email = elements.emailInput.value;
    const currentPassword = elements.currentPasswordInput.value;
    const newPassword = elements.newPasswordInput.value;
    const confirmPassword = elements.confirmPasswordInput.value;
    
    // Validate form
    if (!email) {
        alert('Email is required');
        return;
    }
    
    // Check if password fields are visible and filled
    const isChangingPassword = elements.passwordChangeFields.style.display !== 'none';
    if (isChangingPassword) {
        if (!currentPassword) {
            alert('Current password is required');
            return;
        }
        
        if (!newPassword) {
            alert('New password is required');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match');
            return;
        }
    }
    
    try {
        const token = localStorage.getItem('token');
        
        // Build request body
        const body = { email };
        if (isChangingPassword) {
            body.currentPassword = currentPassword;
            body.newPassword = newPassword;
        }
        
        // Send update request
        const response = await fetch('/api/profile/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }
        
        // Reset password fields
        if (isChangingPassword) {
            elements.currentPasswordInput.value = '';
            elements.newPasswordInput.value = '';
            elements.confirmPasswordInput.value = '';
            togglePasswordFields(); // Hide password fields
        }
        
        alert('Profile updated successfully');
        
        // Refresh user data
        fetchUserData();
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message || 'Failed to update profile. Please try again later.');
    }
}

// Calculate XP required for a specific level (OSRS formula)
function calculateLevelXp(level) {
    let points = 0;
    
    for (let i = 1; i < level; i++) {
        points += Math.floor(i + 300 * Math.pow(2, i / 7));
    }
    
    return Math.floor(points / 4);
}