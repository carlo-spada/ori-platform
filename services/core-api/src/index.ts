import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import the routers
import { applicationRoutes } from './routes/applications.js';
import { jobRoutes } from './routes/jobs.js';
import { paymentRoutes } from './routes/payments.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Mount API routers
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.listen(port, () => {
  console.log(`[core-api]: Server is running at http://localhost:${port}`);
});
