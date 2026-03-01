import { useState, useEffect } from 'react'

/**
 * Hook that returns true when a CSS media query matches.
 * Useful for responsive logic in components.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.matchMedia(query).matches
    })

    useEffect(() => {
        const mql = window.matchMedia(query)
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
        mql.addEventListener('change', handler)
        setMatches(mql.matches) // sync on mount
        return () => mql.removeEventListener('change', handler)
    }, [query])

    return matches
}
