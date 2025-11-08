import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error('Error:', err)

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
    })
  }

  if (err.message.includes('JWT')) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'Invalid or expired token',
    })
  }

  // Default error response
  return res.status(500).json({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
  })
}
