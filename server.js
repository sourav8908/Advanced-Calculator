const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'calculator_db'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Save calculation endpoint
app.post('/save-calculation', (req, res) => {
    const { expression, result, tag } = req.body;
    const query = 'INSERT INTO calculations (expression, result, tag) VALUES (?, ?, ?)';
    
    db.query(query, [expression, result, tag], (err, results) => {
        if (err) {
            console.error('Error saving calculation:', err);
            res.status(500).json({ error: 'Failed to save calculation' });
            return;
        }
        res.json({ success: true, id: results.insertId });
    });
});

// Get history endpoint with filters
app.get('/get-history', (req, res) => {
    const { tag, startDate, endDate } = req.query;
    let query = 'SELECT * FROM calculations WHERE 1=1';
    const params = [];

    if (tag) {
        query += ' AND tag = ?';
        params.push(tag);
    }

    if (startDate) {
        query += ' AND created_at >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND created_at <= ?';
        params.push(endDate);
    }

    query += ' ORDER BY created_at DESC LIMIT 10';
    
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching history:', err);
            res.status(500).json({ error: 'Failed to fetch history' });
            return;
        }
        res.json(results);
    });
});

// Delete calculation endpoint
app.delete('/delete-calculation/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM calculations WHERE id = ?';
    
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting calculation:', err);
            res.status(500).json({ error: 'Failed to delete calculation' });
            return;
        }
        res.json({ success: true });
    });
});

// Update calculation endpoint
app.put('/update-calculation/:id', (req, res) => {
    const { id } = req.params;
    const { expression, result, tag } = req.body;
    const query = 'UPDATE calculations SET expression = ?, result = ?, tag = ? WHERE id = ?';
    
    db.query(query, [expression, result, tag, id], (err) => {
        if (err) {
            console.error('Error updating calculation:', err);
            res.status(500).json({ error: 'Failed to update calculation' });
            return;
        }
        res.json({ success: true });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 