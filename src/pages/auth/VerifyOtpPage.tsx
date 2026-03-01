import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/common/Logo'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/useAuthStore'

export default function VerifyOtpPage() {
    const navigate = useNavigate()
    const { phone, login } = useAuthStore()
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [resendTimer, setResendTimer] = useState(30)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Redirect if no phone number
    useEffect(() => {
        if (!phone) navigate('/login', { replace: true })
    }, [phone, navigate])

    // Resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendTimer])

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        // Auto-advance
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto-submit when all filled
        if (newOtp.every((d) => d !== '')) {
            verifyOtp(newOtp.join(''))
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            const newOtp = pasted.split('')
            setOtp(newOtp)
            inputRefs.current[5]?.focus()
            verifyOtp(pasted)
        }
    }

    const verifyOtp = async (token: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await authService.verifyOtp(phone, token)
            if (data.session && data.user) {
                login(
                    {
                        id: data.user.id,
                        phone: data.user.phone || phone,
                        full_name: data.user.user_metadata?.full_name || 'User',
                        user_type: data.user.user_metadata?.user_type || 'customer',
                        is_active: true,
                        created_at: data.user.created_at,
                        updated_at: data.user.updated_at || data.user.created_at,
                    },
                    data.session
                )
                navigate('/')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid OTP')
            setOtp(Array(6).fill(''))
            inputRefs.current[0]?.focus()
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        try {
            await authService.sendOtp(phone)
            setResendTimer(30)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend OTP')
        }
    }

    const maskedPhone = phone
        ? `${phone.slice(0, 4)}****${phone.slice(-2)}`
        : ''

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <Logo size="lg" />
                    </div>
                </div>

                <Card className="border-0 shadow-elevated">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Verify OTP</CardTitle>
                        <CardDescription>
                            We&apos;ve sent a 6-digit code to{' '}
                            <span className="font-medium text-foreground">{maskedPhone}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-2.5">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="h-13 w-11 rounded-lg border-2 border-input bg-background text-center text-lg font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {isLoading && (
                            <p className="mt-4 text-center text-sm text-muted-foreground animate-pulse-soft">
                                Verifying...
                            </p>
                        )}

                        {/* Resend */}
                        <div className="mt-6 text-center">
                            {resendTimer > 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Resend OTP in{' '}
                                    <span className="font-medium text-foreground">{resendTimer}s</span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        {/* Back */}
                        <div className="mt-6">
                            <Link to="/login">
                                <Button variant="ghost" className="w-full" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                    Change Phone Number
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
