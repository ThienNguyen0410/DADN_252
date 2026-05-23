import express from 'express'
import db from '../db.ts'

const router = express.Router();

router.post('/register', async (req, res) => {
    const conn = await (db as any).getConnection();
    try {
        const { username, password} = req.body;

        if (!username?.trim() || !password?.trim()) {
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


        await conn.commit();

        return res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
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