const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Function to read CSV data
function readCSVData() {
    return new Promise((resolve, reject) => {
        const results = [];
        const csvPath = path.join(__dirname, 'data', 'Table_Input.csv');
        
        console.log('Attempting to read CSV from:', csvPath);
        console.log('File exists:', fs.existsSync(csvPath));
        
        if (!fs.existsSync(csvPath)) {
            reject(new Error(`CSV file not found at: ${csvPath}`));
            return;
        }
        
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => {
                // Convert the CSV row to our expected format
                results.push({
                    index: data['Index #'],
                    value: parseInt(data['Value'])
                });
            })
            .on('end', () => {
                console.log(`Successfully read ${results.length} rows from CSV`);
                resolve(results);
            })
            .on('error', (error) => {
                console.error('CSV reading error:', error);
                reject(error);
            });
    });
}

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route to get table data
app.get('/api/data', async (req, res) => {
    try {
        // Read Table 1 data from CSV
        const table1Data = await readCSVData();

        // Calculate Table 2 values
        const getValueByIndex = (index) => {
            const item = table1Data.find(row => row.index === index);
            return item ? item.value : 0;
        };

        const table2Data = [
            { 
                category: 'Alpha', 
                value: getValueByIndex('A5') + getValueByIndex('A20')
            },
            { 
                category: 'Beta', 
                value: getValueByIndex('A15') / getValueByIndex('A7')
            },
            { 
                category: 'Charlie', 
                value: getValueByIndex('A13') * getValueByIndex('A12')
            }
        ];

        res.json({
            table1: table1Data,
            table2: table2Data
        });
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ 
            error: 'Failed to read CSV data',
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Current directory:', __dirname);
    console.log('CSV file path:', path.join(__dirname, 'data', 'Table_Input.csv'));
    console.log('CSV file exists:', fs.existsSync(path.join(__dirname, 'data', 'Table_Input.csv')));
});
