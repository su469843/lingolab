import { prisma } from '../../lib/prisma.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const today = new Date().toISOString().split('T')[0];

        // Get Top 10 for Words
        const wordLeaderboard = await prisma.dailyStat.findMany({
            where: { date: today, wordCount: { gt: 0 } },
            orderBy: { wordCount: 'desc' },
            take: 10,
            include: { user: { select: { id: true, name: true, username: true } } }
        });

        // Get Top 10 for Phonetics
        const phoneticLeaderboard = await prisma.dailyStat.findMany({
            where: { date: today, phoneticCount: { gt: 0 } },
            orderBy: { phoneticCount: 'desc' },
            take: 10,
            include: { user: { select: { id: true, name: true, username: true } } }
        });

        return res.json({
            date: today,
            wordLeaderboard: wordLeaderboard.map(s => ({
                userId: s.userId,
                name: s.user.name || s.user.username,
                count: s.wordCount
            })),
            phoneticLeaderboard: phoneticLeaderboard.map(s => ({
                userId: s.userId,
                name: s.user.name || s.user.username,
                count: s.phoneticCount
            }))
        });

    } catch (error) {
        console.error('Leaderboard error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
