import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { validateRequest } from '../middleware/validation.js'
import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'

const router: RouterType = Router()

// Validation schemas
const createEducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field_of_study: z.string().optional().nullable(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional()
    .nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional().nullable(),
})

const updateEducationSchema = z.object({
  institution: z.string().min(1).optional(),
  degree: z.string().min(1).optional(),
  field_of_study: z.string().optional().nullable(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional()
    .nullable(),
  is_current: z.boolean().optional(),
  description: z.string().optional().nullable(),
})

/**
 * GET /api/v1/education
 * Get all education records for the authenticated user
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  try {
    const { data: education, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', req.user.id)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching education:', error)
      return res.status(500).json({ error: 'Failed to fetch education' })
    }

    return res.status(200).json({ education })
  } catch (error) {
    console.error('Unexpected error fetching education:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/v1/education
 * Create a new education record
 */
router.post(
  '/',
  authMiddleware,
  validateRequest(createEducationSchema),
  async (req: AuthRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    try {
      const {
        institution,
        degree,
        field_of_study,
        start_date,
        end_date,
        is_current,
        description,
      } = req.body

      const { data: educationRecord, error } = await supabase
        .from('education')
        .insert({
          user_id: req.user.id,
          institution,
          degree,
          field_of_study,
          start_date,
          end_date,
          is_current: is_current || false,
          description,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating education:', error)
        return res.status(500).json({ error: 'Failed to create education' })
      }

      return res.status(201).json(educationRecord)
    } catch (error) {
      console.error('Unexpected error creating education:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
)

/**
 * PUT /api/v1/education/:id
 * Update an existing education record
 */
router.put(
  '/:id',
  authMiddleware,
  validateRequest(updateEducationSchema),
  async (req: AuthRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    try {
      const { id } = req.params

      // RLS will ensure user can only update their own education
      const { data: educationRecord, error } = await supabase
        .from('education')
        .update(req.body)
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Education not found' })
        }
        console.error('Error updating education:', error)
        return res.status(500).json({ error: 'Failed to update education' })
      }

      return res.status(200).json(educationRecord)
    } catch (error) {
      console.error('Unexpected error updating education:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
)

/**
 * DELETE /api/v1/education/:id
 * Delete an education record
 */
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' })
  }

  try {
    const { id } = req.params

    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id)

    if (error) {
      console.error('Error deleting education:', error)
      return res.status(500).json({ error: 'Failed to delete education' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Unexpected error deleting education:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as educationRoutes }
