import express from 'express'
import dotenv from 'dotenv';
import type{ ResultSetHeader } from 'mysql2';
import db from '../db'
dotenv.config();

const router = express.Router();

router.post('/signal', async (req, res) => {
    try {
        const conn = await db.getConnection();
        const { temperature, humidity } = req.body;

        const [rule] = await conn.query<ResultSetHeader>(`INSERT INTO rules(rules_name, event_type, is_active)
                        VALUES (?,?,?)`,["","OverBound",true]);

        //Insert data to rule_conditions table
        const ruleId = rule.insertId;
        await conn.query(`INSERT INTO rule_conditions(rule_id, field, operator, value)`
                        ,[ruleId, "Temperature", ">", temperature])

        await conn.query(`INSERT INTO rule_conditions(rule_id, filed, operator, value)`
                        ,[ruleId, "Humidity", ">", humidity])

        
        //Insert data to rule_actions table
        await conn.query(`INSERT INTO rule_actions(rule_id, action)`,[ruleId, "Turn on fan"])

        res.status(201).json({
            message: "Set rules successfully",
            ruleId
        })
    } 
    catch (error) {
        console.error('Error sending signal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router
