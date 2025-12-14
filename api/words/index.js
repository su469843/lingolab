import { prisma } from '../../lib/prisma.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Get all words
            const words = await prisma.word.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(words);
        }

        if (req.method === 'POST') {
            // Create new word(s)
            if (Array.isArray(req.body)) {
                const createdWords = await Promise.all(req.body.map(item =>
                    prisma.word.create({
                        data: {
                            word: item.word,
                            phonetic: item.phonetic,
                            meaning: item.meaning,
                            example: item.example
                        }
                    })
                ));
                return res.status(201).json(createdWords);
            }

            const { word, phonetic, meaning, example } = req.body;
            const newWord = await prisma.word.create({
                data: { word, phonetic, meaning, example }
            });
            return res.status(201).json(newWord);
        }

        if (req.method === 'DELETE') {
            // Delete word by ID
            const { id } = req.query;
            await prisma.word.delete({
                where: { id: parseInt(id) }
            });
            return res.status(200).json({ message: 'Word deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
