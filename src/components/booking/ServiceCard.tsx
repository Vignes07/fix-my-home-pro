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
    className,
}: ServiceCardProps) {
    return (
        <Link to={`/services/${id}`}>
            <Card className={cn('group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1', className)}>
                {/* Gradient top bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                            {categoryName && (
                                <Badge variant="secondary" className="text-[10px]">
                                    {categoryName}
                                </Badge>
                            )}
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
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
