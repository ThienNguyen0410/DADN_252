import express from 'express'
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/tempSignal', async (req, res) => {
    const { temperature, humidity } = req.body;
    const aioKey = process.env.AIOKEY;
    console.log('Received signal - Temperature:', temperature, 'Humidity:', humidity);
    try {
        await fetch("https://io.adafruit.com/api/v2/KenElem/feeds/tem-upper/data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AIO-Key': aioKey as string
            },
            body: JSON.stringify({ value: temperature }),
        });
        res.json({ success: true, message: 'Signal sent successfully' });
} 
    catch (error) {
        console.error('Error sending signal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router