import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const imgContactHero = new URL('@/assets/images/01_1.png', import.meta.url).href

export default function ContactPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="relative h-[500px] md:h-[860px] w-full overflow-hidden">
                <img src={imgContactHero} alt="Contact FixPro" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[rgba(0,28,48,0.7)]" />
                <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] pt-[100px] md:pt-[160px]">
                    <h1 className="text-shadow-hero text-[36px] md:text-[60px] lg:text-[85px] font-bold leading-[1.1] tracking-[-1.7px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Get in Touch with FixPro
                    </h1>
                    <p className="mt-6 max-w-[560px] text-[20px] leading-[1.4] tracking-[-0.4px] text-white">
                        We're here to help. Reach out to us for any questions or service inquiries.
                    </p>
                    <div className="mt-10 flex items-center gap-4">
                        <Link to="/services" className="flex items-center justify-center rounded-[40px] bg-[#facc15] px-10 py-5 text-[20px] font-semibold tracking-[-0.4px] text-black hover:bg-[#e5b800]">
                            Book Service
                        </Link>
                    </div>
                    <p className="mt-6 text-[20px] font-medium tracking-[-0.4px] text-white">
                        ✔ Verified Technicians • ✔ Transparent Pricing • ✔ Fast Service
                    </p>
                </div>
            </section>

            {/* Contact Info + Form */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] py-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]">Our Services</h2>
                <div className="mt-10 grid grid-cols-1 gap-16 lg:grid-cols-2">
                    {/* Contact Details */}
                    <div className="flex flex-col gap-8">
                        <h3 className="text-[28px] font-semibold text-[#001c30]">Contact Details</h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#001c30]">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[18px] font-semibold text-[#001c30]">Address</p>
                                    <p className="text-[16px] text-[#454545]">123 Main Street, Metro City, ST 12345</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#001c30]">
                                    <Phone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[18px] font-semibold text-[#001c30]">Phone</p>
                                    <a href="tel:+1234567890" className="text-[16px] text-[#454545] hover:text-[#001c30]">(123) 456-7890</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#001c30]">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[18px] font-semibold text-[#001c30]">Email</p>
                                    <a href="mailto:contact@plumbfix.com" className="text-[16px] text-[#454545] hover:text-[#001c30]">contact@plumbfix.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#001c30]">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[18px] font-semibold text-[#001c30]">Working Hours</p>
                                    <p className="text-[16px] text-[#454545]">Mon-Fri: 7am - 8pm<br />Sat-Sun: 8am - 6pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-[15px] bg-[#f8f9fa] p-8">
                        <h3 className="text-[28px] font-semibold text-[#001c30]">Send us a Message</h3>
                        <form className="mt-6 flex flex-col gap-5">
                            <div>
                                <label className="mb-2 block text-[14px] font-medium text-[#001c30]">Full Name</label>
                                <input type="text" placeholder="Enter your name" className="w-full rounded-[10px] border border-[#d6d6d6] px-4 py-3 text-[16px] outline-none focus:border-[#001c30]" />
                            </div>
                            <div>
                                <label className="mb-2 block text-[14px] font-medium text-[#001c30]">Email</label>
                                <input type="email" placeholder="Enter your email" className="w-full rounded-[10px] border border-[#d6d6d6] px-4 py-3 text-[16px] outline-none focus:border-[#001c30]" />
                            </div>
                            <div>
                                <label className="mb-2 block text-[14px] font-medium text-[#001c30]">Phone</label>
                                <input type="tel" placeholder="Enter your phone" className="w-full rounded-[10px] border border-[#d6d6d6] px-4 py-3 text-[16px] outline-none focus:border-[#001c30]" />
                            </div>
                            <div>
                                <label className="mb-2 block text-[14px] font-medium text-[#001c30]">Message</label>
                                <textarea rows={4} placeholder="Write your message..." className="w-full resize-none rounded-[10px] border border-[#d6d6d6] px-4 py-3 text-[16px] outline-none focus:border-[#001c30]" />
                            </div>
                            <button type="submit" className="mt-2 rounded-[40px] bg-[#facc15] px-10 py-4 text-[18px] font-semibold text-black transition-colors hover:bg-[#e5b800]">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Map placeholder */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] pb-16">
                <div className="h-[400px] overflow-hidden rounded-[15px] bg-[#e5e7eb]">
                    <iframe
                        title="FixPro Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.2649741539466!2d80.2209831!3d13.0826802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU3LjciTiA4MMKwMTMnMTUuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>

            {/* Need Help */}
            <section className="bg-[#001c30] py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] text-center">
                    <h2 className="text-[36px] font-bold text-white">Need Help?</h2>
                    <p className="mx-auto mt-4 max-w-[600px] text-[18px] text-white/80">
                        Our support team is available 24/7 to assist you with any questions or service needs.
                    </p>
                    <Link to="/services" className="mt-6 inline-flex rounded-[40px] bg-[#facc15] px-10 py-5 text-[20px] font-semibold text-black hover:bg-[#e5b800]">
                        Book a Service
                    </Link>
                </div>
            </section>
        </div>
    )
}
