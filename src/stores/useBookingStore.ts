import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Booking } from '@/types/booking.types'
import type { Service, ServiceCategory } from '@/types/service.types'

interface BookingStore {
    // Current Booking Draft State
    currentStep: number
    bookingType: 'immediate' | 'scheduled'
    selectedDate: string
    selectedTime: string
    houseNo: string
    street: string
    landmark: string
    city: string
    state: string
    pincode: string

    // Other State
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
    updateDraft: (data: Partial<BookingStore>) => void
    setSelectedCategory: (category: ServiceCategory | null) => void
    setSelectedService: (service: Service | null) => void
    setBookingDetails: (details: BookingStore['bookingDetails']) => void
    setActiveBooking: (booking: Booking | null) => void
    setBookingHistory: (bookings: Booking[]) => void
    setLoading: (loading: boolean) => void
    resetBookingFlow: () => void
}

export const useBookingStore = create<BookingStore>()(
    persist(
        (set) => ({
            // Draft Default State
            currentStep: 0,
            bookingType: 'scheduled',
            selectedDate: '',
            selectedTime: '',
            houseNo: '',
            street: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',

            selectedCategory: null,
            selectedService: null,
            bookingDetails: null,
            activeBooking: null,
            bookingHistory: [],
            isLoading: false,

            updateDraft: (data) => set((state) => ({ ...state, ...data })),
            setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
            setSelectedService: (selectedService) => set({ selectedService }),
            setBookingDetails: (bookingDetails) => set({ bookingDetails }),
            setActiveBooking: (activeBooking) => set({ activeBooking }),
            setBookingHistory: (bookingHistory) => set({ bookingHistory }),
            setLoading: (isLoading) => set({ isLoading }),

            resetBookingFlow: () =>
                set({
                    currentStep: 0,
                    bookingType: 'scheduled',
                    selectedDate: '',
                    selectedTime: '',
                    houseNo: '',
                    street: '',
                    landmark: '',
                    city: '',
                    state: '',
                    pincode: '',
                    selectedCategory: null,
                    selectedService: null,
                    bookingDetails: null,
                }),
        }),
        {
            name: 'booking-draft-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                currentStep: state.currentStep,
                bookingType: state.bookingType,
                selectedDate: state.selectedDate,
                selectedTime: state.selectedTime,
                houseNo: state.houseNo,
                street: state.street,
                landmark: state.landmark,
                city: state.city,
                state: state.state,
                pincode: state.pincode,
            }), // Only persist these fields
        }
    )
)
