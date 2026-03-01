import { useState } from 'react'
import { Search, CheckCircle2, XCircle, Eye, FileText, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/utils/cn'

type TabType = 'pending' | 'approved' | 'rejected'

const mockTechnicians = {
    pending: [
        { id: '1', name: 'Suresh Patel', phone: '+91 98765 43210', skill: 'Electrician', submitted: '2026-02-24', docs: 3 },
        { id: '2', name: 'Ganesh Murugan', phone: '+91 87654 32109', skill: 'Plumber', submitted: '2026-02-23', docs: 4 },
        { id: '3', name: 'Lakshmi Krishnan', phone: '+91 76543 21098', skill: 'AC Technician', submitted: '2026-02-22', docs: 3 },
    ],
    approved: [
        { id: '4', name: 'Rajesh Kumar', phone: '+91 98765 12345', skill: 'Electrician', submitted: '2026-02-15', docs: 3, rating: 4.8, jobs: 156 },
        { id: '5', name: 'Arun Sharma', phone: '+91 87654 12345', skill: 'Plumber', submitted: '2026-02-10', docs: 4, rating: 4.5, jobs: 89 },
    ],
    rejected: [
        { id: '6', name: 'Karthik S.', phone: '+91 76543 12345', skill: 'Painter', submitted: '2026-02-18', docs: 2, reason: 'Incomplete documents' },
    ],
}

export default function AdminTechniciansPage() {
    const [activeTab, setActiveTab] = useState<TabType>('pending')
    const [search, setSearch] = useState('')

    const tabs: { key: TabType; label: string; count: number }[] = [
        { key: 'pending', label: 'Pending KYC', count: mockTechnicians.pending.length },
        { key: 'approved', label: 'Approved', count: mockTechnicians.approved.length },
        { key: 'rejected', label: 'Rejected', count: mockTechnicians.rejected.length },
    ]

    const techs = mockTechnicians[activeTab].filter((t) =>
        !search || t.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Technician Management</h1>
                <p className="text-muted-foreground">Review and manage technician applications</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search technicians..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-muted p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                            activeTab === tab.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs',
                            activeTab === tab.key
                                ? tab.key === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-primary/10 text-primary'
                                : 'bg-muted-foreground/10'
                        )}>{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {techs.map((tech) => (
                    <Card key={tech.id} className="border-0 shadow-card">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {tech.name.split(' ').map((n) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{tech.name}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <Badge variant="secondary" className="text-[10px]">{tech.skill}</Badge>
                                            <span>{tech.phone}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tech.submitted}</span>
                                        </div>
                                        {'rating' in tech && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                ⭐ {(tech as any).rating} · {(tech as any).jobs} jobs completed
                                            </p>
                                        )}
                                        {'reason' in tech && (
                                            <p className="mt-1 text-xs text-red-500">Reason: {(tech as any).reason}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="gap-1.5">
                                        <Eye className="h-3.5 w-3.5" /> View
                                    </Button>
                                    {activeTab === 'pending' && (
                                        <>
                                            <Button variant="destructive" size="sm" className="gap-1.5">
                                                <XCircle className="h-3.5 w-3.5" /> Reject
                                            </Button>
                                            <Button size="sm" className="gap-1.5">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {techs.length === 0 && (
                <div className="py-16 text-center">
                    <p className="text-lg font-medium text-muted-foreground">No technicians found</p>
                </div>
            )}
        </div>
    )
}
