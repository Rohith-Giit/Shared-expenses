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
        
        historyList.innerHTML = paginatedData.data.map((transaction, index) => {
            const isCredit = transaction.type === 'add';
            const formattedDate = new Date(transaction.timestamp).toLocaleString();
            // Get relative time (e.g. "3 hours ago")
            const relativeTime = getRelativeTime(new Date(transaction.timestamp));
            
            // Create initials for avatar if no image
            const nameInitial = transaction.description.charAt(0).toUpperCase();
            
            return `
                <li class="transaction-item-modern">
                    <div class="transaction-avatar">
                        ${nameInitial}
                    </div>
                    <div class="transaction-content">
                        <div class="transaction-title">
                            ${isCredit ? 'Received from' : 'Paid to'} ${transaction.description.replace('Added money to wallet', 'Wallet Reload').replace('Sent to ', '')}
                        </div>
                        <div class="transaction-time">${relativeTime}</div>
                    </div>
                    <div>
                        <div class="transaction-amount ${isCredit ? 'amount-credit' : 'amount-debit'}">
                            ${isCredit ? '+' : ''}₹${transaction.amount.toFixed(2)}
                        </div>
                        <div class="transaction-source">
                            ${isCredit ? 'Credited to' : 'Debited from'} <span class="transaction-source-icon"></span>
                        </div>
                    </div>
                </li>
            `;
        }).join('');
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

// Add this helper function
function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
        return 'Just now';
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

/* Add this to your style.css file */
.modern-card-view {
  display: none !important; /* Default state */
}

/* When shown, this will override the default state */
.modern-card-view.show-card {
  display: flex !important;
}