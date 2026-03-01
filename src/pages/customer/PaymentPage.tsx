import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, CreditCard } from 'lucide-react'

export default function PaymentPage() {
    const handlePayment = () => {
        // Razorpay checkout would be triggered here
        alert('Razorpay checkout will open here when keys are configured')
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
                            <span className="text-muted-foreground">AC Regular Service</span>
                            <span>₹399</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Visit charge</span>
                            <span>₹49</span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                            <span>Discount</span>
                            <span>-₹49</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">₹399</span>
                    </div>

                    <Separator />

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Payment Methods</h3>
                        <div className="space-y-2">
                            {['UPI', 'Credit/Debit Card', 'Net Banking', 'Wallets'].map((method) => (
                                <div
                                    key={method}
                                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 cursor-pointer"
                                >
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{method}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handlePayment} className="w-full" size="lg">
                        Pay ₹399
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
