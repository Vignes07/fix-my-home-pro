import { useState, useEffect } from 'react'
import { Search, Calendar, MapPin, Clock } from 'lucide-react'
import { TableSkeleton } from '@/components/common/skeletons'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge'
import type { BookingStatus } from '@/types/booking.types'
import { cn } from '@/utils/cn'
import { api } from '@/services/api'

const statusFilters: { key: BookingStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
]

interface AdminBooking {
    id: string
    service_name: string
    customer_name: string
    customer_email: string
    technician_name: string
    technician_id?: string | null
    booking_date: string
    booking_time: string
    status: BookingStatus
    amount: number
    customer_address: string
    payment_status: string
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<AdminBooking[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
    const [search, setSearch] = useState('')

    const [reassignModalOpen, setReassignModalOpen] = useState(false)
    const [selectedBookingForReassign, setSelectedBookingForReassign] = useState<string | null>(null)
    const [availableTechs, setAvailableTechs] = useState<any[]>([])
    const [selectedTechId, setSelectedTechId] = useState('')
    const [reassigning, setReassigning] = useState(false)

    useEffect(() => {
        fetchBookings()
    }, [statusFilter])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (statusFilter !== 'all') params.set('status', statusFilter)
            if (search) params.set('search', search)
            const res = await api.get(`/bookings/admin/all?${params.toString()}`)
            setBookings(res.data.data || [])
        } catch (err) {
            console.error('Failed to fetch bookings:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            await api.patch(`/bookings/admin/${bookingId}`, { status: newStatus })
            fetchBookings()
        } catch (err) {
            console.error('Failed to update booking:', err)
        }
    }

    const handleCancel = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return
        try {
            await api.patch(`/bookings/admin/${bookingId}`, {
                status: 'cancelled',
                cancellation_reason: 'Cancelled by admin',
            })
            fetchBookings()
        } catch (err) {
            console.error('Failed to cancel:', err)
        }
    }

    const openReassignModal = async (bookingId: string) => {
        setSelectedBookingForReassign(bookingId)
        setSelectedTechId('')
        setReassignModalOpen(true)
        try {
            const res = await api.get('/technicians')
            setAvailableTechs(res.data.data || [])
        } catch (err) {
            console.error('Failed to fetch technicians:', err)
        }
    }

    const handleReassign = async () => {
        if (!selectedBookingForReassign || !selectedTechId) return
        setReassigning(true)
        try {
            await api.patch(`/bookings/admin/${selectedBookingForReassign}`, {
                technician_id: selectedTechId,
                status: 'technician_assigned'
            })
            setReassignModalOpen(false)
            fetchBookings()
        } catch (err) {
            console.error('Failed to reassign:', err)
            alert('Failed to reassign technician')
        } finally {
            setReassigning(false)
        }
    }

    // Client-side search
    const filtered = bookings.filter(b => {
        if (!search) return true
        const s = search.toLowerCase()
        return b.service_name.toLowerCase().includes(s) || b.customer_name.toLowerCase().includes(s)
    })

    // Status counts
    const counts: Record<string, number> = { all: bookings.length }
    bookings.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1 })

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Booking Management</h1>
                <p className="text-muted-foreground">View and manage all bookings on the platform</p>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by service or customer..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
                    />
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
                {statusFilters.map((f) => (
                    <Badge
                        key={f.key}
                        variant={statusFilter === f.key ? 'default' : 'outline'}
                        className="cursor-pointer px-3 py-1.5 text-sm"
                        onClick={() => setStatusFilter(f.key)}
                    >
                        {f.label} {counts[f.key] !== undefined ? `(${counts[f.key]})` : ''}
                    </Badge>
                ))}
            </div>

            {loading ? (
                <TableSkeleton rows={8} cols={8} />
            ) : (
                <>
                    {/* Bookings Table */}
                    <Card className="border-0 shadow-card overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Service</th>
                                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Technician</th>
                                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date & Time</th>
                                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Payment</th>
                                            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                                            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((booking) => (
                                            <tr key={booking.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium">{booking.service_name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.customer_address || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p>{booking.customer_name}</p>
                                                    <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={booking.technician_name === 'Unassigned' ? 'text-amber-500' : ''}>
                                                        {booking.technician_name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{booking.booking_date}</div>
                                                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{booking.booking_time}</div>
                                                </td>
                                                <td className="px-4 py-3"><BookingStatusBadge status={booking.status} /></td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={booking.payment_status === 'completed' ? 'success' : 'secondary'} className="text-[10px]">
                                                        {booking.payment_status || 'pending'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold">₹{booking.amount}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        {booking.status === 'pending' && (
                                                            <Button size="sm" variant="outline" className="text-xs" onClick={() => handleStatusChange(booking.id, 'accepted')}>
                                                                Accept
                                                            </Button>
                                                        )}
                                                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                            <Button size="sm" variant="destructive" className="text-xs" onClick={() => handleCancel(booking.id)}>
                                                                Cancel
                                                            </Button>
                                                        )}
                                                        {booking.status === 'in_progress' && (
                                                            <Button size="sm" className="text-xs" onClick={() => handleStatusChange(booking.id, 'completed')}>
                                                                Complete
                                                            </Button>
                                                        )}
                                                        {['pending', 'accepted', 'technician_assigned'].includes(booking.status) && (
                                                            <Button size="sm" variant="outline" className="text-xs" onClick={() => openReassignModal(booking.id)}>
                                                                Reassign
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg font-medium text-muted-foreground">No bookings found</p>
                        </div>
                    )}
                </>
            )}

            {/* Reassign Modal */}
            {reassignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow-2xl animate-fade-in">
                        <h2 className="text-lg font-bold mb-4">Reassign Technician</h2>

                        <div className="space-y-4 mb-6">
                            <label className="block text-sm font-medium">Select Approved Technician</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedTechId}
                                onChange={(e) => setSelectedTechId(e.target.value)}
                            >
                                <option value="">Select technician...</option>
                                {availableTechs.map(tech => (
                                    <option key={tech.id} value={tech.id}>{tech.users?.full_name} ({tech.city})</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => setReassignModalOpen(false)}>Cancel</Button>
                            <Button className="flex-1" onClick={handleReassign} disabled={!selectedTechId || reassigning}>
                                {reassigning ? 'Reassigning...' : 'Assign'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
