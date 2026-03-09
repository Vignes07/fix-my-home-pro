import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/* ─── Service Card (ServicesPage grid) ─── */
export function ServiceCardSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-white p-4 space-y-3">
            <Skeleton className="h-[120px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        </div>
    )
}

/* ─── Service Category Section (HomePage) ─── */
export function ServiceCategorySkeleton() {
    return (
        <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, sectionIdx) => (
                <section key={sectionIdx} className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] pb-12">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="space-y-3">
                                <Skeleton className="h-[312px] w-full rounded-[10px]" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}

/* ─── Service Detail Page ─── */
export function ServiceDetailSkeleton() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 bg-slate-50 min-h-screen">
            {/* Hero */}
            <Skeleton className="w-full h-[400px] md:h-[500px] rounded-[32px]" />

            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                {/* Left */}
                <div className="space-y-12">
                    {/* Includes & metadata */}
                    <div className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-24" />
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Skeleton className="h-3 w-24 mb-2" />
                                <Skeleton className="h-7 w-32" />
                            </div>
                            <div>
                                <Skeleton className="h-3 w-24 mb-2" />
                                <Skeleton className="h-7 w-24" />
                            </div>
                        </div>
                    </div>

                    {/* Service options */}
                    <div>
                        <Skeleton className="h-8 w-48 mb-6" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-200 mb-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-36" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-10 w-28 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    <div className="rounded-[32px] bg-white p-8 space-y-6">
                        <Skeleton className="h-7 w-40" />
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                        <Skeleton className="h-px w-full" />
                        <div className="flex justify-between">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                        <Skeleton className="h-16 w-full rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─── Booking Card (BookingHistoryPage) ─── */
export function BookingCardSkeleton() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-7 w-36 mb-2" />
            <Skeleton className="h-4 w-64 mb-8" />
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-card mb-4">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

/* ─── Payment Page ─── */
export function PaymentSkeleton() {
    return (
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-4 w-56 mb-8" />
            <Card className="border-0 shadow-elevated">
                <div className="h-1.5 bg-muted rounded-t-xl" />
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-5 w-28" />
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="flex justify-between">
                        <Skeleton className="h-7 w-16" />
                        <Skeleton className="h-7 w-20" />
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                    <Skeleton className="h-11 w-full rounded-md" />
                </CardContent>
            </Card>
        </div>
    )
}

/* ─── Admin Dashboard ─── */
export function DashboardStatsSkeleton() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-4 w-52" />
            </div>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="border-0 shadow-card">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-7 w-16" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-11 w-11 rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Panels */}
            <div className="grid gap-6 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} className="border-0 shadow-card">
                        <CardHeader>
                            <Skeleton className="h-6 w-44" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <Skeleton key={j} className="h-16 w-full rounded-lg" />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

/* ─── Table skeleton (AdminServicesPage, AdminBookingsPage, TestDataViewer) ─── */
export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-border bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            {Array.from({ length: cols }).map((_, i) => (
                                <th key={i} className="px-4 py-3">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-border/50 last:border-0">
                                {Array.from({ length: cols }).map((_, colIdx) => (
                                    <td key={colIdx} className="px-4 py-3">
                                        <Skeleton className={`h-4 ${colIdx === 0 ? 'w-32' : 'w-16'}`} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/* ─── Technician Card (AdminTechniciansPage) ─── */
export function TechnicianCardSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-card">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                    <Skeleton className="h-5 w-16 rounded-full ml-2" />
                                </div>
                                <div className="grid gap-2 sm:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <Skeleton key={j} className="h-4 w-28" />
                                    ))}
                                </div>
                                <div className="grid gap-2 sm:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <Skeleton key={j} className="h-4 w-28" />
                                    ))}
                                </div>
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-36 rounded-md" />
                                <Skeleton className="h-9 w-20 rounded-md" />
                                <Skeleton className="h-9 w-20 rounded-md" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

/* ─── Job Card (TechJobsPage) ─── */
export function JobCardSkeleton() {
    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <Skeleton className="h-7 w-16 mb-2" />
                <Skeleton className="h-4 w-56" />
            </div>
            {/* Available jobs */}
            <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="border-0 shadow-card overflow-hidden">
                            <div className="h-1 bg-muted" />
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-5 w-12 rounded-full" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-44" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="h-10 flex-1 rounded-md" />
                                    <Skeleton className="h-10 flex-1 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
