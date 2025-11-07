import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare function validateRequest<T extends z.ZodType>(schema: T): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map