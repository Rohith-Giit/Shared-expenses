// Authentication State
let currentUser = null;

// Load user from localStorage on page load
function initAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    } else {
        // If no user is logged in, show auth section
        updateAuthUI();
    }
}

// User Authentication
class User {
    constructor(email, name) {
        this.email = email;
        this.name = name;
        this.id = `user_${Date.now()}`;
        this.createdAt = new Date().toISOString();
        this.uniqueCode = null;
        this.preferences = {
            theme: 'light',
            currency: 'GBP'
        };
        this.wallet = {
            balance: 0,
            transactions: []
        };
    }
}

// Authentication Functions
function login(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                const user = Object.values(users).find(u => u.email === email);
                
                if (user) {
                    currentUser = user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    updateAuthUI();
                    resolve(user);
                } else {
                    // Create new user if not exists
                    const newUser = new User(email, email.split('@')[0]);
                    currentUser = newUser;
                    saveUserData(newUser);
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    updateAuthUI();
                    resolve(newUser);
                }
            } catch (error) {
                reject(error);
            }
        }, 1000);
    });
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('walletBalance');
    localStorage.removeItem('walletHistory');
    window.location.href = 'login.html';
}

function register(email, password, name) {
    // TODO: Replace with actual backend registration
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const newUser = new User(email, name);
            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            updateAuthUI();
            resolve(newUser);
        }, 1000);
    });
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const mainContent = document.getElementById('mainContent');
    const mainNav = document.getElementById('mainNav');
    const userInfo = document.getElementById('userInfo');
    
    if (currentUser) {
        // User is logged in
        if (authSection) authSection.classList.add('hidden');
        if (mainContent) mainContent.classList.remove('hidden');
        if (mainNav) mainNav.classList.remove('hidden');
        
        if (userInfo) {
            userInfo.innerHTML = `
                <span>${currentUser.name}</span>
                <button onclick="logout()" class="logout-btn">Logout</button>
            `;
        }
    } else {
        // No user logged in
        if (authSection) authSection.classList.remove('hidden');
        if (mainContent) mainContent.classList.add('hidden');
        if (mainNav) mainNav.classList.add('hidden');
        
        if (userInfo) {
            userInfo.innerHTML = `
                <button onclick="window.location.href='login.html'" class="login-btn">Login</button>
            `;
        }
    }
}

// Add error handling function
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => errorDiv.remove(), 500);
    }, 3000);
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', initAuth);

// Update storage functions
function saveUserData(user) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[user.id] = user;
    localStorage.setItem('users', JSON.stringify(users));
}

function getUserData(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[userId];
}

// Add transaction management functions
function addTransaction(type, amount, description) {
    if (!currentUser) return;
    
    const transaction = {
        id: `txn_${Date.now()}`,
        type,
        amount,
        description,
        timestamp: new Date().toISOString(),
        userId: currentUser.id
    };
    
    currentUser.wallet.transactions.unshift(transaction);
    
    if (type === 'add') {
        currentUser.wallet.balance += amount;
    } else if (type === 'send') {
        currentUser.wallet.balance -= amount;
    }
    
    saveUserData(currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return transaction;
}

// Add transaction filtering and search
function filterTransactions(filters = {}) {
    if (!currentUser) return [];
    
    let transactions = [...currentUser.wallet.transactions];
    
    if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
    }
    
    if (filters.search) {
        const search = filters.search.toLowerCase();
        transactions = transactions.filter(t => 
            t.description.toLowerCase().includes(search) ||
            t.amount.toString().includes(search)
        );
    }
    
    if (filters.dateFrom) {
        transactions = transactions.filter(t => 
            new Date(t.timestamp) >= new Date(filters.dateFrom)
        );
    }
    
    if (filters.dateTo) {
        transactions = transactions.filter(t => 
            new Date(t.timestamp) <= new Date(filters.dateTo)
        );
    }
    
    return transactions;
}

// Add pagination helper
function paginateTransactions(transactions, page = 1, perPage = 10) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        data: transactions.slice(start, end),
        total: transactions.length,
        currentPage: page,
        totalPages: Math.ceil(transactions.length / perPage)
    };
}

// Login with Email
function loginWithEmail(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                const user = Object.values(users).find(u => u.email === email);
                
                if (user) {
                    currentUser = user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    updateAuthUI();
                    resolve(user);
                } else {
                    // Create new user if not exists
                    const newUser = new User(email, email.split('@')[0]);
                    currentUser = newUser;
                    saveUserData(newUser);
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    updateAuthUI();
                    resolve(newUser);
                }
            } catch (error) {
                reject(error);
            }
        }, 1000);
    });
}

// Login with Code
function loginWithCode(code) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                const user = Object.values(users).find(u => u.uniqueCode === code.toUpperCase());
                
                if (user) {
                    currentUser = user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    updateAuthUI();
                    resolve(user);
                } else {
                    // Create new user with code
                    const newUser = new User(null, `User_${code}`);
                    newUser.uniqueCode = code.toUpperCase();
                    currentUser = newUser;
                    saveUserData(newUser);
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    updateAuthUI();
                    resolve(newUser);
                }
            } catch (error) {
                reject(error);
            }
        }, 1000);
    });
}

// Generate Unique Code
function generateUniqueCode() {
    return new Promise((resolve, reject) => {
        try {
            const code = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                        Math.random().toString(36).substring(2, 6).toUpperCase();
            resolve(code);
        } catch (error) {
            reject(error);
        }
    });
}