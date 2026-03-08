import { z } from 'zod'

export const phoneSchema = z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(13, 'Phone number is too long')
    .regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a valid Indian phone number')

export const otpSchema = z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers')

export const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters')

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: passwordSchema,
})

export const registerSchema = z.object({
    full_name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long'),
    email: z.string().email('Enter a valid email address'),
    phone: phoneSchema,
    password: passwordSchema,
    user_type: z.enum(['customer', 'technician'], {
        message: 'Please select a user type',
    }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
