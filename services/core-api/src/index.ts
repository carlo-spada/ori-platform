import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import the routers
import { applicationRoutes } from './routes/applications.js'
import { dashboardRoutes } from './routes/dashboard.js'
import { experiencesRoutes } from './routes/experiences.js'
import { educationRoutes } from './routes/education.js'
import { jobRoutes } from './routes/jobs.js'
import { paymentRoutes, paymentWebhookRoutes } from './routes/payments.js'
import setupIntentRouter from './routes/setupIntent.js'
import subscriptionsRouter from './routes/subscriptions.js'
import usersRouter from './routes/users.js'
import chatRouter from './routes/chat.js'
import profileRouter from './routes/profile.js'
import { notificationsRouter } from './routes/notifications.js'
import betaTestersRouter from './routes/betaTesters.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).send('OK')
})

// Stripe webhook route needs to be before express.json()
app.use(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentWebhookRoutes,
)

app.use(express.json())

// Mount API routers
app.use('/api/v1/applications', applicationRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/experiences', experiencesRoutes)
app.use('/api/v1/education', educationRoutes)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/jobs', jobRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/setup-intent', setupIntentRouter)
app.use('/api/v1/subscriptions', subscriptionsRouter)
app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/notifications', notificationsRouter)
app.use('/api/v1/beta-testers', betaTestersRouter)

// Export for Vercel serverless
export default app

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`[core-api]: Server is running at http://localhost:${port}`)
  })
}
