import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Clock } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import { cn } from '@/utils/cn'

interface ServiceCardProps {
    id: string
    name: string
    description?: string
    basePrice: number
    estimatedDuration: number
    categoryName?: string
    rating?: number
    imageUrl?: string
    thumbnailUrl?: string
    className?: string
}

export function ServiceCard({
    id,
    name,
    description,
    basePrice,
    estimatedDuration,
    categoryName,
    rating,
    imageUrl,
    thumbnailUrl,
    className,
}: ServiceCardProps) {
    const displayImage = thumbnailUrl || imageUrl
    return (
        <Link to={`/services/${id}`}>
            <Card className={cn('group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1', className)}>
                {/* Image Section */}
                <div className="h-40 w-full overflow-hidden bg-muted">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-accent/20">
                            <span className="text-4xl">🛠️</span>
                        </div>
                    )}
                </div>
                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                            {categoryName && (
                                <Badge variant="secondary" className="text-[10px]">
                                    {categoryName}
                                </Badge>
                            )}
                            <h3 className="text-[24px] font-semibold text-foreground group-hover:text-primary transition-colors">
                                {name}
                            </h3>
                            {description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {description}
                                </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {estimatedDuration} min
                                </span>
                                {rating && (
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        {rating.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                                {formatPrice(basePrice)}
                            </p>
                            <p className="text-xs text-muted-foreground">onwards</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
