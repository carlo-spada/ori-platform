'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Bug, MessageSquare, Rocket, Mail } from 'lucide-react'
import { useSubmitBetaTester } from '@/hooks/useBetaTesters'
import { toast } from 'sonner'

interface BetaWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: (email: string) => void
  defaultEmail?: string
}

export function BetaWarningModal({
  isOpen,
  onClose,
  onProceed,
  defaultEmail = '',
}: BetaWarningModalProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState(defaultEmail)
  const [firstName, setFirstName] = useState('')
  const { mutate: submitBetaTester, isPending } = useSubmitBetaTester()

  const handleProceed = async () => {
    if (!email) {
      toast.error(t('betaWarning.errors.emailRequired'))
      return
    }

    // Submit to beta testers list
    submitBetaTester(
      {
        email,
        firstName: firstName || undefined,
        source: 'signup',
      },
      {
        onSuccess: () => {
          // Proceed with signup
          onProceed(email)
        },
        onError: (error) => {
          console.error('Failed to submit beta tester:', error)
          // Still proceed with signup even if beta submission fails
          toast.warning('Continuing with signup...')
          onProceed(email)
        },
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Rocket className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">{t('betaWarning.title')}</DialogTitle>
              <DialogDescription>
                {t('betaWarning.subtitle')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  {t('betaWarning.warning.title')}
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t('betaWarning.warning.message')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">{t('betaWarning.expectations.title')}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Bug className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{t('betaWarning.expectations.bugs')}</span>
              </li>
              <li className="flex gap-2">
                <Rocket className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{t('betaWarning.expectations.newFeatures')}</span>
              </li>
              <li className="flex gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{t('betaWarning.expectations.feedback')}</span>
              </li>
            </ul>
          </div>

          {/* Email capture form */}
          <div className="space-y-4 rounded-lg border bg-card p-4">
            <p className="text-sm font-medium">
              {t('betaWarning.community.title')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('betaWarning.community.message')}
            </p>

            <div className="space-y-3">
              <div>
                <Label htmlFor="beta-first-name" className="text-xs">
                  {t('betaWarning.community.firstNameLabel')}
                </Label>
                <Input
                  id="beta-first-name"
                  type="text"
                  placeholder={t('betaWarning.community.firstNamePlaceholder')}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isPending}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="beta-email" className="text-xs">
                  {t('betaWarning.community.emailLabel')}
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="beta-email"
                    type="email"
                    placeholder={t('betaWarning.community.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {t('betaWarning.actions.cancel')}
          </Button>
          <Button
            onClick={handleProceed}
            disabled={isPending || !email}
            className="w-full sm:w-auto"
          >
            {isPending ? t('betaWarning.actions.joining') : t('betaWarning.actions.proceed')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
