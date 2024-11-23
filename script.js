// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

let totalCollected = 0;
let totalExpenses = 0;

// Add Contribution
document.getElementById("addContribution").addEventListener("click", function () {
    const name = document.getElementById("contributorName").value;
    const amount = parseFloat(document.getElementById("contributionAmount").value);

    if (name && !isNaN(amount) && amount > 0) {
        // Save to Firebase
        const newContributionRef = database.ref('contributions').push();
        newContributionRef.set({
            name: name,
            amount: amount
        });

        // Update Total Collected
        totalCollected += amount;
        document.getElementById("totalCollected").innerText = `£${totalCollected}`;

        // Clear inputs
        document.getElementById("contributorName").value = "";
        document.getElementById("contributionAmount").value = "";
    }
});

// Add Expense
document.getElementById("addExpense").addEventListener("click", function () {
    const description = document.getElementById("expenseDescription").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (description && !isNaN(amount) && amount > 0) {
        // Save to Firebase
        const newExpenseRef = database.ref('expenses').push();
        newExpenseRef.set({
            description: description,
            amount: amount
        });

        // Update Total Expenses
        totalExpenses += amount;
        const remainingBalance = totalCollected - totalExpenses;
        document.getElementById("remainingBalance").innerText = `£${remainingBalance}`;

        // Clear inputs
        document.getElementById("expenseDescription").value = "";
        document.getElementById("expenseAmount").value = "";
    }
});

// Fetch and Display Contributions
database.ref('contributions').on('value', function(snapshot) {
    const contributions = snapshot.val();
    let recordsHTML = "";
    for (const key in contributions) {
        recordsHTML += `${contributions[key].name} contributed £${contributions[key].amount}<br>`;
    }
    document.getElementById("records").innerHTML = recordsHTML;
});

// Fetch and Display Expenses
database.ref('expenses').on('value', function(snapshot) {
    const expenses = snapshot.val();
    let expenseHTML = "";
    for (const key in expenses) {
        expenseHTML += `Expense: ${expenses[key].description} (£${expenses[key].amount})<br>`;
    }
    document.getElementById("expenseRecords").innerHTML = expenseHTML;
});
