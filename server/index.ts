import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Warning: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Endpoints
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running correctly',
        env_configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY),
        node_env: process.env.NODE_ENV
    });
});

// Get all acupoints
app.get('/api/acupoints', async (req, res) => {
    try {
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
            return res.status(500).json({ error: 'Database environment variables are missing on server.' });
        }

        const { data, error } = await supabase
            .from('acupoints')
            .select('*');

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                error: 'Failed to fetch acupoints',
                details: error.message,
                code: error.code
            });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error',
            details: err instanceof Error ? err.message : String(err)
        });
    }
});

// Get a single acupoint by ID
app.get('/api/acupoints/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('acupoints')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching acupoint ${id}:`, error);

            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Acupoint not found' });
            }

            return res.status(500).json({ error: 'Failed to fetch acupoint' });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server natively only if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
        if (supabaseUrl && supabaseKey) {
            console.log(`Connected to Supabase at ${supabaseUrl}`);
        } else {
            console.log(`Supabase connection NOT configured. Please check .env file.`);
        }
    });
}

export default app;
