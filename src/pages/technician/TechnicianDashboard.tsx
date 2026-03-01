import { Briefcase, DollarSign, Star, TrendingUp, CalendarCheck, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
    { label: 'Total Jobs', value: '156', icon: Briefcase, change: '+12 this month' },
    { label: 'Total Earnings', value: '₹87,500', icon: DollarSign, change: '+₹12,300 this month' },
    { label: 'Rating', value: '4.8', icon: Star, change: '350 reviews' },
    { label: 'Completion Rate', value: '96%', icon: TrendingUp, change: '+2% from last month' },
]

const recentJobs = [
    { id: '1', service: 'AC Regular Service', customer: 'Priya S.', date: '2026-02-25', status: 'completed', amount: 399 },
    { id: '2', service: 'Pipe Leak Fix', customer: 'Arun K.', date: '2026-02-25', status: 'in_progress', amount: 349 },
    { id: '3', service: 'Switch Repair', customer: 'Meena R.', date: '2026-02-24', status: 'pending', amount: 149 },
]

export default function TechnicianDashboard() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
            </div>

            {/* Stats Grid */}
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

            {/* Recent Jobs */}
            <Card className="border-0 shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-primary" />
                        Recent Jobs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentJobs.map((job) => (
                            <div
                                key={job.id}
                                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium">{job.service}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{job.customer}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {job.date}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={
                                            job.status === 'completed' ? 'success' :
                                                job.status === 'in_progress' ? 'default' : 'warning'
                                        }
                                    >
                                        {job.status.replace('_', ' ')}
                                    </Badge>
                                    <span className="font-bold">₹{job.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
