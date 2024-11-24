// Initialize Variables
let contributions = [];
let expenses = [];
let totalCollected = 0;
let totalExpenses = 0;

// Utility to Update UI
function updateUI() {
    const contributionRecords = document.getElementById("contributionRecords");
    const expenseRecords = document.getElementById("expenseRecords");
    const totalCollectedEl = document.getElementById("totalCollected");
    const remainingBalanceEl = document.getElementById("remainingBalance");

    // Clear previous records
    contributionRecords.innerHTML = "";
    expenseRecords.innerHTML = "";

    // Render Contributions
    contributions.forEach((contribution, index) => {
        const div = document.createElement("div");
        div.className = "record";
        div.innerHTML = `
            ${contribution.name} contributed £${contribution.amount}
            <button onclick="deleteContribution(${index})">Delete</button>
        `;
        contributionRecords.appendChild(div);
    });

    // Render Expenses
    expenses.forEach((expense, index) => {
        const div = document.createElement("div");
        div.className = "record";
        div.innerHTML = `
            ${expense.person} added: ${expense.description} (£${expense.amount})
            ${expense.image ? `<img src="${expense.image}" alt="Receipt">` : ""}
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseRecords.appendChild(div);
    });

    // Update Summary
    totalCollectedEl.innerText = totalCollected;
    remainingBalanceEl.innerText = totalCollected - totalExpenses;
}

// Add Contribution
document.getElementById("addContribution").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value;
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (name && amount > 0) {
        contributions.push({ name, amount });
        totalCollected += amount;
        updateUI();

        // Clear inputs
        document.getElementById("contributorName").value = "";
        document.getElementById("contributionAmount").value = "";
    }
});

// Add Expense
document.getElementById("addExpense").addEventListener("click", () => {
    const person = document.getElementById("expensePerson").value;
    const description = document.getElementById("expenseDescription").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const image = document.getElementById("expenseImage").files[0];

    if (person && description && amount > 0) {
        let imageURL = "";

        if (image) {
            const reader = new FileReader();
            reader.onload = function () {
                imageURL = reader.result;
                expenses.push({ person, description, amount, image: imageURL });
                totalExpenses += amount;
                updateUI();
            };
            reader.readAsDataURL(image);
        } else {
            expenses.push({ person, description, amount, image: "" });
            totalExpenses += amount;
            updateUI();
        }

        // Clear inputs
        document.getElementById("expensePerson").value = "";
        document.getElementById("expenseDescription").value = "";
        document.getElementById("expenseAmount").value = "";
        document.getElementById("expenseImage").value = "";
    }
});

// Delete Contribution
function deleteContribution(index) {
    totalCollected -= contributions[index].amount;
    contributions.splice(index, 1);
    updateUI();
}

// Delete Expense
function deleteExpense(index) {
    totalExpenses -= expenses[index].amount;
    expenses.splice(index, 1);
    updateUI();
}

// Initial UI Update
updateUI();
