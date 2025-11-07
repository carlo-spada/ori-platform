import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
export interface AuthRequest extends Request {
    user?: User;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.d.ts.map