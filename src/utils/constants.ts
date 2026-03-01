export const APP_NAME = 'FixMyHome Pro'
export const APP_DESCRIPTION = 'On-demand home services at your doorstep'

export const SERVICE_CATEGORIES = [
    { id: 'plumbing', name: 'Plumbing', icon: 'Wrench', color: '#3b82f6' },
    { id: 'electrical', name: 'Electrical', icon: 'Zap', color: '#f59e0b' },
    { id: 'ac-service', name: 'AC Service', icon: 'Wind', color: '#06b6d4' },
    { id: 'appliance', name: 'Appliance Repair', icon: 'Tv', color: '#8b5cf6' },
    { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', color: '#d97706' },
    { id: 'painting', name: 'Painting', icon: 'Paintbrush', color: '#10b981' },
] as const

export const BOOKING_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    TECHNICIAN_ASSIGNED: 'technician_assigned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    PAYMENT_PENDING: 'payment_pending',
} as const

export const USER_TYPES = {
    CUSTOMER: 'customer',
    TECHNICIAN: 'technician',
    ADMIN: 'admin',
} as const

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    VERIFY_OTP: '/verify-otp',
    REGISTER: '/register',
    SERVICES: '/services',
    SERVICE_DETAIL: '/services/:id',
    BOOKING_NEW: '/booking/new',
    BOOKING_PAYMENT: '/booking/:id/payment',
    BOOKING_TRACKING: '/booking/:id/tracking',
    BOOKINGS: '/bookings',
    CHAT: '/chat/:bookingId',
    PROFILE: '/profile',

    // Technician
    TECH_DASHBOARD: '/technician',
    TECH_REGISTER: '/technician/register',
    TECH_JOBS: '/technician/jobs',
    TECH_JOB_DETAIL: '/technician/jobs/:id',
    TECH_EARNINGS: '/technician/earnings',
    TECH_WALLET: '/technician/wallet',

    // Admin
    ADMIN_DASHBOARD: '/admin',
    ADMIN_TECHNICIANS: '/admin/technicians',
    ADMIN_BOOKINGS: '/admin/bookings',
    ADMIN_SERVICES: '/admin/services',
} as const
