import express from 'express';
const router = express.Router();

router.post('/fan', async (req, res) => {
    //const { status } = req.body;
    const status = req.body.status;
    const aioKey = process.env.VITE_AIO_KEY;
    console.log('Received fan status:', status);
    await fetch("https://io.adafruit.com/api/v2/KenElem/feeds/button-fan/data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': aioKey as string
        },
        body: JSON.stringify({ value: status ? 1 : 0 }),
    });

    let fanPinMode:Number = 0;
    if (status == true) {
        fanPinMode = 1;
    }
    else {
        fanPinMode = 0;
    }
    res.send(fanPinMode.toString());
});

export default router;