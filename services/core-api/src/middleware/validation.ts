import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

export function validateRequest<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues,
        })
      } else {
        next(error)
      }
    }
  }
}
