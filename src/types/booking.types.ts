export type BookingStatus =
    | 'pending'
    | 'accepted'
    | 'technician_assigned'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'payment_pending'

export type BookingType = 'immediate' | 'scheduled'

export interface Booking {
    id: string
    customer_id: string
    technician_id?: string
    service_id: string
    booking_date: string
    booking_time: string
    booking_type: BookingType
    status: BookingStatus
    customer_address: string
    customer_lat?: number
    customer_lng?: number
    estimated_price?: number
    final_price?: number
    commission_amount?: number
    technician_payout?: number
    payment_method?: string
    payment_status: string
    razorpay_order_id?: string
    razorpay_payment_id?: string
    cancellation_reason?: string
    customer_rating?: number
    customer_review?: string
    completed_at?: string
    created_at: string
    updated_at: string
}

export interface Message {
    id: string
    booking_id: string
    sender_id: string
    sender_type: 'customer' | 'technician'
    message: string
    media_url?: string
    read_at?: string
    created_at: string
}

export interface WalletTransaction {
    id: string
    technician_id: string
    booking_id?: string
    transaction_type: 'credit' | 'debit' | 'payout'
    amount: number
    balance_after: number
    description?: string
    razorpay_payout_id?: string
    status: string
    created_at: string
}
