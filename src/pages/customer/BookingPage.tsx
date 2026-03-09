import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import { bookingService } from '@/services/booking.service'
import { paymentService } from '@/services/payment.service'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useBookingStore } from '@/stores/useBookingStore'

const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
]

const steps = ['Service', 'Schedule', 'Address', 'Confirm']

// --- Zod Validation Schemas ---
const scheduleSchema = z.object({
    selectedDate: z.string().min(1, 'Please select a date'),
    selectedTime: z.string().min(1, 'Please select a time slot'),
})

const addressSchema = z.object({
    houseNo: z.string().min(1, 'House / Flat No is required'),
    street: z.string().min(1, 'Street / Area is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().length(6, 'Valid 6-digit pincode is required'),
})

export default function BookingPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { user, session } = useAuthStore()

    // Global persisted store
    const draft = useBookingStore()
    const {
        currentStep, bookingType, selectedDate, selectedTime,
        houseNo, street, landmark, city, state, pincode,
        updateDraft, resetBookingFlow
    } = draft

    const serviceId = searchParams.get('service_id') || searchParams.get('service') || ''
    const serviceName = searchParams.get('service_name') || 'Home Service'
    const servicePrice = searchParams.get('price') || ''

    const fullAddress = [houseNo, street, landmark, city, state, pincode].filter(Boolean).join(', ')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle')

    const handleNext = () => {
        setFieldErrors({}) // Reset previous errors
        let isValid = true;
        let errors: Record<string, string> = {};

        // Validation per step
        if (currentStep === 1 && bookingType === 'scheduled') {
            const result = scheduleSchema.safeParse({ selectedDate, selectedTime })
            if (!result.success) {
                isValid = false;
                result.error.issues.forEach((err: z.ZodIssue) => {
                    if (err.path[0]) errors[err.path[0] as string] = err.message
                })
            }
        } else if (currentStep === 2) {
            const result = addressSchema.safeParse({ houseNo, street, city, state, pincode })
            if (!result.success) {
                isValid = false;
                result.error.issues.forEach((err: z.ZodIssue) => {
                    if (err.path[0]) errors[err.path[0] as string] = err.message
                })
            }
        }

        if (!isValid) {
            setFieldErrors(errors)
            return;
        }

        if (currentStep < steps.length - 1) {
            updateDraft({ currentStep: currentStep + 1 })
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setFieldErrors({})
            updateDraft({ currentStep: currentStep - 1 })
        }
    }

    const handleSubmitBooking = async () => {
        setIsSubmitting(true)
        setSubmitError(null)
        try {
            const token = session?.access_token || ''
            const res = await bookingService.createBooking({
                customer_id: user?.id,
                service_id: serviceId || undefined,
                booking_date: selectedDate || new Date().toISOString().split('T')[0],
                booking_time: selectedTime || new Date().toTimeString().slice(0, 8),
                booking_type: bookingType,
                customer_address: fullAddress,
                estimated_price: servicePrice ? Number(servicePrice) : undefined,
            }, token)

            const result = res as any
            const newBookingId = result?.data?.data?.id || result?.data?.id || result?.id || 'new'

            // DON'T reset draft yet — wait for payment to succeed

            // Directly open Razorpay popup
            try {
                const orderData = await paymentService.createOrder(newBookingId)
                await paymentService.openCheckout({
                    order_id: orderData.order_id,
                    amount: orderData.amount,
                    booking_id: newBookingId,
                    customerName: user?.full_name || (user as any)?.user_metadata?.full_name || '',
                    customerEmail: user?.email || '',
                    customerPhone: user?.phone || (user as any)?.user_metadata?.phone || '',
                    onSuccess: async (response) => {
                        try {
                            await paymentService.verifyPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                booking_id: newBookingId,
                            })
                            resetBookingFlow() // Clear draft only on success
                            setPaymentStatus('success')
                            setTimeout(() => navigate('/bookings'), 3000)
                        } catch {
                            setSubmitError('Payment verification failed. Please contact support.')
                            setPaymentStatus('failed')
                        }
                        setIsSubmitting(false)
                    },
                    onFailure: async () => {
                        // Payment cancelled — cancel the booking so it doesn't appear as booked
                        try {
                            await api.patch(`/bookings/${newBookingId}/status`, { status: 'cancelled' })
                        } catch { /* ignore */ }
                        setIsSubmitting(false)
                        setSubmitError('Payment was cancelled. Booking has been cancelled.')
                    },
                })
            } catch (payErr) {
                // If Razorpay order creation fails, cancel the booking
                console.error('Payment init failed:', payErr)
                try {
                    await api.patch(`/bookings/${newBookingId}/status`, { status: 'cancelled' })
                } catch { /* ignore */ }
                setIsSubmitting(false)
                setSubmitError('Could not start payment. Please try again.')
            }
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to create booking')
            setIsSubmitting(false)
        }
    }

    // Payment Success Screen
    if (paymentStatus === 'success') {
        return (
            <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8 animate-fade-in text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-emerald-700">Payment Successful!</h1>
                <p className="text-muted-foreground mb-4">
                    Your booking for <strong>{serviceName}</strong> has been confirmed.
                </p>
                <p className="text-sm text-muted-foreground">Redirecting to your bookings...</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h1 className="mb-2 text-2xl font-bold">Book a Service</h1>
            <p className="mb-8 text-muted-foreground">Complete the steps below to book your service</p>

            {/* Stepper */}
            <div className="mb-8 flex items-center gap-2">
                {steps.map((step, i) => (
                    <div key={step} className="flex flex-1 items-center gap-2">
                        <div className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                            i < currentStep ? 'bg-emerald-500 text-white' :
                                i === currentStep ? 'bg-primary text-white' :
                                    'bg-muted text-muted-foreground'
                        )}>
                            {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </div>
                        <span className={cn('hidden text-xs font-medium sm:block', i === currentStep ? 'text-foreground' : 'text-muted-foreground')}>
                            {step}
                        </span>
                        {i < steps.length - 1 && <div className={cn('h-0.5 flex-1', i < currentStep ? 'bg-emerald-500' : 'bg-muted')} />}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <Card className="border-0 shadow-elevated">
                <CardContent className="p-6">
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <CardHeader className="p-0">
                                <CardTitle>Booking Type</CardTitle>
                            </CardHeader>
                            {serviceName && (
                                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 mb-4">
                                    <p className="text-sm text-muted-foreground">Selected Service</p>
                                    <p className="font-semibold text-lg">{serviceName}</p>
                                    <p className="text-primary font-bold">₹{servicePrice}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                {(['immediate', 'scheduled'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => updateDraft({ bookingType: type })}
                                        className={cn(
                                            'rounded-xl border-2 p-5 text-left transition-all',
                                            bookingType === type
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/30'
                                        )}
                                    >
                                        <div className="mb-2 text-2xl">{type === 'immediate' ? '⚡' : '📅'}</div>
                                        <p className="font-semibold capitalize">{type}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {type === 'immediate' ? 'Get service within 60 minutes' : 'Pick your preferred date & time'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <CardHeader className="p-0">
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5 text-primary" />
                                    Schedule
                                </CardTitle>
                            </CardHeader>
                            {bookingType === 'immediate' ? (
                                <div className="rounded-xl bg-orange-500/10 p-4 text-orange-700">
                                    <p className="font-medium">⚡ Immediate Service Selected</p>
                                    <p className="mt-1 text-sm opacity-90">A verified professional will be assigned and reach your location within 60 minutes.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label className={fieldErrors.selectedDate ? 'text-destructive' : ''}>Date</Label>
                                        <Input
                                            type="date"
                                            className={fieldErrors.selectedDate ? 'border-destructive focus-visible:ring-destructive' : ''}
                                            value={selectedDate}
                                            onChange={(e) => {
                                                updateDraft({ selectedDate: e.target.value })
                                                if (fieldErrors.selectedDate) setFieldErrors(prev => ({ ...prev, selectedDate: '' }))
                                            }}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {fieldErrors.selectedDate && <p className="text-xs text-destructive">{fieldErrors.selectedDate}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={cn('flex items-center gap-2', fieldErrors.selectedTime ? 'text-destructive' : '')}>
                                            <Clock className="h-4 w-4" /> Time Slot
                                        </Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => {
                                                        updateDraft({ selectedTime: time })
                                                        if (fieldErrors.selectedTime) setFieldErrors(prev => ({ ...prev, selectedTime: '' }))
                                                    }}
                                                    className={cn(
                                                        'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                                        selectedTime === time
                                                            ? 'border-primary bg-primary/10 text-primary'
                                                            : 'border-border hover:border-primary/30',
                                                        fieldErrors.selectedTime && !selectedTime && 'border-destructive/50'
                                                    )}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                        {fieldErrors.selectedTime && <p className="mt-1 text-xs text-destructive">{fieldErrors.selectedTime}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <CardHeader className="p-0">
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Service Address
                                </CardTitle>
                            </CardHeader>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-1">
                                    <Label className={fieldErrors.houseNo && 'text-destructive'}>House / Flat No.</Label>
                                    <Input
                                        placeholder="e.g. 12A"
                                        value={houseNo}
                                        className={fieldErrors.houseNo && 'border-destructive focus-visible:ring-destructive'}
                                        onChange={(e) => {
                                            updateDraft({ houseNo: e.target.value })
                                            if (fieldErrors.houseNo) setFieldErrors(prev => ({ ...prev, houseNo: '' }))
                                        }}
                                    />
                                    {fieldErrors.houseNo && <p className="text-xs text-destructive">{fieldErrors.houseNo}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label className={fieldErrors.street && 'text-destructive'}>Street / Area</Label>
                                    <Input
                                        placeholder="e.g. MG Road, Anna Nagar"
                                        value={street}
                                        className={fieldErrors.street && 'border-destructive focus-visible:ring-destructive'}
                                        onChange={(e) => {
                                            updateDraft({ street: e.target.value })
                                            if (fieldErrors.street) setFieldErrors(prev => ({ ...prev, street: '' }))
                                        }}
                                    />
                                    {fieldErrors.street && <p className="text-xs text-destructive">{fieldErrors.street}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Landmark <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                    <Input
                                        placeholder="e.g. Near Apollo Hospital"
                                        value={landmark}
                                        onChange={(e) => updateDraft({ landmark: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className={fieldErrors.city && 'text-destructive'}>City</Label>
                                    <Input
                                        placeholder="e.g. Chennai"
                                        value={city}
                                        className={fieldErrors.city && 'border-destructive focus-visible:ring-destructive'}
                                        onChange={(e) => {
                                            updateDraft({ city: e.target.value })
                                            if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: '' }))
                                        }}
                                    />
                                    {fieldErrors.city && <p className="text-xs text-destructive">{fieldErrors.city}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={fieldErrors.state && 'text-destructive'}>State</Label>
                                    <Input
                                        placeholder="e.g. Tamil Nadu"
                                        value={state}
                                        className={fieldErrors.state && 'border-destructive focus-visible:ring-destructive'}
                                        onChange={(e) => {
                                            updateDraft({ state: e.target.value })
                                            if (fieldErrors.state) setFieldErrors(prev => ({ ...prev, state: '' }))
                                        }}
                                    />
                                    {fieldErrors.state && <p className="text-xs text-destructive">{fieldErrors.state}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={fieldErrors.pincode && 'text-destructive'}>Pincode</Label>
                                    <Input
                                        placeholder="e.g. 600001"
                                        maxLength={6}
                                        value={pincode}
                                        className={fieldErrors.pincode && 'border-destructive focus-visible:ring-destructive'}
                                        onChange={(e) => {
                                            updateDraft({ pincode: e.target.value })
                                            if (fieldErrors.pincode) setFieldErrors(prev => ({ ...prev, pincode: '' }))
                                        }}
                                    />
                                    {fieldErrors.pincode && <p className="text-xs text-destructive">{fieldErrors.pincode}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <CardHeader className="p-0">
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    Confirm Booking
                                </CardTitle>
                            </CardHeader>
                            <div className="space-y-3 rounded-xl bg-muted/50 p-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Service</span>
                                    <span className="font-medium">{serviceName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium capitalize">{bookingType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Date & Time</span>
                                    <span className="font-medium">
                                        {bookingType === 'immediate' ? 'ASAP (Within 60 mins)' : `${selectedDate} \u00B7 ${selectedTime}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Address</span>
                                    <span className="max-w-[200px] text-right font-medium">{fullAddress || 'Not provided'}</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between">
                                    <span className="font-semibold">Estimated Total</span>
                                    <span className="text-lg font-bold text-primary">₹{servicePrice}</span>
                                </div>
                            </div>
                            {submitError && (
                                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                    {submitError}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {currentStep === steps.length - 1 ? (
                    <Button onClick={handleSubmitBooking} className="gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                        ) : (
                            <>Confirm & Pay <ArrowRight className="h-4 w-4" /></>
                        )}
                    </Button>
                ) : (
                    <Button onClick={handleNext} className="gap-2">
                        Next <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
