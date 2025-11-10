/**
 * Vercel Serverless Function Entry Point
 *
 * This file wraps the Express app for Vercel's serverless environment
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import app from '../src/index.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Let Express handle the request
  return app(req, res)
}
