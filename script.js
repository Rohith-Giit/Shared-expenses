let totalAmount = 0;
let expenses = 0;

// Update UI
function updateUI() {
  document.getElementById("total-amount").textContent = totalAmount.toFixed(2);
  document.getElementById("remaining-balance").textContent = (totalAmount - expenses).toFixed(2);
}

// Add Contribution
document.getElementById("add-contribution").addEventListener("click", () => {
  const name = document.getElementById("contributor-name").value.trim();
  const amount = parseFloat(document.getElementById("amount-contributed").value);

  if (name && amount && amount > 0) {
    totalAmount += amount;
    updateUI();

    const record = `${name} contributed $${amount.toFixed(2)}`;
    addRecord(record);
    document.getElementById("contributor-name").value = "";
    document.getElementById("amount-contributed").value = "";
  } else {
    alert("Please enter a valid name and amount!");
  }
});

// Add Expense
document.getElementById("add-expense").addEventListener("click", () => {
  const description = document.getElementById("expense-description").value.trim();
  const amount = parseFloat(document.getElementById("expense-amount").value);

  if (description && amount && amount > 0) {
    expenses += amount;
    updateUI();

    const record = `Expense: ${description} - $${amount.toFixed(2)}`;
    addRecord(record);
    document.getElementById("expense-description").value = "";
    document.getElementById("expense-amount").value = "";
  } else {
    alert("Please enter a valid description and amount!");
  }
});

// Add Record to List
function addRecord(record) {
  const list = document.getElementById("records-list");
  const listItem = document.createElement("li");
  listItem.textContent = record;
  list.appendChild(listItem);
}
