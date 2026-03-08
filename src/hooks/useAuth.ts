import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { authService } from '@/services/auth.service'

/**
 * Custom hook for auth operations.
 * Wraps the Zustand auth store with navigation + Supabase side-effects.
 */
export function useAuth() {
    const navigate = useNavigate()
    const {
        user,
        session,
        isAuthenticated,
        userType,
        isLoading,
        setUser,
        setSession,
        setLoading,
        login,
        logout: storeLogout,
    } = useAuthStore()

    // Listen for Supabase auth state changes on mount
    useEffect(() => {
        const { data: { subscription } } = authService.onAuthStateChange(
            (_event, session) => {
                setSession(session as any) // suppress TS mismatch with Supabase generic
                if (!session) {
                    storeLogout()
                }
            }
        )
        return () => subscription.unsubscribe()
    }, [setSession, storeLogout])

    const signOut = useCallback(async () => {
        setLoading(true)
        try {
            await authService.signOut()
            storeLogout()
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }, [setLoading, storeLogout, navigate])

    return {
        user,
        session,
        isAuthenticated,
        userType,
        isLoading,
        setUser,
        login,
        signOut,
    }
}
