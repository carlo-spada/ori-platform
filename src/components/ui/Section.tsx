import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Section wrapper component
 * Provides consistent max-width and padding for landing page sections
 */
export interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  /**
   * Optional data-testid for testing
   */
  'data-testid'?: string
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20',
          className,
        )}
        {...props}
      >
        {children}
      </section>
    )
  },
)

Section.displayName = 'Section'
