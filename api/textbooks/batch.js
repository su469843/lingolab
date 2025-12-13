import { prisma } from '../../lib/prisma.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token' });
        const payload = verifyToken(authHeader.split(' ')[1]);
        if (!payload) return res.status(401).json({ error: 'Invalid token' });

        const textbookId = parseInt(req.query.id);
        if (!textbookId) return res.status(400).json({ error: 'Invalid ID' });

        // Verify ownership
        const book = await prisma.textbook.findUnique({ where: { id: textbookId } });
        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (book.teacherId !== payload.userId) return res.status(403).json({ error: 'Not authorized' });

        // Helper to parse line
        // Format: "Word [Phonetic] Meaning / Example" (Flexible)
        // Simple logic: 
        // 1. Text split by line
        // 2. Each line, try to extract. 
        //    Let's assume Tab separated or basic structure: "word  meaning"
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'No content' });

        const lines = text.split('\n').filter(l => l.trim());
        const createdWords = [];

        for (const line of lines) {
            // Very basic parser: First word is English, rest is meaning.
            // Improve: Check for phonetic in []
            let word = '', phonetic = '', meaning = '', example = '';

            const parts = line.trim().split(/\s+/);
            if (parts.length > 0) {
                word = parts[0];
                const rest = parts.slice(1).join(' ');
                // Check if rest contains phonetic
                const phoneticMatch = rest.match(/\[(.*?)\]/);
                if (phoneticMatch) {
                    phonetic = `[${phoneticMatch[1]}]`;
                    meaning = rest.replace(phonetic, '').trim();
                } else {
                    meaning = rest;
                }
            }

            if (word) {
                const w = await prisma.word.create({
                    data: {
                        word,
                        phonetic,
                        meaning,
                        example: '',
                        textbookId: textbookId
                    }
                });
                createdWords.push(w);
            }
        }

        return res.json({ count: createdWords.length, words: createdWords });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
