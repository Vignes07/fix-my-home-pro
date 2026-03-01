import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useUiStore } from '@/stores/useUiStore'

export function DashboardLayout() {
    const { toggleSidebar } = useUiStore()

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                {/* Top bar for mobile */}
                <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="rounded-lg p-2 hover:bg-muted"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
