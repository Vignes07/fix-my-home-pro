type CacheEntry<T> = {
    data: T
    timestamp: number
}

// 5 minutes in milliseconds
const DEFAULT_TTL = 5 * 60 * 1000

class ApiCache {
    private cache: Map<string, CacheEntry<any>> = new Map()

    /**
     * Set data in cache
     */
    set<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        })
    }

    /**
     * Get data from cache if it exists and hasn't expired
     */
    get<T>(key: string, ttl: number = DEFAULT_TTL): T | null {
        const entry = this.cache.get(key)

        if (!entry) return null

        const isExpired = Date.now() - entry.timestamp > ttl
        if (isExpired) {
            this.cache.delete(key)
            return null
        }

        return entry.data as T
    }

    /**
     * Clear specific cache key
     */
    invalidate(key: string): void {
        this.cache.delete(key)
    }

    /**
     * Clear entire cache
     */
    clear(): void {
        this.cache.clear()
    }
}

export const apiCache = new ApiCache()
