import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, User, LogOut, CalendarCheck, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/format'

const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Join Us', path: '/join-us' },
    { label: 'Contact', path: '/contact' },
]

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const { isAuthenticated, user, logout } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()
    const profileRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        setProfileOpen(false)
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Main navbar */}
            <div className="w-full bg-[rgba(3,19,44,0.9)] backdrop-blur-sm">
                <div className="mx-auto flex h-[70px] md:h-[90px] items-center justify-between px-4 md:px-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="font-heading text-[28px] md:text-[42px] font-bold capitalize leading-[40px] md:leading-[59px] text-white">
                            FIXPRO
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden items-center gap-[35px] lg:flex">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        'font-heading text-[14px] font-semibold uppercase leading-6 tracking-[0.84px] transition-colors',
                                        isActive
                                            ? 'border-b-2 border-white py-[10px] text-white'
                                            : 'text-white/75 hover:text-white'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right side buttons */}
                    <div className="hidden items-center gap-[20px] lg:flex">
                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 rounded-full bg-white/10 py-2 pl-2 pr-4 transition-colors hover:bg-white/20"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#facc15] text-sm font-bold text-[#09172e]">
                                        {getInitials(user?.full_name || user?.email || 'U')}
                                    </div>
                                    <span className="text-sm font-medium text-white">
                                        {user?.full_name || 'Account'}
                                    </span>
                                    <ChevronDown className={cn('h-4 w-4 text-white/75 transition-transform', profileOpen && 'rotate-180')} />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0d2240] shadow-2xl animate-fade-in">
                                        <div className="border-b border-white/10 px-4 py-3">
                                            <p className="text-sm font-semibold text-white">{user?.full_name || 'User'}</p>
                                            <p className="text-xs text-white/50">{user?.email || ''}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                            >
                                                <User className="h-4 w-4" />
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/bookings"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                            >
                                                <CalendarCheck className="h-4 w-4" />
                                                My Bookings
                                            </Link>
                                        </div>
                                        <div className="border-t border-white/10 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="font-heading text-[14px] font-semibold uppercase leading-6 tracking-[0.84px] text-white/75 transition-colors hover:text-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center rounded-[40px] bg-[#facc15] px-[38px] py-[15px] transition-colors hover:bg-[#e5b800]"
                                >
                                    <span className="font-heading text-[14px] font-semibold uppercase leading-6 tracking-[0.84px] text-[#09172e]">
                                        Sign Up
                                    </span>
                                </Link>
                            </>
                        )}
                        <a href="tel:+123456789" className="flex items-center gap-[10px] text-white">
                            <Phone className="h-4 w-4" />
                            <span className="font-heading text-[14px] font-semibold uppercase leading-6 tracking-[0.84px]">
                                123 456 789
                            </span>
                        </a>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-white/10 bg-[rgba(3,19,44,0.95)] p-6 lg:hidden">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'rounded-lg px-4 py-3 font-heading text-[14px] font-semibold uppercase tracking-[0.84px] transition-colors',
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/75 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>
                    <div className="mt-4 flex flex-col gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/75 hover:bg-white/5 hover:text-white"
                                >
                                    <User className="h-4 w-4" /> My Profile
                                </Link>
                                <Link
                                    to="/bookings"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-white/75 hover:bg-white/5 hover:text-white"
                                >
                                    <CalendarCheck className="h-4 w-4" /> My Bookings
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-red-400 hover:bg-white/5"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center rounded-lg px-4 py-3 text-white/75 hover:bg-white/5 hover:text-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center rounded-[40px] bg-[#facc15] px-[38px] py-[15px]"
                                >
                                    <span className="font-heading text-[14px] font-semibold uppercase tracking-[0.84px] text-[#09172e]">
                                        Sign Up
                                    </span>
                                </Link>
                            </>
                        )}
                        <a href="tel:+123456789" className="flex items-center justify-center gap-2 py-2 text-white">
                            <Phone className="h-4 w-4" />
                            <span className="font-heading text-sm font-semibold uppercase tracking-wider">
                                123 456 789
                            </span>
                        </a>
                    </div>
                </div>
            )}
        </header>
    )
}
