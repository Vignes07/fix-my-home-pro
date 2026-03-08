import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Loader2, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { api } from '@/services/api'
import { cn } from '@/utils/cn'

interface Service {
    id: string
    name: string
    description: string
    base_price: number
    estimated_duration: number
    is_active: boolean
    category_id: string
    category_name: string
    booking_count: number
    image_url?: string
}

interface Category {
    id: string
    name: string
    is_active: boolean
}

interface ServiceForm {
    name: string
    category_id: string
    description: string
    base_price: number
    estimated_duration: number
    is_active: boolean
}

const emptyForm: ServiceForm = {
    name: '',
    category_id: '',
    description: '',
    base_price: 0,
    estimated_duration: 60,
    is_active: true,
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<ServiceForm>(emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await api.get('/services/admin/all')
            setServices(res.data.data.services || [])
            setCategories(res.data.data.categories || [])
        } catch (err) {
            console.error('Failed to fetch services:', err)
            setError('Failed to load services')
        } finally {
            setLoading(false)
        }
    }

    const openAdd = () => {
        setEditingId(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const openEdit = (service: Service) => {
        setEditingId(service.id)
        setForm({
            name: service.name,
            category_id: service.category_id,
            description: service.description || '',
            base_price: service.base_price,
            estimated_duration: service.estimated_duration || 60,
            is_active: service.is_active,
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.name || !form.category_id || !form.base_price) {
            setError('Name, category, and price are required')
            return
        }
        setSaving(true)
        setError(null)
        try {
            if (editingId) {
                await api.patch(`/services/admin/${editingId}`, form)
            } else {
                await api.post('/services/admin', form)
            }
            setShowModal(false)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? If it has bookings, it will be deactivated instead.`)) return
        try {
            await api.delete(`/services/admin/${id}`)
            fetchData()
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    const handleToggleActive = async (service: Service) => {
        try {
            await api.patch(`/services/admin/${service.id}`, { is_active: !service.is_active })
            fetchData()
        } catch (err) {
            console.error('Failed to toggle:', err)
        }
    }

    const filtered = services.filter(s =>
        !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category_name.toLowerCase().includes(search.toLowerCase())
    )

    // Group services by category for the category cards
    const categoryCounts: Record<string, { total: number; active: number }> = {}
    services.forEach(s => {
        if (!categoryCounts[s.category_name]) categoryCounts[s.category_name] = { total: 0, active: 0 }
        categoryCounts[s.category_name].total++
        if (s.is_active) categoryCounts[s.category_name].active++
    })

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Service Management</h1>
                    <p className="text-muted-foreground">Manage categories, services, and pricing</p>
                </div>
                <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add Service</Button>
            </div>

            {/* Category Summary Cards */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Categories</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map(cat => (
                        <Card key={cat.id} className={cn('border-0 shadow-card cursor-pointer transition-all hover:shadow-elevated', !cat.is_active && 'opacity-50')}>
                            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                                <p className="text-xs font-semibold">{cat.name}</p>
                                <p className="text-[10px] text-muted-foreground">
                                    {categoryCounts[cat.name]?.active || 0} / {categoryCounts[cat.name]?.total || 0} services
                                </p>
                                <Badge variant={cat.is_active ? 'success' : 'secondary'} className="text-[10px]">
                                    {cat.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Services Table */}
            <Card className="border-0 shadow-card">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle>All Services ({services.length})</CardTitle>
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
                                {filtered.map(service => (
                                    <tr key={service.id} className="border-b border-border/50 last:border-0">
                                        <td className="py-3 font-medium">{service.name}</td>
                                        <td className="py-3"><Badge variant="secondary" className="text-[10px]">{service.category_name}</Badge></td>
                                        <td className="py-3 text-right">₹{service.base_price}</td>
                                        <td className="py-3 text-right">{service.estimated_duration || '-'} min</td>
                                        <td className="py-3 text-right">{service.booking_count}</td>
                                        <td className="py-3 text-center">
                                            <Badge
                                                variant={service.is_active ? 'success' : 'secondary'}
                                                className="text-[10px] cursor-pointer"
                                                onClick={() => handleToggleActive(service)}
                                            >
                                                {service.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => openEdit(service)}><Edit className="h-3.5 w-3.5" /></Button>
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(service.id, service.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg font-medium text-muted-foreground">No services found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}><X className="h-4 w-4" /></Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Service Name *</Label>
                                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. AC Regular Service" />
                            </div>
                            <div>
                                <Label>Category *</Label>
                                <select
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={form.category_id}
                                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                                >
                                    <option value="">Select category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <textarea
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Service description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (₹) *</Label>
                                    <Input type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <Label>Duration (min)</Label>
                                    <Input type="number" value={form.estimated_duration} onChange={e => setForm({ ...form, estimated_duration: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={form.is_active}
                                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                    className="rounded"
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
