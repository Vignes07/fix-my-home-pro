import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X, Save, Loader2, LayoutDashboard, Tag, Megaphone, Star as StarIcon, Image, Type } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { api } from '@/services/api'
import { supabase } from '@/services/supabase'
import { cn } from '@/utils/cn'

// Section keys the CMS manages
const SECTION_TABS = [
    { key: 'hero', label: 'Hero', icon: LayoutDashboard, type: 'section' },
    { key: 'offers', label: 'Offers', icon: Tag, type: 'items' },
    { key: 'new_noteworthy', label: 'New & Noteworthy', icon: Megaphone, type: 'items' },
    { key: 'most_booked', label: 'Most Booked', icon: StarIcon, type: 'items' },
    { key: 'banner', label: 'Banner', icon: Image, type: 'section' },
    { key: 'join_cta', label: 'Join CTA', icon: Type, type: 'section' },
    { key: 'testimonials', label: 'Testimonials', icon: StarIcon, type: 'items' },
]

interface SectionData {
    section_key?: string
    title?: string
    subtitle?: string
    description?: string
    image_url?: string
    button_text?: string
    button_link?: string
    bg_color?: string
    metadata?: any
    items?: ItemData[]
}

interface ItemData {
    id?: string
    section_key: string
    title: string
    subtitle?: string
    description?: string
    image_url?: string
    button_text?: string
    button_link?: string
    bg_color?: string
    price?: string
    rating?: string
    display_order?: number
    metadata?: any
}

// Upload helper
async function uploadToAssets(file: File, folder: string): Promise<string> {
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('assets').upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('assets').getPublicUrl(path)
    return data.publicUrl
}

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState('hero')
    const [sections, setSections] = useState<Record<string, SectionData>>({})
    const [allItems, setAllItems] = useState<ItemData[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    // Item editing
    const [showItemForm, setShowItemForm] = useState(false)
    const [editingItemId, setEditingItemId] = useState<string | null>(null)
    const [itemForm, setItemForm] = useState<Partial<ItemData>>({})

    // Section form
    const [sectionForm, setSectionForm] = useState<Partial<SectionData>>({})

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        try {
            setLoading(true)
            const res = await api.get('/content/admin/all')
            const { sections: secs, items } = res.data.data
            const map: Record<string, SectionData> = {}
            ;(secs || []).forEach((s: any) => { map[s.section_key] = s })
            setSections(map)
            setAllItems(items || [])
        } catch {
            setError('Failed to load content')
        } finally {
            setLoading(false)
        }
    }

    const currentTabConfig = SECTION_TABS.find(t => t.key === activeTab)!
    const currentSection = sections[activeTab] || {}
    const currentItems = allItems.filter(i => i.section_key === activeTab).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

    // Load section form when tab changes
    useEffect(() => {
        const s = sections[activeTab] || {}
        setSectionForm({
            title: s.title || '',
            subtitle: s.subtitle || '',
            description: s.description || '',
            image_url: s.image_url || '',
            button_text: s.button_text || '',
            button_link: s.button_link || '',
            bg_color: s.bg_color || '',
            metadata: s.metadata || {},
        })
        setShowItemForm(false)
        setError(null)
        setSuccessMsg(null)
    }, [activeTab, sections])

    // Save section
    const handleSaveSection = async () => {
        setSaving(true)
        setError(null)
        try {
            await api.post('/content/admin/sections', {
                section_key: activeTab,
                ...sectionForm,
            })
            setSuccessMsg('Section saved!')
            setTimeout(() => setSuccessMsg(null), 2000)
            fetchAll()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Save failed')
        } finally {
            setSaving(false)
        }
    }

    // Item CRUD
    const openAddItem = () => {
        setEditingItemId(null)
        setItemForm({ section_key: activeTab, title: '', subtitle: '', description: '', image_url: '', button_text: '', button_link: '', bg_color: '', price: '', rating: '', display_order: currentItems.length + 1 })
        setShowItemForm(true)
        setError(null)
    }

    const openEditItem = (item: ItemData) => {
        setEditingItemId(item.id!)
        setItemForm({ ...item })
        setShowItemForm(true)
        setError(null)
    }

    const handleSaveItem = async () => {
        if (!itemForm.title) { setError('Title is required'); return }
        setSaving(true)
        setError(null)
        try {
            if (editingItemId) {
                await api.patch(`/content/admin/items/${editingItemId}`, itemForm)
            } else {
                await api.post('/content/admin/items', { ...itemForm, section_key: activeTab })
            }
            setShowItemForm(false)
            fetchAll()
            setSuccessMsg('Item saved!')
            setTimeout(() => setSuccessMsg(null), 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Save failed')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteItem = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"?`)) return
        try {
            await api.delete(`/content/admin/items/${id}`)
            fetchAll()
        } catch { }
    }

    const handleImageUpload = async (file: File, field: 'image_url', target: 'section' | 'item') => {
        try {
            const url = await uploadToAssets(file, `content/${activeTab}`)
            if (target === 'section') {
                setSectionForm(prev => ({ ...prev, [field]: url }))
            } else {
                setItemForm(prev => ({ ...prev, [field]: url }))
            }
        } catch {
            setError('Image upload failed')
        }
    }

    if (loading) {
        return (
            <div className="animate-fade-in p-6">
                <div className="h-7 w-48 bg-muted animate-pulse rounded mb-4" />
                <div className="h-64 bg-muted animate-pulse rounded-xl" />
            </div>
        )
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Site Content</h1>
                <p className="text-muted-foreground">Manage homepage sections, offers, testimonials, and more</p>
            </div>

            {/* Tab Bar */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-3">
                {SECTION_TABS.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                activeTab === tab.key
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Success / Error */}
            {successMsg && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">{successMsg}</div>}
            {error && <div className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>}

            <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
                {/* LEFT: Section Settings */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Section: {currentTabConfig.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input className="mt-1" value={sectionForm.title || ''} onChange={e => setSectionForm(f => ({ ...f, title: e.target.value }))} placeholder="Section heading" />
                        </div>
                        <div>
                            <Label>Subtitle</Label>
                            <Input className="mt-1" value={sectionForm.subtitle || ''} onChange={e => setSectionForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Subheading or tagline" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" value={sectionForm.description || ''} onChange={e => setSectionForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional longer text" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Button Text</Label>
                                <Input className="mt-1" value={sectionForm.button_text || ''} onChange={e => setSectionForm(f => ({ ...f, button_text: e.target.value }))} />
                            </div>
                            <div>
                                <Label>Button Link</Label>
                                <Input className="mt-1" value={sectionForm.button_link || ''} onChange={e => setSectionForm(f => ({ ...f, button_link: e.target.value }))} placeholder="/services" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>BG Color</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input value={sectionForm.bg_color || ''} onChange={e => setSectionForm(f => ({ ...f, bg_color: e.target.value }))} placeholder="#ffffff" />
                                    {sectionForm.bg_color && <div className="h-8 w-8 rounded border" style={{ background: sectionForm.bg_color }} />}
                                </div>
                            </div>
                            <div>
                                <Label>Image</Label>
                                <div className="mt-1 flex items-center gap-2">
                                    {sectionForm.image_url && <img src={sectionForm.image_url} className="h-8 w-8 rounded object-cover" alt="" />}
                                    <label className="cursor-pointer text-xs text-primary hover:underline">
                                        Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'image_url', 'section')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleSaveSection} disabled={saving} className="w-full gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Section
                        </Button>
                    </CardContent>
                </Card>

                {/* RIGHT: Items List */}
                <Card>
                    <CardHeader className="pb-3 flex-row items-center justify-between">
                        <CardTitle className="text-base">Items ({currentItems.length})</CardTitle>
                        <Button size="sm" className="gap-1" onClick={openAddItem}>
                            <Plus className="h-3.5 w-3.5" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {currentItems.length === 0 && !showItemForm ? (
                            <div className="py-8 text-center text-muted-foreground text-sm">
                                No items yet. Click "Add Item" to create one.
                            </div>
                        ) : (
                            currentItems.map(item => (
                                <div key={item.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-muted/20">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {item.image_url && <img src={item.image_url} className="h-10 w-10 rounded object-cover shrink-0" alt="" />}
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">{item.title}</p>
                                            {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {item.price && <Badge variant="secondary" className="text-[10px]">₹{item.price}</Badge>}
                                                {item.rating && <Badge variant="secondary" className="text-[10px]">⭐{item.rating}</Badge>}
                                                {item.bg_color && <div className="h-3 w-3 rounded-full border" style={{ background: item.bg_color }} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditItem(item)}><Edit className="h-3 w-3" /></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteItem(item.id!, item.title)}><Trash2 className="h-3 w-3" /></Button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Item Add/Edit Form */}
                        {showItemForm && (
                            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3 mt-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">{editingItemId ? 'Edit Item' : 'Add New Item'}</h4>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowItemForm(false)}><X className="h-3 w-3" /></Button>
                                </div>
                                <div>
                                    <Label className="text-xs">Title *</Label>
                                    <Input className="mt-1 h-8 text-sm" value={itemForm.title || ''} onChange={e => setItemForm(f => ({ ...f, title: e.target.value }))} placeholder="Item title" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs">Subtitle</Label>
                                        <Input className="mt-1 h-8 text-sm" value={itemForm.subtitle || ''} onChange={e => setItemForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. Downtown" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">BG Color</Label>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Input className="h-8 text-sm" value={itemForm.bg_color || ''} onChange={e => setItemForm(f => ({ ...f, bg_color: e.target.value }))} placeholder="#f0f3f6" />
                                            {itemForm.bg_color && <div className="h-6 w-6 rounded border shrink-0" style={{ background: itemForm.bg_color }} />}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs">Description</Label>
                                    <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs min-h-[60px]" value={itemForm.description || ''} onChange={e => setItemForm(f => ({ ...f, description: e.target.value }))} placeholder="Quote or description text" />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <Label className="text-xs">Price</Label>
                                        <Input className="mt-1 h-8 text-sm" value={itemForm.price || ''} onChange={e => setItemForm(f => ({ ...f, price: e.target.value }))} placeholder="899" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Rating</Label>
                                        <Input className="mt-1 h-8 text-sm" value={itemForm.rating || ''} onChange={e => setItemForm(f => ({ ...f, rating: e.target.value }))} placeholder="4.8" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Order</Label>
                                        <Input type="number" className="mt-1 h-8 text-sm" value={itemForm.display_order ?? 0} onChange={e => setItemForm(f => ({ ...f, display_order: Number(e.target.value) }))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-xs">Button Text</Label>
                                        <Input className="mt-1 h-8 text-sm" value={itemForm.button_text || ''} onChange={e => setItemForm(f => ({ ...f, button_text: e.target.value }))} placeholder="Book Now" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Button Link</Label>
                                        <Input className="mt-1 h-8 text-sm" value={itemForm.button_link || ''} onChange={e => setItemForm(f => ({ ...f, button_link: e.target.value }))} placeholder="/services" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs">Image</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        {itemForm.image_url && <img src={itemForm.image_url} className="h-8 w-8 rounded object-cover" alt="" />}
                                        <label className="cursor-pointer text-xs text-primary hover:underline">
                                            Upload image
                                            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'image_url', 'item')} />
                                        </label>
                                        {itemForm.image_url && (
                                            <Input className="h-8 text-xs flex-1" value={itemForm.image_url} onChange={e => setItemForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Or paste URL" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowItemForm(false)}>Cancel</Button>
                                    <Button size="sm" className="flex-1" onClick={handleSaveItem} disabled={saving}>
                                        {saving ? 'Saving...' : editingItemId ? 'Update' : 'Add'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
