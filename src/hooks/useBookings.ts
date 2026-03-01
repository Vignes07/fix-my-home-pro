import { useState, useCallback } from 'react'
import { useBookingStore } from '@/stores/useBookingStore'
import { bookingService } from '@/services/booking.service'
import type { Booking } from '@/types/booking.types'

/**
 * Custom hook for booking CRUD operations.
 * Wraps the Zustand booking store with API calls.
 */
export function useBookings() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {
        selectedCategory,
        selectedService,
        bookingDetails,
        activeBooking,
        bookingHistory,
        setSelectedCategory,
        setSelectedService,
        setBookingDetails,
        setActiveBooking,
        setBookingHistory,
    } = useBookingStore()

    const fetchBookings = useCallback(async (token: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const data: any = await bookingService.getBookings(token)
            setBookingHistory(data)
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
            return []
        } finally {
            setIsLoading(false)
        }
    }, [setBookingHistory])

    const fetchBooking = useCallback(async (id: string, token: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const data: any = await bookingService.getBooking(id, token)
            setActiveBooking(data)
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch booking')
            return null
        } finally {
            setIsLoading(false)
        }
    }, [setActiveBooking])

    const createBooking = useCallback(async (payload: Parameters<typeof bookingService.createBooking>[0], token: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const data: any = await bookingService.createBooking(payload, token)
            setActiveBooking(data)
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking')
            return null
        } finally {
            setIsLoading(false)
        }
    }, [setActiveBooking])

    const cancelBooking = useCallback(async (id: string, reason: string, token: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const data: any = await bookingService.cancelBooking(id, reason, token)
            setActiveBooking(data)
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel booking')
            return null
        } finally {
            setIsLoading(false)
        }
    }, [setActiveBooking])

    const rateBooking = useCallback(async (id: string, rating: number, review: string, token: string) => {
        setIsLoading(true)
        setError(null)
        try {
            await bookingService.submitRating(id, rating, review, token)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit rating')
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        // State
        selectedCategory,
        selectedService,
        bookingDetails,
        activeBooking,
        bookingHistory,
        isLoading,
        error,
        // Actions
        setSelectedCategory,
        setSelectedService,
        setBookingDetails,
        fetchBookings,
        fetchBooking,
        createBooking,
        cancelBooking,
        rateBooking,
    }
}
