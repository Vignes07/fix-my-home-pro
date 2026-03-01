import { create } from 'zustand'

interface UiStore {
    sidebarOpen: boolean
    theme: 'light' | 'dark' | 'system'
    globalLoading: boolean
    toasts: Toast[]

    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    setTheme: (theme: 'light' | 'dark' | 'system') => void
    setGlobalLoading: (loading: boolean) => void
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
}

export interface Toast {
    id: string
    title: string
    description?: string
    variant?: 'default' | 'success' | 'error' | 'warning'
    duration?: number
}

export const useUiStore = create<UiStore>((set) => ({
    sidebarOpen: false,
    theme: 'system',
    globalLoading: false,
    toasts: [],

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    setTheme: (theme) => set({ theme }),
    setGlobalLoading: (globalLoading) => set({ globalLoading }),

    addToast: (toast) =>
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
        })),

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}))
