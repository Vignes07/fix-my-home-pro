import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Smartphone, Clock, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api'
import { DashboardStatsSkeleton } from '@/components/common/skeletons'

export default function TechnicianDashboard() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/technician/me')
                if (res.data?.success) {
                    setProfile(res.data.data) // Will be null if no profile exists
                }
            } catch (error) {
                console.error("Failed to fetch technician profile", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (isLoading) {
        return <div className="p-8"><DashboardStatsSkeleton /></div>
    }

    // Not registered yet
    if (!profile) {
        navigate('/join-us', { replace: true })
        return null
    }

    const { approval_status, admin_notes } = profile

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-lg text-center animate-fade-in">

                {approval_status === 'pending' && (
                    <Card className="border-0 shadow-elevated">
                        <CardContent className="pt-10 pb-10 flex flex-col items-center">
                            <div className="rounded-full bg-amber-100 p-4 mb-6">
                                <Clock className="h-12 w-12 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Application Under Review</h2>
                            <p className="text-muted-foreground mb-6">
                                Your registration details and documents are currently being verified by our team.
                                This process usually takes 24-48 hours.
                            </p>
                            <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                                You will be notified via SMS or email once your account is approved.
                            </div>
                        </CardContent>
                    </Card>
                )}

                {approval_status === 'rejected' && (
                    <Card className="border-0 shadow-elevated">
                        <CardContent className="pt-10 pb-10 flex flex-col items-center">
                            <div className="rounded-full bg-red-100 p-4 mb-6">
                                <XCircle className="h-12 w-12 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Application Rejected</h2>
                            <p className="text-muted-foreground mb-6">
                                Unfortunately, we could not approve your application at this time.
                            </p>
                            {admin_notes && (
                                <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 mb-6 text-left">
                                    <strong>Admin Notes:</strong> {admin_notes}
                                </div>
                            )}
                            <Button onClick={() => navigate('/contact')}>Contact Support</Button>
                        </CardContent>
                    </Card>
                )}

                {approval_status === 'approved' && (
                    <Card className="border-0 shadow-elevated bg-[#001c30] text-white">
                        <CardContent className="pt-12 pb-12 flex flex-col items-center">
                            <div className="rounded-full bg-[#facc15] p-5 mb-8">
                                <Smartphone className="h-16 w-16 text-[#001c30]" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 font-heading tracking-tight">You're Approved!</h2>
                            <p className="text-[16px] text-white/80 mb-8 max-w-[300px]">
                                Download the FixMyHome Pro app to start accepting jobs and earning money.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-[40px] text-lg font-semibold">
                                    Download for iOS
                                </Button>
                                <Button className="bg-[#facc15] text-black hover:bg-[#e5b800] px-8 py-6 rounded-[40px] text-lg font-semibold">
                                    Download for Android
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
