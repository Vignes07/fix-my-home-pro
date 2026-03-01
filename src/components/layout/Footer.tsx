import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Join Us', path: '/join-us' },
    { label: 'Contact', path: '/contact' },
]

const services = [
    'Pipe Repair',
    'Drain Cleaning',
    'Water Heater Service',
    'Fixture Installation',
    'Emergency Repairs',
    'Bathroom Plumbing',
]

export function Footer() {
    return (
        <footer className="bg-black py-[80px]">
            <div className="mx-auto max-w-[1440px] px-[100px]">
                <div className="flex flex-col gap-12 lg:flex-row lg:gap-[162px]">
                    {/* Brand column */}
                    <div className="flex flex-col gap-10 lg:w-[408px]">
                        <div className="flex flex-col gap-6">
                            <h3 className="font-display text-[32px] font-medium leading-[50px] text-white">
                                Fix Home Pro
                            </h3>
                            <p className="font-body text-[16px] leading-[25px] text-[#fafafa]">
                                Professional plumbing services you can trust. Available 24/7 for all your residential and commercial plumbing needs.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-body text-[14px] text-[#fafafa]">Follow us:</span>
                            <div className="flex items-center gap-6">
                                {/* LinkedIn */}
                                <a href="#" className="text-white transition-colors hover:text-[#facc15]" aria-label="LinkedIn">
                                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                                {/* Instagram */}
                                <a href="#" className="text-white transition-colors hover:text-[#facc15]" aria-label="Instagram">
                                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                                {/* Twitter/X */}
                                <a href="#" className="text-white transition-colors hover:text-[#facc15]" aria-label="Twitter">
                                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                {/* Facebook */}
                                <a href="#" className="text-white transition-colors hover:text-[#facc15]" aria-label="Facebook">
                                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                {/* YouTube */}
                                <a href="#" className="text-white transition-colors hover:text-[#facc15]" aria-label="YouTube">
                                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links columns */}
                    <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3">
                        {/* Quick Links */}
                        <div>
                            <h4 className="font-display text-[24px] font-semibold leading-[35px] text-white">
                                Quick Links
                            </h4>
                            <ul className="mt-[59px] flex flex-col gap-4">
                                {quickLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className="font-body text-[16px] leading-[30px] text-[#fafafa] transition-colors hover:text-[#facc15]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="font-display text-[24px] font-semibold leading-[35px] text-white">
                                Services
                            </h4>
                            <ul className="mt-[59px] flex flex-col gap-4">
                                {services.map((s) => (
                                    <li key={s}>
                                        <Link
                                            to="/services"
                                            className="font-body text-[16px] leading-[30px] text-[#fafafa] transition-colors hover:text-[#facc15]"
                                        >
                                            {s}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h4 className="font-display text-[24px] font-semibold leading-[35px] text-white">
                                Contact Us
                            </h4>
                            <div className="mt-[59px] flex flex-col gap-[16px]">
                                <div className="flex items-start gap-[10px]">
                                    <MapPin className="mt-0.5 h-[25px] w-[25px] shrink-0 text-[#fafafa]" />
                                    <p className="font-body text-[16px] leading-[30px] text-[#fafafa]">
                                        123 Main Street<br />Metro City, ST 12345
                                    </p>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <Phone className="h-[25px] w-[25px] shrink-0 text-[#fafafa]" />
                                    <a href="tel:+1234567890" className="font-body text-[16px] leading-[30px] text-[#fafafa] hover:text-[#facc15]">
                                        (123) 456-7890
                                    </a>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <Mail className="h-[25px] w-[25px] shrink-0 text-[#fafafa]" />
                                    <a href="mailto:contact@plumbfix.com" className="font-body text-[16px] leading-[30px] text-[#fafafa] hover:text-[#facc15]">
                                        contact@plumbfix.com
                                    </a>
                                </div>
                                <div className="flex items-start gap-[10px]">
                                    <Clock className="mt-0.5 h-[25px] w-[25px] shrink-0 text-[#fafafa]" />
                                    <p className="font-body text-[16px] leading-[30px] text-[#fafafa]">
                                        Mon-Fri: 7am - 8pm<br />Sat-Sun: 8am - 6pm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-10 h-px w-full bg-white/20" />

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="font-body text-[14px] text-[#fafafa]">
                        © {new Date().getFullYear()} Fix Home Pro. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="/privacy" className="font-body text-[14px] text-[#fafafa] hover:text-[#facc15]">Privacy Policy</Link>
                        <Link to="/terms" className="font-body text-[14px] text-[#fafafa] hover:text-[#facc15]">Term of Service</Link>
                        <Link to="/cookies" className="font-body text-[14px] text-[#fafafa] hover:text-[#facc15]">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
