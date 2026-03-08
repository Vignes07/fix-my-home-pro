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
    email: string
    isLoading: boolean

    // Actions
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    setEmail: (email: string) => void
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
            email: '',
            isLoading: false,

            setUser: (user) =>
                set({
                    user,
                    userType: user?.user_type ?? null,
                    isAuthenticated: !!user,
                }),

            setSession: (session) =>
                set({ session, isAuthenticated: !!session }),

            setEmail: (email) => set({ email }),

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
                    email: '',
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
