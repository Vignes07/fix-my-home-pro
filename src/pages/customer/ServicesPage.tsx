import { useState, useEffect, useDeferredValue } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ServiceCard } from '@/components/booking/ServiceCard'
import { api } from '@/services/api'
import { apiCache } from '@/utils/cache'
import { ServiceCardSkeleton } from '@/components/common/skeletons'

export default function ServicesPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeCategory = searchParams.get('category') || 'all'
    const [searchQuery, setSearchQuery] = useState('')
    const deferredSearchQuery = useDeferredValue(searchQuery)

    const [categories, setCategories] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        const fetchCategoriesAndServices = async () => {
            try {
                // Check cache first
                const cacheKey = '/services/grouped'
                const cachedData = apiCache.get<any>(cacheKey)

                if (cachedData) {
                    processData(cachedData)
                    setIsLoading(false)
                    return
                }

                const response = await api.get('/services/grouped', {
                    signal: controller.signal
                })
                if (response.data?.success) {
                    apiCache.set(cacheKey, response.data.data) // Save to cache
                    processData(response.data.data)
                }
            } catch (error: any) {
                if (error.name === 'CanceledError' || error.message === 'canceled') return
                console.error("Error fetching services", error)
            } finally {
                setIsLoading(false)
            }
        }

        const processData = (fetchedCategories: any[]) => {
            setCategories(fetchedCategories)

            // Flatten all services from all categories into one array
            const allServices: any[] = []
            fetchedCategories.forEach((cat: any) => {
                if (cat.services) {
                    cat.services.forEach((svc: any) => {
                        allServices.push({
                            ...svc,
                            categoryName: cat.name // Attach category name for the UI card
                        })
                    })
                }
            })
            setServices(allServices)
        }

        fetchCategoriesAndServices()

        return () => {
            controller.abort()
        }
    }, [])

    const filteredServices = services.filter((service) => {
        const matchesCategory = activeCategory === 'all' || service.category_id === activeCategory
        const matchesSearch =
            !deferredSearchQuery ||
            service.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(deferredSearchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[42px] font-bold">Our Services</h1>
                <p className="mt-2 text-[14px] text-muted-foreground">
                    Browse and book professional home services
                </p>
            </div>

            {/* Search */}
            <div className="mb-6 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                </Button>
            </div>

            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2">
                <Badge
                    variant={activeCategory === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer px-3 py-1.5 text-sm"
                    onClick={() => setSearchParams({})}
                >
                    All Services
                </Badge>
                {categories.map((cat) => (
                    <Badge
                        key={cat.id}
                        variant={activeCategory === cat.id ? 'default' : 'outline'}
                        className="cursor-pointer px-3 py-1.5 text-sm"
                        onClick={() => setSearchParams({ category: cat.id })}
                    >
                        {cat.name}
                    </Badge>
                ))}
            </div>

            {/* Services Grid */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 15 }).map((_, idx) => (
                        <ServiceCardSkeleton key={idx} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredServices.map((service) => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                name={service.name}
                                description={service.description}
                                basePrice={service.base_price}
                                estimatedDuration={service.estimated_duration}
                                categoryName={service.categoryName}
                                rating={service.rating || 4.5}
                                imageUrl={service.image_url}
                                thumbnailUrl={service.thumbnail_url}
                            />
                        ))}
                    </div>

                    {filteredServices.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg font-medium text-muted-foreground">
                                No services found matching your criteria
                            </p>
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchQuery('')
                                    setSearchParams({})
                                }}
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
