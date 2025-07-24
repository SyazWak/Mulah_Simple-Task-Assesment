// Function to populate tables with data
async function loadTableData() {
    try {
        // Show loading state
        showLoading();

        // Fetch data from the API
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate that we have the expected data structure
        if (!data.table1 || !data.table2) {
            throw new Error('Invalid data structure received from server');
        }
        
        // Populate Table 1
        populateTable1(data.table1);
        
        // Populate Table 2
        populateTable2(data.table2);
        
    } catch (error) {
        console.error('Error loading table data:', error);
        showError(`Failed to load table data: ${error.message}`);
    }
}

// Function to show loading state
function showLoading() {
    const table1Body = document.querySelector('#table1 tbody');
    const table2Body = document.querySelector('#table2 tbody');
    
    table1Body.innerHTML = '<tr><td colspan="2" class="loading">Loading data...</td></tr>';
    table2Body.innerHTML = '<tr><td colspan="2" class="loading">Loading data...</td></tr>';
}

// Function to show error state
function showError(message) {
    const table1Body = document.querySelector('#table1 tbody');
    const table2Body = document.querySelector('#table2 tbody');
    
    const errorHtml = `<tr><td colspan="2" class="error">${message}</td></tr>`;
    table1Body.innerHTML = errorHtml;
    table2Body.innerHTML = errorHtml;
}

// Function to populate Table 1 with original data
function populateTable1(data) {
    const tbody = document.querySelector('#table1 tbody');
    tbody.innerHTML = '';
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.index}</td>
            <td>${row.value}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to populate Table 2 with calculated values
function populateTable2(data) {
    const tbody = document.querySelector('#table2 tbody');
    tbody.innerHTML = '';
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.category}</td>
            <td>${row.value}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Load data when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    loadTableData();
});

// Add a refresh function for manual reload
function refreshData() {
    loadTableData();
}

// Optional: Add keyboard shortcut for refresh (Ctrl+R or F5)
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey && event.key === 'r') || event.key === 'F5') {
        event.preventDefault();
        refreshData();
    }
});
