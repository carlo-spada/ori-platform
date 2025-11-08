import { useEffect } from 'react'
import FocusTrap from 'focus-trap-react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

/**
 * Accessible modal dialog component with focus trap
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalId = 'modal-title'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <FocusTrap active={isOpen}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalId}
          className={cn(
            'relative z-50 max-h-[90vh] w-full max-w-lg overflow-y-auto',
            'rounded-2xl border border-border bg-card shadow-lg',
            'mx-4',
            className,
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-6">
            <h2 id={modalId} className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-lg p-2 transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </FocusTrap>
    </div>
  )
}
