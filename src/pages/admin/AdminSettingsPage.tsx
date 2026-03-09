import { useState, useEffect } from 'react'
import { Shield, ShieldAlert, ShieldCheck, UserCog, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/common/skeletons'
import { useAuthStore } from '@/stores/useAuthStore'
import { api } from '@/services/api'

interface UserRecord {
    id: string
    full_name: string
    email: string
    phone: string
    user_type: 'admin' | 'customer' | 'technician'
    created_at: string
}

export default function AdminSettingsPage() {
    const { user } = useAuthStore()
    const [users, setUsers] = useState<UserRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [search])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/users/admin?search=${search}`)
            setUsers(res.data.data || [])
        } catch (err) {
            console.error('Failed to fetch users:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return

        try {
            setUpdatingId(userId)
            await api.patch(`/users/admin/${userId}/role`, { user_type: newRole })
            fetchUsers()
        } catch (err: any) {
            console.error('Failed to update role:', err)
            alert(err.response?.data?.message || 'Failed to update user role')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" /> Settings & Roles
                </h1>
                <p className="text-muted-foreground">Manage platform administrators and user roles</p>
            </div>

            <Card className="border-0 shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5 text-primary" />
                        Role Management
                    </CardTitle>
                    <CardDescription>
                        Promote users to admins or demote existing admins. Carefully manage who has access to the admin dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name or email..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <TableSkeleton rows={5} cols={4} />
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                                        <th className="p-4 font-medium">User</th>
                                        <th className="p-4 font-medium">Contact</th>
                                        <th className="p-4 font-medium">Current Role</th>
                                        <th className="p-4 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No users found.</td></tr>
                                    ) : (
                                        users.map((record) => (
                                            <tr key={record.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="p-4 font-medium">{record.full_name || 'N/A'}</td>
                                                <td className="p-4">
                                                    <div>{record.email}</div>
                                                    <div className="text-xs text-muted-foreground">{record.phone || 'No phone'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant={record.user_type === 'admin' ? 'destructive' : 'secondary'} className="capitalize">
                                                        {record.user_type === 'admin' && <ShieldCheck className="w-3 h-3 mr-1" />}
                                                        {record.user_type}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {record.user_type !== 'admin' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => handleRoleChange(record.id, 'admin')}
                                                                disabled={updatingId === record.id}
                                                            >
                                                                <ShieldAlert className="w-3 h-3 mr-1" /> Make Admin
                                                            </Button>
                                                        )}
                                                        {record.user_type === 'admin' && record.id !== user?.id && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-xs"
                                                                onClick={() => handleRoleChange(record.id, 'customer')}
                                                                disabled={updatingId === record.id}
                                                            >
                                                                Remove Admin
                                                            </Button>
                                                        )}
                                                        {record.id === user?.id && (
                                                            <span className="text-xs text-muted-foreground italic px-2 py-1">You</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
