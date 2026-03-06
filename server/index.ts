import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder';

// Use a fallback or lazy initialization if needed, but createClient must have strings.
// Vercel environment variables should be provided as strings.
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    console.warn('Warning: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.');
}

// Initialize Gemini AI
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || ""
});

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

// Analyze image for acupoints
app.post('/api/analyze-image', async (req, res) => {
    try {
        const { image } = req.body; // base64 encoded image
        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key is not configured' });
        }

        // Prompt for Gemini
        const prompt = `
            Analyze this photo of a human body part (hand, leg, ear, etc.). 
            Identify all visible major acupoints in this image.
            Return ONLY a JSON array of objects with the following structure:
            [
                { 
                    "code": "LI4", 
                    "name": "Hegu", 
                    "description": "Located on the back of the hand...",
                    "x": 0.45, 
                    "y": 0.32 
                }
            ]
            Where x and y are normalized coordinates (0 to 1) starting from top-left.
            If no acupoints are recognizable, return an empty array [].
            Do not include any Markdown formatting or extra text.
        `;

        // Prepare image data
        const imageData = {
            data: image.split(',')[1] || image,
            mimeType: "image/jpeg"
        };

        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{
                role: 'user',
                parts: [
                    { text: prompt },
                    { inlineData: imageData }
                ]
            }]
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "[]";

        // Sanitize response (Gemini might sometimes include ```json ... ```)
        const jsonMatch = text.match(/\[.*\]/s);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        const points = JSON.parse(jsonStr);

        res.json({ points });
    } catch (err) {
        console.error('Gemini Analysis error:', err);
        res.status(500).json({
            error: 'Failed to analyze image',
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
