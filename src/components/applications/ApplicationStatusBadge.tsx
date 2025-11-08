import { Badge } from '@/components/ui/badge'
import { ApplicationStatus } from '@/lib/types'

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
  labelMap: Record<ApplicationStatus, string>
}

export function ApplicationStatusBadge({
  status,
  labelMap,
}: ApplicationStatusBadgeProps) {
  const getVariant = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return 'secondary' as const
      case 'interviewing':
        return 'default' as const
      case 'offer':
        return 'default' as const
      case 'rejected':
        return 'outline' as const
      case 'paused':
        return 'secondary' as const
      default:
        return 'secondary' as const
    }
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return 'text-muted-foreground'
      case 'interviewing':
        return 'text-accent'
      case 'offer':
        return 'text-accent'
      case 'rejected':
        return 'text-muted-foreground/70'
      case 'paused':
        return 'text-muted-foreground/80'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Badge variant={getVariant(status)} className={getStatusColor(status)}>
      {labelMap[status]}
    </Badge>
  )
}
