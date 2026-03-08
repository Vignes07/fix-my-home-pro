import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, MapPin, Shield, Star, Check, Plus, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
import { api } from '@/services/api'
import { apiCache } from '@/utils/cache'
import { useAuthStore } from '@/stores/useAuthStore'
import { bookingService } from '@/services/booking.service'
import type { Service } from '@/types/service.types'

export default function ServiceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, session } = useAuthStore()

    const [service, setService] = useState<Service | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [fullName, setFullName] = useState(user?.full_name || '')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState(user?.email || '')

    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [pincode, setPincode] = useState('')

    const [selectedDate, setSelectedDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('')
    const [problemDetails, setProblemDetails] = useState('')

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

    if (isLoading) return <div className="py-20 text-center animate-pulse">Loading Service Details...</div>
    if (!service) return <div className="py-20 text-center text-red-500">Service not found</div>

    const basePrice = Number(service.base_price) || 349
    const visitCharge = 0

    const includesList = service.includes?.length ? service.includes : [
        'Inspection & fault check',
        'Repair / installation work',
        'Safety verification'
    ]

    const optionsList = service.service_options?.length ? service.service_options : [
        { id: 'dummy-1', service_id: service.id, name: 'Standard Service', price: basePrice } as import('@/types/service.types').ServiceOption
    ]

    // Calculate total based strictly on selected options
    const totalSelectedCost = selectedOptions.length > 0
        ? optionsList
            .filter(opt => selectedOptions.includes(opt.id))
            .reduce((sum, opt) => sum + Number(opt.price), 0)
        : 0;

    // Only add visit charge if they have actually selected something
    const displayTotal = selectedOptions.length > 0 ? (totalSelectedCost + visitCharge) : 0;

    const toggleOption = (optId: string) => {
        setSelectedOptions(prev =>
            prev.includes(optId) ? prev.filter(i => i !== optId) : [...prev, optId]
        )
    }

    const handleConfirmBooking = async () => {
        if (!address || !city || !pincode || !selectedDate || !timeSlot) {
            alert('Please fill in all required fields (Address, City, Pincode, Date, Time Slot)');
            return;
        }

        setIsSubmitting(true)
        try {
            const token = session?.access_token || ''
            const res = await bookingService.createBooking({
                customer_id: user?.id,
                service_id: service.id,
                booking_date: selectedDate,
                booking_time: timeSlot,
                booking_type: 'scheduled',
                customer_address: `${address}, ${city}, ${pincode}`,
                estimated_price: displayTotal,
            }, token)

            const result = res as any
            const newBookingId = result?.data?.data?.id || result?.data?.id || result?.id || 'new'
            navigate(`/booking/${newBookingId}/payment`)
        } catch (err) {
            console.error(err)
            alert('Failed to confirm booking');
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-fade-in bg-slate-50 min-h-screen">

            {/* Hero Image */}
            <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden relative shadow-lg">
                <img
                    src={service.image_url || "https://placehold.co/1235x725/e2e8f0/64748b"}
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
                {/* Left Column - Details & Forms */}
                <div className="space-y-12">

                    {/* Includes & Metdata */}
                    <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div>
                            <h3 className="text-xl font-bold mb-4 font-['Inter']">Includes</h3>
                            <ul className="space-y-3">
                                {includesList.map((inc: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700 text-lg">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                                        {inc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center space-y-6 md:pl-8 md:border-l border-slate-200">
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Estimated Time</p>
                                <p className="text-2xl font-semibold text-slate-900">{service.estimated_duration || 60} mins – 2 hrs</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Starting Price</p>
                                <p className="text-2xl font-semibold text-primary">{formatPrice(basePrice)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Select Service Type (Options) */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 font-['Lato']">Select Service Type</h2>
                        <div className="grid gap-4">
                            {optionsList.map((opt: import('@/types/service.types').ServiceOption) => {
                                const isSelected = selectedOptions.includes(opt.id)
                                return (
                                    <div
                                        key={opt.id}
                                        className={cn(
                                            "flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer",
                                            isSelected ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:border-primary/50"
                                        )}
                                        onClick={() => toggleOption(opt.id)}
                                    >
                                        <div>
                                            <h4 className="text-xl font-bold">{opt.name}</h4>
                                            <p className="text-primary font-bold mt-1">{formatPrice(opt.price)}</p>
                                        </div>
                                        <Button
                                            variant={isSelected ? "default" : "outline"}
                                            className="rounded-full px-6 font-bold"
                                        >
                                            {isSelected ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                            {isSelected ? "Selected" : "Add to Cart"}
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* Customer Details */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 font-['Lato']">Customer Details</h2>
                        <div className="space-y-4">
                            <Input
                                placeholder="Full Name"
                                className="h-16 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <div className="flex items-center h-16 px-4 bg-zinc-100/80 rounded-2xl text-slate-500 font-medium border border-transparent">
                                    +91 |
                                </div>
                                <Input
                                    placeholder="Phone Number"
                                    className="h-16 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>
                            <Input
                                placeholder="Email (optional)"
                                type="email"
                                className="h-16 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Service Address */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 font-['Lato']">Service Address</h2>
                        <div className="space-y-4">
                            <Input
                                placeholder="Address line (House No, Street Area)"
                                className="h-16 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                            />
                            <Input
                                placeholder="City"
                                className="h-16 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                            />
                            <Input
                                placeholder="Pincode"
                                maxLength={6}
                                className="h-16 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white"
                                value={pincode}
                                onChange={e => setPincode(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Schedule Service */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 font-['Lato']">Schedule Service</h2>
                        <div className="space-y-4">
                            <Label className="text-lg font-bold ml-2">Date</Label>
                            <Input
                                type="date"
                                className="h-16 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Label className="text-lg font-bold ml-2 mt-4 block">Select Preferred Time</Label>
                            <div className="grid grid-cols-3 gap-3 pt-2">
                                {[
                                    { label: '09:00 AM', value: '09:00:00' },
                                    { label: '10:00 AM', value: '10:00:00' },
                                    { label: '11:00 AM', value: '11:00:00' },
                                    { label: '12:00 PM', value: '12:00:00' },
                                    { label: '01:00 PM', value: '13:00:00' },
                                    { label: '02:00 PM', value: '14:00:00' },
                                    { label: '03:00 PM', value: '15:00:00' },
                                    { label: '04:00 PM', value: '16:00:00' },
                                    { label: '05:00 PM', value: '17:00:00' },
                                    { label: '06:00 PM', value: '18:00:00' },
                                    { label: '07:00 PM', value: '19:00:00' }
                                ].map(slot => (
                                    <Button
                                        key={slot.value}
                                        type="button"
                                        variant={timeSlot === slot.value ? 'default' : 'outline'}
                                        className={cn(
                                            "h-12 text-sm md:text-md font-bold rounded-2xl transition-all",
                                            timeSlot === slot.value ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-zinc-100/80 border-transparent text-slate-700 hover:bg-zinc-200"
                                        )}
                                        onClick={() => setTimeSlot(slot.value)}
                                    >
                                        {slot.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 font-['Lato']">Service Details</h2>
                        <div className="space-y-4">
                            <Label className="text-lg font-bold ml-2">Describe Your Problem</Label>
                            <textarea
                                placeholder="E.g. The AC makes a loud noise after 10 mins..."
                                className="w-full h-32 p-4 text-lg rounded-2xl bg-zinc-100/80 border-transparent focus-visible:ring-primary focus-visible:bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                value={problemDetails}
                                onChange={e => setProblemDetails(e.target.value)}
                            />
                            <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer">
                                <div className="text-center">
                                    <p className="text-lg font-medium text-slate-700 flex justify-center items-center gap-2">
                                        <UploadCloud className="h-5 w-5" /> Attach Photo / Add Photo
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Accepted file types: JPG, PNG. Max size: 5MB</p>
                                </div>
                            </div>
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
                                    onClick={handleConfirmBooking}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Confirm Booking"}
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
