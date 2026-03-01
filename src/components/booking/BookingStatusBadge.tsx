import { Badge } from '@/components/ui/badge'
import type { BookingStatus } from '@/types/booking.types'

const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
    pending: { label: 'Pending', variant: 'warning' },
    accepted: { label: 'Accepted', variant: 'info' },
    technician_assigned: { label: 'Assigned', variant: 'info' },
    in_progress: { label: 'In Progress', variant: 'default' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
    payment_pending: { label: 'Payment Pending', variant: 'warning' },
}

interface BookingStatusBadgeProps {
    status: BookingStatus
    className?: string
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
    const config = statusConfig[status] || { label: status, variant: 'secondary' as const }
    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    )
}
