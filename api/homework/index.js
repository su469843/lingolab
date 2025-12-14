import { prisma } from '../../lib/prisma.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token' });
        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);
        if (!payload) return res.status(401).json({ error: 'Invalid token' });

        // GET Logic
        if (req.method === 'GET') {
            if (user.role === 'TEACHER') {
                const homeworks = await prisma.homework.findMany({
                    where: { teacherId: user.id },
                    include: {
                        records: {
                            include: { student: { select: { name: true, username: true } } }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });
                return res.status(200).json(homeworks);
            } else {
                // STUDENT: Fetch assigned homework records
                // We want to see the Homework details + the user's specific record status
                const records = await prisma.homeworkRecord.findMany({
                    where: { studentId: user.id },
                    include: {
                        homework: true // Include the homework details (title, type, content)
                    },
                    orderBy: { createdAt: 'desc' }
                });
                return res.status(200).json(records);
            }
        }

        // POST: Create new homework
        if (req.method === 'POST') {
            const { title, type, contentIds, deadline } = req.body; // contentIds is JSON string array

            // Find all students for this teacher
            const students = await prisma.user.findMany({
                where: {
                    OR: [
                        { teacherId: user.id },
                        // Find students who are linked via teacherCode lookup (handled by teacherId association in DB actually, but just to be safe let's rely on teacherId which we set during register)
                    ]
                }
            });

            const homework = await prisma.homework.create({
                data: {
                    teacherId: user.id,
                    title,
                    type,
                    contentIds: JSON.stringify(contentIds),
                    deadline: deadline ? new Date(deadline) : null,
                    records: {
                        create: students.map(s => ({
                            studentId: s.id,
                            status: 'PENDING'
                        }))
                    }
                }
            });

            return res.status(201).json(homework);
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Homework API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
