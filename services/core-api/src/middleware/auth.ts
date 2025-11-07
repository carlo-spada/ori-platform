import { Request, Response, NextFunction } from 'express';
import { createClient, User } from '@supabase/supabase-js';

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Create a new Supabase client for this specific request,
    // authenticated with the user's token. This is the correct pattern
    // for validating a JWT on the server.
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use the service role key for server-side validation
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          persistSession: false,
        }
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};
