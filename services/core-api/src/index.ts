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

// Add the Stripe webhook route BEFORE the global express.json() middleware.
// This ensures the body is received as a raw buffer for this specific endpoint.
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  (_req, res) => {
    // Assuming the paymentsRouter has a method to handle the verified webhook
    // For now, we just acknowledge receipt. A real implementation would go here.
    console.log('Stripe webhook received.');
    res.status(200).send({ received: true });
  }
);

// This middleware will now apply to all other routes.
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
