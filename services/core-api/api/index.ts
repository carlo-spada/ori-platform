/**
 * Vercel Serverless Function Entry Point
 *
 * This file wraps the Express app for Vercel's serverless environment
 */

import app from '../src/index.js'

// Export the Express app directly - Vercel's @vercel/node handles Express apps natively
export default app
