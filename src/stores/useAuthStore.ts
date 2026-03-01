import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session } from '@supabase/supabase-js'
import type { User, UserType } from '@/types/user.types'

interface AuthStore {
    // State
    user: User | null
    session: Session | null
    isAuthenticated: boolean
    userType: UserType | null
    phone: string
    isLoading: boolean

    // Actions
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    setPhone: (phone: string) => void
    setLoading: (loading: boolean) => void
    login: (user: User, session: Session) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            isAuthenticated: false,
            userType: null,
            phone: '',
            isLoading: false,

            setUser: (user) =>
                set({
                    user,
                    userType: user?.user_type ?? null,
                    isAuthenticated: !!user,
                }),

            setSession: (session) =>
                set({ session, isAuthenticated: !!session }),

            setPhone: (phone) => set({ phone }),

            setLoading: (isLoading) => set({ isLoading }),

            login: (user, session) =>
                set({
                    user,
                    session,
                    isAuthenticated: true,
                    userType: user.user_type,
                }),

            logout: () =>
                set({
                    user: null,
                    session: null,
                    isAuthenticated: false,
                    userType: null,
                    phone: '',
                }),
        }),
        {
            name: 'fixmyhome-auth',
            partialize: (state) => ({
                user: state.user,
                session: state.session,
                isAuthenticated: state.isAuthenticated,
                userType: state.userType,
            }),
        }
    )
)
