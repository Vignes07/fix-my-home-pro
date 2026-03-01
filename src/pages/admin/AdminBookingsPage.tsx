import { useState } from 'react'
import { Search, Calendar, MapPin, Clock, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge'
import type { BookingStatus } from '@/types/booking.types'
import { cn } from '@/utils/cn'

const statusFilters: { key: BookingStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
]

const mockBookings = [
    { id: '1', service: 'AC Regular Service', customer: 'Priya Sharma', technician: 'Rajesh Kumar', date: '2026-02-25', time: '2:00 PM', status: 'in_progress' as BookingStatus, amount: 399, address: 'Green Park, Chennai' },
    { id: '2', service: 'Pipe Leak Fix', customer: 'Arjun Menon', technician: 'Arun Sharma', date: '2026-02-25', time: '4:00 PM', status: 'pending' as BookingStatus, amount: 349, address: 'T Nagar, Chennai' },
    { id: '3', service: 'Wiring & Rewiring', customer: 'Kumar K.', technician: 'Rajesh Kumar', date: '2026-02-24', time: '11:00 AM', status: 'completed' as BookingStatus, amount: 499, address: 'Anna Nagar, Chennai' },
    { id: '4', service: 'Wall Painting', customer: 'Meena R.', technician: 'Unassigned', date: '2026-02-23', time: '9:00 AM', status: 'cancelled' as BookingStatus, amount: 1999, address: 'Velachery, Chennai' },
    { id: '5', service: 'Switch Repair', customer: 'Suresh G.', technician: 'Ganesh M.', date: '2026-02-22', time: '3:00 PM', status: 'completed' as BookingStatus, amount: 149, address: 'Adyar, Chennai' },
]

export default function AdminBookingsPage() {
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
    const [search, setSearch] = useState('')

    const filtered = mockBookings.filter((b) => {
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter
        const matchesSearch = !search || b.service.toLowerCase().includes(search.toLowerCase()) || b.customer.toLowerCase().includes(search.toLowerCase())
        return matchesStatus && matchesSearch
    })

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Booking Management</h1>
                <p className="text-muted-foreground">View and manage all bookings on the platform</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by service or customer..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                        {f.label}
                    </Badge>
                ))}
            </div>

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
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((booking) => (
                                    <tr key={booking.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{booking.service}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.address}</p>
                                        </td>
                                        <td className="px-4 py-3">{booking.customer}</td>
                                        <td className="px-4 py-3">
                                            <span className={booking.technician === 'Unassigned' ? 'text-amber-500' : ''}>
                                                {booking.technician}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{booking.date}</div>
                                            <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{booking.time}</div>
                                        </td>
                                        <td className="px-4 py-3"><BookingStatusBadge status={booking.status} /></td>
                                        <td className="px-4 py-3 text-right font-bold">₹{booking.amount}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
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
        </div>
    )
}
