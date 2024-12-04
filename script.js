// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, push, get, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhPfAkRKMNMaG2w_tw8TRkjig-UAyas9Q",
  authDomain: "sharedexpenses-61b37.firebaseapp.com",
  databaseURL: "https://sharedexpenses-61b37-default-rtdb.firebaseio.com",
  projectId: "sharedexpenses-61b37",
  storageBucket: "sharedexpenses-61b37.firebasestorage.app",
  messagingSenderId: "753946589591",
  appId: "1:753946589591:web:878c9f294791506da02cd2",
  measurementId: "G-M6YW4P2D0V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Global Variable for Group Code
let currentGroup = null;

// Create Group
document.getElementById("create-group").addEventListener("click", () => {
  const groupCode = document.getElementById("group-code").value.trim();
  if (!groupCode) {
    alert("Please enter a group code.");
    return;
  }

  // Save group in Firebase
  set(ref(database, `groups/${groupCode}`), {
    budget: {},
    records: [],
  }).then(() => {
    currentGroup = groupCode;
    document.getElementById("group-id").textContent = currentGroup;
    alert("Group created successfully!");
  }).catch((error) => {
    console.error("Error creating group:", error);
  });
});

// Join Group
document.getElementById("join-group").addEventListener("click", () => {
  const groupCode = document.getElementById("group-code").value.trim();
  if (!groupCode) {
    alert("Please enter a group code.");
    return;
  }

  // Check if the group exists in Firebase
  get(ref(database, `groups/${groupCode}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        currentGroup = groupCode;
        document.getElementById("group-id").textContent = currentGroup;
        loadGroupData();
        alert("Joined group successfully!");
      } else {
        alert("Group does not exist. Please create it first.");
      }
    })
    .catch((error) => {
      console.error("Error joining group:", error);
    });
});

// Save Budget
document.getElementById("budget-form").addEventListener("submit", (e) => {
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

  // Save budget in Firebase
  set(ref(database, `groups/${currentGroup}/budget`), budget)
    .then(() => {
      alert("Budget saved successfully!");
      loadGroupData();
    })
    .catch((error) => {
      console.error("Error saving budget:", error);
    });
});

// Add Contribution/Expense
document.getElementById("expense-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentGroup) {
    alert("Please join or create a group first.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please enter valid details.");
    return;
  }

  const newExpense = { name, amount, type };

  // Push expense to Firebase
  push(ref(database, `groups/${currentGroup}/records`), newExpense)
    .then(() => {
      alert("Expense added successfully!");
      loadGroupData();
    })
    .catch((error) => {
      console.error("Error adding expense:", error);
    });
});

// Load Group Data
function loadGroupData() {
  if (!currentGroup) return;

  // Load Budget
  onValue(ref(database, `groups/${currentGroup}/budget`), (snapshot) => {
    const budget = snapshot.val() || {};
    const summary = document.getElementById("expense-summary");
    summary.innerHTML = "";
    for (const [key, value] of Object.entries(budget)) {
      const li = document.createElement("li");
      li.textContent = `${key}: £${value}`;
      summary.appendChild(li);
    }
  });

  // Load Records
  onValue(ref(database, `groups/${currentGroup}/records`), (snapshot) => {
    const records = snapshot.val() || {};
    const recordsList = document.getElementById("records-list");
    recordsList.innerHTML = "";
    for (const key in records) {
      const li = document.createElement("li");
      li.textContent = `${records[key].name} - £${records[key].amount} (${records[key].type})`;
      recordsList.appendChild(li);
    }
  });
}