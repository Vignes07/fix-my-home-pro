import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

const imgUserAvatar = new URL('@/assets/images/user-icon-vector-profile-logo-isolated-white-backg.png', import.meta.url).href
const imgAboutHero = new URL('@/assets/images/01_1.png', import.meta.url).href
const imgMission = new URL('@/assets/images/rectangle_4410.png', import.meta.url).href
const imgVision = new URL('@/assets/images/rectangle_4411.png', import.meta.url).href
const imgAppMockup = new URL('@/assets/images/app_01_1.png', import.meta.url).href

const servicesList = [
    'Electrical Services',
    'Mechanical Services',
    'Plumbing Services',
    'Cleaning Services',
    'Civil Maintenance',
    'AC Installation & Service',
    'Painting Services',
    'Smart & Modern Home Solutions',
]

const whyChoose = [
    'Verified and skilled technicians',
    'Fast and easy booking',
    'Transparent pricing with no hidden charges',
    'Reliable and on-time service',
    'Safe and professional work',
    'Customer ratings and trusted service',
]

const testimonials = [
    {
        name: 'Robert William',
        location: 'Downtown',
        text: '"PlumbFix saved us during a major pipe burst at 2 AM. They arrived within 30 minutes and fixed everything professionally. Couldn\'t be happier!"',
    },
    {
        name: 'Victoria Wotton',
        location: 'Westside',
        text: '"Transparent pricing and excellent work. They installed our new water heater quickly and cleaned up perfectly. Highly recommend their services."',
    },
    {
        name: 'Artful Dodger',
        location: 'Northgate',
        text: '"The most professional plumbing service I\'ve ever used. Fair pricing, on-time arrival, and the technician explained everything clearly."',
    },
]

export default function AboutPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="relative h-[500px] md:h-[860px] w-full overflow-hidden">
                <img src={imgAboutHero} alt="About FixPro" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[rgba(0,28,48,0.7)]" />
                <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] pt-[100px] md:pt-[160px]">
                    <h1 className="text-shadow-hero text-[36px] md:text-[60px] lg:text-[85px] font-bold leading-[1.1] tracking-[-1.7px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Complete Home<br />Solutions, One Platform
                    </h1>
                    <p className="mt-6 max-w-[605px] text-[20px] leading-[1.4] tracking-[-0.4px] text-white">
                        Professional technicians for electrical, plumbing, AC, cleaning, and maintenance — book quickly and easily.
                    </p>
                    <div className="mt-10 flex items-center gap-4">
                        <Link to="/services" className="flex items-center justify-center rounded-[40px] bg-[#facc15] px-10 py-5 text-[20px] font-semibold tracking-[-0.4px] text-black hover:bg-[#e5b800]">
                            Book Service
                        </Link>
                        <Link to="/services" className="flex items-center justify-center rounded-[40px] bg-[#d9d9d9] px-10 py-5 text-[20px] font-semibold tracking-[-0.4px] text-black hover:bg-[#c0c0c0]">
                            Explore Services
                        </Link>
                    </div>
                    <p className="mt-6 text-[20px] font-medium tracking-[-0.4px] text-white">
                        ✔ Verified Technicians • ✔ Transparent Pricing • ✔ Fast Service
                    </p>
                </div>
            </section>

            {/* Who We Are */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] py-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]">Who We Are</h2>
                <div className="mt-4 flex gap-16">
                    <div className="max-w-[612px]">
                        <p className="text-[18px] leading-[30px] text-[#0f172a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            FixPro is a trusted home service platform that connects customers with skilled and verified technicians for installation, repair, and maintenance services. We make home services simple, fast, and reliable through one easy-to-use platform. FixMyHome Pro is a smart home-service platform designed to make home maintenance easy and stress-free. We provide professional installation, repair, and maintenance through skilled and verified technicians. Our system ensures transparent pricing, safe service, and quick booking for every customer.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-10 flex items-center gap-16">
                    <div>
                        <p className="text-[32px] font-bold text-[#0f172a]">20</p>
                        <p className="text-[14px] text-[#0f172a]">Years of Experience</p>
                    </div>
                    <div>
                        <p className="text-[32px] font-bold text-[#0f172a]">1500+</p>
                        <p className="text-[14px] text-[#0f172a]">clients Served</p>
                    </div>
                    <div>
                        <p className="text-[32px] font-bold text-[#0f172a]">1.200+</p>
                        <p className="text-[14px] text-[#0f172a]">Experts</p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-[#001c30] py-20">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 sm:px-8 lg:px-[100px] md:grid-cols-2">
                    <div className="relative h-[265px] overflow-hidden rounded-[30px]">
                        <img src={imgMission} alt="Our Mission" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white">
                            <h3 className="text-[32px] font-bold leading-[1.2]">Our Mission</h3>
                            <p className="mt-2 max-w-[318px] text-[16px] leading-[1.4]">
                                To simplify home maintenance by delivering professional, transparent, and reliable services through technology and skilled technicians.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[265px] overflow-hidden rounded-[30px]">
                        <img src={imgVision} alt="Our Vision" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right text-white">
                            <h3 className="text-[32px] font-bold leading-[1.2]">Our Vision</h3>
                            <p className="mt-2 max-w-[328px] text-[16px] leading-[1.4]">
                                To become the most trusted and widely used home-service platform for every home.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] py-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]">What We Do</h2>
                <p className="mt-2 text-[18px] text-[#0f172a]">We offer a wide range of residential services including:</p>
                <div className="mt-6 flex flex-col gap-3">
                    {servicesList.map((s) => (
                        <p key={s} className="text-[20px] text-[#0f172a]">• {s}</p>
                    ))}
                </div>
                <p className="mt-8 max-w-[523px] text-[18px] text-[#0f172a]">
                    Our experienced technicians ensure every job is completed safely, professionally, and on time.
                </p>
            </section>

            {/* Why Choose FixPro */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] py-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]">Why Choose FixPro</h2>
                <div className="mt-6 flex flex-col gap-3">
                    {whyChoose.map((item) => (
                        <p key={item} className="text-[20px] text-[#0f172a]">✔ {item}</p>
                    ))}
                </div>
            </section>

            {/* Our Commitment */}
            <section className="bg-[#001c30] py-12">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] text-center">
                    <h2 className="text-[36px] font-medium text-white">Our Commitment</h2>
                    <p className="mx-auto mt-4 max-w-[1008px] text-[18px] leading-[1.6] text-white/80">
                        At FixPro, customer satisfaction and safety are our top priorities. We focus on quality service, reliability, and building long-term trust with every home we serve.
                    </p>
                    <p className="mt-8 text-[36px] font-medium text-[#facc15]">
                        FixPro – Fast • Safe • Reliable
                    </p>
                </div>
            </section>

            {/* Join CTA */}
            <section className="relative mx-auto max-w-[1440px] overflow-hidden">
                <div className="relative h-[471px] w-full bg-[#001c30]">
                    <div className="absolute left-[112px] top-1/2 -translate-y-1/2">
                        <h2 className="text-[40px] font-bold capitalize leading-[1.2] tracking-[-0.8px] text-white">
                            Earn More. Work Flexible.<br />Join FixMyHome Pro
                        </h2>
                        <p className="mt-4 text-[20px] text-white">Get regular jobs • Flexible schedule • Secure payments</p>
                        <Link to="/join-us" className="mt-6 inline-flex rounded-[40px] bg-[#facc15] px-10 py-5 text-[20px] font-semibold text-black hover:bg-[#e5b800]">
                            Register Now
                        </Link>
                    </div>
                    <div className="absolute right-[100px] top-[-20px] h-[428px] w-[515px]">
                        <img src={imgAppMockup} alt="FixPro App" className="h-full w-full object-contain" />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] py-16">
                <h2 className="text-center text-[40px] font-bold capitalize tracking-[-0.8px] text-[#03132c]">
                    feedback from our valued clients
                </h2>
                <p className="mx-auto mt-2 max-w-[948px] text-center text-[18px] leading-[35px] text-[#454545]">
                    Our customers appreciate our fast response, professional technicians, and reliable service quality.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {testimonials.map((t) => (
                        <div key={t.name} className="rounded-[15px] border border-[#d6d6d6] bg-white p-8">
                            <div className="flex items-center gap-4">
                                <img src={imgUserAvatar} alt={t.name} className="h-[63px] w-[63px] rounded-full" />
                                <div>
                                    <p className="font-display text-[24px] font-semibold text-black">{t.name}</p>
                                    <p className="font-body text-[14px] text-[#454545]">{t.location}</p>
                                </div>
                            </div>
                            <p className="mt-6 font-body text-[16px] leading-[30px] text-[#454545]">{t.text}</p>
                            <div className="mt-6 flex gap-[10px]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-8 w-8 fill-[#facc15] text-[#facc15]" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex items-center justify-center gap-[15px]">
                    <div className="h-[15px] w-[35px] rounded-[10px] bg-[#253c78]" />
                    <div className="h-[15px] w-[15px] rounded-[10px] bg-[#d9d9d9]" />
                    <div className="h-[15px] w-[15px] rounded-[10px] bg-[#d9d9d9]" />
                </div>
            </section>
        </div>
    )
}
