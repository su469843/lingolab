import { prisma } from '../../lib/prisma.js';
import { hashPassword, signToken } from '../../lib/auth.js';

import crypto from 'crypto';

const generateTeacherCode = () => {
    // 3 bytes = 6 hex chars, take 5. Sufficiently random for this use case.
    // Or use custom alphabet for 'lowercase + numbers'
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.randomBytes(5);
    let code = '';
    for (let i = 0; i < 5; i++) {
        const index = randomBytes[i] % chars.length;
        code += chars[index];
    }
    return code;
};

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password, role, name, teacherCode, orgCode } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check existing
        const existing = await prisma.user.findUnique({
            where: { username }
        });

        if (existing) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await hashPassword(password);

        // Validate Role
        const validRoles = ['STUDENT', 'TEACHER', 'VISITOR'];
        const userRole = validRoles.includes(role) ? role : 'VISITOR';

        let finalTeacherId = null;
        let finalTeacherCode = null;

        // Teacher Logic
        if (userRole === 'TEACHER') {
            const ENV_ORG_CODE = process.env.ORG_CODE || '123456'; // Default fallback
            if (orgCode !== ENV_ORG_CODE) {
                return res.status(403).json({ error: 'Invalid Organization Code' });
            }
            // Generate unique teacher code
            let isUnique = false;
            while (!isUnique) {
                finalTeacherCode = generateTeacherCode();
                const check = await prisma.user.findUnique({ where: { teacherCode: finalTeacherCode } });
                if (!check) isUnique = true;
            }
        }

        // Student Logic
        if (userRole === 'STUDENT' && teacherCode) {
            const teacher = await prisma.user.findUnique({
                where: { teacherCode: teacherCode }
            });
            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found with that code' });
            }
            finalTeacherId = teacher.id;
        }

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: userRole,
                name: name || username,
                teacherId: finalTeacherId,
                teacherCode: finalTeacherCode
            }
        });

        const token = signToken(user.id);

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                teacherCode: user.teacherCode
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
