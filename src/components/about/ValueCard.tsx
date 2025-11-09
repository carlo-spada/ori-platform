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
        'border-border bg-card/50 hover:border-accent/50 rounded-xl border p-6 transition-all duration-200 hover:shadow-md',
        className,
      )}
      {...props}
    >
      <h3 className="text-foreground mb-3 text-xl font-semibold">{name}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
