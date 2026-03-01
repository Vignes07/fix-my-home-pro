import { Users, CalendarCheck, DollarSign, TrendingUp, Clock, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
    { label: 'Total Users', value: '3,245', icon: Users, change: '+120 this week' },
    { label: 'Active Bookings', value: '47', icon: CalendarCheck, change: '12 pending approval' },
    { label: 'Revenue (MTD)', value: '₹4,35,000', icon: DollarSign, change: '+18% vs last month' },
    { label: 'Technicians', value: '89', icon: TrendingUp, change: '7 pending KYC' },
]

const pendingApprovals = [
    { id: '1', name: 'Suresh P.', skill: 'Electrician', submitted: '2026-02-24', docs: 3 },
    { id: '2', name: 'Ganesh M.', skill: 'Plumber', submitted: '2026-02-23', docs: 4 },
    { id: '3', name: 'Lakshmi K.', skill: 'AC Technician', submitted: '2026-02-22', docs: 3 },
]

export default function AdminDashboard() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Platform overview and management</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
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
                            Pending KYC Approvals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingApprovals.map((tech) => (
                                <div
                                    key={tech.id}
                                    className="flex items-center justify-between rounded-lg border border-border p-4"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">{tech.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Badge variant="secondary" className="text-[10px]">{tech.skill}</Badge>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {tech.submitted}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="warning">{tech.docs} docs</Badge>
                                </div>
                            ))}
                        </div>
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
                                <BarChart3 className="mx-auto mb-2 h-10 w-10 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">Chart visualization</p>
                                <p className="text-xs text-muted-foreground">Will be integrated with Recharts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
