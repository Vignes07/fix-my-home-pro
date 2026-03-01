import { z } from 'zod'

export const profileSchema = z.object({
    full_name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long'),
    email: z
        .string()
        .email('Enter a valid email address')
        .optional()
        .or(z.literal('')),
})

export const technicianKycSchema = z.object({
    aadhar_number: z
        .string()
        .length(12, 'Aadhar number must be 12 digits')
        .regex(/^\d{12}$/, 'Aadhar number must contain only digits'),
    pan_number: z
        .string()
        .length(10, 'PAN number must be 10 characters')
        .regex(/^[A-Z]{5}\d{4}[A-Z]$/, 'Enter a valid PAN number'),
    address: z.string().min(10, 'Address must be at least 10 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z
        .string()
        .length(6, 'Pincode must be 6 digits')
        .regex(/^\d{6}$/, 'Pincode must contain only digits'),
    bank_account_number: z
        .string()
        .min(9, 'Account number must be at least 9 digits')
        .max(18, 'Account number is too long')
        .regex(/^\d+$/, 'Account number must contain only digits'),
    bank_ifsc_code: z
        .string()
        .length(11, 'IFSC code must be 11 characters')
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code'),
    bank_account_holder_name: z
        .string()
        .min(2, 'Account holder name is required'),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type TechnicianKycFormData = z.infer<typeof technicianKycSchema>
