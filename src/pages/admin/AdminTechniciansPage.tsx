import { useState, useEffect } from 'react'
import { Users, Clock, Search, CheckCircle2, XCircle, CalendarDays, FileText, Loader2 } from 'lucide-react'
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

    const handleAction = async (id: string, status: string) => {
        setUpdatingId(id)
        try {
            await api.patch(`/technicians/admin/${id}/status`, { approval_status: status })
            fetchApplications()
        } catch (err) {
            console.error('Failed to update:', err)
        } finally {
            setUpdatingId(null)
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
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
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
                                                    onClick={() => handleAction(app.id, 'interview_scheduled')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    <CalendarDays className="h-4 w-4 mr-1" /> Schedule Interview
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => handleAction(app.id, 'approved')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleAction(app.id, 'rejected')}
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
                                                    onClick={() => handleAction(app.id, 'approved')}
                                                    disabled={updatingId === app.id}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleAction(app.id, 'rejected')}
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
        </div>
    )
}
