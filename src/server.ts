import express from 'express'
import type {Request, Response} from 'express'
import sensorRoutes from './routes/sensorRoutes.ts'
import login from './routes/login.ts';
import fan from './routes/fan.ts';
import light from './routes/light.ts';
import tempSignal from './routes/signal.ts';
import cors from 'cors';
import security from './routes/security.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', sensorRoutes);
app.use('/api', login);
app.use('/api', fan);
app.use('/api', light);
app.use('/api', tempSignal);
app.use('/api', security);
app.get('/', (req: Request, res: Response) => {
    res.send("Hello IOT project!");
})


    
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})