import { z } from 'zod'

export const createBookingSchema = z.object({
    service_id: z.string().uuid('Invalid service selection'),
    booking_date: z.string().min(1, 'Please select a date'),
    booking_time: z.string().min(1, 'Please select a time'),
    booking_type: z.enum(['immediate', 'scheduled']),
    customer_address: z
        .string()
        .min(10, 'Address must be at least 10 characters')
        .max(500, 'Address is too long'),
    customer_lat: z.number().optional(),
    customer_lng: z.number().optional(),
    notes: z.string().max(500, 'Notes are too long').optional(),
})

export const ratingSchema = z.object({
    rating: z.number().min(1, 'Rating is required').max(5),
    review: z
        .string()
        .max(500, 'Review is too long')
        .optional()
        .or(z.literal('')),
})

export type CreateBookingFormData = z.infer<typeof createBookingSchema>
export type RatingFormData = z.infer<typeof ratingSchema>
