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
            // Get all sentences
            const sentences = await prisma.sentence.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.status(200).json(sentences);
        }

        if (req.method === 'POST') {
            // Create new sentence
            const { text, translation } = req.body;
            const newSentence = await prisma.sentence.create({
                data: { text, translation }
            });
            return res.status(201).json(newSentence);
        }

        if (req.method === 'DELETE') {
            // Delete sentence by ID
            const { id } = req.query;
            await prisma.sentence.delete({
                where: { id: parseInt(id) }
            });
            return res.status(200).json({ message: 'Sentence deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
