let groups = JSON.parse(localStorage.getItem("groups")) || {}; // Store group data
let currentGroup = null;

// Create or Join Group
document.getElementById("create-group").addEventListener("click", function () {
  const groupCode = document.getElementById("group-code").value.trim();
  if (!groupCode) {
    alert("Please enter a group code.");
    return;
  }
  if (groups[groupCode]) {
    alert("Group code already exists. Try joining it instead.");
    return;
  }
  groups[groupCode] = { budget: {}, records: [] };
  currentGroup = groupCode;
  localStorage.setItem("groups", JSON.stringify(groups));
  updateGroupDisplay();
});

document.getElementById("join-group").addEventListener("click", function () {
  const groupCode = document.getElementById("group-code").value.trim();
  if (!groupCode) {
    alert("Please enter a group code.");
    return;
  }
  if (!groups[groupCode]) {
    alert("Group does not exist. Try creating it first.");
    return;
  }
  currentGroup = groupCode;
  updateGroupDisplay();
});

// Update Group Display
function updateGroupDisplay() {
  document.getElementById("group-id").innerText = currentGroup || "None";
  updateExpenseSummary();
  updateExpenseList();
}

// Save Budget
document.getElementById("budget-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!currentGroup) {
    alert("Please join or create a group first.");
    return;
  }

  const rent = parseFloat(document.getElementById("rent").value) || 0;
  const electricity = parseFloat(document.getElementById("electricity").value) || 0;
  const wifi = parseFloat(document.getElementById("wifi").value) || 0;
  const extraName = document.getElementById("extra-name").value.trim();
  const extraAmount = parseFloat(document.getElementById("extra-amount").value) || 0;

  const budget = { rent, electricity, wifi };
  if (extraName) {
    budget[extraName] = extraAmount;
  }

  groups[currentGroup].budget = budget;
  localStorage.setItem("groups", JSON.stringify(groups));
  updateExpenseSummary();
  alert("Budget saved successfully!");
});

// Update Expense Summary
function updateExpenseSummary() {
  if (!currentGroup) return;

  const summaryElement = document.getElementById("expense-summary");
  summaryElement.innerHTML = "";

  const budget = groups[currentGroup]?.budget || {};
  for (const [key, value] of Object.entries(budget)) {
    const listItem = document.createElement("li");
    listItem.innerText = `${key}: £${value}`;
    summaryElement.appendChild(listItem);
  }
}

// Add Contribution or Expense
document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!currentGroup) {
    alert("Please join or create a group first.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const billUpload = document.getElementById("bill-upload").files[0];

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter valid name and amount.");
    return;
  }

  let billURL = "";
  if (billUpload) {
    const reader = new FileReader();
    reader.onload = function (e) {
      billURL = e.target.result;
      saveRecord(name, amount, type, billURL);
    };
    reader.readAsDataURL(billUpload);
  } else {
    saveRecord(name, amount, type, billURL);
  }

  e.target.reset();
});

// Save Record
function saveRecord(name, amount, type, billURL) {
  const newRecord = { name, amount, type, billURL };
  groups[currentGroup].records.push(newRecord);
  localStorage.setItem("groups", JSON.stringify(groups));
  updateExpenseList();
}

// Update Expense List
function updateExpenseList() {
  if (!currentGroup) return;

  const expenseList = document.getElementById("expense-list");
  expenseList.innerHTML = "";
  let totalContributions = 0;
  let totalExpenses = 0;

  groups[currentGroup].records.forEach((record, index) => {
    if (record.type === "contribution") {
      totalContributions += record.amount;
    } else {
      totalExpenses += record.amount;
    }

    const recordDiv = document.createElement("div");
    recordDiv.classList.add("expense-item");
    recordDiv.innerHTML = `
      <strong>${record.name}</strong> - £${record.amount} (${record.type})
      ${record.billURL ? `<img src="${record.billURL}" alt="Bill Image">` : ""}
      <button onclick="deleteRecord(${index})">Delete</button>
    `;
    expenseList.appendChild(recordDiv);
  });

  const summary = `
    <h3>Summary</h3>
    <p><strong>Total Contributions:</strong> £${totalContributions}</p>
    <p><strong>Total Expenses:</strong> £${totalExpenses}</p>
    <p><strong>Remaining Balance:</strong> £${totalContributions - totalExpenses}</p>
  `;
  expenseList.innerHTML += summary;
}

// Delete Record
function deleteRecord(index) {
  groups[currentGroup].records.splice(index, 1);
  localStorage.setItem("groups", JSON.stringify(groups));
  updateExpenseList();
}

// Initialize App
updateGroupDisplay();