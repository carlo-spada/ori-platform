import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import the routers
import { applicationRoutes } from './routes/applications.js';
import { jobRoutes } from './routes/jobs.js';
import { paymentRoutes, paymentWebhookRoutes } from './routes/payments.js';
import usersRouter from './routes/users.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Stripe webhook route needs to be before express.json()
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), paymentWebhookRoutes);

app.use(express.json());


// Mount API routers
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/users', usersRouter);

app.listen(port, () => {
  console.log(`[core-api]: Server is running at http://localhost:${port}`);
});
