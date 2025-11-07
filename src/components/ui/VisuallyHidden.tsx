import { forwardRef, type ComponentPropsWithoutRef } from 'react';

/**
 * VisuallyHidden component
 * Hides content visually but keeps it accessible to screen readers.
 * Use for skip links, icon button labels, etc.
 */
export const VisuallyHidden = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<'span'>
>(({ children, ...props }, ref) => {
  return (
    <span ref={ref} className="sr-only" {...props}>
      {children}
    </span>
  );
});

VisuallyHidden.displayName = 'VisuallyHidden';
