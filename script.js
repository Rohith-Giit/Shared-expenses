// State Management
let groupCode = "";
let contributions = [];
let totalRentCollected = 0;
let totalExpenses = 0;

// Auto-login if group code exists
window.addEventListener("load", () => {
    const savedGroupCode = localStorage.getItem("groupCode");
    if (savedGroupCode) {
        groupCode = savedGroupCode;
        autoLogin();
    }
});

// Auto-login logic
function autoLogin() {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.getElementById("main-section").classList.add("active");
    document.getElementById("contributionsTab").disabled = false;
    document.getElementById("logout").hidden = false;
}

// Create Group
document.getElementById("createGroup").addEventListener("click", () => {
    const groupName = document.getElementById("groupName").value;
    if (groupName.trim()) {
        groupCode = groupName.toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
        document.getElementById("groupCode").textContent = groupCode;
        alert(`Group "${groupName}" created successfully! Share the code: ${groupCode}`);
    } else {
        alert("Please enter a group name.");
    }
});

// Join Group
document.getElementById("joinGroup").addEventListener("click", () => {
    const enteredCode = document.getElementById("joinGroupCode").value;
    if (enteredCode === groupCode) {
        localStorage.setItem("groupCode", enteredCode);
        autoLogin();
    } else {
        alert("Invalid group code.");
    }
});

// Add Contribution
document.getElementById("addContribution").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value;
    const amount = parseFloat(document.getElementById("contributionAmount").value);
    const month = document.getElementById("monthSelector").value;

    if (name && !isNaN(amount) && amount > 0) {
        contributions.push({ name, amount, month });
        totalRentCollected += amount;
        updateContributions();
    } else {
        alert("Enter valid contribution details.");
    }
});

// Add Expense
document.getElementById("addExpense").addEventListener("click", () => {
    const name = document.getElementById("expenseName").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (name && !isNaN(amount) && amount > 0) {
        totalExpenses += amount;
        updateContributions();
    } else {
        alert("Enter valid expense details.");
    }
});

// Update Contributions
function updateContributions() {
    const remainingBalance = totalRentCollected - totalExpenses;
    document.getElementById("totalRentCollected").textContent = totalRentCollected.toFixed(2);
    document.getElementById("remainingBalance").textContent = remainingBalance.toFixed(2);
    document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
}