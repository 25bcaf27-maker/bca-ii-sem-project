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

// Serve static files
app.use(express.static(__dirname));

// Parse forms
app.use(express.urlencoded({ extended: false }));

// Contact form
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.redirect('/?error=1');
    }
    
    try {
        const { data, error } = await supabase
            .from('contacts')
            .insert([{ name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() }]);
        
        if (error) throw error;
        
        console.log('✅ Message saved to Supabase:', data[0]);
        res.redirect('/?success=1');
    } catch (error) {
        console.error('❌ Supabase error:', error.message);
        res.redirect('/?error=1');
    }
});

// Root serve index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Start
app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
});

