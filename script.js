let totalCollected = parseFloat(localStorage.getItem('totalCollected')) || 0;
let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;
const savedRecords = JSON.parse(localStorage.getItem('records')) || [];

document.getElementById("totalCollected").innerText = `£${totalCollected}`;
document.getElementById("remainingBalance").innerText = `£${totalCollected - totalExpenses}`;

// Display saved records from localStorage
const recordsContainer = document.getElementById("records");
savedRecords.forEach(record => {
    const recordElement = document.createElement("div");
    recordElement.textContent = record;
    recordsContainer.appendChild(recordElement);
});

// Add Contribution
document.getElementById("addContribution").addEventListener("click", function () {
    const name = document.getElementById("contributorName").value;
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (name && !isNaN(amount) && amount > 0) {
        totalCollected += amount;
        document.getElementById("totalCollected").innerText = `£${totalCollected}`;

        const record = `${name} contributed £${amount}`;
        const recordElement = document.createElement("div");
        recordElement.textContent = record;
        recordsContainer.appendChild(recordElement);

        // Save the data to localStorage
        localStorage.setItem('totalCollected', totalCollected);
        savedRecords.push(record);
        localStorage.setItem('records', JSON.stringify(savedRecords));
    }

    // Clear input fields after adding the contribution
    document.getElementById("contributorName").value = "";
    document.getElementById("contributionAmount").value = "";
});

// Add Expense
document.getElementById("addExpense").addEventListener("click", function () {
    const description = document.getElementById("expenseDescription").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (description && !isNaN(amount) && amount > 0) {
        totalExpenses += amount;
        const remainingBalance = totalCollected - totalExpenses;
        document.getElementById("remainingBalance").innerText = `£${remainingBalance}`;

        const record = `Expense: ${description} (£${amount})`;
        const recordElement = document.createElement("div");
        recordElement.textContent = record;
        recordsContainer.appendChild(recordElement);

        // Save the data to localStorage
        localStorage.setItem('totalExpenses', totalExpenses);
        savedRecords.push(record);
        localStorage.setItem('records', JSON.stringify(savedRecords));
    }

    // Clear input fields after adding the expense
    document.getElementById("expenseDescription").value = "";
    document.getElementById("expenseAmount").value = "";
});
