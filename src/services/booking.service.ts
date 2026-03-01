import { api } from './api'
import type { Booking } from '@/types/booking.types'

export const bookingService = {
    /**
     * Get all bookings for current user
     */
    async getBookings(token: string) {
        return api.get<Booking[]>('/bookings', { headers: { Authorization: `Bearer ${token}` } })
    },

    /**
     * Get a single booking by ID
     */
    async getBooking(id: string, token: string) {
        return api.get<Booking>(`/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    },

    /**
     * Create a new booking
     */
    async createBooking(data: Partial<Booking>, token: string) {
        return api.post<Booking>('/bookings', data, { headers: { Authorization: `Bearer ${token}` } })
    },

    /**
     * Update booking status
     */
    async updateBookingStatus(id: string, status: string, token: string) {
        return api.patch<Booking>(`/bookings/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
    },

    /**
     * Cancel a booking
     */
    async cancelBooking(id: string, reason: string, token: string) {
        return api.post<Booking>(`/bookings/${id}/cancel`, { reason }, { headers: { Authorization: `Bearer ${token}` } })
    },

    /**
     * Submit rating for a booking
     */
    async submitRating(id: string, rating: number, review: string, token: string) {
        return api.post(`/bookings/${id}/rating`, { rating, review }, { headers: { Authorization: `Bearer ${token}` } })
    },
}
