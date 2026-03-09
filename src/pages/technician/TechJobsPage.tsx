import { useState, useEffect } from 'react'
import { MapPin, CalendarDays, Clock, CheckCircle2, XCircle, Loader2, Briefcase } from 'lucide-react'
import { JobCardSkeleton } from '@/components/common/skeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/useAuthStore'

interface Job {
    id: string
    booking_date: string
    booking_time: string
    customer_address: string
    estimated_price: number
    status: string
    services?: { name: string; base_price: number }
}

export default function TechJobsPage() {
    const { user } = useAuthStore()
    const [availableJobs, setAvailableJobs] = useState<Job[]>([])
    const [myJobs, setMyJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [respondingId, setRespondingId] = useState<string | null>(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const [availRes, myRes] = await Promise.all([
                api.get('/bookings/available/jobs'),
                api.get(`/bookings?technician_id=${user?.id}`).catch(() => ({ data: { data: [] } })),
            ])
            setAvailableJobs(availRes.data.data || [])
            setMyJobs(myRes.data.data || [])
        } catch (err) {
            console.error('Failed to fetch jobs:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleRespond = async (bookingId: string, action: 'accept' | 'reject') => {
        setRespondingId(bookingId)
        try {
            const res = await api.post(`/bookings/${bookingId}/respond`, {
                technician_id: user?.id,
                action,
            })

            if (res.data.success) {
                if (action === 'accept') {
                    const accepted = availableJobs.find(j => j.id === bookingId)
                    if (accepted) {
                        setMyJobs(prev => [{ ...accepted, status: 'technician_assigned' }, ...prev])
                    }
                }
                setAvailableJobs(prev => prev.filter(j => j.id !== bookingId))
            }
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Failed to respond to job')
        } finally {
            setRespondingId(null)
        }
    }

    if (loading) {
        return <JobCardSkeleton />
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Jobs</h1>
                <p className="text-muted-foreground">Manage your available and assigned jobs</p>
            </div>

            {/* Available Jobs */}
            <div>
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Available Jobs ({availableJobs.length})
                </h2>
                {availableJobs.length === 0 ? (
                    <Card className="border-0 shadow-card">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground">No available jobs right now</p>
                            <p className="text-xs text-muted-foreground mt-1">Check back later for new opportunities</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {availableJobs.map((job) => (
                            <Card key={job.id} className="border-0 shadow-card overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
                                <CardContent className="p-5 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-lg">{job.services?.name || 'Home Service'}</p>
                                            <Badge variant="warning" className="mt-1">New</Badge>
                                        </div>
                                        <p className="text-xl font-bold text-primary">₹{job.estimated_price}</p>
                                    </div>

                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4" />
                                            {job.booking_date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {job.booking_time}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {job.customer_address || 'Address available after accept'}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                            onClick={() => handleRespond(job.id, 'accept')}
                                            disabled={respondingId === job.id}
                                        >
                                            {respondingId === job.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <><CheckCircle2 className="h-4 w-4 mr-1" /> Accept</>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => handleRespond(job.id, 'reject')}
                                            disabled={respondingId === job.id}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* My Assigned Jobs */}
            <div>
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    My Jobs ({myJobs.length})
                </h2>
                {myJobs.length === 0 ? (
                    <Card className="border-0 shadow-card">
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No assigned jobs yet. Accept an available job above!
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {myJobs.map((job) => (
                            <Card key={job.id} className="border-0 shadow-card overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                                <CardContent className="p-5 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <p className="font-semibold">{job.services?.name || 'Home Service'}</p>
                                        <Badge variant="success">{job.status?.replace('_', ' ')}</Badge>
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {job.booking_date} · {job.booking_time}</p>
                                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.customer_address}</p>
                                    </div>
                                    <p className="text-lg font-bold text-primary">₹{job.estimated_price}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
