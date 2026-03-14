import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { apiCache } from '@/utils/cache'

interface SiteSection {
    section_key: string
    title?: string
    subtitle?: string
    description?: string
    image_url?: string
    button_text?: string
    button_link?: string
    bg_color?: string
    metadata?: any
    items?: SiteItem[]
}

interface SiteItem {
    id?: string
    section_key?: string
    title: string
    subtitle?: string
    description?: string
    image_url?: string
    button_text?: string
    button_link?: string
    bg_color?: string
    price?: string
    rating?: string
    display_order?: number
    metadata?: any
}

export type { SiteSection, SiteItem }

/**
 * Fetch all site content sections + items from the CMS.
 * Returns a map keyed by section_key.
 */
export function useSiteContent() {
    const [content, setContent] = useState<Record<string, SiteSection>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const cacheKey = '/content'
                const cached = apiCache.get<Record<string, SiteSection>>(cacheKey)
                if (cached) {
                    setContent(cached)
                    setLoading(false)
                    return
                }

                const res = await api.get('/content')
                if (res.data?.success) {
                    apiCache.set(cacheKey, res.data.data) // 5 min cache
                    setContent(res.data.data)
                }
            } catch (err) {
                console.error('Failed to load site content:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [])

    const getSection = (key: string): SiteSection | undefined => content[key]
    const getItems = (key: string): SiteItem[] => content[key]?.items || []

    return { content, loading, getSection, getItems }
}
