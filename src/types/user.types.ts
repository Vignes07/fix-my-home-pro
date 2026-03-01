export type UserType = 'customer' | 'technician' | 'admin'

export interface User {
    id: string
    phone: string
    email?: string
    full_name: string
    user_type: UserType
    profile_photo_url?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Technician {
    id: string
    user_id: string
    aadhar_number?: string
    pan_number?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    police_verification_status: 'pending' | 'verified' | 'rejected'
    kyc_verified: boolean
    approval_status: 'pending' | 'approved' | 'rejected'
    commission_rate: number
    rating: number
    total_jobs_completed: number
    wallet_balance: number
    bank_account_number?: string
    bank_ifsc_code?: string
    bank_account_holder_name?: string
    created_at: string
}
