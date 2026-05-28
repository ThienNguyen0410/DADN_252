import express from 'express'
import db from '../db.ts'
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const [account] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]) as any[];
        if (account.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({ message: 'Login successful', status: "success" });

    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/put/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username?.trim() || !password?.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'Username and new password are required'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE username = ?',
            [password.trim(), username.trim()]
        ) as any[];

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Username not found'
            });
        }

        return res.json({
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

export default router;