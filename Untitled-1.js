// State management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentTab = 'dashboard';

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const addMoneyBtn = document.getElementById('addMoneyBtn');
const sendMoneyBtn = document.getElementById('sendMoneyBtn');
const addMoneyModal = document.getElementById('addMoneyModal');
const sendMoneyModal = document.getElementById('sendMoneyModal');
const addMoneyForm = document.getElementById('addMoneyForm');
const sendMoneyForm = document.getElementById('sendMoneyForm');
const expenseForm = document.getElementById('expenseForm');

// Initialize
updateDashboard();

// Event Listeners
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const tab = item.dataset.tab;
    switchTab(tab);
  });
});

addMoneyBtn.addEventListener('click', () => openModal('addMoneyModal'));
sendMoneyBtn.addEventListener('click', () => openModal('sendMoneyModal'));

addMoneyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('addAmount').value);
  addTransaction('Add Money', amount, 'income');
  closeModal('addMoneyModal');
  addMoneyForm.reset();
});

sendMoneyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('sendAmount').value);
  const recipient = document.getElementById('recipientName').value;
  addTransaction(`Send to ${recipient}`, amount, 'expense');
  closeModal('sendMoneyModal');
  sendMoneyForm.reset();
});

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = document.getElementById('expenseDescription').value;
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const type = document.getElementById('expenseType').value;
  addTransaction(description, amount, type);
  expenseForm.reset();
});

// Functions
function switchTab(tab) {
  currentTab = tab;
  
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });
  
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tab);
  });
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function addTransaction(description, amount, type) {
  const transaction = {
    id: Date.now(),
    description,
    amount,
    type,
    date: new Date().toISOString()
  };

  transactions.unshift(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateDashboard();
}

function updateDashboard() {
  const totalBalance = transactions.reduce((sum, t) => 
    sum + (t.type === 'income' ? t.amount : -t.amount), 0
  );
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById('totalBalance').textContent = formatCurrency(totalBalance);
  document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
  document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);

  updateTransactionsList();
}

function updateTransactionsList() {
  const container = document.getElementById('recentTransactions');
  container.innerHTML = transactions
    .slice(0, 10)
    .map(t => `
      <div class="transaction-item">
        <div class="transaction-info">
          <span class="transaction-description">${t.description}</span>
          <span class="transaction-date">${formatDate(t.date)}</span>
        </div>
        <span class="transaction-amount ${t.type}">
          ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
        </span>
      </div>
    `)
    .join('');
}

function formatCurrency(amount) {
  return `£${amount.toFixed(2)}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
