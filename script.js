require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
});

// Create contacts table if it doesn't exist
db.query(`CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Handle contact form submission
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    // Basic field check
    if (!name || !email || !message) {
        return res.redirect('/?error=1');
    }
    try {
        await db.query('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
        // Redirect with success flag
        res.redirect('/?success=1');
    } catch (error) {
        // You can log error if debugging
        res.redirect('/?error=1');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});