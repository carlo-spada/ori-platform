import express from 'express'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.js'
import { getSupabaseClient } from '../services/supabase.js'

const router = express.Router()

// Validation schemas
const OnboardingSessionSchema = z.object({
  currentStep: z.number().min(0).max(5),
  completedSteps: z.array(z.number()),
  formData: z.record(z.any()),
  lastSavedAt: z.string().optional(),
})

const ProfileDataSchema = z.object({
  // Identity
  full_name: z.string().max(200).optional(),
  preferred_name: z.string().max(100).optional(),
  profile_photo_url: z.string().url().optional(),

  // Context
  current_status: z.enum(['student', 'professional', 'transitioning', 'exploring']).optional(),
  years_experience: z.number().min(0).max(50).optional(),
  location: z.string().optional(),
  is_remote_open: z.boolean().optional(),

  // Import
  cv_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  imported_data: z.any().optional(),

  // Expertise
  skills: z.array(z.string()).optional(),
  skill_levels: z.record(z.number()).optional(),
  hidden_talents: z.array(z.string()).optional(),

  // Aspirations
  dream_role: z.string().max(200).optional(),
  timeline_months: z.enum([6, 12, 24, 36, 60]).optional(),
  success_metrics: z.any().optional(),
  long_term_vision: z.string().optional(),
  target_roles: z.array(z.string()).optional(),

  // Preferences
  work_styles: z.record(z.number()).optional(),
  culture_values: z.array(z.string()).optional(),
  deal_breakers: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
})

// Save or update onboarding session
router.post('/session', authenticateToken, async (req, res) => {
  try {
    const validatedData = OnboardingSessionSchema.parse(req.body)
    const supabase = getSupabaseClient()

    // Check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('onboarding_sessions')
      .select('id')
      .eq('user_id', req.user.id)
      .is('completed_at', null)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Error other than "no rows"
      throw fetchError
    }

    let sessionData

    if (existingSession) {
      // Update existing session
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .update({
          current_step: validatedData.currentStep,
          completed_steps: validatedData.completedSteps,
          form_data: validatedData.formData,
          last_saved_at: new Date().toISOString(),
        })
        .eq('id', existingSession.id)
        .select()
        .single()

      if (error) throw error
      sessionData = data
    } else {
      // Create new session
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .insert({
          user_id: req.user.id,
          current_step: validatedData.currentStep,
          completed_steps: validatedData.completedSteps,
          form_data: validatedData.formData,
          device_info: req.headers['user-agent'] ? { userAgent: req.headers['user-agent'] } : null,
        })
        .select()
        .single()

      if (error) throw error
      sessionData = data
    }

    // Track analytics event
    await supabase.from('onboarding_analytics').insert({
      session_id: sessionData.id,
      user_id: req.user.id,
      event_type: 'session_saved',
      step_name: `step_${validatedData.currentStep}`,
    })

    res.json(sessionData)
  } catch (error) {
    console.error('Error saving onboarding session:', error)
    res.status(error.status || 500).json({
      error: error.message || 'Failed to save onboarding session',
    })
  }
})

// Get current onboarding session
router.get('/session', authenticateToken, async (req, res) => {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('onboarding_sessions')
      .select('*')
      .eq('user_id', req.user.id)
      .is('completed_at', null)
      .single()

    if (error && error.code === 'PGRST116') {
      // No active session found
      return res.json(null)
    }

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Error fetching onboarding session:', error)
    res.status(error.status || 500).json({
      error: error.message || 'Failed to fetch onboarding session',
    })
  }
})

// Delete/abandon onboarding session
router.delete('/session', authenticateToken, async (req, res) => {
  try {
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('onboarding_sessions')
      .update({
        abandoned_at: new Date().toISOString(),
      })
      .eq('user_id', req.user.id)
      .is('completed_at', null)

    if (error) throw error

    res.json({ message: 'Session cleared' })
  } catch (error) {
    console.error('Error deleting onboarding session:', error)
    res.status(error.status || 500).json({
      error: error.message || 'Failed to delete onboarding session',
    })
  }
})

// Complete onboarding and update profile
router.put('/complete', authenticateToken, async (req, res) => {
  try {
    const validatedData = ProfileDataSchema.parse(req.body)
    const supabase = getSupabaseClient()

    // Start a transaction
    const userId = req.user.id

    // Update user profile with all the new fields
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .update({
        ...validatedData,
        onboarding_completed: true,
        onboarding_version: 2,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (profileError) throw profileError

    // Calculate and update profile completeness
    const completeness = calculateProfileCompleteness(profile)

    const { error: completenessError } = await supabase
      .from('user_profiles')
      .update({
        profile_completeness: completeness,
        features_unlocked: getUnlockedFeatures(completeness),
      })
      .eq('user_id', userId)

    if (completenessError) throw completenessError

    // Mark session as completed
    const { error: sessionError } = await supabase
      .from('onboarding_sessions')
      .update({
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .is('completed_at', null)

    if (sessionError) throw sessionError

    // Track completion analytics
    await supabase.from('onboarding_analytics').insert({
      user_id: userId,
      event_type: 'onboarding_completed',
      total_session_time: 300, // Calculate from session start
    })

    // Create Stripe customer if not exists
    try {
      const { ensureStripeCustomer } = await import('../services/stripe.js')
      await ensureStripeCustomer(
        userId,
        req.user.email,
        validatedData.full_name || validatedData.preferred_name
      )
    } catch (stripeError) {
      console.error('Stripe customer creation failed (non-blocking):', stripeError)
      // Don't fail onboarding if Stripe fails
    }

    res.json({
      ...profile,
      profile_completeness: completeness,
      features_unlocked: getUnlockedFeatures(completeness),
    })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    res.status(error.status || 500).json({
      error: error.message || 'Failed to complete onboarding',
    })
  }
})

// Track analytics events
router.post('/analytics', authenticateToken, async (req, res) => {
  try {
    const { eventType, stepName, fieldName, timeOnStep, oldValue, newValue } = req.body
    const supabase = getSupabaseClient()

    // Get active session
    const { data: session } = await supabase
      .from('onboarding_sessions')
      .select('id')
      .eq('user_id', req.user.id)
      .is('completed_at', null)
      .single()

    if (session) {
      await supabase.from('onboarding_analytics').insert({
        session_id: session.id,
        user_id: req.user.id,
        event_type: eventType,
        step_name: stepName,
        field_name: fieldName,
        time_on_step: timeOnStep,
        old_value: oldValue,
        new_value: newValue,
      })
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    // Don't fail requests due to analytics errors
    res.json({ success: false })
  }
})

// Get skill suggestions based on role
router.get('/skill-suggestions', authenticateToken, async (req, res) => {
  try {
    const { role, experience } = req.query
    const supabase = getSupabaseClient()

    let query = supabase.from('skill_suggestions').select('*')

    if (role) {
      query = query.eq('role', role)
    }

    if (experience) {
      query = query.eq('experience_level', experience)
    }

    const { data, error } = await query.limit(10)

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    console.error('Error fetching skill suggestions:', error)
    res.status(error.status || 500).json({
      error: error.message || 'Failed to fetch skill suggestions',
    })
  }
})

// Helper functions
function calculateProfileCompleteness(profile) {
  let completeness = 0

  // Required fields (60 points)
  if (profile.full_name) completeness += 10
  if (profile.current_status) completeness += 10
  if (profile.location) completeness += 10
  if (profile.years_experience !== null) completeness += 10
  if (profile.skills && profile.skills.length >= 3) completeness += 20

  // Valuable optional fields (30 points)
  if (profile.dream_role) completeness += 5
  if (profile.timeline_months) completeness += 5
  if (profile.long_term_vision) completeness += 5
  if (profile.target_roles && profile.target_roles.length > 0) completeness += 5
  if (profile.cv_url || profile.linkedin_url) completeness += 10

  // Nice to have (10 points)
  if (profile.work_styles) completeness += 5
  if (profile.culture_values && profile.culture_values.length > 0) completeness += 5

  return Math.min(completeness, 100)
}

function getUnlockedFeatures(completeness) {
  const features = []

  if (completeness >= 30) features.push('basic_matching')
  if (completeness >= 50) features.push('ai_recommendations')
  if (completeness >= 70) features.push('premium_insights')
  if (completeness >= 90) features.push('full_access')

  return features
}

export default router