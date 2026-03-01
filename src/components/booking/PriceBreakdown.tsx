import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/utils/format'

interface PriceItem {
    label: string
    amount: number
    type?: 'add' | 'discount'
}

interface PriceBreakdownProps {
    items: PriceItem[]
    total: number
    className?: string
}

export function PriceBreakdown({ items, total, className }: PriceBreakdownProps) {
    return (
        <div className={className}>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={item.type === 'discount' ? 'text-emerald-600' : ''}>
                            {item.type === 'discount' ? '-' : ''}{formatPrice(Math.abs(item.amount))}
                        </span>
                    </div>
                ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-lg text-primary">{formatPrice(total)}</span>
            </div>
        </div>
    )
}
