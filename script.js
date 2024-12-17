// Global State
let contributions = [];
let expenses = [];
let walletBalance = 0;
let walletHistory = [];

// Tab Switching Logic
document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
        document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
        const targetTab = btn.dataset.target;
        document.getElementById(targetTab).classList.add("active");
        btn.classList.add("active");
    });
});

// Add Contribution
document.getElementById("addContributionButton").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value.trim();
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (name && amount > 0) {
        contributions.push({ name, amount, date: new Date().toLocaleString() });
        updateHistory("contributionHistory", contributions);
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
    }
});

// Add Money to Wallet
document.getElementById("addWalletButton").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("walletAmount").value);
    if (amount > 0) {
        walletBalance += amount;
        walletHistory.push({ action: "Added", amount, date: new Date().toLocaleString() });
        updateWallet();
    }
});

// Send Money
document.getElementById("sendMoneyButton").addEventListener("click", () => {
    const recipient = document.getElementById("recipientName").value.trim();
    const amount = parseFloat(document.getElementById("sendAmount").value);

    if (recipient && amount > 0 && amount <= walletBalance) {
        walletBalance -= amount;
        walletHistory.push({ action: `Sent to ${recipient}`, amount, date: new Date().toLocaleString() });
        updateWallet();
    }
});

function updateHistory(id, data) {
    document.getElementById(id).innerHTML = data
        .map((item) => `<li>${item.name}: £${item.amount} (${item.date})</li>`)
        .join("");
}

function updateWallet() {
    document.getElementById("walletBalance").textContent = walletBalance.toFixed(2);
    document.getElementById("walletHistory").innerHTML = walletHistory
        .map((item) => `<li>${item.action}: £${item.amount} on ${item.date}</li>`)
        .join("");
}