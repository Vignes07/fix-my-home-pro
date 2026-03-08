import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, CreditCard, CheckCircle2, Loader2 } from 'lucide-react'
import { paymentService } from '@/services/payment.service'
import { useAuthStore } from '@/stores/useAuthStore'
import { api } from '@/services/api'
import { cn } from '@/utils/cn'

export default function PaymentPage() {
    const { id: bookingId } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle')
    const [error, setError] = useState<string | null>(null)
    const [booking, setBooking] = useState<any>(null)
    const [loadingBooking, setLoadingBooking] = useState(true)

    // Fetch real booking data from DB
    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId || bookingId === 'new') {
                setLoadingBooking(false)
                return
            }
            try {
                const res = await api.get(`/bookings/${bookingId}`)
                setBooking(res.data.data)
            } catch (err) {
                console.error('Failed to fetch booking:', err)
            } finally {
                setLoadingBooking(false)
            }
        }
        fetchBooking()
    }, [bookingId])

    const price = booking?.estimated_price || booking?.services?.base_price || 0
    const serviceName = booking?.services?.name || 'Home Service'

    const handlePayment = async (preferredMethod?: string) => {
        if (!bookingId) return

        setIsProcessing(true)
        setError(null)

        try {
            // Step 1: Create order
            const orderData = await paymentService.createOrder(bookingId)

            // Step 2: Open Razorpay checkout
            await paymentService.openCheckout({
                order_id: orderData.order_id,
                amount: orderData.amount,
                booking_id: bookingId,
                customerName: user?.full_name || (user as any)?.user_metadata?.full_name || '',
                customerEmail: user?.email || '',
                customerPhone: user?.phone || (user as any)?.user_metadata?.phone || '',
                preferredMethod: preferredMethod,
                onSuccess: async (response) => {
                    try {
                        // Step 3: Verify payment
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            booking_id: bookingId,
                        })
                        setPaymentStatus('success')
                        setTimeout(() => navigate('/bookings'), 3000)
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.')
                        setPaymentStatus('failed')
                    }
                    setIsProcessing(false)
                },
                onFailure: (err) => {
                    setError(err.message || 'Payment failed')
                    setPaymentStatus('failed')
                    setIsProcessing(false)
                },
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create payment order')
            setIsProcessing(false)
        }
    }

    if (paymentStatus === 'success') {
        return (
            <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8 animate-fade-in text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-emerald-700">Payment Successful!</h1>
                <p className="text-muted-foreground mb-4">
                    Your booking for <strong>{serviceName}</strong> has been confirmed. A confirmation email has been sent.
                </p>
                <p className="text-sm text-muted-foreground">Redirecting to your bookings...</p>
            </div>
        )
    }

    if (loadingBooking) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h1 className="mb-2 text-2xl font-bold">Payment</h1>
            <p className="mb-8 text-muted-foreground">Complete payment to confirm your booking</p>

            <Card className="border-0 shadow-elevated">
                <div className="h-1.5 bg-gradient-to-r from-primary to-accent rounded-t-xl" />
                <CardContent className="p-6 space-y-4">
                    {/* Order Summary */}
                    <h2 className="font-semibold">Order Summary</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Service</span>
                            <span className="font-medium">{serviceName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date & Time</span>
                            <span className="font-medium">{booking?.booking_date} · {booking?.booking_time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Service Charge</span>
                            <span>₹{price}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">₹{price}</span>
                    </div>

                    <Separator />

                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Payment Methods</h3>
                        <div className="space-y-2">
                            {[
                                { label: 'UPI', id: 'upi' },
                                { label: 'Credit/Debit Card', id: 'card' },
                                { label: 'Net Banking', id: 'netbanking' },
                                { label: 'Wallets', id: 'wallet' }
                            ].map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => handlePayment(method.id)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg border border-border p-3 transition-colors cursor-pointer",
                                        isProcessing
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:border-primary/50 hover:bg-slate-50 active:bg-slate-100"
                                    )}
                                >
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{method.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={() => handlePayment()} className="w-full" size="lg" disabled={isProcessing || !price}>
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            `Pay ₹${price}`
                        )}
                    </Button>


                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3.5 w-3.5" />
                        Secured by Razorpay · 100% Safe
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
