const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
// This line is what links your CSS and HTML from the 'public' folder
app.use(express.static('public')); 

// These lines allow the server to read the data sent from your Contact Form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DATABASE CONNECTION ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Crucial for connecting to Render
});

// --- ROUTES ---

// 1. Serve the Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Handle Contact Form Submissions
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query(
            'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        // Simple success message
        res.send(`
            <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
                <h1>Thank you, ${name}!</h1>
                <p>Your message has been saved to the Render database.</p>
                <a href="/">Go Back to Portfolio</a>
            </div>
        `);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).send('Something went wrong with the database connection.');
    }
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});