import { api } from './api'

declare global {
    interface Window {
        Razorpay: any
    }
}

export const paymentService = {
    /**
     * Create a Razorpay order via backend
     */
    async createOrder(booking_id: string) {
        const res = await api.post('/payments/create-order', { booking_id })
        return res.data.data
    },

    /**
     * Verify payment via backend
     */
    async verifyPayment(data: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
        booking_id: string
    }) {
        const res = await api.post('/payments/verify', data)
        return res.data.data
    },

    /**
     * Load Razorpay script dynamically
     */
    loadRazorpayScript(): Promise<boolean> {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    },

    /**
     * Open Razorpay checkout
     */
    async openCheckout(options: {
        order_id: string
        amount: number
        booking_id: string
        customerName: string
        customerEmail: string
        customerPhone: string
        preferredMethod?: string
        onSuccess: (response: any) => void
        onFailure: (error: any) => void
    }) {
        const loaded = await this.loadRazorpayScript()
        if (!loaded) {
            options.onFailure(new Error('Failed to load Razorpay SDK'))
            return
        }

        const prefillData: any = {
            name: options.customerName,
            email: options.customerEmail,
            contact: options.customerPhone,
        }

        if (options.preferredMethod) {
            prefillData.method = options.preferredMethod
        }

        const rzp = new window.Razorpay({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ROYK0JMAmeBjIC',
            amount: options.amount,
            currency: 'INR',
            name: 'FixMyHome Pro',
            description: 'Service Booking Payment',
            order_id: options.order_id,
            prefill: prefillData,
            theme: {
                color: '#09172e',
            },
            handler: (response: any) => {
                options.onSuccess(response)
            },
            modal: {
                ondismiss: () => {
                    options.onFailure(new Error('Payment cancelled by user'))
                },
            },
        })

        rzp.open()
    },
}
