import type { IncomingMessage, ServerResponse } from 'http';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Helper to read request body
async function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => resolve(body));
    });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const url = req.url || '';
    const method = req.method || 'GET';

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // GET /api/health
        if (url === '/api/health' || url === '/api/') {
            res.writeHead(200);
            res.end(JSON.stringify({
                status: 'ok',
                message: 'Backend is running correctly',
                env_configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY),
                node_env: process.env.NODE_ENV
            }));
            return;
        }

        // GET /api/acupoints
        if (method === 'GET' && url === '/api/acupoints') {
            if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Database environment variables are missing.' }));
                return;
            }
            const { data, error } = await supabase.from('acupoints').select('*');
            if (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Failed to fetch acupoints', details: error.message }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify(data));
            return;
        }

        // GET /api/acupoints/:id
        const acupointMatch = url.match(/^\/api\/acupoints\/(.+)$/);
        if (method === 'GET' && acupointMatch) {
            const id = acupointMatch[1];
            const { data, error } = await supabase.from('acupoints').select('*').eq('id', id).single();
            if (error) {
                const status = error.code === 'PGRST116' ? 404 : 500;
                res.writeHead(status);
                res.end(JSON.stringify({ error: error.code === 'PGRST116' ? 'Acupoint not found' : 'Failed to fetch acupoint' }));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify(data));
            return;
        }

        // POST /api/analyze-image
        if (method === 'POST' && url === '/api/analyze-image') {
            if (!process.env.GEMINI_API_KEY) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Gemini API key is not configured' }));
                return;
            }
            const bodyStr = await readBody(req);
            const { image } = JSON.parse(bodyStr) as { image?: string };
            if (!image) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Image data is required' }));
                return;
            }

            const prompt = `Analyze this photo of a human body part (hand, leg, ear, etc.). 
            Identify all visible major acupoints in this image.
            Return ONLY a JSON array of objects with the following structure:
            [{ "code": "LI4", "name": "Hegu", "description": "Located on the back of the hand...", "x": 0.45, "y": 0.32 }]
            Where x and y are normalized coordinates (0 to 1) starting from top-left.
            If no acupoints are recognizable, return an empty array [].
            Do not include any Markdown formatting or extra text.`;

            const imageData = { data: image.split(',')[1] || image, mimeType: 'image/jpeg' as const };
            const result = await genAI.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: imageData }] }]
            });

            const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '[]';
            const jsonMatch = text.match(/\[.*\]/s);
            const points = JSON.parse(jsonMatch ? jsonMatch[0] : text);
            res.writeHead(200);
            res.end(JSON.stringify({ points }));
            return;
        }

        // 404 for unknown routes
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));

    } catch (err) {
        console.error('Handler error:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal server error', details: err instanceof Error ? err.message : String(err) }));
    }
}
