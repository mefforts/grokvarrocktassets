// public/js/auth.js

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {
        // Show profile link and hide login/register button
        document.getElementById('profile-link').style.display = 'block';
        
        // Change login/register to logout
        const loginRegisterLi = document.getElementById('login-register');
        loginRegisterLi.innerHTML = '<a href="#" id="logout-btn">Logout</a>';
        
        // Add logout event listener
        document.getElementById('logout-btn').addEventListener('click', logout);
        
        // Hide login prompt if it exists
        const loginPrompt = document.getElementById('login-prompt');
        if (loginPrompt) {
            loginPrompt.style.display = 'none';
        }
        
        // Fetch user data
        fetchUserData();
    }
});

// Fetch user data from the server
async function fetchUserData() {
    try {
        const response = await fetch('/auth/user', {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            // Store user data in localStorage for easy access
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update UI with user data if needed
            updateUserUI(userData);
        } else {
            // If token is invalid, log the user out
            logout();
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Update UI elements with user data
function updateUserUI(userData) {
    // This will be expanded as needed in different pages
    // For example, adding username to header, updating XP bar, etc.
    console.log('User data loaded:', userData);
}

// Login functionality
async function login(email, password) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Redirect or update UI
            window.location.reload();
            return true;
        } else {
            // Show error message
            alert(data.message || 'Login failed. Please try again.');
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
        return false;
    }
}

// Register functionality
async function register(username, email, password) {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Redirect or update UI
            window.location.reload();
            return true;
        } else {
            // Show error message
            alert(data.message || 'Registration failed. Please try again.');
            return false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
        return false;
    }
}

// Logout functionality
function logout() {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Redirect to home page
    window.location.href = '/';
}

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const authModal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.close');
    
    // Get tab elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Get login buttons
    const loginBtn = document.getElementById('login-btn');
    const promptLoginBtn = document.getElementById('prompt-login-btn');
    
    // Open modal when login button is clicked
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.style.display = 'block';
        });
    }
    
    // Open modal when prompt login button is clicked
    if (promptLoginBtn) {
        promptLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.style.display = 'block';
        });
    }
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const success = await login(email, password);
            if (success) {
                authModal.style.display = 'none';
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }
            
            const success = await register(username, email, password);
            if (success) {
                authModal.style.display = 'none';
            }
        });
    }
});