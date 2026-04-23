import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/light', async (req, res) => {
    const { status } = req.body;
    const aioKey = process.env.VITE_AIO_KEY;
    console.log('Received light status:', status);
    await fetch("https://io.adafruit.com/api/v2/KenElem/feeds/button-led/data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': aioKey as string
        },
        body: JSON.stringify({ value: status ? 1 : 0 }),
    });

    let lightPinMode: number = 0;
    if (status == true) {
        lightPinMode = 1;
    }
    else {
        lightPinMode = 0;
    }
    res.send(lightPinMode.toString());
});

export default router;