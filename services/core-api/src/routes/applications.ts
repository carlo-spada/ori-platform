import { Router, type Router as RouterType } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { validateRequest } from '../middleware/validation.js';
import { AuthRequest } from '../middleware/auth.js';

const router: RouterType = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for creating application
const createApplicationSchema = z.object({
  userId: z.string().uuid(),
  jobId: z.string().uuid(),
  status: z.enum(['saved', 'applied', 'interviewing', 'offer', 'rejected']).default('saved')
});

// GET /api/applications/:userId - Get user's applications
router.get('/:userId', async (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;
    
    // Validate user can only view their own applications
    if (req.user?.id !== userId) {
      return res.status(403).json({ error: 'Forbidden - Can only view your own applications' });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ applications });
  } catch (error) {
    return next(error);
  }
});

// POST /api/applications - Create new application
router.post('/', validateRequest(createApplicationSchema), async (req: AuthRequest, res, next) => {
  try {
    const { userId, jobId, status } = req.body;
    
    // Validate user can only create applications for themselves
    if (req.user?.id !== userId) {
      return res.status(403).json({ error: 'Forbidden - Can only create applications for yourself' });
    }

    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        job_id: jobId,
        status,
        applied: status === 'applied'
      })
      .select()
      .single();

    if (error) throw error;

    return res.json({ application });
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/applications/:id - Update application status
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // First verify the application belongs to the user
    const { data: existingApp } = await supabase
      .from('applications')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (!existingApp || existingApp.user_id !== req.user?.id) {
      return res.status(403).json({ error: 'Forbidden - Can only update your own applications' });
    }

    const { data: application, error } = await supabase
      .from('applications')
      .update({
        status,
        applied: status === 'applied'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.json({ application });
  } catch (error) {
    return next(error);
  }
});

export { router as applicationRoutes };