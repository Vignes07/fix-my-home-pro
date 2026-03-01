import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { profileSchema, type ProfileFormData } from '@/schemas/profile.schema'
import { useAuthStore } from '@/stores/useAuthStore'
import { getInitials } from '@/utils/format'

export default function ProfilePage() {
    const { user, logout } = useAuthStore()

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: user?.full_name || '',
            email: user?.email || '',
        },
    })

    const onSubmit = async (_data: ProfileFormData) => {
        // Would update profile via API
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h1 className="mb-8 text-2xl font-bold">My Profile</h1>

            {/* Avatar Section */}
            <div className="mb-8 flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.profile_photo_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {getInitials(user?.full_name || 'U')}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold">{user?.full_name || 'User'}</h2>
                    <p className="text-sm text-muted-foreground capitalize">{user?.user_type || 'Customer'}</p>
                    <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                        Change Photo
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-elevated">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" {...register('full_name')} />
                            {errors.full_name && (
                                <p className="text-sm text-destructive">{errors.full_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input id="email" type="email" className="pl-10" {...register('email')} />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={user?.phone || ''}
                                    disabled
                                    className="pl-10 bg-muted"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
                        </div>

                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Separator className="my-6" />

            <Button variant="destructive" className="w-full gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" /> Sign Out
            </Button>
        </div>
    )
}
