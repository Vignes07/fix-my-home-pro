export interface ServiceCategory {
    id: string
    name: string
    icon_url?: string
    is_active: boolean
    display_order: number
}

export interface ServiceOption {
    id: string
    service_id: string
    name: string
    description?: string
    price: number
    estimated_duration?: number
    image_url?: string
}

export interface Service {
    id: string
    category_id: string
    name: string
    description?: string
    base_price: number
    estimated_duration: number // minutes
    is_active: boolean
    category?: ServiceCategory
    image_url?: string
    categoryName?: string
    includes?: string[]
    service_options?: ServiceOption[]
}
