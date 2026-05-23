import express from 'express'
import db from '../db.ts'

const router = express.Router();
router.get("/boundary", async(req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const [temperatureDB]:any = await conn.query(`
            SELECT value FROM rule_conditions
            WHERE field = 'Temperature'
            ORDER BY condition_id DESC
            LIMIT 1
            `)

        const [humidityDB]:any = await conn.query(`
            SELECT value FROM rule_conditions
            WHERE field = 'Humidity'
            ORDER BY condition_id DESC
            LIMIT 1
            `)

        res.status(200).json({
            temperature: temperatureDB[0]?.value ?? 25,
            humidity: humidityDB[0]?.value ?? 25
        })  
    }
    catch(dbErr) {
        console.error("Failed to query boundary", dbErr);
        res.status(500).json({
            message: "Internal server error"
        })
    }

    finally{
        if (conn) {
            conn.release();
        }
    }
})

export default router