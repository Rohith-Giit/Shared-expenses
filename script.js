// State Management
let groupCode = "";
let contributions = [];
let expenses = [];
let totalRentCollected = 0;
let totalExpenses = 0;

// Auto-login logic
function autoLogin() {
    switchToTab("main-section");
    document.getElementById("contributionsTab").disabled = false;
    document.getElementById("logout").hidden = false;
}

// Populate Year Selector
window.addEventListener("load", () => {
    const currentYear = new Date().getFullYear();
    const yearSelector = document.getElementById("yearSelector");
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (i === currentYear) option.selected = true;
        yearSelector.appendChild(option);
    }
});

// Add Contributions
document.getElementById("addContribution").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value;
    const amount = parseFloat(document.getElementById("contributionAmount").value);
    const month = document.getElementById("monthSelector").value;
    const year = document.getElementById("yearSelector").value;

    if (name && amount > 0) {
        contributions.push({ name, amount, month, year, dateAdded: new Date().toLocaleString() });
        totalRentCollected += amount;
        updateUI();
        updateContributionRecords();
    } else {
        alert("Please fill in all fields with valid information.");
    }
});

// Add Expenses
document.getElementById("addExpense").addEventListener("click", () => {
    const person = document.getElementById("personName").value;
    const expenseName = document.getElementById("expenseName").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (person && expenseName && amount > 0) {
        expenses.push({
            person,
            name: expenseName,
            amount,
            dateAdded: new Date().toLocaleString(),
        });
        totalExpenses += amount;
        updateUI();
        updateExpenseRecords();
    } else {
        alert("Please fill in all fields with valid expense details.");
    }
});

// Update the UI for totals and remaining balance
function updateUI() {
    const remainingBalance = totalRentCollected - totalExpenses;

    document.getElementById("totalRentCollected").textContent = totalRentCollected.toFixed(2);
    document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
    document.getElementById("remainingBalance").textContent = remainingBalance.toFixed(2);
}

// Update Contribution Records
function updateContributionRecords() {
    const contributionList = document.getElementById("contributionRecords");
    contributionList.innerHTML = "";
    contributions.forEach((c) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${c.name}</strong> contributed £${c.amount.toFixed(
            2
        )} for ${c.month} ${c.year}
        <br><span class="date-added">Added on: ${c.dateAdded}</span>`;
        contributionList.appendChild(li);
    });
}

// Update Expense Records
function updateExpenseRecords() {
    const expenseList = document.getElementById("expenseRecords");
    expenseList.innerHTML = "";
    expenses.forEach((e) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${e.person}</strong> added an expense: ${e.name} (£${e.amount.toFixed(
            2
        )})
        <br><span class="date-added">Added on: ${e.dateAdded}</span>`;
        expenseList.appendChild(li);
    });
}