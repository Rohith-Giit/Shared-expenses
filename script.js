// Initialize variables from localStorage
let totalCollected = parseFloat(localStorage.getItem('totalCollected')) || 0;
let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;
const savedRecords = JSON.parse(localStorage.getItem('records')) || [];

// Update the total values on page load
document.getElementById('totalCollectedInput').value = totalCollected;
document.getElementById('remainingBalanceInput').value = totalCollected - totalExpenses;

const recordsContainer = document.getElementById('recordsContainer');

// Load saved records
savedRecords.forEach((record, index) => {
    const recordDiv = document.createElement('div');
    recordDiv.classList.add('records');
    recordDiv.innerHTML = `
        <span>${record}</span>
        <button onclick="editRecord(${index})">Edit</button>
        <button onclick="deleteRecord(${index})">Delete</button>
    `;
    recordsContainer.appendChild(recordDiv);
});

// Add Contribution
document.getElementById('addContribution').addEventListener('click', () => {
    const name = document.getElementById('contributorName').value;
    const amount = parseFloat(document.getElementById('contributionAmount').value);

    if (name && !isNaN(amount) && amount > 0) {
        totalCollected += amount;
        localStorage.setItem('totalCollected', totalCollected);

        const record = `${name} contributed £${amount}`;
        savedRecords.push(record);
        localStorage.setItem('records', JSON.stringify(savedRecords));

        updateRecords();
    }

    document.getElementById('contributorName').value = '';
    document.getElementById('contributionAmount').value = '';
});

// Add Expense
document.getElementById('addExpense').addEventListener('click', () => {
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (description && !isNaN(amount) && amount > 0) {
        totalExpenses += amount;
        localStorage.setItem('totalExpenses', totalExpenses);

        const record = `Expense: ${description} (£${amount})`;
        savedRecords.push(record);
        localStorage.setItem('records', JSON.stringify(savedRecords));

        updateRecords();
    }

    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
});

// Update displayed records and totals
function updateRecords() {
    recordsContainer.innerHTML = '';
    savedRecords.forEach((record, index) => {
        const recordDiv = document.createElement('div');
        recordDiv.classList.add('records');
        recordDiv.innerHTML = `
            <span>${record}</span>
            <button onclick="editRecord(${index})">Edit</button>
            <button onclick="deleteRecord(${index})">Delete</button>
        `;
        recordsContainer.appendChild(recordDiv);

        document.getElementById('totalCollectedInput').value = `£${totalCollected}`;
        document.getElementById('remainingBalanceInput').value = `£${totalCollected - totalExpenses}`;
    });
}

// Edit Record
function editRecord(index) {
    const record = savedRecords[index];
    const newValue = prompt('Edit value:', record);

    if (newValue !== null) {
        savedRecords[index] = newValue;
        localStorage.setItem('records', JSON.stringify(savedRecords));
        updateRecords();
    }
}

// Delete Record
function deleteRecord(index) {
    const record = savedRecords[index];

    // Update totals
    if (record.includes('contributed')) {
        const amount = parseFloat(record.split('£')[1]);
        totalCollected -= amount;
        localStorage.setItem('totalCollected', totalCollected);
    } else if (record.includes('Expense')) {
        const amount = parseFloat(record.split('£')[1]);
        totalExpenses -= amount;
        localStorage.setItem('totalExpenses', totalExpenses);
    }

    savedRecords.splice(index, 1);
    localStorage.setItem('records', JSON.stringify(savedRecords));
    updateRecords();
}

// Edit Total Collected and Remaining Balance
document.getElementById('totalCollectedInput').addEventListener('blur', () => {
    const newTotal = parseFloat(document.getElementById('totalCollectedInput').value);
    if (!isNaN(newTotal)) {
        totalCollected = newTotal;
        localStorage.setItem('totalCollected', totalCollected);
        updateRecords();
    }
});

document.getElementById('remainingBalanceInput').addEventListener('blur', () => {
    const newRemaining = parseFloat(document.getElementById('remainingBalanceInput').value);
    if (!isNaN(newRemaining)) {
        const newTotal = totalCollected - newRemaining;
        totalExpenses = newTotal;
        localStorage.setItem('totalExpenses', totalExpenses);
        updateRecords();
    }
});
