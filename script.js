// Global State
let contributions = [];
let expenses = [];
let walletBalance = 0;
let walletHistory = [];
let syncInterval;

// Store uploaded images
let uploadedFiles = [];

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
        // Create expense object with images
        const expenseItem = { 
            name, 
            amount, 
            description, 
            date: new Date().toLocaleString(),
            images: uploadedFiles.slice() // Copy the uploaded images
        };
        
        expenses.push(expenseItem);
        updateHistory("expenseHistory", expenses);
        updateDashboard();
        
        // Clear inputs and preview
        document.getElementById("expenseName").value = '';
        document.getElementById("expenseAmount").value = '';
        document.getElementById("expenseDescription").value = '';
        document.getElementById("imagePreview").innerHTML = '';
        uploadedFiles = [];
        
        showSuccess("Expense added successfully!");
    } else {
        showError("Please enter a name and valid amount");
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
    const successToast = document.createElement('div');
    successToast.className = 'toast success-toast';
    successToast.textContent = message;
    document.body.appendChild(successToast);
    
    setTimeout(() => {
        successToast.classList.add('show');
        setTimeout(() => {
            successToast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(successToast);
            }, 300);
        }, 3000);
    }, 100);
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

    // Setup periodic sync for user data
    if (currentUser) {
        syncInterval = setInterval(() => {
            if (syncUserData()) {
                // Update UI if data was synced
                updateWalletUI();
                if (transactionManager) {
                    transactionManager.updateTransactionList();
                }
            }
        }, 30000); // Sync every 30 seconds
    }

    // Initialize file upload
    const fileInput = document.getElementById('expenseImage');
    const uploadContainer = document.getElementById('uploadContainer');
    const imagePreview = document.getElementById('imagePreview');
    const captureBtn = document.getElementById('captureBtn');

    if (fileInput && uploadContainer) {
        // Handle drag and drop
        uploadContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadContainer.classList.add('dragover');
        });

        uploadContainer.addEventListener('dragleave', () => {
            uploadContainer.classList.remove('dragover');
        });

        uploadContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadContainer.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });

        // Handle file input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFiles(e.target.files);
            }
        });

        // Handle click on container to open file dialog
        uploadContainer.addEventListener('click', (e) => {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });

        // Camera capture
        if (captureBtn) {
            captureBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent container click
                openCamera();
            });
        }
    }

    // Directly manipulate the card view when the page loads
    window.addEventListener('load', function() {
        // Get card elements
        const cardToggleBtn = document.getElementById('cardToggleBtn');
        const modernCardView = document.getElementById('modernCardView');
        
        if (!cardToggleBtn || !modernCardView) {
            console.error('Card elements not found:', {
                toggleBtn: !!cardToggleBtn,
                cardView: !!modernCardView
            });
            return;
        }
        
        console.log('Card elements found successfully');
        
        // Explicitly set initial style
        modernCardView.style.display = 'none';
        
        // Simple toggle function
        function toggleCardView() {
            console.log('Toggle button clicked!');
            console.log('Current display style:', modernCardView.style.display);
            
            if (modernCardView.style.display === 'none' || modernCardView.style.display === '') {
                modernCardView.style.display = 'flex';
                cardToggleBtn.querySelector('span:last-child').textContent = 'Hide Card';
                console.log('Card should be visible now');
            } else {
                modernCardView.style.display = 'none';
                cardToggleBtn.querySelector('span:last-child').textContent = 'View Card';
                console.log('Card should be hidden now');
            }
        }
        
        // Remove any existing click handlers to avoid duplicates
        cardToggleBtn.removeEventListener('click', toggleCardView);
        
        // Add the click handler
        cardToggleBtn.addEventListener('click', toggleCardView);
        console.log('Click handler attached to card toggle button');
        
        // Setup the card action buttons
        const showDetailsBtn = document.getElementById('showDetailsBtn');
        const freezeCardBtn = document.getElementById('freezeCardBtn');
        const cardSettingsBtn = document.getElementById('cardSettingsBtn');
        
        if (showDetailsBtn) {
            showDetailsBtn.addEventListener('click', function() {
                alert('Card Details: This is a virtual card for NoteBudget app');
            });
        }
        
        if (freezeCardBtn) {
            freezeCardBtn.addEventListener('click', function() {
                const isFrozen = this.getAttribute('data-frozen') === 'true';
                if (isFrozen) {
                    this.setAttribute('data-frozen', 'false');
                    this.querySelector('.action-icon').textContent = '❄️';
                    this.querySelector('.action-text').textContent = 'Freeze';
                    showSuccess('Card unfrozen successfully');
                } else {
                    this.setAttribute('data-frozen', 'true');
                    this.querySelector('.action-icon').textContent = '🔥';
                    this.querySelector('.action-text').textContent = 'Unfreeze';
                    showSuccess('Card frozen successfully');
                }
            });
        }
        
        if (cardSettingsBtn) {
            cardSettingsBtn.addEventListener('click', function() {
                alert('Card Settings: You can manage your card settings here');
            });
        }
    });

    // Force specific card number to match design
    const cardLastDigits = document.getElementById('cardLastDigits');
    if (cardLastDigits) {
        // Set to exactly 0000
        cardLastDigits.textContent = '0000';
        localStorage.setItem('cardLastDigits', '0000');
    }
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

// Clean up on logout
function logout() {
    clearInterval(syncInterval);
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Function to switch tabs via app shortcuts
function switchTab(tabId) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    
    // Add active class to selected tab
    document.getElementById(tabId).classList.add("active");
    
    // Find and activate the corresponding button
    document.querySelector(`[data-target="${tabId}"]`).classList.add("active");
    
    // Make sure the tab content is visible
    document.getElementById(tabId).classList.remove("hidden");
}

// Export all data function
function exportAllData() {
    if (transactionManager) {
        transactionManager.exportTransactions('csv');
    } else {
        showError('No transaction data available');
    }
}

// Function to handle files
function handleFiles(files) {
    const imagePreview = document.getElementById('imagePreview');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check if it's an image
        if (!file.type.match('image.*')) {
            continue;
        }
        
        // Add to uploaded files array
        uploadedFiles.push(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                // Create preview item
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                // Create image
                const img = document.createElement('img');
                img.src = e.target.result;
                img.title = theFile.name;
                
                // Create remove button
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-image';
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', function(evt) {
                    evt.stopPropagation();
                    const index = uploadedFiles.indexOf(theFile);
                    if (index > -1) {
                        uploadedFiles.splice(index, 1);
                    }
                    previewItem.remove();
                });
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                imagePreview.appendChild(previewItem);
            };
        })(file);
        
        reader.readAsDataURL(file);
    }
}

// Function to open the camera
function openCamera() {
    // Check if the camera modal already exists
    let cameraModal = document.getElementById('cameraModal');
    
    if (!cameraModal) {
        // Create the camera modal
        cameraModal = document.createElement('div');
        cameraModal.id = 'cameraModal';
        cameraModal.className = 'modal';
        cameraModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Take a Photo</h2>
                <video id="cameraPreview" autoplay></video>
                <div class="camera-controls">
                    <button id="takePictureBtn">📸 Capture</button>
                    <button id="closeCameraBtn">Cancel</button>
                </div>
                <canvas id="captureCanvas" style="display:none;"></canvas>
            </div>
        `;
        document.body.appendChild(cameraModal);
        
        // Add CSS for the modal
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: block;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
            }
            .modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 20px;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            }
            .close-modal {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            .close-modal:hover {
                color: black;
            }
            #cameraPreview {
                width: 100%;
                max-height: 400px;
                background-color: #f0f0f0;
                margin: 15px 0;
                border-radius: 8px;
            }
            .camera-controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 15px;
            }
            .camera-controls button {
                padding: 10px 20px;
                border-radius: 50px;
                border: none;
                cursor: pointer;
                font-size: 16px;
            }
            #takePictureBtn {
                background-color: #34A853;
                color: white;
            }
            #closeCameraBtn {
                background-color: #EA4335;
                color: white;
            }
        `;
        document.head.appendChild(style);
        
        // Get elements and set up event handlers
        const closeBtn = cameraModal.querySelector('.close-modal');
        const closeCameraBtn = document.getElementById('closeCameraBtn');
        const takePictureBtn = document.getElementById('takePictureBtn');
        const video = document.getElementById('cameraPreview');
        const canvas = document.getElementById('captureCanvas');
        
        // Close modal events
        closeBtn.onclick = closeCameraBtn.onclick = function() {
            stopVideoStream();
            cameraModal.remove();
        };
        
        // Initialize camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    video.srcObject = stream;
                })
                .catch(function(error) {
                    console.error("Camera error: ", error);
                    alert("Unable to access camera. Please check permissions.");
                    cameraModal.remove();
                });
        } else {
            alert("Sorry, your browser doesn't support camera access");
            cameraModal.remove();
        }
        
        // Capture photo
        takePictureBtn.onclick = function() {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to file
            canvas.toBlob(function(blob) {
                const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                handleFiles([file]);
                
                // Close the modal
                stopVideoStream();
                cameraModal.remove();
            }, 'image/jpeg');
        };
        
        function stopVideoStream() {
            if (video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                video.srcObject = null;
            }
        }
    }
}

// Function to update history with images
function updateHistory(elementId, items) {
    const historyList = document.getElementById(elementId);
    if (!historyList) return;

    historyList.innerHTML = items.map(item => {
        // Generate image previews if available
        let imageHtml = '';
        if (item.images && item.images.length) {
            imageHtml = `
                <div class="expense-images">
                    ${item.images.slice(0, 3).map(img => {
                        const url = img instanceof File ? URL.createObjectURL(img) : img;
                        return `<img src="${url}" class="expense-thumbnail" alt="Receipt">`;
                    }).join('')}
                    ${item.images.length > 3 ? `<div class="more-images">+${item.images.length - 3}</div>` : ''}
                </div>
            `;
        }

        return `
            <li>
                <div class="expense-details">
                    <span>${item.name}</span>
                    <span>£${item.amount.toFixed(2)}</span>
                    <span>${item.date}</span>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                    ${imageHtml}
                </div>
            </li>
        `;
    }).join('');
}