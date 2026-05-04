import express from 'express'
import db from '../db.ts'

const router = express.Router();

router.post('/register', async (req, res) => {
    const conn = await (db as any).getConnection();
    try {
        const { username, password, avatarUrl, familyMembers } = req.body;

        if (!username?.trim() || !password?.trim() || !avatarUrl?.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'Username, password, and avatar URL are required',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 6 characters',
            });
        }

        const [existing] = await conn.query(
            'SELECT user_id FROM users WHERE username = ?',
            [username.trim()]
        ) as any[];

        if (existing.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'Username already exists',
            });
        }

        await conn.beginTransaction();

        const [userResult] = await conn.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username.trim(), password, 'member']
        ) as any[];

        const userId: number = userResult.insertId;

        const imageRows: [number, string, string][] = [
            [userId, 'owner', avatarUrl.trim()],
        ];

        if (Array.isArray(familyMembers)) {
            for (const member of familyMembers) {
                if (member?.imageUrl?.trim() && member?.name?.trim()) {
                    // Store "relation:name" in the relation column so name info is preserved
                    const relationLabel = `${member.relation || 'member'}:${member.name.trim()}`;
                    imageRows.push([userId, relationLabel, member.imageUrl.trim()]);
                }
            }
        }

        await conn.query(
            'INSERT INTO user_image (user_id, relation, image_url) VALUES ?',
            [imageRows]
        );

        await conn.commit();

        return res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
            userId,
        });

    } catch (error) {
        await conn.rollback();
        console.error('Register error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    } finally {
        conn.release();
    }
});

export default router;