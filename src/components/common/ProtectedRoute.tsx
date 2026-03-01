import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import type { UserType } from '@/types/user.types'
import { LoadingSpinner } from './LoadingSpinner'

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: UserType[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, userType, isLoading } = useAuthStore()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner size="lg" text="Loading..." />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles && userType && !allowedRoles.includes(userType)) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
