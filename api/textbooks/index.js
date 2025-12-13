import { prisma } from '../../lib/prisma.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token' });
        const payload = verifyToken(authHeader.split(' ')[1]);
        if (!payload) return res.status(401).json({ error: 'Invalid token' });

        const userId = payload.userId;

        // GET: List Textbooks (for teacher: my books; for student: my teacher's books)
        if (req.method === 'GET') {
             const user = await prisma.user.findUnique({ where: { id: userId } });
             let targetTeacherId = userId;

             if (user.role === 'STUDENT') {
                 if (!user.teacherId) return res.json([]);
                 targetTeacherId = user.teacherId;
             }

             const books = await prisma.textbook.findMany({
                 where: { teacherId: targetTeacherId },
                 include: { _count: { select: { words: true } } },
                 orderBy: { createdAt: 'desc' }
             });
             return res.json(books);
        }

        // POST: Create Textbook (Teacher only)
        if (req.method === 'POST') {
             const user = await prisma.user.findUnique({ where: { id: userId } });
             if (user.role !== 'TEACHER') return res.status(403).json({ error: 'Only teachers can create books' });

             const { title, description } = req.body;
             if (!title) return res.status(400).json({ error: 'Title required' });

             const book = await prisma.textbook.create({
                 data: {
                     title,
                     description,
                     teacherId: userId
                 }
             });
             return res.json(book);
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}
