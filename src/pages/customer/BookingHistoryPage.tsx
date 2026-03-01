import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge'
import type { BookingStatus } from '@/types/booking.types'

const mockBookings = [
    { id: '1', service: 'AC Regular Service', status: 'completed' as BookingStatus, date: '2026-02-20', time: '10:00 AM', address: '12A, Green Park, Chennai', price: 399 },
    { id: '2', service: 'Tap Repair', status: 'in_progress' as BookingStatus, date: '2026-02-25', time: '02:00 PM', address: '45, Anna Nagar, Chennai', price: 199 },
    { id: '3', service: 'Wiring & Rewiring', status: 'pending' as BookingStatus, date: '2026-02-26', time: '11:00 AM', address: '78, T Nagar, Chennai', price: 499 },
    { id: '4', service: 'Wall Painting', status: 'cancelled' as BookingStatus, date: '2026-02-18', time: '09:00 AM', address: '23, Velachery, Chennai', price: 1999 },
]

export default function BookingHistoryPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h1 className="mb-2 text-2xl font-bold">My Bookings</h1>
            <p className="mb-8 text-muted-foreground">View and manage your service bookings</p>

            <div className="space-y-4">
                {mockBookings.map((booking) => (
                    <Link key={booking.id} to={`/booking/${booking.id}/tracking`}>
                        <Card className="group cursor-pointer border-0 shadow-card transition-all hover:shadow-elevated">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                {booking.service}
                                            </h3>
                                            <BookingStatusBadge status={booking.status} />
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <CalendarDays className="h-3.5 w-3.5" /> {booking.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" /> {booking.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" /> {booking.address}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">₹{booking.price}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
