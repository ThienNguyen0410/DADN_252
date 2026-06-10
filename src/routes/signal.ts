import express from 'express'
import dotenv from 'dotenv';
import type{ ResultSetHeader } from 'mysql2';
import db from '../db.ts'
dotenv.config();

const router = express.Router();

router.post('/signal', async (req, res) => {
    let conn;
    try {
        const { temperature, humidity } = req.body;
        const aioKey = process.env.VITE_AIO_KEY;
        await fetch("https://io.adafruit.com/api/v2/KenElem/feeds/tem-upper/data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AIO-Key': aioKey as string
            },
            body: JSON.stringify({ value :temperature}),
        });


        conn = await db.getConnection();

        const [rule] = await conn.query<ResultSetHeader>(`INSERT INTO rules(rule_name, event_type, is_active)
                        VALUES (?,?,?)`,["","OverBound",true]);

        //Insert data to rule_conditions table
        const ruleId = rule.insertId;
        await conn.query(`INSERT INTO rule_conditions(rule_id, field, operator, value) VALUES(?,?,?,?)`
                        ,[ruleId, "Temperature", ">", temperature])

        await conn.query(`INSERT INTO rule_conditions(rule_id, field, operator, value) VALUES(?,?,?,?)`
                        ,[ruleId, "Humidity", ">", humidity])

        
        //Insert data to rule_actions table
        await conn.query(`INSERT INTO rule_actions(rule_id, action) VALUES(?,?)`,
                            [ruleId, "Turn on fan"])

        res.status(201).json({
            message: "Set rules successfully",
            ruleId
        })
    } 
    catch (error) {
        console.error('Error sending signal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally{
        if (conn) conn.release();
    }
})

router.get("/signal", async(req, res) => {
    let conn;
    try {
        conn = await db.getConnection();   
    }
    catch(dbErr) {
        console.error("DB connection failed", dbErr);
        res.status(500).json({
            message: "Internal server error"
        });
    }
    finally{
        if (conn) conn.release();
    }

});

export default router