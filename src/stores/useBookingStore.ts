import { create } from 'zustand'
import type { Booking } from '@/types/booking.types'
import type { Service, ServiceCategory } from '@/types/service.types'

interface BookingStore {
    // State
    selectedCategory: ServiceCategory | null
    selectedService: Service | null
    bookingDetails: {
        date: string
        time: string
        address: string
        lat?: number
        lng?: number
        bookingType: 'immediate' | 'scheduled'
    } | null
    activeBooking: Booking | null
    bookingHistory: Booking[]
    isLoading: boolean

    // Actions
    setSelectedCategory: (category: ServiceCategory | null) => void
    setSelectedService: (service: Service | null) => void
    setBookingDetails: (details: BookingStore['bookingDetails']) => void
    setActiveBooking: (booking: Booking | null) => void
    setBookingHistory: (bookings: Booking[]) => void
    setLoading: (loading: boolean) => void
    resetBookingFlow: () => void
}

export const useBookingStore = create<BookingStore>((set) => ({
    selectedCategory: null,
    selectedService: null,
    bookingDetails: null,
    activeBooking: null,
    bookingHistory: [],
    isLoading: false,

    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setSelectedService: (selectedService) => set({ selectedService }),
    setBookingDetails: (bookingDetails) => set({ bookingDetails }),
    setActiveBooking: (activeBooking) => set({ activeBooking }),
    setBookingHistory: (bookingHistory) => set({ bookingHistory }),
    setLoading: (isLoading) => set({ isLoading }),

    resetBookingFlow: () =>
        set({
            selectedCategory: null,
            selectedService: null,
            bookingDetails: null,
        }),
}))
