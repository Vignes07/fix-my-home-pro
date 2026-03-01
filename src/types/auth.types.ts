import type { Session } from '@supabase/supabase-js'

export interface AuthState {
    isAuthenticated: boolean
    session: Session | null
    phone: string
}
