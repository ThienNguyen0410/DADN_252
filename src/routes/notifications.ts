//routes get/notifications
import express from 'express'
import db from '../db.ts'

const router = express.Router();
router.get("/notifications", async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const [result] = await conn.query('SELECT* FROM notifications')
        res.status(200).json(result)
    }
    catch(dbErr) {
        console.error("DB connection failed", dbErr);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
    if (conn) {
        conn.release();
    }
});

router.post("/notifications", async(req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const {field, value, boundValue, action} = req.body;

        await conn.query(`INSERT INTO notifications(field, value, boundValue, action,time)
                        VALUES(?,?,?,?,NOW())`,[field, value, boundValue, action]
        );
        res.status(200).json({
            message: "Ok"
        });
    }
    catch(dbErr) {
        console.error("DB connection failed", dbErr);
        res.status(500).json({
            message: "Internal server error"
        });
    }
    finally{
        if (conn) {
            conn.release();
        }
    }
});

router.delete("/notifications", async(req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        await conn.query("TRUNCATE TABLE notifications;");
        res.status(200).json({
            message:"Ok"
        })
    }
    catch(dbErr) {
        console.error(dbErr);
        res.status(500).json({
            message: "Failed to fetch database"
        });
    }
    finally{
        if (conn) {
            conn.release();
        }
    }
});

export default router