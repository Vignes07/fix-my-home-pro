import { useState, useEffect } from 'react'
import { Users, Clock, Search, CheckCircle2, XCircle, CalendarDays, FileText } from 'lucide-react'
import { TechnicianCardSkeleton } from '@/components/common/skeletons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/services/api'

interface TechApplication {
    id: string
    user_id: string
    aadhar_number: string
    pan_number: string
    address: string
    city: string
    state: string
    approval_status: string
    kyc_verified: boolean
    bank_account_holder_name: string
    bank_account_number: string
    bank_ifsc_code: string
    created_at: string
    users: { full_name: string; email: string; phone: string; profile_photo_url?: string }
}

export default function AdminTechniciansPage() {
    const [applications, setApplications] = useState<TechApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('')
    const [search, setSearch] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [detailsModalTech, setDetailsModalTech] = useState<any | null>(null)
    const [actionModal, setActionModal] = useState<{ id: string, action: string } | null>(null)
    const [actionForm, setActionForm] = useState({ interview_date: '', notes: '' })

    useEffect(() => {
        fetchApplications()
    }, [filter])

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const url = filter ? `/technicians/admin/applications?status=${filter}` : '/technicians/admin/applications'
            const res = await api.get(url)
            setApplications(res.data.data || [])
        } catch (err) {
            console.error('Failed to fetch applications:', err)
        } finally {
            setLoading(false)
        }
    }

    const openActionModal = (id: string, action: string) => {
        setActionModal({ id, action })
        setActionForm({ interview_date: '', notes: '' })
    }

    const submitAction = async () => {
        if (!actionModal) return
        setUpdatingId(actionModal.id)
        try {
            await api.patch(`/technicians/admin/${actionModal.id}/status`, {
                approval_status: actionModal.action,
                interview_date: actionForm.interview_date || undefined,
                notes: actionForm.notes || undefined
            })
            fetchApplications()
            setActionModal(null)
        } catch (err) {
            console.error('Failed to update status:', err)
        } finally {
            setUpdatingId(null)
        }
    }

    const fetchTechDetails = async (id: string) => {
        try {
            const res = await api.get(`/technicians/${id}`)
            setDetailsModalTech(res.data.data)
        } catch (err) {
            console.error('Failed to fetch details:', err)
            alert('Failed to load technician details.')
        }
    }

    const filteredApps = applications.filter(app => {
        if (!search) return true
        const name = app.users?.full_name?.toLowerCase() || ''
        const email = app.users?.email?.toLowerCase() || ''
        return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
    })

    const statusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'success'
            case 'rejected': return 'destructive'
            case 'interview_scheduled': return 'warning'
            default: return 'secondary'
        }
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Technician Management</h1>
                    <p className="text-muted-foreground">Review and manage technician applications</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {['', 'pending', 'approved', 'rejected', 'interview_scheduled'].map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status)}
                    >
                        {status ? status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All'}
                    </Button>
                ))}
            </div>

            {loading ? (
                <TechnicianCardSkeleton />
            ) : filteredApps.length === 0 ? (
                <Card className="border-0 shadow-card">
                    <CardContent className="py-12 text-center">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">No technician applications found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredApps.map((app) => (
                        <Card key={app.id} className="border-0 shadow-card">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                {app.users?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{app.users?.full_name || 'Unknown'}</p>
                                                <p className="text-sm text-muted-foreground">{app.users?.email} · {app.users?.phone}</p>
                                            </div>
                                            <Badge variant={statusColor(app.approval_status) as any} className="capitalize ml-2">
                                                {app.approval_status?.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-sm text-primary underline cursor-pointer hover:text-primary/80" onClick={() => fetchTechDetails(app.id)}>
                                            View Full Details
                                        </div>

                                        <div className="grid gap-2 text-sm sm:grid-cols-3">
                                            <div>
                                                <span className="text-muted-foreground">Aadhaar:</span>{' '}
                                                <span className="font-medium">{app.aadhar_number || '—'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">PAN:</span>{' '}
                                                <span className="font-medium">{app.pan_number || '—'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Location:</span>{' '}
                                                <span className="font-medium">{app.city || '—'}, {app.state || '—'}</span>
                                            </div>
                                        </div>

                                        <div className="grid gap-2 text-sm sm:grid-cols-3">
                                            <div>
                                                <span className="text-muted-foreground">Bank:</span>{' '}
                                                <span className="font-medium">{app.bank_account_holder_name || '—'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">A/C:</span>{' '}
                                                <span className="font-medium">{app.bank_account_number || '—'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">IFSC:</span>{' '}
                                                <span className="font-medium">{app.bank_ifsc_code || '—'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            Applied: {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        {app.approval_status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openActionModal(app.id, 'interview_scheduled')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    <CalendarDays className="h-4 w-4 mr-1" /> Schedule Interview
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => openActionModal(app.id, 'approved')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openActionModal(app.id, 'rejected')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                        {app.approval_status === 'interview_scheduled' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => openActionModal(app.id, 'approved')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openActionModal(app.id, 'rejected')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Action Popup Modal */}
            {actionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-background p-6 shadow-2xl animate-fade-in">
                        <h2 className="text-lg font-bold mb-4 capitalize">{actionModal.action.replace('_', ' ')} Technician</h2>

                        {actionModal.action === 'interview_scheduled' && (
                            <div className="space-y-4 mb-4">
                                <label className="block text-sm font-medium">Select Interview Date</label>
                                <Input type="date" value={actionForm.interview_date} onChange={(e) => setActionForm({ ...actionForm, interview_date: e.target.value })} />
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <label className="block text-sm font-medium">Internal Notes (Optional)</label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                                placeholder="E.g., Missing document clarity, interview details..."
                                value={actionForm.notes}
                                onChange={(e) => setActionForm({ ...actionForm, notes: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => setActionModal(null)}>Cancel</Button>
                            <Button className="flex-1" onClick={submitAction} disabled={!!updatingId}>
                                {updatingId ? 'Saving...' : 'Confirm'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail View Modal */}
            {detailsModalTech && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-background p-6 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                                    {detailsModalTech.users?.full_name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{detailsModalTech.users?.full_name}</h2>
                                    <p className="text-sm text-muted-foreground">{detailsModalTech.users?.email} • {detailsModalTech.users?.phone}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setDetailsModalTech(null)}>Close</Button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                            <div className="space-y-4 rounded-lg bg-muted/30 p-4">
                                <h3 className="font-semibold text-primary flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> KYC Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Aadhaar:</span> <span className="font-medium">{detailsModalTech.aadhar_number}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">PAN:</span> <span className="font-medium">{detailsModalTech.pan_number}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Location:</span> <span className="font-medium">{detailsModalTech.city}, {detailsModalTech.state}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Address:</span> <span className="font-medium truncate max-w-[150px]" title={detailsModalTech.address}>{detailsModalTech.address}</span></div>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg bg-muted/30 p-4">
                                <h3 className="font-semibold text-primary flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Bank Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Account Name:</span> <span className="font-medium">{detailsModalTech.bank_account_holder_name}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">A/C Number:</span> <span className="font-medium">{detailsModalTech.bank_account_number}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">IFSC:</span> <span className="font-medium">{detailsModalTech.bank_ifsc_code}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-3 border-b pb-2">Provided Services Structure</h3>
                                {detailsModalTech.technician_services && detailsModalTech.technician_services.length > 0 ? (
                                    <ul className="space-y-2">
                                        {detailsModalTech.technician_services.map((ts: any, i: number) => (
                                            <li key={i} className="flex justify-between items-center rounded-md border p-3 text-sm">
                                                <span>{ts.services?.name} <span className="text-muted-foreground text-xs ml-2">({ts.experience_years}y exp)</span></span>
                                                <span className="font-medium">₹{ts.services?.base_price} base rate</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No specific services defined yet.</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-3 border-b pb-2">Ongoing / Recent Jobs</h3>
                                {detailsModalTech.bookings && detailsModalTech.bookings.length > 0 ? (
                                    <div className="space-y-2">
                                        {detailsModalTech.bookings.map((booking: any) => (
                                            <div key={booking.id} className="flex justify-between items-center rounded-md border p-3 text-sm">
                                                <div>
                                                    <p className="font-medium">Client: {booking.users?.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="mb-1">{booking.status.replace('_', ' ')}</Badge>
                                                    <p className="font-bold">₹{booking.estimated_price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No jobs found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
