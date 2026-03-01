import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Phone, MessageCircle, User, CheckCircle2, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function TechJobDetailPage() {
    const { id } = useParams()

    const job = {
        id,
        service: 'AC Regular Service',
        description: 'Deep cleaning, gas check, filter cleaning, and performance check',
        status: 'pending' as const,
        customer: { name: 'Priya Sharma', phone: '+91 98765 43210', address: '12A, Green Park, Adyar, Chennai - 600020' },
        scheduledDate: '2026-02-25',
        scheduledTime: '2:00 PM',
        amount: 399,
        estimatedDuration: 60,
        notes: 'Split AC in bedroom, last serviced 6 months ago',
    }

    return (
        <div className="animate-fade-in space-y-6">
            <Link to="/technician/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Jobs
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{job.service}</h1>
                    <p className="mt-1 text-muted-foreground">{job.description}</p>
                </div>
                <Badge variant="warning" className="text-sm">Pending</Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Customer Info */}
                <Card className="border-0 shadow-card">
                    <CardContent className="p-5 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Customer</h3>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                                <AvatarFallback className="bg-primary/10 text-primary text-lg">PS</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{job.customer.name}</p>
                                <p className="text-sm text-muted-foreground">{job.customer.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <p className="text-sm">{job.customer.address}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-1.5"><Phone className="h-3.5 w-3.5" /> Call</Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> Chat</Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-1.5"><Navigation className="h-3.5 w-3.5" /> Navigate</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Details */}
                <Card className="border-0 shadow-card">
                    <CardContent className="p-5 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Job Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Schedule</span>
                                <span className="font-medium">{job.scheduledDate} · {job.scheduledTime}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-medium">{job.estimatedDuration} min</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-semibold">Earning</span>
                                <span className="text-xl font-bold text-primary">₹{job.amount}</span>
                            </div>
                        </div>

                        {job.notes && (
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                                <p className="text-xs font-medium text-amber-800 dark:text-amber-200">Customer Notes</p>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{job.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button variant="destructive" className="flex-1" size="lg">Reject Job</Button>
                <Button className="flex-1 gap-2" size="lg">
                    <CheckCircle2 className="h-4 w-4" /> Accept Job
                </Button>
            </div>
        </div>
    )
}
