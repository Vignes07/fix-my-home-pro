import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { useAuthStore } from '@/stores/useAuthStore'

export function RootLayout() {
    const { userType } = useAuthStore()
    const location = useLocation()

    // Restrict technicians from Customer-specific pages
    if (userType === 'technician') {
        const allowedTechPublicPaths = ['/about', '/contact', '/join-us', '/profile']
        // If they try to access home, services, booking, redirect to their main hub
        if (!allowedTechPublicPaths.includes(location.pathname)) {
            return <Navigate to="/technician" replace />
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
