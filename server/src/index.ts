import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mealdbRouter from './routes/mealdb.js';

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') ?? ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', mealdbRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = Number(process.env.PORT ?? 5174);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
