import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/common/Logo'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/useAuthStore'

export default function LoginPage() {
    const navigate = useNavigate()
    const { setEmail, login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await authService.signIn(data.email, data.password)
            if (result.user && result.session) {
                // Determine user type
                let userType = result.user.user_metadata?.user_type || 'customer'
                try {
                    const { supabase } = await import('@/services/supabase')
                    const { data: dbUser } = await supabase
                        .from('users')
                        .select('user_type')
                        .eq('id', result.user.id)
                        .single()
                    if (dbUser?.user_type) userType = dbUser.user_type
                } catch {
                    // Fall back to auth metadata
                }

                const appUser = {
                    id: result.user.id,
                    email: result.user.email || data.email,
                    full_name: result.user.user_metadata?.full_name || '',
                    phone: result.user.user_metadata?.phone || result.user.phone || '',
                    user_type: userType,
                    is_active: true,
                    profile_photo_url: result.user.user_metadata?.profile_photo_url || '',
                    created_at: result.user.created_at || '',
                    updated_at: result.user.updated_at || '',
                }
                login(appUser as any, result.session)
                setEmail(data.email)

                // Admins go to /admin, everyone else goes home
                if (userType === 'admin') {
                    navigate('/admin')
                } else {
                    navigate('/')
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in')
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
                        On-demand home services at your doorstep
                    </p>
                </div>

                <Card className="border-0 shadow-elevated">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Enter your email and password to sign in
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
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
                                {isLoading ? (
                                    <span className="animate-pulse-soft">Signing in...</span>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="font-medium text-primary hover:underline">
                                Sign Up
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
