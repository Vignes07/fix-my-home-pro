import { supabase } from './supabase'

export const authService = {
    /**
     * Sign In with Email/Password
     */
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return data
    },

    /**
     * Sign Up
     */
    async signUp(email: string, password: string, metadata: { full_name: string, phone: string, user_type: string }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        })
        if (error) throw error
        return data
    },

    /**
     * Get current session
     */
    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        return data.session
    },

    /**
     * Sign out
     */
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    /**
     * Listen for auth state changes
     */
    onAuthStateChange(callback: (event: string, session: unknown) => void) {
        return supabase.auth.onAuthStateChange(callback)
    },
}
