import express from 'express'
import type {Request, Response} from 'express'
import path from 'path'
import sensorRoutes from './routes/sensorRoutes.ts'
import login from './routes/login.ts';
import fan from './routes/fan.ts';
import light from './routes/light.ts';
import signal from './routes/signal.ts';
import cors from 'cors';
import security from './routes/security.ts';
import register from './routes/register.ts';
import notifications from './routes/notifications.ts'
import boundary from './routes/boundary.ts'
import camera from './routes/camnotify.ts'

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', sensorRoutes);
app.use('/api', login);
app.use('/api', fan);
app.use('/api', light);
app.use('/api', signal);
app.use('/api', security);
app.use('/api', register);
app.use('/api', notifications)
app.use('/api', boundary)
app.use(
  '/api/camera',
  express.static(
    path.join(process.cwd(), 'src/face')
  )
)
app.get('/', (req: Request, res: Response) => {
    res.send("Hello IOT project!");
})


    
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
})