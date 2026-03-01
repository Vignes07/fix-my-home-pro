import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Star, MapPin, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/utils/format'
import { api } from '@/services/api'
import { apiCache } from '@/utils/cache'
export default function ServiceDetailPage() {
    const { id } = useParams()

    const [service, setService] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchServiceDetail = async () => {
            try {
                const cacheKey = `/services/${id}`
                const cachedData = apiCache.get<any>(cacheKey)

                if (cachedData) {
                    setService(cachedData)
                    setIsLoading(false)
                    return
                }

                const response = await api.get(cacheKey)
                if (response.data?.success) {
                    apiCache.set(cacheKey, response.data.data)
                    setService(response.data.data)
                } else {
                    setError('Service not found')
                }
            } catch (err) {
                console.error('Error fetching service details', err)
                setError('Failed to load service details')
            } finally {
                setIsLoading(false)
            }
        }
        if (id) {
            fetchServiceDetail()
        }
    }, [id])

    if (isLoading) {
        return <div className="py-20 text-center animate-pulse">Loading Service Details...</div>
    }

    if (error || !service) {
        return <div className="py-20 text-center text-red-500">{error || 'Service not found'}</div>
    }

    // Default includes if backend does not provide them as an array
    const includes = Array.isArray(service.includes)
        ? service.includes
        : [
            'Professional service delivery',
            'Experienced technicians',
            'Quality assurance',
            'Safety protocols followed'
        ];

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            {/* Back */}
            <Link to="/services" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Services
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <Badge variant="secondary" className="mb-3">{service.categoryName}</Badge>
                        <h1 className="text-3xl font-bold">{service.name}</h1>
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                {service.rating || 4.5} ({(service.totalReviews || 0).toLocaleString()} reviews)
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {service.estimated_duration} minutes
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">About this service</h2>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>

                    {/* What's Included */}
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">What&apos;s included</h2>
                        <ul className="space-y-2.5">
                            {includes.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    <span className="text-sm">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium">Verified Professionals</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium">Service at Doorstep</span>
                        </div>
                    </div>
                </div>

                {/* Booking Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20 border-0 shadow-elevated">
                        <div className="h-1.5 rounded-t-xl bg-gradient-to-r from-primary to-accent" />
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Starting at</p>
                                <p className="text-3xl font-bold text-primary">{formatPrice(service.base_price)}</p>
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Base price</span>
                                    <span>{formatPrice(service.base_price)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Duration</span>
                                    <span>{service.estimated_duration} min</span>
                                </div>
                            </div>
                            <Separator />
                            <Link to={`/booking/new?service=${service.id}`}>
                                <Button className="w-full" size="lg">
                                    Book Now
                                </Button>
                            </Link>
                            <p className="text-center text-xs text-muted-foreground">
                                Free cancellation up to 2 hours before
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
