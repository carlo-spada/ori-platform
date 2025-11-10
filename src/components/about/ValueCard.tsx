import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface ValueCardProps extends ComponentPropsWithoutRef<'div'> {
  name: string
  description: string
}

export function ValueCard({
  name,
  description,
  className,
  ...props
}: ValueCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card/50 p-6 transition-all duration-200 hover:border-accent/50 hover:shadow-md',
        className,
      )}
      {...props}
    >
      <h3 className="mb-3 text-xl font-semibold text-foreground">{name}</h3>
      <p className="leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
