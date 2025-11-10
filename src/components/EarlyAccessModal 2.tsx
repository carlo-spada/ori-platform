'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/sonner'
import {
  Sparkles,
  Rocket,
  Users,
  TrendingUp,
  Mail,
  CheckCircle,
  ArrowRight,
  Star,
} from 'lucide-react'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'Please enter your first name').optional(),
})

interface EarlyAccessModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: string // 'login' | 'signup' | 'other'
}

export function EarlyAccessModal({
  isOpen,
  onClose,
  trigger = 'other',
}: EarlyAccessModalProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  console.log('EarlyAccessModal rendered, isOpen:', isOpen)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validation = emailSchema.parse({
        email,
        firstName: firstName || undefined,
      })
      setIsSubmitting(true)

      // Here we'll integrate with your email service (SendGrid, Mailchimp, etc.)
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store in localStorage to prevent repeated popups
      localStorage.setItem(
        'ori-early-access',
        JSON.stringify({
          email: validation.email,
          firstName: validation.firstName,
          timestamp: new Date().toISOString(),
        }),
      )

      setIsSuccess(true)

      // Show success toast
      toast.success(t('earlyAccessModal.toast.success'), {
        description: t('earlyAccessModal.toast.successDescription'),
      })

      // Close modal and redirect to landing page after 3 seconds
      setTimeout(() => {
        onClose()
        // Reset for next time
        setTimeout(() => {
          setIsSuccess(false)
          setEmail('')
          setFirstName('')
        }, 500)
        // Redirect to landing page
        router.push('/')
      }, 3000)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message)
      } else {
        toast.error(t('earlyAccessModal.toast.error'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    { icon: Rocket, text: t('earlyAccessModal.benefits.firstAccess') },
    { icon: Users, text: t('earlyAccessModal.benefits.foundingCommunity') },
    { icon: TrendingUp, text: t('earlyAccessModal.benefits.shapeProduct') },
    { icon: Star, text: t('earlyAccessModal.benefits.specialPerks') },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-hidden sm:max-w-xl">
        {!isSuccess ? (
          <>
            {/* Header with gradient background */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

            <DialogHeader className="relative">
              <div className="mb-4 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-60 blur-xl" />
                  <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-2xl font-bold text-transparent sm:text-3xl">
                {t('earlyAccessModal.title')}
              </DialogTitle>

              <DialogDescription className="mt-3 text-center text-base">
                {t('earlyAccessModal.description')}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Benefits list */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm"
                    style={{
                      animation: `fade-in 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <benefit.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t('earlyAccessModal.form.firstNameLabel')}
                  </Label>
                  <Input
                    id="firstName"
                    placeholder={t(
                      'earlyAccessModal.form.firstNamePlaceholder',
                    )}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                    className="transition-all focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('earlyAccessModal.form.emailLabel')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('earlyAccessModal.form.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                      className="pl-10 transition-all focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="group relative w-full overflow-hidden"
                  size="lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('earlyAccessModal.form.submitting')}
                      </>
                    ) : (
                      <>
                        {t('earlyAccessModal.form.submitButton')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  {t('earlyAccessModal.form.disclaimer')}
                </p>
              </form>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="space-y-6 py-8 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20" />
                <div className="relative rounded-full bg-green-500 p-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                {t('earlyAccessModal.success.title')}
              </h3>
              <p className="mx-auto max-w-sm text-muted-foreground">
                {firstName
                  ? t('earlyAccessModal.success.description', {
                      name: ` ${firstName}`,
                    })
                  : t('earlyAccessModal.success.descriptionNoName')}
              </p>
            </div>

            <div className="mx-auto max-w-sm rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium">
                {t('earlyAccessModal.success.nextSteps.title')}
              </p>
              <ul className="space-y-1 text-left text-sm text-muted-foreground">
                <li>• {t('earlyAccessModal.success.nextSteps.checkInbox')}</li>
                <li>• {t('earlyAccessModal.success.nextSteps.followBlog')}</li>
                <li>
                  • {t('earlyAccessModal.success.nextSteps.joinCommunity')}
                </li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
