import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/utils/cn'

const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Join Us', path: '/join-us' },
    { label: 'Contact', path: '/contact' },
]

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { isAuthenticated, user, logout } = useAuthStore()
    const location = useLocation()

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Top black bar */}
            {/* <div className="h-[36px] w-full bg-black" /> */}

            {/* Main navbar */}
            <div className="w-full bg-[rgba(3,19,44,0.9)] backdrop-blur-sm">
                <div className="mx-auto flex h-[130px] items-center justify-between px-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="font-heading text-[45px] font-bold capitalize leading-[59px] text-white">
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
                    <div className="hidden items-center gap-[30px] lg:flex">
                        <Link
                            to="/login"
                            className="flex items-center justify-center rounded-[40px] bg-[#facc15] px-[38px] py-[15px] transition-colors hover:bg-[#e5b800]"
                        >
                            <span className="font-heading text-[14px] font-semibold uppercase leading-6 tracking-[0.84px] text-[#09172e]">
                                Download the App
                            </span>
                        </Link>
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
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center rounded-[40px] bg-[#facc15] px-[38px] py-[15px]"
                        >
                            <span className="font-heading text-[14px] font-semibold uppercase tracking-[0.84px] text-[#09172e]">
                                Download the App
                            </span>
                        </Link>
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
