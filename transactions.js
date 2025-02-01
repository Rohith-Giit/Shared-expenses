// Transaction Management
class TransactionManager {
    constructor(user) {
        this.user = user;
        this.currentPage = 1;
        this.perPage = 10;
        this.filters = {};
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Search input
        document.getElementById('transactionSearch')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.updateTransactionList();
        });
        
        // Type filter
        document.getElementById('transactionType')?.addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.updateTransactionList();
        });
        
        // Date filters
        document.getElementById('dateFrom')?.addEventListener('change', (e) => {
            this.filters.dateFrom = e.target.value;
            this.updateTransactionList();
        });
        
        document.getElementById('dateTo')?.addEventListener('change', (e) => {
            this.filters.dateTo = e.target.value;
            this.updateTransactionList();
        });
    }
    
    updateTransactionList() {
        const filteredTransactions = filterTransactions(this.filters);
        const paginatedData = paginateTransactions(
            filteredTransactions, 
            this.currentPage, 
            this.perPage
        );
        
        this.renderTransactions(paginatedData);
        this.renderPagination(paginatedData);
    }
    
    renderTransactions(paginatedData) {
        const historyList = document.getElementById('walletHistory');
        if (!historyList) return;
        
        historyList.innerHTML = paginatedData.data.map((transaction, index) => `
            <li class="transaction-item ${index === 0 ? 'new-transaction' : ''}"
                style="animation-delay: ${index * 0.1}s">
                <div class="transaction-details">
                    <span class="transaction-action">${transaction.description}</span>
                    <span class="transaction-amount">
                        ${transaction.type === 'add' ? '+' : '-'}£${transaction.amount.toFixed(2)}
                    </span>
                    <span class="transaction-date">
                        ${new Date(transaction.timestamp).toLocaleString()}
                    </span>
                </div>
                <div class="transaction-actions">
                    <button class="action-button" onclick="exportTransaction('${transaction.id}')">📥</button>
                    <button class="action-button" onclick="deleteTransaction('${transaction.id}')">🗑️</button>
                </div>
            </li>
        `).join('');
    }
    
    renderPagination(paginatedData) {
        const paginationElement = document.getElementById('transactionPagination');
        if (!paginationElement) return;
        
        const { currentPage, totalPages } = paginatedData;
        
        paginationElement.innerHTML = `
            <button 
                ${currentPage === 1 ? 'disabled' : ''}
                onclick="transactionManager.goToPage(${currentPage - 1})">
                Previous
            </button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button 
                ${currentPage === totalPages ? 'disabled' : ''}
                onclick="transactionManager.goToPage(${currentPage + 1})">
                Next
            </button>
        `;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.updateTransactionList();
    }
    
    exportTransactions(format = 'csv') {
        const transactions = filterTransactions(this.filters);
        
        if (format === 'csv') {
            const csv = this.generateCSV(transactions);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions_${new Date().toISOString()}.csv`;
            a.click();
        }
    }
    
    generateCSV(transactions) {
        const headers = ['Date', 'Type', 'Amount', 'Description'];
        const rows = transactions.map(t => [
            new Date(t.timestamp).toLocaleString(),
            t.type,
            t.amount,
            t.description
        ]);
        
        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }
}

// Initialize transaction manager when user logs in
let transactionManager = null;

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        transactionManager = new TransactionManager(currentUser);
    }
}); 