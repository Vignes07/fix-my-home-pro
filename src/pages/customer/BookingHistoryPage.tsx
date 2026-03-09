import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Inbox } from 'lucide-react'
import { BookingCardSkeleton } from '@/components/common/skeletons'
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
    technicians?: { users: { full_name: string; phone: string; profile_photo_url: string } }
}

export default function BookingHistoryPage() {
    const { user } = useAuthStore()
    const [bookings, setBookings] = useState<BookingItem[]>([])
    const [loading, setLoading] = useState(true)

    const [searchLocation, setSearchLocation] = useState('')
    const [searchService, setSearchService] = useState('')
    const [searchTech, setSearchTech] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

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
        return <BookingCardSkeleton />
    }

    const filteredBookings = bookings.filter((b) => {
        if (statusFilter !== 'all' && b.status !== statusFilter) return false
        if (searchLocation && !b.customer_address?.toLowerCase().includes(searchLocation.toLowerCase())) return false
        if (searchService && !b.services?.name.toLowerCase().includes(searchService.toLowerCase())) return false

        const techName = b.technicians?.users?.full_name?.toLowerCase() || ''
        if (searchTech && !techName.includes(searchTech.toLowerCase())) return false

        return true
    })

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
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <input
                            type="text"
                            placeholder="Filter by Location"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Filter by Service"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={searchService}
                            onChange={(e) => setSearchService(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Filter by Technician"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={searchTech}
                            onChange={(e) => setSearchTech(e.target.value)}
                        />
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="searching">Searching</option>
                            <option value="technician_assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {filteredBookings.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No bookings match your filters.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => (
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
                                                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
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

                                                    <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                                                        {booking.technicians?.users ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary uppercase">
                                                                    {booking.technicians.users.full_name?.charAt(0)}
                                                                </div>
                                                                <span className="font-medium text-foreground">
                                                                    Professional: {booking.technicians.users.full_name}
                                                                </span>
                                                            </div>
                                                        ) : booking.status === 'cancelled' ? (
                                                            <span className="text-muted-foreground italic">Cancelled</span>
                                                        ) : (
                                                            <span className="text-amber-600 font-medium italic animate-pulse">
                                                                Assigning to nearby professional...
                                                            </span>
                                                        )}
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
            )}
        </div>
    )
}
