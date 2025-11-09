'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SubscriptionDetails } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { getSupabaseClient } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/sonner'

interface BillingSettingsProps {
  subscription?: SubscriptionDetails | null
  labels: {
    heading: string
    noSubscriptionMessage: string
    currentPlanLabel: string
    billingCycleLabel: string
    nextBillingLabel: string
    paymentMethodLabel: string
    changePlanLabel: string
    updatePaymentMethodLabel: string
    viewBillingHistoryLabel: string
    cancelSubscriptionLabel: string
  }
}

export function BillingSettings({
  subscription,
  labels,
}: BillingSettingsProps) {
  const supabase = getSupabaseClient()
  const [isPortalLoading, setIsPortalLoading] = useState(false)

  const formatBillingInterval = (interval: 'monthly' | 'annual') => {
    return interval === 'monthly' ? 'Monthly' : 'Annual'
  }

  const handleManageSubscription = async () => {
    if (isPortalLoading) return
    if (!supabase) {
      toast.error('Configuration error', {
        description:
          'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      })
      return
    }
    setIsPortalLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke(
        'customer-portal',
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        },
      )

      if (error) throw error

      if (data?.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url
      } else {
        throw new Error('No portal URL returned')
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      toast.error('Error', {
        description: 'Could not open billing portal. Please try again.',
      })
      setIsPortalLoading(false)
    }
    // Note: We don't reset loading on success because user is being redirected
  }

  const formatNextBilling = (
    date?: string,
    amount?: number,
    currency?: string,
  ) => {
    if (!date || !amount) return 'N/A'
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount)
    return `${formattedAmount} on ${formattedDate}`
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
      <h2 className="text-foreground text-xl font-semibold">
        {labels.heading}
      </h2>

      {!subscription ? (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {labels.noSubscriptionMessage}
          </p>
          <Link href="/pricing">
            <Button variant="default">View plans</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground mb-1">
                {labels.currentPlanLabel}
              </dt>
              <dd className="text-foreground font-medium">
                {subscription.planName}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground mb-1">
                {labels.billingCycleLabel}
              </dt>
              <dd className="text-foreground font-medium">
                {formatBillingInterval(subscription.billingInterval)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground mb-1">
                {labels.nextBillingLabel}
              </dt>
              <dd className="text-foreground font-medium">
                {formatNextBilling(
                  subscription.nextBillingDate,
                  subscription.nextBillingAmount,
                  subscription.currency,
                )}
              </dd>
            </div>
            {subscription.paymentMethodSummary && (
              <div>
                <dt className="text-muted-foreground mb-1">
                  {labels.paymentMethodLabel}
                </dt>
                <dd className="text-foreground font-medium">
                  {subscription.paymentMethodSummary}
                </dd>
              </div>
            )}
          </dl>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isPortalLoading || !supabase}
                className="flex-1"
              >
                {isPortalLoading ? 'Redirecting...' : labels.changePlanLabel}
              </Button>
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isPortalLoading || !supabase}
                className="flex-1"
              >
                {isPortalLoading
                  ? 'Redirecting...'
                  : labels.updatePaymentMethodLabel}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={isPortalLoading || !supabase}
              className="w-full"
            >
              {isPortalLoading
                ? 'Redirecting...'
                : labels.viewBillingHistoryLabel}
            </Button>
            <Button
              variant="ghost"
              onClick={handleManageSubscription}
              disabled={isPortalLoading || !supabase}
              className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              {isPortalLoading
                ? 'Redirecting...'
                : labels.cancelSubscriptionLabel}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
