export interface ServiceCategory {
    id: string
    name: string
    icon_url?: string
    is_active: boolean
    display_order: number
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
}
