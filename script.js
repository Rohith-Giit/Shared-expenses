
// Data Storage
let contributions = [];
let expenses = [];
let totalCollected = 0;
let totalExpenses = 0;

// Update Totals
function updateTotals() {
    const remainingBalance = totalCollected - totalExpenses;
    document.getElementById("totalCollected").innerText = totalCollected.toFixed(2);
    document.getElementById("remainingBalance").innerText = remainingBalance.toFixed(2);
}

// Render Records
function renderRecords() {
    const contributionList = document.getElementById("contributionRecords");
    const expenseList = document.getElementById("expenseRecords");

    // Clear existing records
    contributionList.innerHTML = "";
    expenseList.innerHTML = "";

    // Render contributions
    contributions.forEach((contribution, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${contribution.name} contributed £${contribution.amount.toFixed(2)}
            <button onclick="deleteContribution(${index})">Delete</button>
        `;
        contributionList.appendChild(li);
    });

    // Render expenses
    expenses.forEach((expense, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${expense.name} spent £${expense.amount.toFixed(2)} on ${expense.description}
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
}

// Delete Contribution
function deleteContribution(index) {
    totalCollected -= contributions[index].amount;
    contributions.splice(index, 1);
    renderRecords();
    updateTotals();
}

// Delete Expense
function deleteExpense(index) {
    totalExpenses -= expenses[index].amount;
    expenses.splice(index, 1);
    renderRecords();
    updateTotals();
}

// Add Contribution
document.getElementById("addContribution").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value;
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (name && !isNaN(amount) && amount > 0) {
        contributions.push({ name, amount });
        totalCollected += amount;

        renderRecords();
        updateTotals();

        document.getElementById("contributorName").value = "";
        document.getElementById("contributionAmount").value = "";
    } else {
        alert("Please enter valid contribution details!");
    }
});

// Add Expense
document.getElementById("addExpense").addEventListener("click", () => {
    const name = document.getElementById("spenderName").value;
    const description = document.getElementById("expenseDescription").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (name && description && !isNaN(amount) && amount > 0) {
        expenses.push({ name, description, amount });
        totalExpenses += amount;

        renderRecords();
        updateTotals();

        document.getElementById("spenderName").value = "";
        document.getElementById("expenseDescription").value = "";
        document.getElementById("expenseAmount").value = "";
    } else {
        alert("Please enter valid expense details!");
    }
});
