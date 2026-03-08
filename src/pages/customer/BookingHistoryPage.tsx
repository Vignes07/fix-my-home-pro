import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Loader2, Inbox } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge'
import { useAuthStore } from '@/stores/useAuthStore'
import { api } from '@/services/api'
import type { BookingStatus } from '@/types/booking.types'

interface BookingItem {
    id: string
    booking_date: string
    booking_time: string
    customer_address: string
    estimated_price: number
    status: BookingStatus
    services?: { name: string; base_price: number }
}

export default function BookingHistoryPage() {
    const { user } = useAuthStore()
    const [bookings, setBookings] = useState<BookingItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const res = await api.get(`/bookings?customer_id=${user?.id}`)
            setBookings(res.data.data || [])
        } catch (err) {
            console.error('Failed to fetch bookings:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h1 className="mb-2 text-2xl font-bold">My Bookings</h1>
            <p className="mb-8 text-muted-foreground">View and manage your service bookings</p>

            {bookings.length === 0 ? (
                <Card className="border-0 shadow-card">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Inbox className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-semibold text-muted-foreground">No bookings yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Book a service to get started!</p>
                        <Link
                            to="/services"
                            className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                        >
                            Browse Services
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <Link key={booking.id} to={`/booking/${booking.id}/tracking`}>
                            <Card className="group cursor-pointer border-0 shadow-card transition-all hover:shadow-elevated mb-4">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                    {booking.services?.name || 'Home Service'}
                                                </h3>
                                                <BookingStatusBadge status={booking.status} />
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays className="h-3.5 w-3.5" /> {booking.booking_date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" /> {booking.booking_time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" /> {booking.customer_address}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold">₹{booking.estimated_price}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
