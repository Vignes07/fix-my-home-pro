declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance
    }
}

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description?: string
    order_id: string
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    theme?: {
        color?: string
    }
    handler: (response: RazorpayResponse) => void
    modal?: {
        ondismiss?: () => void
    }
}

interface RazorpayInstance {
    open: () => void
    close: () => void
}

export interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

/**
 * Load Razorpay checkout script dynamically
 */
function loadRazorpayScript(): Promise<boolean> {
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
}

export const paymentService = {
    /**
     * Open Razorpay checkout
     */
    async openCheckout(options: {
        orderId: string
        amount: number
        customerName?: string
        customerEmail?: string
        customerPhone?: string
        description?: string
        onSuccess: (response: RazorpayResponse) => void
        onDismiss?: () => void
    }) {
        const loaded = await loadRazorpayScript()
        if (!loaded) {
            throw new Error('Razorpay SDK failed to load')
        }

        const rzp = new window.Razorpay({
            key: RAZORPAY_KEY,
            amount: options.amount * 100, // Convert to paise
            currency: 'INR',
            name: 'FixMyHome Pro',
            description: options.description || 'Service Booking Payment',
            order_id: options.orderId,
            prefill: {
                name: options.customerName,
                email: options.customerEmail,
                contact: options.customerPhone,
            },
            theme: {
                color: '#2563eb',
            },
            handler: options.onSuccess,
            modal: {
                ondismiss: options.onDismiss,
            },
        })

        rzp.open()
    },
}
