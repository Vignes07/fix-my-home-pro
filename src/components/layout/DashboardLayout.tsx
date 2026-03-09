import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, LogOut } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useUiStore } from '@/stores/useUiStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'

export function DashboardLayout() {
    const { toggleSidebar } = useUiStore()
    const { user, logout: authLogout } = useAuthStore()
    const navigate = useNavigate()

    const logout = () => {
        authLogout()
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
                    <button
                        onClick={toggleSidebar}
                        className="rounded-lg p-2 hover:bg-muted lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex-1 lg:hidden"></div> {/* Spacer for mobile */}

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium uppercase">
                                {user?.full_name?.charAt(0) || 'U'}
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground hidden sm:flex">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground sm:hidden">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
