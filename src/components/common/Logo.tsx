import { Wrench } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    showText?: boolean
}

export function Logo({ size = 'md', className, showText = true }: LogoProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
    }

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="relative">
                <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-2 shadow-md">
                    <Wrench className={cn('text-white', sizeClasses[size])} />
                </div>
                <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className={cn('font-bold leading-tight text-foreground', textSizes[size])}>
                        FixMyHome
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                        Pro
                    </span>
                </div>
            )}
        </div>
    )
}
