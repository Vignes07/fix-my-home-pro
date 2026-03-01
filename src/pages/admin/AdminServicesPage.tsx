import { useState } from 'react'
import { Plus, Edit, Trash2, Search, Wrench, Zap, Wind, Tv, Hammer, Paintbrush, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'

const categories: { id: string; name: string; icon: LucideIcon; color: string; serviceCount: number; active: boolean }[] = [
    { id: 'plumbing', name: 'Plumbing', icon: Wrench, color: 'from-blue-500 to-blue-600', serviceCount: 8, active: true },
    { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-amber-500 to-amber-600', serviceCount: 6, active: true },
    { id: 'ac-service', name: 'AC Service', icon: Wind, color: 'from-cyan-500 to-cyan-600', serviceCount: 5, active: true },
    { id: 'appliance', name: 'Appliance Repair', icon: Tv, color: 'from-violet-500 to-violet-600', serviceCount: 7, active: true },
    { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'from-orange-500 to-orange-600', serviceCount: 4, active: true },
    { id: 'painting', name: 'Painting', icon: Paintbrush, color: 'from-emerald-500 to-emerald-600', serviceCount: 3, active: false },
]

const mockServices = [
    { id: '1', name: 'Tap Repair & Replacement', category: 'Plumbing', price: 199, duration: 30, active: true, bookings: 245 },
    { id: '2', name: 'Pipe Leak Fix', category: 'Plumbing', price: 349, duration: 60, active: true, bookings: 189 },
    { id: '3', name: 'Switch & Socket Repair', category: 'Electrical', price: 149, duration: 20, active: true, bookings: 312 },
    { id: '4', name: 'AC Regular Service', category: 'AC Service', price: 399, duration: 60, active: true, bookings: 534 },
    { id: '5', name: 'AC Gas Refill', category: 'AC Service', price: 1499, duration: 90, active: true, bookings: 167 },
    { id: '6', name: 'Washing Machine Repair', category: 'Appliance', price: 349, duration: 60, active: false, bookings: 98 },
]

export default function AdminServicesPage() {
    const [search, setSearch] = useState('')

    const filtered = mockServices.filter((s) =>
        !search || s.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Service Management</h1>
                    <p className="text-muted-foreground">Manage categories, services, and pricing</p>
                </div>
                <Button className="gap-2"><Plus className="h-4 w-4" /> Add Service</Button>
            </div>

            {/* Categories */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Categories</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map((cat) => {
                        const Icon = cat.icon
                        return (
                            <Card key={cat.id} className={cn('border-0 shadow-card cursor-pointer transition-all hover:shadow-elevated', !cat.active && 'opacity-50')}>
                                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                                    <div className={cn('rounded-xl bg-gradient-to-br p-2.5', cat.color)}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <p className="text-xs font-semibold">{cat.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{cat.serviceCount} services</p>
                                    <Badge variant={cat.active ? 'success' : 'secondary'} className="text-[10px]">
                                        {cat.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Services Table */}
            <Card className="border-0 shadow-card">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle>All Services</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search services..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Service</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Category</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Price</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Duration</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Bookings</th>
                                    <th className="pb-3 text-center font-medium text-muted-foreground">Status</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((service) => (
                                    <tr key={service.id} className="border-b border-border/50 last:border-0">
                                        <td className="py-3 font-medium">{service.name}</td>
                                        <td className="py-3"><Badge variant="secondary" className="text-[10px]">{service.category}</Badge></td>
                                        <td className="py-3 text-right">₹{service.price}</td>
                                        <td className="py-3 text-right">{service.duration} min</td>
                                        <td className="py-3 text-right">{service.bookings}</td>
                                        <td className="py-3 text-center">
                                            <Badge variant={service.active ? 'success' : 'secondary'} className="text-[10px]">
                                                {service.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
