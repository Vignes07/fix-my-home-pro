import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Briefcase,
    DollarSign,
    Wallet,
    Users,
    CalendarCheck,
    Settings,
    ShieldCheck,
    ChevronLeft,
    X,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from '@/stores/useUiStore'
import { cn } from '@/utils/cn'

interface SidebarLink {
    label: string
    path: string
    icon: React.ReactNode
}

const technicianLinks: SidebarLink[] = [
    { label: 'Dashboard', path: '/technician', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Jobs', path: '/technician/jobs', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Earnings', path: '/technician/earnings', icon: <DollarSign className="h-4 w-4" /> },
    { label: 'Wallet', path: '/technician/wallet', icon: <Wallet className="h-4 w-4" /> },
]

const adminLinks: SidebarLink[] = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Technicians', path: '/admin/technicians', icon: <Users className="h-4 w-4" /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck className="h-4 w-4" /> },
    { label: 'Services', path: '/admin/services', icon: <Settings className="h-4 w-4" /> },
    { label: 'Roles', path: '/admin/settings', icon: <ShieldCheck className="h-4 w-4" /> },
]

export function Sidebar() {
    const { userType } = useAuthStore()
    const { sidebarOpen, setSidebarOpen } = useUiStore()
    const location = useLocation()

    const links = userType === 'admin' ? adminLinks : technicianLinks

    return (
        <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo & Close */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                    <Logo size="sm" />
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-1.5 hover:bg-muted lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-3">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-border p-3">
                    <NavLink
                        to="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </NavLink>
                </div>
            </aside>
        </>
    )
}
