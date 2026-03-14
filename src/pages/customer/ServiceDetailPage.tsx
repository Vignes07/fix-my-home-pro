import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Plus, Check, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
import { api } from '@/services/api'
import { apiCache } from '@/utils/cache'
import type { Service, ServiceOption } from '@/types/service.types'
import { ServiceDetailSkeleton } from '@/components/common/skeletons'

export default function ServiceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [service, setService] = useState<Service | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])

    useEffect(() => {
        const fetchServiceDetail = async () => {
            try {
                const cacheKey = `/services/${id}`
                const cachedData = apiCache.get<any>(cacheKey)

                if (cachedData) {
                    setService(cachedData)
                } else {
                    const response = await api.get(cacheKey)
                    if (response.data?.success) {
                        apiCache.set(cacheKey, response.data.data)
                        setService(response.data.data)
                    }
                }
            } catch (err) {
                console.error('Error fetching', err)
            } finally {
                setIsLoading(false)
            }
        }
        if (id) fetchServiceDetail()
    }, [id])

    if (isLoading) return <ServiceDetailSkeleton />
    if (!service) return <div className="py-20 text-center text-red-500">Service not found</div>

    const basePrice = Number(service.base_price) || 349
    const visitCharge = 0

    const includesList = service.includes?.length ? service.includes : [
        'Inspection & fault check',
        'Repair / installation work',
        'Safety verification'
    ]

    const optionsList: ServiceOption[] = service.service_options?.length ? service.service_options : [
        { id: 'dummy-1', service_id: service.id, name: 'Standard Service', price: basePrice } as ServiceOption
    ]

    const totalSelectedCost = selectedOptions.length > 0
        ? optionsList
            .filter(opt => selectedOptions.includes(opt.id))
            .reduce((sum, opt) => sum + Number(opt.price), 0)
        : 0;

    const displayTotal = selectedOptions.length > 0 ? (totalSelectedCost + visitCharge) : 0;

    const toggleOption = (optId: string) => {
        setSelectedOptions(prev =>
            prev.includes(optId) ? prev.filter(i => i !== optId) : [...prev, optId]
        )
    }

    const handleProceedToBooking = () => {
        if (selectedOptions.length === 0) {
            alert('Please select at least one service type')
            return
        }
        // Navigate to booking page with service info as query params
        const params = new URLSearchParams({
            service_id: service.id,
            service_name: service.name,
            price: String(displayTotal),
        })
        navigate(`/booking/new?${params.toString()}`)
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-fade-in min-h-screen">

            {/* Hero Image */}
            <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden relative shadow-lg">
                <img
                    src={(service as any).detail_image_url || service.image_url || "https://placehold.co/1235x725/e2e8f0/64748b"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8 md:p-12">
                    <div className="text-white space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold font-['Inter'] drop-shadow-md">{service.name}</h1>
                        <p className="text-xl md:text-2xl font-medium text-white/90 drop-shadow-sm">{service.categoryName || 'Repair & Setup'}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                {/* Left Column - Details */}
                <div className="space-y-12">

                    {/* Service Overview */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Starting Price</p>
                                <p className="text-3xl font-bold text-primary">{formatPrice(basePrice)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Estimated Time</p>
                                <p className="text-2xl font-semibold text-slate-900">{service.estimated_duration || 60} mins – 2 hrs</p>
                            </div>
                        </div>
                        {service.description && (
                            <p className="mt-4 text-slate-600 leading-relaxed">{service.description}</p>
                        )}
                    </div>

                    {/* Select Service Type (Options) — each with its own includes, duration, and rating */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 font-['Lato']">Select Service Type</h2>
                        <div className="grid gap-4">
                            {optionsList.map((opt: ServiceOption) => {
                                const isSelected = selectedOptions.includes(opt.id)
                                const optIncludes = (opt as any).includes || []
                                const optDuration = opt.estimated_duration || 60
                                const optRating = (opt as any).avg_rating || 0
                                const optRatingCount = (opt as any).rating_count || 0
                                return (
                                    <div
                                        key={opt.id}
                                        className={cn(
                                            "p-6 rounded-2xl border-2 transition-all cursor-pointer",
                                            isSelected ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:border-primary/50"
                                        )}
                                        onClick={() => toggleOption(opt.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold">{opt.name}</h4>
                                                {opt.description && (
                                                    <p className="text-sm text-slate-500 mt-1">{opt.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                    <span className="font-semibold text-primary text-base">{formatPrice(opt.price)}</span>
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        {optDuration} min
                                                    </span>
                                                    {optRating > 0 && (
                                                        <span className="flex items-center gap-1 text-amber-500">
                                                            <Star className="h-3.5 w-3.5 fill-amber-400" />
                                                            {optRating.toFixed(1)} ({optRatingCount})
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Per-option includes */}
                                                {optIncludes.length > 0 && (
                                                    <ul className="mt-3 space-y-1.5">
                                                        {optIncludes.map((inc: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                                {inc}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <Button
                                                variant={isSelected ? "default" : "outline"}
                                                className="rounded-full px-6 font-bold ml-4 shrink-0"
                                            >
                                                {isSelected ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                                {isSelected ? "Selected" : "Add"}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* Right Column - Sticky Sidebar */}
                <div className="relative">
                    <div className="sticky top-24 space-y-6">

                        {/* Price Breakdown Card */}
                        <Card className="rounded-[32px] border-0 shadow-lg bg-white overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                                <CardTitle className="text-2xl font-bold font-['Lato']">Price Breakdown</CardTitle>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-lg text-slate-600">
                                        <span>Service Charge</span>
                                        <span className="font-medium text-slate-900">{formatPrice(totalSelectedCost)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg text-slate-600">
                                        <span>Visit Charge</span>
                                        <span className="font-medium text-slate-900">{formatPrice(visitCharge)}</span>
                                    </div>
                                </div>

                                <Separator className="bg-slate-200" />

                                <div className="flex justify-between items-center">
                                    <span className="text-3xl font-bold text-slate-900">Total</span>
                                    <span className="text-3xl font-bold text-primary">{formatPrice(displayTotal)}</span>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full h-16 rounded-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xl font-bold drop-shadow-md"
                                    onClick={handleProceedToBooking}
                                    disabled={selectedOptions.length === 0}
                                >
                                    Proceed to Booking
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Trust Badges */}
                        <div className="px-4 space-y-4">
                            <h4 className="text-xl font-bold text-slate-800">Technician will contact you shortly</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-600 font-medium text-lg">
                                    <Shield className="h-6 w-6 text-emerald-500" />
                                    Verified Technicians
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium text-lg">
                                    <Star className="h-6 w-6 text-yellow-500" />
                                    Transparent Pricing
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium text-lg">
                                    <CheckCircle2 className="h-6 w-6 text-blue-500" />
                                    Secure Booking
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
