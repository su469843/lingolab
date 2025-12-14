import { prisma } from '../../lib/prisma.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token' });
        const payload = verifyToken(authHeader.split(' ')[1]);
        if (!payload) return res.status(401).json({ error: 'Invalid token' });

        const { type, count } = req.body; // type: 'word' | 'phonetic', count: number
        if (!count || count <= 0) return res.status(400).json({ error: 'Invalid count' });

        const today = new Date().toISOString().split('T')[0];

        // Upsert daily stat
        const updateData = {};
        if (type === 'word') updateData.wordCount = { increment: count };
        if (type === 'phonetic') updateData.phoneticCount = { increment: count };

        const stat = await prisma.dailyStat.upsert({
            where: {
                userId_date: {
                    userId: payload.userId,
                    date: today
                }
            },
            update: updateData,
            create: {
                userId: payload.userId,
                date: today,
                wordCount: type === 'word' ? count : 0,
                phoneticCount: type === 'phonetic' ? count : 0
            }
        });

        return res.json(stat);

    } catch (error) {
        console.error('Stats record error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
