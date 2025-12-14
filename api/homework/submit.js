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

        const { recordId, score } = req.body;
        if (!recordId) return res.status(400).json({ error: 'Record ID required' });

        // Update record
        const record = await prisma.homeworkRecord.update({
            where: { id: recordId },
            data: {
                status: 'COMPLETED',
                score: score || 0,
                completedAt: new Date()
            }
        });

        return res.json(record);

    } catch (error) {
        console.error('Submit homework error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
