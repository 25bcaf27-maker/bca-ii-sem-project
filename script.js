require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve static files from current dir (not 'public')
app.use(express.static(__dirname));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Handle contact form submission
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.redirect('/?error=1');
    }
    
    try {
        const { data, error } = await supabase
            .from('contacts')
            .insert([
                { 
                    name: name.trim(), 
                    email: email.trim().toLowerCase(), 
                    message: message.trim()
                }
            ]);
        
        if (error) {
            console.error('Supabase insert error:', error);
            return res.redirect('/?error=1');
        }
        
        console.log('Contact saved:', data);
        res.redirect('/?success=1');
        
    } catch (err) {
        console.error('Server error:', err);
        res.redirect('/?error=1');
    }
});

// Serve index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Supabase connected:', !!supabase);
});

