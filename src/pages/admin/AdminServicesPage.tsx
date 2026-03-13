import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Search, X, Upload, ImageIcon, ListChecks, Clock } from 'lucide-react'
import { TableSkeleton } from '@/components/common/skeletons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { api } from '@/services/api'
import { supabase } from '@/services/supabase'
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
    thumbnail_url?: string
    detail_image_url?: string
    image_url?: string
}

interface Category {
    id: string
    name: string
    is_active: boolean
    description?: string
    icon_name?: string
    display_order?: number
}

interface ServiceForm {
    name: string
    category_id: string
    description: string
    base_price: number
    estimated_duration: number
    is_active: boolean
    thumbnail_url: string
    detail_image_url: string
}

const emptyForm: ServiceForm = {
    name: '',
    category_id: '',
    description: '',
    base_price: 0,
    estimated_duration: 60,
    is_active: true,
    thumbnail_url: '',
    detail_image_url: '',
}

// Upload a file to the Supabase 'assets' bucket and return the public URL
async function uploadToAssets(file: File, folder: string): Promise<string> {
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, file, { upsert: true, cacheControl: '3600' })
    if (error) throw new Error(`Upload failed: ${error.message}`)
    const { data: urlData } = supabase.storage.from('assets').getPublicUrl(data.path)
    return urlData.publicUrl
}

// Image upload field component
function ImageUploadField({
    label,
    hint,
    currentUrl,
    onUploaded,
}: {
    label: string
    hint: string
    currentUrl: string
    onUploaded: (url: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [localUrl, setLocalUrl] = useState(currentUrl)

    const handleFile = async (file: File) => {
        if (!file) return
        setUploading(true)
        try {
            const url = await uploadToAssets(file, 'services')
            setLocalUrl(url)
            onUploaded(url)
        } catch (err: any) {
            console.error(err)
            alert(`Upload failed: ${err.message}`)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <p className="text-xs text-muted-foreground">{hint}</p>
            <div
                className={cn(
                    'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors cursor-pointer',
                    localUrl ? 'border-emerald-400 bg-emerald-50/30' : 'border-border hover:border-primary/40 hover:bg-muted/30'
                )}
                onClick={() => inputRef.current?.click()}
            >
                {localUrl ? (
                    <div className="w-full">
                        <img
                            src={localUrl}
                            alt="Preview"
                            className="mx-auto max-h-[120px] rounded-lg object-cover"
                        />
                        <p className="mt-2 text-center text-xs text-emerald-600 font-medium">✓ Image uploaded</p>
                        <p className="mt-1 text-center text-xs text-muted-foreground underline">Click to replace</p>
                    </div>
                ) : (
                    <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">
                            {uploading ? 'Uploading...' : 'Click to select image'}
                        </p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP supported</p>
                    </>
                )}
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
        </div>
    )
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<ServiceForm>(emptyForm)

    const [showCatModal, setShowCatModal] = useState(false)
    const [editingCatId, setEditingCatId] = useState<string | null>(null)
    const [catForm, setCatForm] = useState({ name: '', display_order: 0, is_active: true })

    // Service options (types) state
    const [showOptionsModal, setShowOptionsModal] = useState(false)
    const [optionsServiceId, setOptionsServiceId] = useState<string | null>(null)
    const [optionsServiceName, setOptionsServiceName] = useState('')
    const [serviceOptions, setServiceOptions] = useState<any[]>([])
    const [optionsLoading, setOptionsLoading] = useState(false)
    const [showOptionForm, setShowOptionForm] = useState(false)
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null)
    const [optionForm, setOptionForm] = useState({ name: '', price: 0, estimated_duration: 60, includes: '' })

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
        setError(null)
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
            thumbnail_url: service.thumbnail_url || service.image_url || '',
            detail_image_url: service.detail_image_url || '',
        })
        setShowModal(true)
        setError(null)
    }

    const handleSave = async () => {
        if (!form.name || !form.category_id || !form.base_price) {
            setError('Name, category, and price are required')
            return
        }
        setSaving(true)
        setError(null)
        try {
            const payload = {
                name: form.name,
                category_id: form.category_id,
                description: form.description,
                base_price: form.base_price,
                estimated_duration: form.estimated_duration,
                is_active: form.is_active,
                thumbnail_url: form.thumbnail_url || null,
                detail_image_url: form.detail_image_url || null,
                // Keep backward-compat image_url pointing to thumbnail
                image_url: form.thumbnail_url || null,
            }
            if (editingId) {
                await api.patch(`/services/admin/${editingId}`, payload)
            } else {
                await api.post('/services/admin', payload)
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

    const openCatAdd = () => {
        setEditingCatId(null)
        setCatForm({ name: '', display_order: 0, is_active: true })
        setShowCatModal(true)
        setError(null)
    }

    const openCatEdit = (cat: Category) => {
        setEditingCatId(cat.id)
        setCatForm({ name: cat.name, display_order: cat.display_order || 0, is_active: cat.is_active })
        setShowCatModal(true)
        setError(null)
    }

    const handleCatSave = async () => {
        if (!catForm.name) {
            setError('Category name is required')
            return
        }
        setSaving(true)
        setError(null)
        try {
            if (editingCatId) {
                await api.patch(`/services/admin/categories/${editingCatId}`, catForm)
            } else {
                await api.post('/services/admin/categories', catForm)
            }
            setShowCatModal(false)
            fetchData()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save category')
        } finally {
            setSaving(false)
        }
    }

    const handleCatDelete = async (id: string, name: string) => {
        if (!confirm(`Delete category "${name}"? If it has services, it will be deactivated instead.`)) return
        try {
            await api.delete(`/services/admin/categories/${id}`)
            fetchData()
        } catch (err) {
            console.error('Failed to delete category:', err)
        }
    }

    // ===== Service Options (Types) CRUD =====
    const openOptionsModal = async (service: Service) => {
        setOptionsServiceId(service.id)
        setOptionsServiceName(service.name)
        setShowOptionsModal(true)
        setShowOptionForm(false)
        setOptionsLoading(true)
        try {
            const res = await api.get(`/services/admin/${service.id}/options`)
            setServiceOptions(res.data.data || [])
        } catch (err) {
            console.error('Failed to load options:', err)
            setServiceOptions([])
        } finally {
            setOptionsLoading(false)
        }
    }

    const openAddOption = () => {
        setEditingOptionId(null)
        setOptionForm({ name: '', price: 0, estimated_duration: 60, includes: '' })
        setShowOptionForm(true)
        setError(null)
    }

    const openEditOption = (opt: any) => {
        setEditingOptionId(opt.id)
        setOptionForm({
            name: opt.name,
            price: opt.price,
            estimated_duration: opt.estimated_duration || 60,
            includes: (opt.includes || []).join('\n'),
        })
        setShowOptionForm(true)
        setError(null)
    }

    const handleOptionSave = async () => {
        if (!optionForm.name || !optionForm.price) {
            setError('Name and price are required')
            return
        }
        setSaving(true)
        setError(null)
        const includesArr = optionForm.includes.split('\n').map(s => s.trim()).filter(Boolean)
        try {
            if (editingOptionId) {
                await api.patch(`/services/admin/options/${editingOptionId}`, {
                    name: optionForm.name,
                    price: optionForm.price,
                    estimated_duration: optionForm.estimated_duration,
                    includes: includesArr,
                })
            } else {
                await api.post(`/services/admin/${optionsServiceId}/options`, {
                    name: optionForm.name,
                    price: optionForm.price,
                    estimated_duration: optionForm.estimated_duration,
                    includes: includesArr,
                })
            }
            setShowOptionForm(false)
            // Refresh the options list
            const res = await api.get(`/services/admin/${optionsServiceId}/options`)
            setServiceOptions(res.data.data || [])
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save option')
        } finally {
            setSaving(false)
        }
    }

    const handleOptionDelete = async (optionId: string, name: string) => {
        if (!confirm(`Delete service type "${name}"?`)) return
        try {
            await api.delete(`/services/admin/options/${optionId}`)
            setServiceOptions(prev => prev.filter(o => o.id !== optionId))
        } catch (err) {
            console.error('Failed to delete option:', err)
        }
    }

    const filtered = services.filter(s =>
        !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category_name.toLowerCase().includes(search.toLowerCase())
    )

    const categoryCounts: Record<string, { total: number; active: number }> = {}
    services.forEach(s => {
        if (!categoryCounts[s.category_name]) categoryCounts[s.category_name] = { total: 0, active: 0 }
        categoryCounts[s.category_name].total++
        if (s.is_active) categoryCounts[s.category_name].active++
    })

    if (loading) {
        return (
            <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-7 w-40 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
                    </div>
                </div>
                <TableSkeleton rows={8} cols={7} />
            </div>
        )
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Service Management</h1>
                    <p className="text-muted-foreground">Manage categories, services, and images</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={openCatAdd}><Plus className="h-4 w-4" /> Add Category</Button>
                    <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" /> Add Service</Button>
                </div>
            </div>

            {/* Category Cards */}
            <div>
                <h2 className="mb-4 text-lg font-semibold">Categories ({categories.length})</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.map(cat => (
                        <Card key={cat.id} className={cn('relative group border-0 shadow-card transition-all hover:shadow-elevated', !cat.is_active && 'opacity-50')}>
                            <div className="absolute right-1 top-1 hidden group-hover:flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => openCatEdit(cat)}><Edit className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-destructive hover:bg-destructive/10" onClick={() => handleCatDelete(cat.id, cat.name)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                            <CardContent className="flex flex-col items-center gap-2 p-4 text-center mt-2">
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
                    {categories.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground text-sm">
                            No categories yet. Click "Add Category" to create one.
                        </div>
                    )}
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
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Image</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Service</th>
                                    <th className="pb-3 text-left font-medium text-muted-foreground">Category</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Price</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Duration</th>
                                    <th className="pb-3 text-center font-medium text-muted-foreground">Status</th>
                                    <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(service => (
                                    <tr key={service.id} className="border-b border-border/50 last:border-0">
                                        <td className="py-3">
                                            {service.thumbnail_url || service.image_url ? (
                                                <img
                                                    src={service.thumbnail_url || service.image_url}
                                                    alt={service.name}
                                                    className="h-10 w-10 rounded-lg object-cover border border-border"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 font-medium">{service.name}</td>
                                        <td className="py-3"><Badge variant="secondary" className="text-[10px]">{service.category_name}</Badge></td>
                                        <td className="py-3 text-right">₹{service.base_price}</td>
                                        <td className="py-3 text-right">{service.estimated_duration || '-'} min</td>
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
                                                <Button variant="ghost" size="sm" title="Manage Service Types" onClick={() => openOptionsModal(service)}><ListChecks className="h-3.5 w-3.5" /></Button>
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

            {/* Add/Edit Service Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10">
                    <div className="w-full max-w-lg rounded-2xl bg-background shadow-2xl mb-8">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="text-lg font-bold">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}><X className="h-4 w-4" /></Button>
                        </div>

                        <div className="space-y-5 p-6">
                            {/* Name */}
                            <div>
                                <Label>Service Name *</Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. AC Regular Service"
                                    className="mt-1"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Label>Category *</Label>
                                <select
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={form.category_id}
                                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                                >
                                    <option value="">Select category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <Label>Description</Label>
                                <textarea
                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief description of this service..."
                                />
                            </div>

                            {/* Image Upload: Two fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <ImageUploadField
                                    label="Thumbnail Image *"
                                    hint="Small card image shown on Services page"
                                    currentUrl={form.thumbnail_url}
                                    onUploaded={(url) => setForm(f => ({ ...f, thumbnail_url: url }))}
                                />
                                <ImageUploadField
                                    label="Detail Image"
                                    hint="Large hero image on the Service Detail page"
                                    currentUrl={form.detail_image_url}
                                    onUploaded={(url) => setForm(f => ({ ...f, detail_image_url: url }))}
                                />
                            </div>

                            {/* Price & Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (₹) *</Label>
                                    <Input
                                        type="number"
                                        className="mt-1"
                                        value={form.base_price}
                                        onChange={e => setForm({ ...form, base_price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label>Duration (min)</Label>
                                    <Input
                                        type="number"
                                        className="mt-1"
                                        value={form.estimated_duration}
                                        onChange={e => setForm({ ...form, estimated_duration: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={form.is_active}
                                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <Label htmlFor="is_active">Active (visible to customers)</Label>
                            </div>

                            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCatModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-background shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h2 className="text-lg font-bold">{editingCatId ? 'Edit Category' : 'Add New Category'}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowCatModal(false)}><X className="h-4 w-4" /></Button>
                        </div>
                        <div className="space-y-4 p-6">
                            <div>
                                <Label>Category Name *</Label>
                                <Input
                                    className="mt-1"
                                    value={catForm.name}
                                    onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                                    placeholder="e.g. Electrical Services"
                                />
                            </div>
                            <div>
                                <Label>Display Order</Label>
                                <Input
                                    type="number"
                                    className="mt-1"
                                    value={catForm.display_order}
                                    onChange={e => setCatForm({ ...catForm, display_order: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="cat_is_active"
                                    checked={catForm.is_active}
                                    onChange={e => setCatForm({ ...catForm, is_active: e.target.checked })}
                                    className="h-4 w-4 rounded"
                                />
                                <Label htmlFor="cat_is_active">Active</Label>
                            </div>
                            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowCatModal(false)}>Cancel</Button>
                                <Button className="flex-1" onClick={handleCatSave} disabled={saving}>
                                    {saving ? 'Saving...' : editingCatId ? 'Update' : 'Add Category'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Options (Types) Modal */}
            {showOptionsModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10">
                    <div className="w-full max-w-2xl rounded-2xl bg-background shadow-2xl mb-8">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold">Service Types</h2>
                                <p className="text-sm text-muted-foreground">{optionsServiceName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" className="gap-1" onClick={openAddOption}><Plus className="h-3.5 w-3.5" /> Add Type</Button>
                                <Button variant="ghost" size="sm" onClick={() => setShowOptionsModal(false)}><X className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {optionsLoading ? (
                                <div className="py-8 text-center text-muted-foreground">Loading...</div>
                            ) : serviceOptions.length === 0 && !showOptionForm ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p>No service types yet.</p>
                                    <p className="text-xs mt-1">Click "Add Type" to create one.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {serviceOptions.map(opt => (
                                        <div key={opt.id} className="rounded-xl border border-border p-4 bg-muted/20">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-base">{opt.name}</h4>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                        <span className="font-medium text-primary">₹{opt.price}</span>
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{opt.estimated_duration || 60} min</span>
                                                        {opt.avg_rating > 0 && (
                                                            <span className="flex items-center gap-1 text-amber-500">⭐ {opt.avg_rating} ({opt.rating_count})</span>
                                                        )}
                                                    </div>
                                                    {opt.includes && opt.includes.length > 0 && (
                                                        <ul className="mt-2 space-y-1">
                                                            {opt.includes.map((inc: string, i: number) => (
                                                                <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                                                                    {inc}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 ml-4 shrink-0">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditOption(opt)}><Edit className="h-3 w-3" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleOptionDelete(opt.id, opt.name)}><Trash2 className="h-3 w-3" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add/Edit Option Form */}
                            {showOptionForm && (
                                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-4">
                                    <h3 className="font-semibold">{editingOptionId ? 'Edit Service Type' : 'Add New Service Type'}</h3>
                                    <div>
                                        <Label>Type Name *</Label>
                                        <Input className="mt-1" value={optionForm.name} onChange={e => setOptionForm({ ...optionForm, name: e.target.value })} placeholder="e.g. Deep Cleaning" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Price (₹) *</Label>
                                            <Input type="number" className="mt-1" value={optionForm.price} onChange={e => setOptionForm({ ...optionForm, price: Number(e.target.value) })} />
                                        </div>
                                        <div>
                                            <Label>Duration (min)</Label>
                                            <Input type="number" className="mt-1" value={optionForm.estimated_duration} onChange={e => setOptionForm({ ...optionForm, estimated_duration: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Includes (one per line)</Label>
                                        <textarea
                                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                                            value={optionForm.includes}
                                            onChange={e => setOptionForm({ ...optionForm, includes: e.target.value })}
                                            placeholder={"Inspection & fault check\nRepair / installation work\nSafety verification"}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Each line becomes one "includes" bullet point shown to customers.</p>
                                    </div>
                                    {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1" onClick={() => setShowOptionForm(false)}>Cancel</Button>
                                        <Button className="flex-1" onClick={handleOptionSave} disabled={saving}>
                                            {saving ? 'Saving...' : editingOptionId ? 'Update Type' : 'Add Type'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
