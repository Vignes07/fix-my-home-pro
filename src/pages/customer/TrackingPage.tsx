import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, MessageCircle, CheckCircle2, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge'
import { cn } from '@/utils/cn'

const statusTimeline = [
    { status: 'Booking Confirmed', time: '10:30 AM', completed: true },
    { status: 'Technician Assigned', time: '10:32 AM', completed: true },
    { status: 'On the Way', time: '10:45 AM', completed: true },
    { status: 'Arrived', time: '', completed: false },
    { status: 'Service Completed', time: '', completed: false },
]

export default function TrackingPage() {
    const { id } = useParams()

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Track Booking</h1>
                    <p className="text-sm text-muted-foreground">Booking ID: #{id?.slice(0, 8)}</p>
                </div>
                <BookingStatusBadge status="in_progress" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Map Placeholder */}
                <Card className="border-0 shadow-elevated overflow-hidden">
                    <div className="flex h-80 items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                        <div className="text-center">
                            <MapPin className="mx-auto mb-3 h-12 w-12 text-primary opacity-50" />
                            <p className="text-sm font-medium text-muted-foreground">
                                Live map tracking
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Google Maps integration will appear here
                            </p>
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Estimated Arrival</p>
                                <p className="text-lg font-bold text-primary">15 minutes</p>
                            </div>
                            <Badge variant="info">En Route</Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {/* Technician Info */}
                    <Card className="border-0 shadow-elevated">
                        <CardContent className="p-5">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Assigned Technician
                            </h3>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14">
                                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                        RK
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">Rajesh Kumar</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>⭐ 4.8</span>
                                        <span>·</span>
                                        <span>350+ jobs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                                    <Phone className="h-3.5 w-3.5" /> Call
                                </Button>
                                <Link to={`/chat/${id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                                        <MessageCircle className="h-3.5 w-3.5" /> Chat
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Timeline */}
                    <Card className="border-0 shadow-elevated">
                        <CardContent className="p-5">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Status Timeline
                            </h3>
                            <div className="space-y-0">
                                {statusTimeline.map((item, i) => (
                                    <div key={item.status} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                'flex h-7 w-7 items-center justify-center rounded-full',
                                                item.completed ? 'bg-emerald-500' : 'bg-muted'
                                            )}>
                                                {item.completed ? (
                                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                                ) : (
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                )}
                                            </div>
                                            {i < statusTimeline.length - 1 && (
                                                <div className={cn(
                                                    'w-0.5 flex-1 min-h-[32px]',
                                                    item.completed ? 'bg-emerald-500' : 'bg-muted'
                                                )} />
                                            )}
                                        </div>
                                        <div className="pb-6">
                                            <p className={cn('text-sm font-medium', !item.completed && 'text-muted-foreground')}>
                                                {item.status}
                                            </p>
                                            {item.time && (
                                                <p className="text-xs text-muted-foreground">{item.time}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
