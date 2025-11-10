import { Router, type Router as RouterType } from 'express'
import { z } from 'zod'
import { supabase } from '../lib/supabase.js'

const router: RouterType = Router()

// Validation schema
const betaTesterSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  source: z.enum(['signup', 'login', 'landing']).default('signup'),
})

/**
 * POST /api/v1/beta-testers
 * Captures email for beta testing waitlist
 * Public endpoint - no auth required
 */
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validatedData = betaTesterSchema.parse(req.body)

    // Insert into beta_testers table
    const { data, error } = await supabase
      .from('beta_testers')
      .insert({
        email: validatedData.email,
        first_name: validatedData.firstName,
        source: validatedData.source,
      })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return res.status(200).json({
          message: 'Email already registered for beta access',
          alreadyExists: true,
        })
      }

      console.error('Error inserting beta tester:', error)
      return res.status(500).json({ error: 'Failed to register for beta' })
    }

    return res.status(201).json({
      message: 'Successfully registered for beta access',
      data,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      })
    }

    console.error('Unexpected error registering beta tester:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
