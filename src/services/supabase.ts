import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidUrl(url: string | undefined): boolean {
    if (!url) return false
    try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false
    }
}

const hasValidConfig = isValidUrl(supabaseUrl) && !!supabaseAnonKey

if (!hasValidConfig) {
    console.warn(
        '⚠️ Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.\n' +
        '   Auth features will be unavailable until configured.'
    )
}

export const supabase: SupabaseClient = hasValidConfig
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder')
