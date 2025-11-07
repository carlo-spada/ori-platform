import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // Use the shared service role client to verify the user token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Token verification failed' });
  }
};
