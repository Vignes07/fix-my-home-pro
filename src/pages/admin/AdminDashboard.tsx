import { useState, useEffect } from 'react'
import { Users, CalendarCheck, DollarSign, TrendingUp, Clock, BarChart3, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'

interface Stats {
    totalUsers: number
    totalBookings: number
    activeBookings: number
    revenue: number
    totalTechnicians: number
    pendingKyc: number
}

interface TechApplication {
    id: string
    user_id: string
    aadhar_number: string
    pan_number: string
    approval_status: string
    created_at: string
    users: { full_name: string; email: string; phone: string }
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [applications, setApplications] = useState<TechApplication[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [statsRes, appsRes] = await Promise.all([
                api.get('/technicians/admin/stats'),
                api.get('/technicians/admin/applications?status=pending'),
            ])
            setStats(statsRes.data.data)
            setApplications(appsRes.data.data || [])
        } catch (err) {
            console.error('Failed to fetch admin data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleApproval = async (id: string, status: string) => {
        try {
            await api.patch(`/technicians/admin/${id}/status`, { approval_status: status })
            setApplications(prev => prev.filter(a => a.id !== id))
            fetchData() // refresh stats
        } catch (err) {
            console.error('Failed to update status:', err)
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers?.toLocaleString() || '0', icon: Users, change: `${stats?.activeBookings || 0} active bookings` },
        { label: 'Total Bookings', value: stats?.totalBookings?.toLocaleString() || '0', icon: CalendarCheck, change: `${stats?.activeBookings || 0} active` },
        { label: 'Revenue', value: `₹${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, change: 'Total estimated' },
        { label: 'Technicians', value: stats?.totalTechnicians?.toLocaleString() || '0', icon: TrendingUp, change: `${stats?.pendingKyc || 0} pending KYC` },
    ]

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Platform overview and management</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.label} className="border-0 shadow-card">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                                        <p className="mt-1 text-xs text-emerald-600">{stat.change}</p>
                                    </div>
                                    <div className="rounded-xl bg-primary/10 p-3">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Approvals */}
                <Card className="border-0 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Pending KYC Approvals ({applications.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {applications.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No pending applications</p>
                        ) : (
                            <div className="space-y-3">
                                {applications.map((tech) => (
                                    <div
                                        key={tech.id}
                                        className="flex items-center justify-between rounded-lg border border-border p-4"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">{tech.users?.full_name || 'Unknown'}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{tech.users?.email}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {new Date(tech.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => handleApproval(tech.id, 'interview_scheduled')}>
                                                Interview
                                            </Button>
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApproval(tech.id, 'approved')}>
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleApproval(tech.id, 'rejected')}>
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Revenue Chart Placeholder */}
                <Card className="border-0 shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Revenue Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-64 items-center justify-center rounded-xl bg-muted/50">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-primary">₹{(stats?.revenue || 0).toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground mt-2">Total Revenue</p>
                                <p className="text-xs text-muted-foreground mt-1">{stats?.totalBookings || 0} bookings</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
