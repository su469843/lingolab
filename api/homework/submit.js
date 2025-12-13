import { prisma } from '../../lib/prisma.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token' });
        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);
        if (!payload) return res.status(401).json({ error: 'Invalid token' });

        const { recordId, score } = req.body;

        const record = await prisma.homeworkRecord.findUnique({
            where: { id: recordId }
        });

        if (!record || record.studentId !== payload.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updated = await prisma.homeworkRecord.update({
            where: { id: recordId },
            data: {
                status: 'COMPLETED',
                score: score || null,
                completedAt: new Date()
            }
        });

        return res.status(200).json(updated);

    } catch (error) {
        console.error('Homework Submit API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
