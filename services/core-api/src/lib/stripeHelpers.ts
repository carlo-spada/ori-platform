import { stripe } from './stripe.js'
import { supabase } from './supabase.js'

/**
 * Ensure user has a Stripe customer ID
 * Creates a new customer if one doesn't exist
 *
 * @param userId - Supabase user ID
 * @param email - User's email address
 * @param fullName - Optional user's full name
 * @returns Stripe customer ID
 */
export async function ensureStripeCustomer(
  userId: string,
  email: string,
  fullName?: string,
): Promise<string> {
  // Check if user already has a Stripe customer ID
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  if (profileError) {
    console.error('Error fetching user profile:', profileError)
    throw new Error('Failed to fetch user profile')
  }

  // If customer ID exists, return it
  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id
  }

  // Create new Stripe customer
  try {
    const customer = await stripe.customers.create({
      email,
      name: fullName,
      metadata: {
        supabase_user_id: userId,
      },
    })

    // Save customer ID to database
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        stripe_customer_id: customer.id,
        subscription_status: 'free', // Default to free plan
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error(
        'Error updating user profile with Stripe customer ID:',
        updateError,
      )
      throw new Error('Failed to save Stripe customer ID')
    }

    console.log(`✅ Created Stripe customer for user ${userId}: ${customer.id}`)
    return customer.id
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw new Error('Failed to create Stripe customer')
  }
}

/**
 * Get user's email from Supabase Auth
 *
 * @param userId - Supabase user ID
 * @returns User's email address
 */
export async function getUserEmail(userId: string): Promise<string> {
  const { data, error } = await supabase.auth.admin.getUserById(userId)

  if (error || !data.user) {
    throw new Error('Failed to fetch user email')
  }

  return data.user.email!
}
