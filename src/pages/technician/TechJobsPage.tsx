import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Phone, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type TabType = 'available' | 'active' | 'completed'

const mockJobs = {
    available: [
        { id: '1', service: 'AC Regular Service', customer: 'Priya S.', address: '12A, Green Park, Chennai', time: '2:00 PM Today', amount: 399, distance: '2.3 km' },
        { id: '2', service: 'Pipe Leak Fix', customer: 'Arjun M.', address: '45, T Nagar, Chennai', time: '4:00 PM Today', amount: 349, distance: '4.1 km' },
        { id: '3', service: 'Switch & Socket Repair', customer: 'Lakshmi R.', address: '78, Anna Nagar, Chennai', time: '10:00 AM Tomorrow', amount: 149, distance: '5.7 km' },
    ],
    active: [
        { id: '4', service: 'Wiring & Rewiring', customer: 'Kumar K.', address: '23, Velachery, Chennai', time: 'In Progress', amount: 499, distance: '1.2 km' },
    ],
    completed: [
        { id: '5', service: 'Tap Repair', customer: 'Meena P.', address: '90, Adyar, Chennai', time: 'Yesterday 3:00 PM', amount: 199, distance: '3.4 km' },
        { id: '6', service: 'Fan Installation', customer: 'Suresh G.', address: '56, Mylapore, Chennai', time: 'Yesterday 11:00 AM', amount: 199, distance: '2.8 km' },
    ],
}

export default function TechJobsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('available')

    const tabs: { key: TabType; label: string; count: number }[] = [
        { key: 'available', label: 'Available', count: mockJobs.available.length },
        { key: 'active', label: 'Active', count: mockJobs.active.length },
        { key: 'completed', label: 'Completed', count: mockJobs.completed.length },
    ]

    const jobs = mockJobs[activeTab]

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Jobs</h1>
                <p className="text-muted-foreground">Manage your service requests</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-muted p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                            activeTab === tab.key
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs',
                            activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10'
                        )}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Job Cards */}
            <div className="space-y-3">
                {jobs.map((job) => (
                    <Link key={job.id} to={`/technician/jobs/${job.id}`}>
                        <Card className="group cursor-pointer border-0 shadow-card transition-all hover:shadow-elevated">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{job.service}</h3>
                                            <Badge variant={activeTab === 'active' ? 'default' : activeTab === 'completed' ? 'success' : 'info'}>
                                                {activeTab === 'active' ? 'In Progress' : activeTab === 'completed' ? 'Done' : 'New'}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{job.customer}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.time}</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.distance}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{job.address}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-primary">₹{job.amount}</span>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {jobs.length === 0 && (
                <div className="py-16 text-center">
                    <p className="text-lg font-medium text-muted-foreground">No {activeTab} jobs</p>
                </div>
            )}
        </div>
    )
}
