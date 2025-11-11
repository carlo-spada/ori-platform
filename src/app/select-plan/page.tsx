'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { PaymentForm } from '@/components/payments/PaymentForm'
import { toast } from 'sonner'

type PlanId =
  | 'free'
  | 'plus_monthly'
  | 'plus_yearly'
  | 'premium_monthly'
  | 'premium_yearly'

type BillingInterval = 'monthly' | 'yearly'

export default function SelectPlanPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('free')
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('monthly')
  const [showPayment, setShowPayment] = useState(false)

  const PLANS = {
    free: {
      name: t('selectPlan.plans.free.name'),
      price: { monthly: 0, yearly: 0 },
      features: [
        t('selectPlan.plans.free.features.jobMatching'),
        t('selectPlan.plans.free.features.applications'),
        t('selectPlan.plans.free.features.resumeBuilder'),
        t('selectPlan.plans.free.features.support'),
      ],
    },
    plus: {
      name: t('selectPlan.plans.plus.name'),
      price: { monthly: 5, yearly: 48 },
      features: [
        t('selectPlan.plans.plus.features.unlimitedMatches'),
        t('selectPlan.plans.plus.features.aiResume'),
        t('selectPlan.plans.plus.features.prioritySupport'),
        t('selectPlan.plans.plus.features.analytics'),
        t('selectPlan.plans.plus.features.skillsGap'),
      ],
    },
    premium: {
      name: t('selectPlan.plans.premium.name'),
      price: { monthly: 10, yearly: 96 },
      features: [
        t('selectPlan.plans.premium.features.everythingPlus'),
        t('selectPlan.plans.premium.features.coaching'),
        t('selectPlan.plans.premium.features.workshops'),
        t('selectPlan.plans.premium.features.careerAnalytics'),
        t('selectPlan.plans.premium.features.mentorship'),
      ],
    },
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handlePlanSelect = (plan: PlanId) => {
    setSelectedPlan(plan)
    setShowPayment(plan !== 'free')
  }

  const handleFreePlan = () => {
    // Free plan - proceed directly to onboarding
    router.push('/onboarding')
  }

  const handlePaymentSuccess = () => {
    toast.success(t('selectPlan.success'))
    router.push('/onboarding')
  }

  if (!user) {
    return null // Will redirect
  }

  const getPlanId = (tier: 'plus' | 'premium'): PlanId => {
    return `${tier}_${billingInterval}` as PlanId
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-foreground">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">{t('selectPlan.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('selectPlan.subtitle')}
          </p>
        </div>

        {/* Billing Interval Toggle */}
        {!showPayment && (
          <div className="mb-8 flex items-center justify-center gap-4">
            <span
              className={
                billingInterval === 'monthly'
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground'
              }
            >
              {t('selectPlan.billing.monthly')}
            </span>
            <button
              onClick={() =>
                setBillingInterval(
                  billingInterval === 'monthly' ? 'yearly' : 'monthly',
                )
              }
              className="relative h-8 w-16 rounded-full bg-accent transition-colors"
            >
              <div
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                  billingInterval === 'yearly'
                    ? 'translate-x-9'
                    : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={
                billingInterval === 'yearly'
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground'
              }
            >
              {t('selectPlan.billing.yearly')}{' '}
              <span className="text-sm font-semibold text-accent">
                {t('selectPlan.billing.savePercent')}
              </span>
            </span>
          </div>
        )}

        {!showPayment ? (
          /* Plan Cards */
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div
              className={`relative rounded-2xl border border-border bg-card p-8 ${
                selectedPlan === 'free' ? 'ring-2 ring-accent' : ''
              }`}
            >
              <h3 className="mb-2 text-2xl font-bold">{PLANS.free.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {t('selectPlan.plans.free.price')}
                </span>
                <span className="text-muted-foreground">
                  {t('selectPlan.plans.free.period')}
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {PLANS.free.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleFreePlan}
                variant={selectedPlan === 'free' ? 'default' : 'outline'}
                className="w-full"
              >
                {t('selectPlan.plans.free.cta')}
              </Button>
            </div>

            {/* Plus Plan */}
            <div
              className={`relative rounded-2xl border border-border bg-card p-8 ${
                selectedPlan === 'plus_monthly' ||
                selectedPlan === 'plus_yearly'
                  ? 'ring-2 ring-accent'
                  : ''
              }`}
            >
              <h3 className="mb-2 text-2xl font-bold">{PLANS.plus.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${PLANS.plus.price[billingInterval]}
                </span>
                <span className="text-muted-foreground">
                  /
                  {billingInterval === 'monthly'
                    ? t('selectPlan.month')
                    : t('selectPlan.year')}
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {PLANS.plus.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handlePlanSelect(getPlanId('plus'))}
                className="w-full"
              >
                {t('selectPlan.plans.plus.cta')}
              </Button>
            </div>

            {/* Premium Plan */}
            <div
              className={`relative rounded-2xl border border-border bg-card p-8 ${
                selectedPlan === 'premium_monthly' ||
                selectedPlan === 'premium_yearly'
                  ? 'ring-2 ring-accent'
                  : ''
              }`}
            >
              <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                {t('selectPlan.plans.premium.badge')}
              </div>
              <h3 className="mb-2 text-2xl font-bold">{PLANS.premium.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${PLANS.premium.price[billingInterval]}
                </span>
                <span className="text-muted-foreground">
                  /
                  {billingInterval === 'monthly'
                    ? t('selectPlan.month')
                    : t('selectPlan.year')}
                </span>
              </div>
              <ul className="mb-8 space-y-3">
                {PLANS.premium.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handlePlanSelect(getPlanId('premium'))}
                className="w-full"
              >
                {t('selectPlan.plans.premium.cta')}
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="mx-auto max-w-lg">
            <div className="mb-6 rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-2 text-2xl font-bold">
                {t('selectPlan.payment.title')}
              </h2>
              <p className="mb-6 text-muted-foreground">
                {t('selectPlan.payment.selected')}{' '}
                <span className="font-semibold text-foreground">
                  {selectedPlan.includes('plus')
                    ? t('selectPlan.plans.plus.name')
                    : t('selectPlan.plans.premium.name')}{' '}
                  (
                  {billingInterval === 'monthly'
                    ? t('selectPlan.payment.monthly')
                    : t('selectPlan.payment.yearly')}
                  )
                </span>
              </p>

              <Elements stripe={getStripe()}>
                <PaymentForm
                  planId={selectedPlan}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPayment(false)}
                />
              </Elements>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
