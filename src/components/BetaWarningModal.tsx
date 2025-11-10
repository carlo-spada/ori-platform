'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Bug, MessageSquare, Rocket } from 'lucide-react'

interface BetaWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

export function BetaWarningModal({
  isOpen,
  onClose,
  onProceed,
}: BetaWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Rocket className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">Welcome to Ori Beta</DialogTitle>
              <DialogDescription>
                You're joining us in the early stages
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
                  We're still in active development
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Not all features are fully functional yet. You may encounter
                  bugs, incomplete features, or unexpected behavior as we
                  continue building.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">What to expect:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Bug className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Some features may not work as expected</span>
              </li>
              <li className="flex gap-2">
                <Rocket className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>New features and improvements added regularly</span>
              </li>
              <li className="flex gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Your feedback helps us improve faster</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="mb-2 text-sm font-medium">Help us improve</p>
            <p className="text-sm text-muted-foreground">
              Encountered a bug or have a suggestion? We'd love to hear from
              you! Reach out through the feedback button in your dashboard or
              email us directly.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Maybe later
          </Button>
          <Button onClick={onProceed} className="w-full sm:w-auto">
            I understand, let's go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
