import { supabase } from './supabase'

export const authService = {
    /**
     * Send OTP to phone number
     */
    async sendOtp(phone: string) {
        const { data, error } = await supabase.auth.signInWithOtp({
            phone,
            options: {
                channel: 'sms',
            },
        })
        if (error) throw error
        return data
    },

    /**
     * Verify OTP
     */
    async verifyOtp(phone: string, token: string) {
        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
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
