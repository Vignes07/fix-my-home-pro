import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/common/Logo'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
import { supabase } from '@/services/supabase'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: '',
            email: '',
            phone: '',
            password: '',
            user_type: 'customer',
        },
    })

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const phone = data.phone.startsWith('+91') ? data.phone : `+91${data.phone}`

            // Create auth user in Supabase Auth — always as 'customer'
            const result = await authService.signUp(data.email, data.password, {
                full_name: data.full_name,
                phone: phone,
                user_type: 'customer'
            })

            // Insert user into the `users` table
            if (result.user) {
                const { error: insertError } = await supabase
                    .from('users')
                    .upsert([{
                        id: result.user.id,
                        full_name: data.full_name,
                        email: data.email,
                        phone: phone,
                        user_type: 'customer',
                        is_active: true,
                    }], { onConflict: 'id' })

                if (insertError) {
                    console.error('Failed to insert user into users table:', insertError)
                }
            }

            navigate('/login')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <Logo size="lg" />
                    </div>
                    <p className="text-muted-foreground">
                        Join thousands of happy homeowners
                    </p>
                </div>

                <Card className="border-0 shadow-elevated">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                        <CardDescription>Get started with FixMyHome Pro</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="full_name"
                                        placeholder="Enter your full name"
                                        className="pl-10"
                                        {...register('full_name')}
                                    />
                                </div>
                                {errors.full_name && (
                                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="pl-10"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                        className="pl-10"
                                        {...register('phone')}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a strong password"
                                        className="pl-10"
                                        {...register('password')}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            {error && (
                                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <Link to="/terms" className="underline hover:text-foreground">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="underline hover:text-foreground">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    )
}
