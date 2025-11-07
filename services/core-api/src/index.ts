import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { jobRoutes } from './routes/jobs.js';
import { applicationRoutes } from './routes/applications.js';
import { paymentRoutes } from './routes/payments.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());

// Webhook route BEFORE json middleware (needs raw body)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON middleware for all other routes
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'core-api' });
});

// Webhook route FIRST (no auth, validates Stripe signature)
app.use('/api/payments', paymentRoutes);

// Protected routes (require authentication)
app.use('/api/jobs', authMiddleware, jobRoutes);
app.use('/api/applications', authMiddleware, applicationRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Core API running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});