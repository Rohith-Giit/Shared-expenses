// State
const state = {
    contributions: [], // Stores all contributions
    expenses: [],      // Stores all expenses
};

// DOM Elements
const totalRentCollected = document.getElementById("totalRentCollected");
const totalExpenses = document.getElementById("totalExpenses");
const remainingBalance = document.getElementById("remainingBalance");
const rentCollectedCard = document.getElementById("rentCollectedCard");
const expensesCard = document.getElementById("expensesCard");
const historyModal = document.getElementById("historyModal");
const historyList = document.getElementById("historyList");
const closeModalButton = document.getElementById("closeModal");

// Add Rent Contribution
document.getElementById("addContributionButton").addEventListener("click", () => {
    const name = document.getElementById("contributorName").value.trim();
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter valid contribution details!");
        return;
    }

    // Add to state
    state.contributions.push({ name, amount, date: new Date().toLocaleDateString() });

    // Update UI
    updateSummary();
    resetForm(["contributorName", "contributionAmount"]);
    alert("Contribution added!");
});

// Add Expense
document.getElementById("addExpenseButton").addEventListener("click", () => {
    const name = document.getElementById("expenseName").value.trim();
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const receipt = document.getElementById("expenseReceipt").files[0];

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense details!");
        return;
    }

    const receiptURL = receipt ? URL.createObjectURL(receipt) : null;

    // Add to state
    state.expenses.push({ name, amount, receiptURL, date: new Date().toLocaleDateString() });

    // Update UI
    updateSummary();
    resetForm(["expenseName", "expenseAmount", "expenseReceipt"]);
    alert("Expense added!");
});

// Update Summary
function updateSummary() {
    const totalRent = state.contributions.reduce((sum, c) => sum + c.amount, 0);
    const totalExpense = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalRent - totalExpense;

    // Update DOM
    totalRentCollected.textContent = totalRent.toFixed(2);
    totalExpenses.textContent = totalExpense.toFixed(2);
    remainingBalance.textContent = remaining.toFixed(2);

    // Animate changes
    animateHighlight([totalRentCollected, totalExpenses, remainingBalance]);
}

// Animate Highlight
function animateHighlight(elements) {
    elements.forEach((el) => {
        el.classList.add("highlight");
        setTimeout(() => el.classList.remove("highlight"), 500);
    });
}

// View Rent History
rentCollectedCard.addEventListener("click", () => {
    displayHistory(state.contributions, "Rent Contributions");
    historyModal.classList.add("show");
});

// View Expense History
expensesCard.addEventListener("click", () => {
    displayHistory(state.expenses, "Expense History");
    historyModal.classList.add("show");
});

// Display History
function displayHistory(data, title) {
    document.getElementById("modalTitle").textContent = title;
    historyList.innerHTML = "";

    if (data.length === 0) {
        historyList.innerHTML = "<li>No records available</li>";
    } else {
        data.forEach((item) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.name} - £${item.amount} (${item.date})
                ${
                    item.receiptURL
                        ? `<a href="${item.receiptURL}" target="_blank">View Receipt</a>`
                        : ""
                }
            `;
            historyList.appendChild(li);
        });
    }
}

// Close Modal
closeModalButton.addEventListener("click", () => historyModal.classList.remove("show"));
historyModal.addEventListener("click", (e) => {
    if (e.target === historyModal) historyModal.classList.remove("show");
});

// Reset Form
function resetForm(fields) {
    fields.forEach((id) => {
        const field = document.getElementById(id);
        if (field.type === "file") field.value = null;
        else field.value = "";
    });
}
// Sidebar Toggle
const sidebar = document.getElementById("sidebar");
const toggleSidebarButton = document.getElementById("toggleSidebar");

toggleSidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});