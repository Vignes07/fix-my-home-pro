import { Link } from 'react-router-dom'
import { Star, Heart, MapPin, Phone, Mail, Clock } from 'lucide-react'

// Image assets
const imgAboutHero = new URL('@/assets/images/01_1.png', import.meta.url).href
const imgMission = new URL('@/assets/images/rectangle_4410.png', import.meta.url).href
const imgVision = new URL('@/assets/images/rectangle_4411.png', import.meta.url).href
const imgAppMockup = new URL('@/assets/images/app_01_1.png', import.meta.url).href
const imgAboutUs = new URL('@/assets/images/frame_20881.png', import.meta.url).href
const imgAboutUs2 = new URL('@/assets/images/frame_21491.png', import.meta.url).href
const imgUserAvatar = new URL('@/assets/images/user-icon-vector-profile-logo-isolated-white-backg.png', import.meta.url).href
const imgDoorStep = new URL('@/assets/images/rectangle_4415.png', import.meta.url).href

// Service card images
const imgElectrical = new URL('@/assets/images/rectangle_4417.png', import.meta.url).href
const imgMechanical = new URL('@/assets/images/rectangle_4421.png', import.meta.url).href
const imgPlumbing = new URL('@/assets/images/rectangle_4425.png', import.meta.url).href
const imgAC = new URL('@/assets/images/rectangle_4441.png', import.meta.url).href

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

const coreServices = [
    {
        name: 'Electrical Services',
        desc: 'Complete Electrical Installation, Wiring, Repair, And Maintenance For Homes, Safe, Reliable, And Professional Service',
        price: '₹100',
        rating: '5.0',
        img: imgElectrical,
    },
    {
        name: 'Mechanical Services',
        desc: 'HVAC, Pump Systems, Ventilation, Fabrication, And Residential Mechanical Maintenance.',
        price: '₹100',
        rating: '5.0',
        img: imgMechanical,
    },
    {
        name: 'Plumbing Services',
        desc: 'Water Supply, Drainage, Bathroom, And Kitchen Plumbing, Installation, Repair, And Maintenance.',
        price: '₹100',
        rating: '5.0',
        img: imgPlumbing,
    },
    {
        name: 'AC Services',
        desc: 'AC Installation, General Service, Deep Cleaning, Gas Charging, Repair, And Annual Maintenance.',
        price: '₹100',
        rating: '5.0',
        img: imgAC,
    },
]

export default function AboutPage() {
    return (
        <div className="animate-fade-in bg-white">
            {/* ====== HERO SECTION ====== */}
            <section className="relative h-[600px] md:h-[900px] lg:h-[1024px] w-full overflow-hidden">
                <img src={imgAboutHero} alt="About FixPro" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/50" />
                <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] pt-[140px] md:pt-[200px] lg:pt-[280px]">
                    <h1
                        className="text-[36px] md:text-[56px] lg:text-[72px] font-bold leading-[1.1] text-white drop-shadow-[10px_5px_18px_rgba(3,19,44,1)]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Complete Home<br />Solutions, One Platform
                    </h1>
                    <p
                        className="mt-8 max-w-[650px] text-[16px] md:text-[20px] font-normal leading-[1.5] text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Professional technicians for electrical, plumbing, AC, cleaning, and maintenance — book quickly and easily.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            to="/services"
                            className="flex h-[64px] w-[288px] items-center justify-center rounded-[40px] bg-yellow-400 text-[20px] font-semibold text-black hover:bg-yellow-500 transition-colors"
                        >
                            Book Service
                        </Link>
                        <Link
                            to="/services"
                            className="flex h-[64px] w-[288px] items-center justify-center rounded-[40px] bg-slate-900 text-[20px] font-semibold text-white hover:bg-slate-800 transition-colors"
                        >
                            Explore Services
                        </Link>
                    </div>

                    <p className="mt-8 text-[16px] md:text-[20px] font-medium text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        ✔ Verified Technicians • ✔ Transparent Pricing • ✔ Fast Service
                    </p>
                </div>
            </section>

            {/* ====== WHO WE ARE ====== */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[92px] py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
                    <div className="flex-1">
                        <h2 className="text-[36px] font-medium text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Who We Are
                        </h2>
                        <p
                            className="mt-4 text-[20px] lg:text-[24px] font-light leading-[1.6] text-slate-900 max-w-[620px]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            FixPro is a trusted home service platform that connects
                            customers with skilled and verified technicians for
                            installation, repair, and maintenance services.
                            We make home services simple, fast, and reliable
                            through one easy-to-use platform. FixMyHome Pro
                            is a smart home-service platform designed to make
                            home maintenance easy and stress-free. We provide
                            professional installation, repair, and maintenance through
                            skilled and verified technicians. Our system ensures
                            transparent pricing, safe service, and quick booking
                            for every customer.
                        </p>

                        {/* Stats */}
                        <div className="mt-12 flex items-start gap-12 lg:gap-16">
                            <div>
                                <p className="text-[30px] font-bold text-slate-900 capitalize leading-10" style={{ fontFamily: "'Lato', sans-serif" }}>20</p>
                                <p className="text-[16px] font-light text-slate-900 capitalize leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>Years of Experience</p>
                            </div>
                            <div>
                                <p className="text-[30px] font-bold text-slate-900 capitalize leading-10" style={{ fontFamily: "'Lato', sans-serif" }}>1500+</p>
                                <p className="text-[16px] font-light text-slate-900 capitalize leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>clients Served</p>
                            </div>
                            <div>
                                <p className="text-[30px] font-bold text-slate-900 capitalize leading-10" style={{ fontFamily: "'Lato', sans-serif" }}>1.200+</p>
                                <p className="text-[16px] font-light text-slate-900 capitalize leading-5" style={{ fontFamily: "'Inter', sans-serif" }}>Experts</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <img
                            src={imgAboutUs}
                            alt="About Us"
                            className="w-full lg:w-[595px] h-auto lg:h-[472px] object-cover rounded-[20px]"
                        />
                    </div>
                </div>
            </section>

            {/* ====== MISSION & VISION (Yellow Band) ====== */}
            <section className="bg-yellow-400 py-10 lg:py-16">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[92px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Our Mission */}
                        <div className="relative bg-white rounded-[30px] p-8 lg:p-10 flex flex-col items-start min-h-[256px]">
                            <div className="flex items-start gap-6">
                                <div className="flex-1">
                                    <h3 className="text-[40px] lg:text-[60px] font-normal text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        Our Mission
                                    </h3>
                                    <p className="mt-4 text-[16px] font-normal leading-[1.5] text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        To simplify home maintenance by delivering<br />
                                        professional, transparent, and reliable<br />
                                        services through technology and<br />
                                        skilled technicians.
                                    </p>
                                </div>
                                <img
                                    src={imgMission}
                                    alt="Mission"
                                    className="hidden lg:block w-[139px] h-[127px] object-cover flex-shrink-0"
                                />
                            </div>
                        </div>

                        {/* Our Vision */}
                        <div className="relative bg-white rounded-[30px] p-8 lg:p-10 flex flex-col items-start min-h-[256px]">
                            <div className="flex items-start gap-6">
                                <div className="flex-1">
                                    <h3 className="text-[40px] lg:text-[60px] font-normal text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        Our Vision
                                    </h3>
                                    <p className="mt-4 text-[16px] font-normal leading-[1.5] text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        To become the most trusted and widely<br />
                                        used home-service platform for every home.
                                    </p>
                                </div>
                                <img
                                    src={imgVision}
                                    alt="Vision"
                                    className="hidden lg:block w-[109px] h-[109px] object-cover flex-shrink-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== WHAT WE DO ====== */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[92px] py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
                    <div className="flex-1">
                        <h2 className="text-[36px] font-medium text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                            What We Do
                        </h2>
                        <p className="mt-4 text-[20px] lg:text-[24px] font-light text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                            We offer a wide range of residential services including:
                        </p>
                        <div className="mt-6 flex flex-col gap-4">
                            {servicesList.map((s) => (
                                <p key={s} className="text-[20px] lg:text-[24px] font-light text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    • {s}
                                </p>
                            ))}
                        </div>
                        <p className="mt-10 max-w-[523px] text-[20px] lg:text-[24px] font-light text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Our experienced technicians ensure every job is
                            completed safely, professionally, and on time.
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <img
                            src={imgAboutUs2}
                            alt="What We Do"
                            className="w-full lg:w-[595px] h-auto lg:h-[629px] object-cover rounded-[20px]"
                        />
                    </div>
                </div>
            </section>

            {/* ====== WHY CHOOSE FIXPRO (Dark Card) ====== */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[84px] py-8">
                <div className="relative bg-slate-900 rounded-[40px] overflow-hidden py-10 lg:py-16 px-8 lg:px-[112px]">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                        <div>
                            <h2 className="text-[36px] font-medium text-yellow-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Why Choose FixPro
                            </h2>
                            <div className="mt-6 flex flex-col gap-3">
                                {whyChoose.map((item) => (
                                    <p key={item} className="text-[20px] lg:text-[24px] font-light text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src={imgAppMockup}
                                alt="FixPro App"
                                className="w-[300px] lg:w-[515px] h-auto lg:h-[384px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== OUR CORE SERVICES ====== */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[84px] py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[36px] font-medium text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Our Core Services
                    </h2>
                    <Link to="/services" className="text-[20px] font-normal text-slate-900 tracking-wide hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
                        See All
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coreServices.map((service) => (
                        <div
                            key={service.name}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative w-full aspect-square rounded-[10px] overflow-hidden bg-gray-100">
                                <img src={service.img} alt={service.name} className="w-full h-full object-cover" />
                                {/* Rating badge */}
                                <div className="absolute top-2 left-2 bg-white rounded-3xl px-2.5 py-1 flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <span className="text-[16px] font-medium text-slate-900" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                        {service.rating}
                                    </span>
                                </div>
                                {/* Heart icon */}
                                <div className="absolute top-2 right-2 bg-white rounded-3xl p-2.5">
                                    <Heart className="w-5 h-5 text-slate-900" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-4 flex flex-col flex-1">
                                <h3
                                    className="text-[24px] font-bold text-slate-900 tracking-wide"
                                    style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                    {service.name}
                                </h3>
                                <p
                                    className="mt-1 text-[18px] font-normal text-gray-400 flex-1"
                                    style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                    {service.desc}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span
                                        className="text-[24px] font-bold text-amber-500 tracking-wide"
                                        style={{ fontFamily: "'Roboto', sans-serif" }}
                                    >
                                        {service.price}
                                    </span>
                                    <Link
                                        to="/services"
                                        className="px-4 py-2.5 bg-slate-900 rounded-3xl text-[18px] font-medium text-white hover:bg-slate-800 transition-colors"
                                        style={{ fontFamily: "'Roboto', sans-serif" }}
                                    >
                                        Buy
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== OUR COMMITMENT (Yellow Band) ====== */}
            <section className="bg-yellow-400 py-10">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[92px] text-center">
                    <h2 className="text-[36px] font-medium text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Our Commitment
                    </h2>
                    <p className="mt-6 text-[20px] lg:text-[24px] font-light text-slate-900 max-w-[1000px] mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                        At FixPro, customer satisfaction and safety are our top priorities.
                        We focus on quality service, reliability, and building long-term trust with every home we serve.
                    </p>
                    <p className="mt-6 text-[36px] font-medium text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                        FixPro – Fast • Safe • Reliable
                    </p>
                </div>
            </section>

            {/* ====== PROFESSIONAL HOME SERVICES CTA (Banner Image) ====== */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[84px] py-16">
                <div className="relative w-full h-[300px] lg:h-[458px] rounded-[40px] overflow-hidden">
                    <img
                        src={imgDoorStep}
                        alt="Professional Home Services"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="relative z-10 flex flex-col justify-center h-full px-8 lg:px-[72px]">
                        <h2
                            className="text-[28px] lg:text-[40px] font-semibold text-white capitalize leading-[1.2]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Professional Home Services at Your<br />Doorstep
                        </h2>
                        <p className="mt-4 text-[18px] lg:text-[20px] font-normal text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Fast • Safe • Reliable
                        </p>
                        <Link
                            to="/services"
                            className="mt-4 flex h-[64px] w-[288px] items-center justify-center rounded-[40px] bg-yellow-400 text-[20px] font-semibold text-black hover:bg-yellow-500 transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Know More
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====== BUILD YOUR FUTURE WITH FIXPRO (Dark CTA) ====== */}
            <section className="bg-slate-900">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[112px] py-16 lg:py-20">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                        <div className="max-w-[628px]">
                            <h2
                                className="text-[28px] lg:text-[40px] font-bold text-white capitalize leading-[48px]"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                Build Your Future with FixPro
                            </h2>
                            <p className="mt-4 text-[18px] lg:text-[20px] font-normal text-white leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Join FixPro and grow your career with more job opportunities, flexible work, and secure earnings. Work with a trusted platform and connect with real customers in your area.
                            </p>
                            <Link
                                to="/join-us"
                                className="mt-8 inline-flex h-[64px] w-[288px] items-center justify-center rounded-[40px] bg-yellow-400 text-[20px] font-semibold text-black hover:bg-yellow-500 transition-colors"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                Register Now
                            </Link>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src={imgAppMockup}
                                alt="FixPro App"
                                className="w-[300px] lg:w-[515px] h-auto lg:h-[384px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== TESTIMONIALS ====== */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[73px] py-16 lg:py-20">
                <h2
                    className="text-center text-[28px] lg:text-[40px] font-bold capitalize leading-[48px] text-slate-900"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    feedback from our valued clients
                </h2>
                <p
                    className="mx-auto mt-3 max-w-[1000px] text-center text-[16px] lg:text-[18px] font-normal leading-[36px] text-zinc-700"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    Our customers appreciate our fast response, professional technicians, and reliable service quality.
                    Their trust and positive feedback inspire us to deliver safe, efficient, and high-quality home services every day.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className="rounded-2xl border border-neutral-300 bg-white p-8 flex flex-col"
                        >
                            {/* Avatar & Info */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={imgUserAvatar}
                                    alt={t.name}
                                    className="w-16 h-16 rounded-full bg-zinc-300 object-cover"
                                />
                                <div>
                                    <p
                                        className="text-[24px] font-semibold text-black leading-9"
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        {t.name}
                                    </p>
                                    <p
                                        className="text-[14px] font-normal text-zinc-700 leading-5"
                                        style={{ fontFamily: "'Open Sans', sans-serif" }}
                                    >
                                        {t.location}
                                    </p>
                                </div>
                            </div>

                            {/* Quote */}
                            <p
                                className="mt-6 text-[16px] font-normal text-zinc-700 leading-8 flex-1"
                                style={{ fontFamily: "'Open Sans', sans-serif" }}
                            >
                                {t.text}
                            </p>

                            {/* Stars */}
                            <div className="mt-6 flex items-center gap-2.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination dots */}
                <div className="mt-8 flex items-center justify-center gap-3.5">
                    <div className="w-9 h-3.5 bg-blue-900 rounded-[10px]" />
                    <div className="w-3.5 h-3.5 bg-zinc-300 rounded-[10px]" />
                    <div className="w-3.5 h-3.5 bg-zinc-300 rounded-[10px]" />
                </div>
            </section>

            {/* ====== FOOTER ====== */}
            <footer className="bg-black py-20">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px]">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-40">
                        {/* Brand Column */}
                        <div className="max-w-[384px] flex flex-col gap-10">
                            <div className="flex flex-col gap-6">
                                <h3
                                    className="text-[30px] font-medium text-white leading-[50px]"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    Fix Home Pro
                                </h3>
                                <p
                                    className="text-[16px] font-normal text-neutral-50 leading-6"
                                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                                >
                                    Professional plumbing services you can trust. Available
                                    24/7 for all your residential and commercial plumbing
                                    needs.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[14px] font-normal text-neutral-50" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                                    Follow us:
                                </span>
                                <div className="flex items-center gap-6">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded bg-white/20 hover:bg-white/30 transition-colors cursor-pointer" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="flex flex-wrap gap-12 lg:gap-20">
                            {/* Quick Links */}
                            <div className="flex flex-col gap-6">
                                <h4
                                    className="text-[24px] font-semibold text-white leading-9"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    Quick Links
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {['Home', 'About Us', 'Our Services', 'Join Us', 'Contact'].map((link) => (
                                        <span
                                            key={link}
                                            className="text-[16px] font-normal text-neutral-50 leading-8 cursor-pointer hover:text-yellow-400 transition-colors"
                                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                                        >
                                            {link}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Services */}
                            <div className="flex flex-col gap-6">
                                <h4
                                    className="text-[24px] font-semibold text-white leading-9"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    Services
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {['Pipe Repair', 'Drain Cleaning', 'Water Heater Service', 'Fixture Installation', 'Emergency Repairs', 'Bathroom Plumbing'].map((svc) => (
                                        <span
                                            key={svc}
                                            className="text-[16px] font-normal text-neutral-50 leading-8 cursor-pointer hover:text-yellow-400 transition-colors"
                                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                                        >
                                            {svc}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Us */}
                            <div className="flex flex-col gap-6">
                                <h4
                                    className="text-[24px] font-semibold text-white leading-9"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    Contact Us
                                </h4>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                                        <span className="text-[16px] font-normal text-neutral-50 leading-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                                            123 Main Street, Metro City, ST 12345
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Phone className="w-6 h-6 text-white flex-shrink-0" />
                                        <span className="text-[16px] font-normal text-neutral-50 leading-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                                            (123) 456-7890
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Mail className="w-6 h-6 text-white flex-shrink-0" />
                                        <span className="text-[16px] font-normal text-neutral-50 leading-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                                            contact@plumbfix.com
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Clock className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                                        <span className="text-[16px] font-normal text-neutral-50 leading-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                                            Mon-Fri: 7am - 8pm<br />Sat-Sun: 8am - 6pm
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-10 h-[1px] bg-neutral-50/20" />

                    {/* Bottom Bar */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[14px] font-normal text-neutral-50 leading-5" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                            © 2026 Fix Home Pro. All rights reserved.
                        </p>
                        <div className="flex items-center gap-8">
                            {['Privacy Policy', 'Term of Service', 'Cookie Policy'].map((item) => (
                                <span
                                    key={item}
                                    className="text-[14px] font-normal text-neutral-50 leading-5 cursor-pointer hover:text-yellow-400 transition-colors"
                                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
