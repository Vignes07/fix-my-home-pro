import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/common/Logo'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
import { supabase } from '@/services/supabase'
import { cn } from '@/utils/cn'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
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

    const selectedType = watch('user_type')

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const phone = data.phone.startsWith('+91') ? data.phone : `+91${data.phone}`

            // 1. Create auth user in Supabase Auth
            const result = await authService.signUp(data.email, data.password, {
                full_name: data.full_name,
                phone: phone,
                user_type: data.user_type
            })

            // 2. Insert user into the `users` table so it shows up in the DB
            if (result.user) {
                const { error: insertError } = await supabase
                    .from('users')
                    .upsert([{
                        id: result.user.id,
                        full_name: data.full_name,
                        email: data.email,
                        phone: phone,
                        user_type: data.user_type,
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
                            {/* User Type Selection */}
                            <div className="space-y-2">
                                <Label>I am a</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['customer', 'technician'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setValue('user_type', type)}
                                            className={cn(
                                                'rounded-xl border-2 p-4 text-center transition-all',
                                                selectedType === type
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-border hover:border-primary/30'
                                            )}
                                        >
                                            <p className="text-sm font-semibold capitalize">{type}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {type === 'customer'
                                                    ? 'I need home services'
                                                    : 'I provide services'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                                {errors.user_type && (
                                    <p className="text-sm text-destructive">{errors.user_type.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    placeholder="Enter your full name"
                                    {...register('full_name')}
                                />
                                {errors.full_name && (
                                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    maxLength={10}
                                    {...register('phone')}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    {...register('password')}
                                />
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
            </div>
        </div>
    )
}
