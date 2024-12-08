// Contributions and Expenses Data
let contributions = [];
let totalRentCollected = 0;
let totalExpenses = 0;

// Group Settings
let groupCode = "";

// Add Contribution
document.getElementById("addContribution").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value;
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (name && !isNaN(amount) && amount > 0) {
        contributions.push({ name, amount });
        totalRentCollected += amount;
        updateRecords();
    } else {
        alert("Please enter valid contribution details!");
    }
});

// Add Expense
document.getElementById("addExpense").addEventListener("click", () => {
    const expenseName = document.getElementById("expenseName").value;
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);

    if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0) {
        if (expenseAmount > totalRentCollected - totalExpenses) {
            alert("Insufficient funds!");
            return;
        }
        totalExpenses += expenseAmount;
        updateRecords();
    } else {
        alert("Please enter valid expense details!");
    }
});

// Update Records
function updateRecords() {
    // Update Contributions List
    const contributionList = document.getElementById("contributionRecords");
    contributionList.innerHTML = "";
    contributions.forEach(contribution => {
        const li = document.createElement("li");
        li.textContent = `${contribution.name} contributed £${contribution.amount.toFixed(2)}`;
        contributionList.appendChild(li);
    });

    // Update Expenses List
    const expenseList = document.getElementById("expenseRecords");
    expenseList.innerHTML = "";
    const remainingBalance = totalRentCollected - totalExpenses;

    expenseList.innerHTML = "";
    contributions.forEach(contribution=>totalExpenses.toFixed);  

    document.getElementById("remainingBalance").textContent = remainingBalance.toFixed(2);
    document.getElementById("totalRentCollected").textContent = totalRentCollected.toFixed(2);
    document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
}

// Tab Navigation
document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
        document.getElementById(button.dataset.tab).classList.add("active");
    });
});

// Generate Group Code
document.getElementById("generateGroupCode").addEventListener("click", () => {
    groupCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    document.getElementById("groupCode").textContent = groupCode;
});

// Join Group
document.getElementById("joinGroup").addEventListener("click", () => {
    const enteredCode = document.getElementById("joinGroupCode").value;

    if (enteredCode === groupCode) {
        document.getElementById("groupStatusMessage").textContent = "Successfully joined the group!";
        document.getElementById("groupStatusMessage").style.color = "green";
    } else {
        document.getElementById("groupStatusMessage").textContent = "Invalid group code.";
        document.getElementById("groupStatusMessage").style.color = "red";
    }
});