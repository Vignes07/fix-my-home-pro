import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, LogOut, Shield, MapPin, ChevronRight, Settings, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { profileSchema, type ProfileFormData } from '@/schemas/profile.schema'
import { useAuthStore } from '@/stores/useAuthStore'
import { supabase } from '@/services/supabase'
import { getInitials } from '@/utils/format'
import { cn } from '@/utils/cn'

const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
] as const

type TabId = (typeof tabs)[number]['id']

export default function ProfilePage() {
    const { user, logout, setUser } = useAuthStore()
    const [activeTab, setActiveTab] = useState<TabId>('personal')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [address, setAddress] = useState('')

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: user?.full_name || '',
            email: user?.email || '',
        },
    })

    const onSubmit = async (data: ProfileFormData) => {
        if (!user?.id) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from('users')
                .update({ full_name: data.full_name, email: data.email })
                .eq('id', user.id)

            if (!error) {
                setUser({ ...user, full_name: data.full_name, email: data.email })
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            }
        } catch (err) {
            console.error('Failed to update profile:', err)
        } finally {
            setSaving(false)
        }
    }

    const joinedYear = user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()

    return (
        <div className="min-h-screen bg-muted/30 py-8 lg:py-12 animate-fade-in">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground">My Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Left Column - Profile Card & Tabs */}
                    <div className="space-y-6 md:col-span-1">
                        <Card className="overflow-hidden border-0 shadow-soft">
                            <div className="h-32 bg-primary/10 bg-[url('/pattern-bg.png')] bg-cover bg-center" />
                            <CardContent className="relative px-6 pb-6 pt-0 text-center">
                                <Avatar className="mx-auto -mt-12 mb-4 h-24 w-24 border-4 border-background shadow-sm">
                                    <AvatarImage src={user?.profile_photo_url} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                                        {getInitials(user?.full_name || 'U')}
                                    </AvatarFallback>
                                </Avatar>

                                <h2 className="text-xl font-semibold text-foreground">{user?.full_name || 'User'}</h2>
                                <Badge variant="secondary" className="mt-2 capitalize">
                                    {user?.user_type || 'Customer'}
                                </Badge>

                                <p className="mt-4 text-sm text-muted-foreground">Joined in {joinedYear}</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-soft">
                            <CardContent className="p-4 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    const isActive = activeTab === tab.id
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                'flex w-full items-center justify-between rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted/50',
                                                isActive ? 'text-foreground bg-muted/50' : 'text-muted-foreground'
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : '')} />
                                                {tab.label}
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Tab Content */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Personal Info Tab */}
                        {activeTab === 'personal' && (
                            <Card className="border-0 shadow-soft">
                                <div className="border-b px-6 py-4">
                                    <h3 className="font-semibold text-lg">Personal Information</h3>
                                    <p className="text-sm text-muted-foreground">Update your personal details here.</p>
                                </div>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="full_name">Full Name</Label>
                                                <Input
                                                    id="full_name"
                                                    className={cn("bg-muted/50", errors.full_name && "border-destructive focus-visible:ring-destructive")}
                                                    {...register('full_name')}
                                                />
                                                {errors.full_name && (
                                                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className="pl-10 bg-muted/50"
                                                        {...register('email')}
                                                    />
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
                                                        className="pl-10 bg-muted opacity-70"
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Contact support to change phone.</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                            <Button type="button" variant="outline">Cancel</Button>
                                            <Button type="submit" disabled={saving}>
                                                {saving ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Saving...</>
                                                ) : saved ? (
                                                    <><Check className="h-4 w-4 mr-1" /> Saved!</>
                                                ) : (
                                                    'Save Changes'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <Card className="border-0 shadow-soft">
                                <div className="border-b px-6 py-4">
                                    <h3 className="font-semibold text-lg">Saved Addresses</h3>
                                    <p className="text-sm text-muted-foreground">Manage your service addresses.</p>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="rounded-xl bg-muted/50 p-4 text-center">
                                        <MapPin className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
                                        <p className="text-sm text-muted-foreground">Save addresses for quicker booking</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Add New Address</Label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            placeholder="Enter full address with flat/house number, street, landmark..."
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                    <Button disabled={!address.trim()} onClick={() => { setAddress(''); }}>
                                        Save Address
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <Card className="border-0 shadow-soft">
                                <div className="border-b px-6 py-4">
                                    <h3 className="font-semibold text-lg">Security</h3>
                                    <p className="text-sm text-muted-foreground">Manage your password and account security.</p>
                                </div>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Current Password</Label>
                                            <Input type="password" placeholder="Enter current password" className="bg-muted/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>New Password</Label>
                                            <Input type="password" placeholder="Enter new password" className="bg-muted/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Confirm New Password</Label>
                                            <Input type="password" placeholder="Confirm new password" className="bg-muted/50" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4 border-t">
                                        <Button>Update Password</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <Card className="border-0 shadow-soft">
                                <div className="border-b px-6 py-4">
                                    <h3 className="font-semibold text-lg">Preferences</h3>
                                    <p className="text-sm text-muted-foreground">Customize your experience.</p>
                                </div>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Get updates about your bookings</p>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" defaultChecked className="peer sr-only" />
                                            <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                        <div>
                                            <p className="font-medium">SMS Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive SMS for service updates</p>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" defaultChecked className="peer sr-only" />
                                            <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                        <div>
                                            <p className="font-medium">Promotional Offers</p>
                                            <p className="text-sm text-muted-foreground">Receive offers and discounts</p>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input type="checkbox" className="peer sr-only" />
                                            <div className="h-6 w-11 rounded-full bg-muted-foreground/30 peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex justify-end">
                            <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                                Sign Out securely
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
