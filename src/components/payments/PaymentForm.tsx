'use client'

import { useState, useEffect } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import {
  createSetupIntent,
  createSubscription,
} from '@/integrations/api/payments'
import { toast } from 'sonner'

interface PaymentFormProps {
  planId: string
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({ planId, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Create Setup Intent when component mounts
  useEffect(() => {
    const initializePayment = async () => {
      setIsLoading(true)
      try {
        const { clientSecret } = await createSetupIntent(planId)
        setClientSecret(clientSecret)
      } catch (error: unknown) {
        console.error('Error creating setup intent:', error)
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to initialize payment'
        toast.error(message)
        onCancel()
      } finally {
        setIsLoading(false)
      }
    }

    initializePayment()
  }, [planId, onCancel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      // Confirm the Setup Intent
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      })

      if (confirmError) {
        toast.error(confirmError.message || 'Payment failed')
        setIsProcessing(false)
        return
      }

      if (!setupIntent?.payment_method) {
        toast.error('No payment method provided')
        setIsProcessing(false)
        return
      }

      // Create subscription with the payment method
      await createSubscription(planId, setupIntent.payment_method as string)

      toast.success('Subscription created successfully!')
      onSuccess()
    } catch (error: unknown) {
      console.error('Error processing payment:', error)
      const message =
        error instanceof Error ? error.message : 'Failed to create subscription'
      toast.error(message)
      setIsProcessing(false)
    }
  }

  if (isLoading || !clientSecret) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:150ms]" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:300ms]" />
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processing...' : 'Subscribe'}
        </Button>
      </div>
    </form>
  )
}
