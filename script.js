// Global State
let contributions = [];
let expenses = [];
let walletBalance = 0;
let walletHistory = [];

// Load data from localStorage
function loadWalletData() {
    const savedBalance = localStorage.getItem('walletBalance');
    const savedHistory = localStorage.getItem('walletHistory');
    const savedName = localStorage.getItem('cardHolderName');
    
    if (savedBalance) walletBalance = parseFloat(savedBalance);
    if (savedHistory) walletHistory = JSON.parse(savedHistory);
    if (savedName) {
        updateCardHolderName(savedName);
        document.getElementById("walletUser").value = savedName;
    }
    
    // Initialize wallet display
    document.getElementById("walletBalance").textContent = walletBalance.toFixed(2);
    document.getElementById("cardBalance").textContent = `£${walletBalance.toFixed(2)}`;
    updateWallet();
}

// Save data to localStorage
function saveWalletData() {
    localStorage.setItem('walletBalance', walletBalance.toString());
    localStorage.setItem('walletHistory', JSON.stringify(walletHistory));
}

// Tab Switching Logic
document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
        document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
        const targetTab = btn.dataset.target;
        document.getElementById(targetTab).classList.add("active");
        btn.classList.add("active");
        
        // Remove 'hidden' class when switching tabs
        document.getElementById(targetTab).classList.remove("hidden");
    });
});

// Add Contribution
document.getElementById("addContributionButton").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value.trim();
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (name && amount > 0) {
        contributions.push({ name, amount, date: new Date().toLocaleString() });
        updateHistory("contributionHistory", contributions);
        updateDashboard();
        
        // Clear inputs
        document.getElementById("contributorName").value = '';
        document.getElementById("contributionAmount").value = '';
    }
});

// Add Expense
document.getElementById("addExpenseButton").addEventListener("click", () => {
    const name = document.getElementById("expenseName").value.trim();
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const description = document.getElementById("expenseDescription").value.trim();

    if (name && amount > 0) {
        expenses.push({ name, amount, description, date: new Date().toLocaleString() });
        updateHistory("expenseHistory", expenses);
        updateDashboard();
        
        // Clear inputs
        document.getElementById("expenseName").value = '';
        document.getElementById("expenseAmount").value = '';
        document.getElementById("expenseDescription").value = '';
    }
});

// Add these helper functions
function validateWalletOperation(amount, name) {
    if (!name) {
        showError("Please enter a name");
        return false;
    }
    
    if (!amount || amount <= 0) {
        showError("Please enter a valid amount");
        return false;
    }
    
    if (amount > 10000) {
        showError("Maximum transaction limit is £10,000");
        return false;
    }
    
    return true;
}

// Add this utility function for transaction simulation
function simulateTransaction(callback) {
    const loader = document.createElement('div');
    loader.className = 'transaction-loader';
    loader.innerHTML = '<div class="loader-spinner"></div><p>Processing transaction...</p>';
    document.body.appendChild(loader);
    
    // Simulate transaction processing
    setTimeout(() => {
        document.body.removeChild(loader);
        callback();
    }, 1000);
}

// Update the wallet button handlers
document.getElementById("addWalletButton").addEventListener("click", () => {
    const amountInput = document.getElementById("walletAmount");
    const userInput = document.getElementById("walletUser");
    const amount = parseFloat(amountInput.value);
    const userName = userInput.value.trim();

    if (!validateWalletOperation(amount, userName)) return;

    simulateTransaction(() => {
        try {
            // Add transaction using the new system
            const transaction = addTransaction('add', amount, `Added money to wallet`);
            
            // Update UI
            updateWalletUI();
            updateCardHolderName(userName);
            
            // Clear inputs
            amountInput.value = '';
            userInput.classList.add('success-input');
            setTimeout(() => {
                userInput.classList.remove('success-input');
            }, 2000);
            
            showSuccess(`Successfully added £${amount.toFixed(2)} to wallet`);
            
            // Update transaction list
            if (transactionManager) {
                transactionManager.updateTransactionList();
            }
        } catch (error) {
            showError("Failed to add money to wallet");
        }
    });
});

// Add new function to handle card holder name updates
function updateCardHolderName(name) {
    const cardHolderElement = document.getElementById("cardHolderName");
    if (cardHolderElement) {
        // Add fade-out animation
        cardHolderElement.classList.add('fade-out');
        
        // After fade-out, update text and fade-in
        setTimeout(() => {
            cardHolderElement.textContent = name.toUpperCase();
            cardHolderElement.classList.remove('fade-out');
            cardHolderElement.classList.add('fade-in');
            
            // Add highlight effect
            cardHolderElement.classList.add('highlight');
            setTimeout(() => {
                cardHolderElement.classList.remove('highlight');
                cardHolderElement.classList.remove('fade-in');
            }, 1000);
        }, 300);
    }
}

// Update the send money handler
document.getElementById("sendMoneyButton").addEventListener("click", () => {
    const recipient = document.getElementById("recipientName").value.trim();
    const amount = parseFloat(document.getElementById("sendAmount").value);

    if (!validateWalletOperation(amount, recipient)) return;
    
    if (amount > currentUser.wallet.balance) {
        showError("Insufficient balance");
        return;
    }

    simulateTransaction(() => {
        try {
            // Add transaction using the new system
            const transaction = addTransaction('send', amount, `Sent to ${recipient}`);
            
            // Update UI
            updateWalletUI();
            
            // Clear inputs
            document.getElementById("recipientName").value = '';
            document.getElementById("sendAmount").value = '';
            
            showSuccess(`Successfully sent £${amount.toFixed(2)} to ${recipient}`);
            
            // Update transaction list
            if (transactionManager) {
                transactionManager.updateTransactionList();
            }
        } catch (error) {
            showError("Failed to send money");
        }
    });
});

function updateHistory(id, data) {
    document.getElementById(id).innerHTML = data
        .map((item) => `<li>${item.name}: £${item.amount} (${item.date})</li>`)
        .join("");
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme or use system preference
const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Transaction editing functionality
function createTransactionItem(transaction, index, type) {
    return `
        <li class="transaction-item ${index === walletHistory.length - 1 ? 'new-transaction' : ''}"
            style="animation-delay: ${index * 0.1}s">
            <div class="transaction-details">
                <span class="transaction-action">${transaction.action}</span>
                <span class="transaction-amount">£${transaction.amount.toFixed(2)}</span>
            </div>
            <div class="transaction-date">${transaction.date}</div>
            <div class="transaction-actions">
                <button class="action-button" onclick="editTransaction(${index})">✏️</button>
                <button class="action-button" onclick="deleteTransaction(${index})">🗑️</button>
            </div>
        </li>
    `;
}

function editTransaction(index) {
    const transaction = walletHistory[index];
    showEditModal(transaction, index);
}

function deleteTransaction(index) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        const transaction = walletHistory[index];
        
        // Update wallet balance
        if (transaction.action === 'Added') {
            walletBalance -= transaction.amount;
        } else if (transaction.action.startsWith('Sent to')) {
            walletBalance += transaction.amount;
        }
        
        // Remove transaction
        walletHistory.splice(index, 1);
        updateWallet();
        showSuccess('Transaction deleted successfully');
    }
}

function showEditModal(transaction, index) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit Transaction</h2>
            <input type="text" id="editAmount" value="${transaction.amount}" onInput="formatCurrency(this)">
            <input type="text" id="editDescription" value="${transaction.action}" ${transaction.action === 'Added' ? 'readonly' : ''}>
            <button onclick="saveEdit(${index})">Save</button>
            <button onclick="closeModal()">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

function saveEdit(index) {
    const transaction = walletHistory[index];
    const newAmount = parseFloat(document.getElementById('editAmount').value);
    const newDescription = document.getElementById('editDescription').value;
    
    // Update wallet balance
    if (transaction.action === 'Added') {
        walletBalance = walletBalance - transaction.amount + newAmount;
    } else if (transaction.action.startsWith('Sent to')) {
        walletBalance = walletBalance + transaction.amount - newAmount;
    }
    
    // Update transaction
    transaction.amount = newAmount;
    if (!transaction.action.startsWith('Added')) {
        transaction.action = newDescription;
    }
    
    updateWallet();
    closeModal();
    showSuccess('Transaction updated successfully');
}

// Update the updateWallet function to use the new createTransactionItem function
function updateWallet() {
    // Update wallet balance with animation
    const balanceElement = document.getElementById("walletBalance");
    const cardBalanceElement = document.getElementById("cardBalance");
    
    if (balanceElement && cardBalanceElement) {
        animateNumber(parseFloat(balanceElement.textContent || '0'), walletBalance, (value) => {
            balanceElement.textContent = value.toFixed(2);
            cardBalanceElement.textContent = `£${value.toFixed(2)}`;
        });

        // Update transaction history with animation
        const historyList = document.getElementById("walletHistory");
        if (historyList) {
            const newTransactions = walletHistory
                .map((item, index) => createTransactionItem(item, index))
                .join("");
            
            historyList.innerHTML = newTransactions;
        }
    }
    
    saveWalletData();
}

// Update the animateNumber function for smoother animations
function animateNumber(start, end, callback) {
    const duration = 800; // Animation duration in milliseconds
    const steps = 60; // Number of steps in animation
    const increment = (end - start) / steps;
    let current = start;
    let step = 0;

    const animation = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            clearInterval(animation);
            current = end;
        }
        
        callback(current);
    }, duration / steps);
}

// Error and success message functions
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

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'message success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.classList.add('fade-out');
        setTimeout(() => successDiv.remove(), 500);
    }, 3000);
}

// Dashboard Updates
function updateDashboard() {
    const totalContributionsAmount = contributions.reduce((sum, item) => sum + item.amount, 0);
    const totalExpensesAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netBalanceAmount = totalContributionsAmount - totalExpensesAmount;

    document.getElementById('totalContributions').textContent = `£${totalContributionsAmount.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `£${totalExpensesAmount.toFixed(2)}`;
    document.getElementById('netBalance').textContent = `£${netBalanceAmount.toFixed(2)}`;

    // Update recent transactions
    const allTransactions = [
        ...contributions.map(c => ({...c, type: 'contribution'})),
        ...expenses.map(e => ({...e, type: 'expense'}))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    document.getElementById('recentTransactions').innerHTML = allTransactions
        .map(transaction => `
            <li>
                <span>${transaction.name}</span>
                <div>
                    <span class="transaction-type type-${transaction.type}">
                        ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                    <span>£${transaction.amount.toFixed(2)}</span>
                </div>
            </li>
        `).join('');
}

// Add these functions after the existing utility functions
function formatCurrency(input) {
    // Remove any non-digit characters except decimal point
    let value = input.value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
    
    // Limit to 2 decimal places
    if (parts[1]?.length > 2) {
        value = parseFloat(value).toFixed(2);
    }
    
    input.value = value;
}

// Update the wallet amount input handlers
document.getElementById("walletAmount").addEventListener('input', function() {
    formatCurrency(this);
});

document.getElementById("sendAmount").addEventListener('input', function() {
    formatCurrency(this);
});

// Initialize wallet data on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize wallet data
    loadWalletData();
    
    // Format currency inputs
    const currencyInputs = ['walletAmount', 'sendAmount'];
    currencyInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                formatCurrency(this);
            });
        }
    });
});

// Update the wallet UI function
function updateWalletUI() {
    if (!currentUser) return;
    
    const balanceElement = document.getElementById("walletBalance");
    const cardBalanceElement = document.getElementById("cardBalance");
    
    animateNumber(
        parseFloat(balanceElement.textContent || '0'), 
        currentUser.wallet.balance, 
        (value) => {
            balanceElement.textContent = value.toFixed(2);
            cardBalanceElement.textContent = `£${value.toFixed(2)}`;
        }
    );
}