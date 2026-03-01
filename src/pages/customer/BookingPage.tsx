import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
]

const steps = ['Service', 'Schedule', 'Address', 'Confirm']

export default function BookingPage() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [bookingType, setBookingType] = useState<'immediate' | 'scheduled'>('scheduled')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [address, setAddress] = useState('')

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((s) => s + 1)
        } else {
            // Submit booking
            navigate('/booking/mock-id/payment')
        }
    }

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((s) => s - 1)
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
                            <div className="grid grid-cols-2 gap-4">
                                {(['immediate', 'scheduled'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setBookingType(type)}
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
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Time Slot
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(time)}
                                            className={cn(
                                                'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                                selectedTime === time
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border hover:border-primary/30'
                                            )}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                            <div className="space-y-2">
                                <Label>Full Address</Label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Enter your full address including flat/house number, street, landmark..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                                <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Map integration will be available here
                                </p>
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
                                    <span className="font-medium">AC Regular Service</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium capitalize">{bookingType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Date & Time</span>
                                    <span className="font-medium">{selectedDate || 'Today'} · {selectedTime || 'ASAP'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Address</span>
                                    <span className="max-w-[200px] text-right font-medium">{address || 'Not provided'}</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between">
                                    <span className="font-semibold">Estimated Total</span>
                                    <span className="text-lg font-bold text-primary">₹399</span>
                                </div>
                            </div>
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
                <Button onClick={handleNext} className="gap-2">
                    {currentStep === steps.length - 1 ? 'Proceed to Payment' : 'Next'}
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
