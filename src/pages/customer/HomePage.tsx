import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Star, Heart, ChevronRight } from 'lucide-react'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'

// Import images — will use Figma-exported assets from /assets/images/
// Using dynamic imports with fallback pattern
const heroImg = new URL('@/assets/images/01_1.png', import.meta.url).href
const electricalCard = new URL('@/assets/images/frame_20881.png', import.meta.url).href
const mechanicalCard = new URL('@/assets/images/frame_20881.png', import.meta.url).href
const plumbingCard = new URL('@/assets/images/frame_20881.png', import.meta.url).href

// Service sub-category images
const imgElectrical = new URL('@/assets/images/rectangle_4417.png', import.meta.url).href
const imgMechanical = new URL('@/assets/images/rectangle_4421.png', import.meta.url).href
const imgPlumbing = new URL('@/assets/images/rectangle_4425.png', import.meta.url).href
const imgPainting = new URL('@/assets/images/rectangle_4429.png', import.meta.url).href
const imgCleaning = new URL('@/assets/images/rectangle_4433.png', import.meta.url).href
const imgCivil = new URL('@/assets/images/rectangle_4437.png', import.meta.url).href
const imgAC = new URL('@/assets/images/rectangle_4441.png', import.meta.url).href
const imgSmart = new URL('@/assets/images/rectangle_4445.png', import.meta.url).href

const imgElectrical2 = new URL('@/assets/images/rectangle_4418.png', import.meta.url).href
const imgPlumbing2 = new URL('@/assets/images/rectangle_4426.png', import.meta.url).href
const imgPainting2 = new URL('@/assets/images/rectangle_4430.png', import.meta.url).href
const imgCleaning2 = new URL('@/assets/images/rectangle_4434.png', import.meta.url).href
const imgCivil2 = new URL('@/assets/images/rectangle_4438.png', import.meta.url).href
const imgSmart2 = new URL('@/assets/images/rectangle_4446.png', import.meta.url).href

const imgElectrical3 = new URL('@/assets/images/rectangle_4419.png', import.meta.url).href
const imgMechanical3 = new URL('@/assets/images/rectangle_4423.png', import.meta.url).href
const imgPlumbing3 = new URL('@/assets/images/rectangle_4427.png', import.meta.url).href
const imgPainting3 = new URL('@/assets/images/rectangle_4431.png', import.meta.url).href
const imgCleaning3 = new URL('@/assets/images/rectangle_4435.png', import.meta.url).href
const imgCivil3 = new URL('@/assets/images/rectangle_4439.png', import.meta.url).href
const imgAC3 = new URL('@/assets/images/rectangle_4443.png', import.meta.url).href
const imgSmart3 = new URL('@/assets/images/rectangle_4447.png', import.meta.url).href

const imgElectrical4 = new URL('@/assets/images/rectangle_4420.png', import.meta.url).href
const imgMechanical4 = new URL('@/assets/images/rectangle_4424.png', import.meta.url).href
const imgPlumbing4 = new URL('@/assets/images/rectangle_4428.png', import.meta.url).href
const imgPainting4 = new URL('@/assets/images/rectangle_4432.png', import.meta.url).href
const imgCleaning4 = new URL('@/assets/images/rectangle_4436.png', import.meta.url).href
const imgCivil4 = new URL('@/assets/images/rectangle_4440.png', import.meta.url).href
const imgAC4 = new URL('@/assets/images/rectangle_4444.png', import.meta.url).href
const imgSmart4 = new URL('@/assets/images/rectangle_4448.png', import.meta.url).href

const imgHomeMaintenance = new URL('@/assets/images/rectangle_4410.png', import.meta.url).href
const imgInstantHelp = new URL('@/assets/images/rectangle_4411.png', import.meta.url).href
const imgCleaningCard = new URL('@/assets/images/rectangle_4396.png', import.meta.url).href
const imgACCard = new URL('@/assets/images/rectangle_4408.png', import.meta.url).href
const imgCivilCard = new URL('@/assets/images/rectangle_4409.png', import.meta.url).href
const imgJoinCTA = new URL('@/assets/images/rectangle_4406.png', import.meta.url).href
const imgAppMockup = new URL('@/assets/images/app_01_1.png', import.meta.url).href
const imgUserAvatar = new URL('@/assets/images/user-icon-vector-profile-logo-isolated-white-backg.png', import.meta.url).href

const imgBookedElectrical = new URL('@/assets/images/electrician-installing-electrical-outlet_1.png', import.meta.url).href
const imgBookedCivil = new URL('@/assets/images/construction-planning-development-building-concept.png', import.meta.url).href
const imgBookedAC = new URL('@/assets/images/hvac-technician-cleaning-dirty-air-conditioner-fil.png', import.meta.url).href
const imgBookedPlumbing = new URL('@/assets/images/man-is-working-pipe-with-red-blue-uniform_1.png', import.meta.url).href

// Service categories data
const serviceCategories = [
    {
        title: 'Electrical Services',
        items: [
            { name: 'House Wiring &\nDB Installation', img: imgElectrical },
            { name: 'Switch, Socket &\nLighting Setup', img: imgElectrical2 },
            { name: 'Power Fault & Short\nCircuit Repair', img: imgElectrical3 },
            { name: 'CCTV, Inverter &\nSolar Wiring', img: imgElectrical4 },
        ]
    },
    {
        title: 'Mechanical Services',
        items: [
            { name: 'AC Piping & Installation\nWork', img: imgMechanical },
            { name: 'Pump & Motor Setup\n/ Repair', img: imgElectrical2 },
            { name: 'Ventilation & Exhaust\nSystems', img: imgMechanical3 },
            { name: 'Fabrication & Welding\nWork', img: imgMechanical4 },
        ]
    },
    {
        title: 'Plumbing Services',
        items: [
            { name: 'Water Pipeline\nInstallation', img: imgPlumbing },
            { name: 'Bathroom & Kitchen\nFittings', img: imgPlumbing2 },
            { name: 'Leakage & Blockage\nRepair', img: imgPlumbing3 },
            { name: 'Water Pressure /\nTank Fix', img: imgPlumbing4 },
        ]
    },
    {
        title: 'Painting Services',
        items: [
            { name: 'Interior & Exterior\nPainting', img: imgPainting },
            { name: 'Wall Putty & Surface\nPreparation', img: imgPainting2 },
            { name: 'Wood & Metal Painting', img: imgPainting3 },
            { name: 'Decorative Finish &\nTouch-up', img: imgPainting4 },
        ]
    },
    {
        title: 'Cleaning Services',
        items: [
            { name: 'Full Home Deep\nCleaning', img: imgCleaning },
            { name: 'Kitchen & Bathroom\nCleaning', img: imgCleaning2 },
            { name: 'Sofa & Upholstery\nCleaning', img: imgCleaning3 },
            { name: 'Sanitization &\nDisinfection', img: imgCleaning4 },
        ]
    },
    {
        title: 'Civil Maintenance',
        items: [
            { name: 'Wall & Tile Repair', img: imgCivil },
            { name: 'Waterproofing Service', img: imgCivil2 },
            { name: 'Door & Window Repair', img: imgCivil3 },
            { name: 'General Home\nMaintenance', img: imgCivil4 },
        ]
    },
    {
        title: 'AC Services',
        items: [
            { name: 'AC Installation & Setup', img: imgAC },
            { name: 'General Service &\nCleaning', img: imgElectrical2 },
            { name: 'Gas Charging & Cooling\nRepair', img: imgAC3 },
            { name: 'AMC & Regular\nMaintenance', img: imgAC4 },
        ]
    },
    {
        title: 'Smart & Modern Services',
        items: [
            { name: 'Home Automation Setup', img: imgSmart },
            { name: 'CCTV Camera Installation', img: imgSmart2 },
            { name: 'Smart Lock & Doorbell\nSetup', img: imgSmart3 },
            { name: 'Solar Power System\nWiring', img: imgSmart4 },
        ]
    },
]

const testimonials = [
    {
        name: 'Robert William',
        location: 'Downtown',
        text: '"PlumbFix saved us during a major pipe burst at 2 AM. They arrived within 30 minutes and fixed everything professionally. Couldn\'t be happier!"',
        rating: 5,
    },
    {
        name: 'Victoria Wotton',
        location: 'Westside',
        text: '"Transparent pricing and excellent work. They installed our new water heater quickly and cleaned up perfectly. Highly recommend their services."',
        rating: 5,
    },
    {
        name: 'Artful Dodger',
        location: 'Northgate',
        text: '"The most professional plumbing service I\'ve ever used. Fair pricing, on-time arrival, and the technician explained everything clearly."',
        rating: 5,
    },
]

const bookedServices = [
    { title: 'Electrical Services', sold: '100 item sold', price: '₹100', img: imgBookedElectrical },
    { title: 'Civil Maintenance', sold: '1K+ item sold', price: '₹100', img: imgBookedCivil },
    { title: 'AC Services', sold: '2K item sold', price: '₹100', img: imgBookedAC },
    { title: 'Plumbing Services', sold: '15K+ item sold', price: '₹100', img: imgBookedPlumbing },
]

export default function HomePage() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/data/all')
                // Wait, use the official endpoint
                const officialResponse = await api.get('/services/grouped')
                if (officialResponse.data?.success) {
                    setCategories(officialResponse.data.data)
                }
            } catch (error) {
                console.error("Error fetching categories", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    return (
        <div className="animate-fade-in">
            {/* ====== HERO SECTION ====== */}
            <section className="relative h-[860px] w-full overflow-hidden">
                <img
                    src={heroImg}
                    alt="Professional home service technicians"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="relative z-10 mx-auto max-w-[1440px] px-[100px] pt-[160px]">
                    <h1 className="text-shadow-hero text-[85px] font-bold leading-[1.1] tracking-[-1.7px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Fix Your Home.<br />
                        Fast. Safe. Reliable.
                    </h1>
                    <p className="mt-6 max-w-[560px] text-[20px] leading-[1.4] tracking-[-0.4px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Book trusted and verified technicians for electrical, plumbing, AC, cleaning, and home maintenance — all in one place.
                    </p>
                    <div className="mt-10 flex items-center gap-4">
                        <Button
                            size="lg"
                            className="rounded-[40px] bg-[#facc15] px-10 py-7 text-[20px] font-semibold tracking-[-0.4px] text-black hover:bg-[#e5b800]"
                            onClick={() => navigate('/services')}
                        >
                            Book Service
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-[40px] bg-[#d9d9d9] px-10 py-7 text-[20px] font-semibold tracking-[-0.4px] text-black hover:bg-[#c0c0c0]"
                            onClick={() => navigate('/services')}
                        >
                            Explore Services
                        </Button>
                    </div>
                    <p className="mt-6 text-[20px] font-medium tracking-[-0.4px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        ✔ Verified Technicians • ✔ Transparent Pricing • ✔ Fast Service
                    </p>
                </div>
            </section>

            {/* ====== OUR EXPERT SERVICES ====== */}
            <section className="mx-auto max-w-[1440px] px-[100px] py-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Our Expert Services
                </h2>
                <p className="mt-2 text-[24px] font-light tracking-[-0.48px] text-[#0f172a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Professional, reliable home services by skilled technicians for<br />
                    safe and quality installation, repair, and maintenance.
                </p>
                <div className="relative mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                        { name: 'Electrical Services', img: electricalCard },
                        { name: 'Mechanical Services', img: mechanicalCard },
                        { name: 'Plumbing Services', img: plumbingCard },
                    ].map((card) => (
                        <div key={card.name} className="group cursor-pointer overflow-hidden rounded-[10px]">
                            <div className="relative h-[229px] overflow-hidden rounded-[10px] bg-[#d7d7d7]">
                                <img src={card.img} alt={card.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <p className="mt-3 text-[24px] font-medium tracking-[0.5px] text-[#001c30]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {card.name}
                            </p>
                        </div>
                    ))}
                    <Link to="/services" className="absolute -right-2 top-[100px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#001c30] text-white transition-transform hover:scale-110">
                        <ArrowRight className="h-6 w-6" />
                    </Link>
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

            {/* ====== BANNER: Complete Home Maintenance + Instant Help ====== */}
            <section className="mx-auto max-w-[1440px] px-[100px] pb-16">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="relative h-[265px] overflow-hidden rounded-[30px]">
                        <img src={imgHomeMaintenance} alt="Complete Home Maintenance" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white">
                            <h3 className="text-[32px] font-bold leading-[1.2]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Complete Home<br />Maintenance
                            </h3>
                            <p className="mt-2 text-[14px]">• Easy booking • Trusted technicians • Transparent pricing</p>
                            <Button
                                variant="outline"
                                className="mt-4 rounded-[40px] border-white/40 bg-white/20 px-6 text-white hover:bg-white/30 hover:text-white"
                                onClick={() => navigate('/services')}
                            >
                                Explore
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-[265px] overflow-hidden rounded-[30px]">
                        <img src={imgInstantHelp} alt="Instant Help Available" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right text-white">
                            <h3 className="text-[32px] font-bold leading-[1.2]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Instant Help<br />Available
                            </h3>
                            <p className="mt-2 text-[14px]">Quick service at your doorstep</p>
                            <Button
                                className="mt-4 rounded-[40px] bg-[#facc15] px-8 text-black hover:bg-[#e5b800]"
                                onClick={() => navigate('/services')}
                            >
                                Book Now
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== SERVICE CATEGORY SECTIONS ====== */}
            {isLoading ? (
                <div className="py-20 text-center animate-pulse">Loading Services from Database...</div>
            ) : categories.length > 0 ? categories.map((cat, catIdx) => (
                <section key={cat.id || cat.name} className="mx-auto max-w-[1440px] px-[100px] pb-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {cat.name}
                        </h2>
                        <Link to={`/services`} className="flex items-center text-[20px] tracking-[0.5px] text-[#001c30] transition-colors hover:text-[#facc15]">
                            See All <ChevronRight className="ml-1 h-5 w-5" />
                        </Link>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
                        {cat.services?.slice(0, 4).map((item: any, idx: number) => {
                            // Map fallback images since DB doesn't have image URLs yet
                            const fallbackImgList = [imgElectrical, imgPlumbing, imgAC, imgCleaning, imgPainting, imgMechanical, imgCivil];
                            const itemImg = fallbackImgList[(catIdx + idx) % fallbackImgList.length];

                            return (
                                <Link to={`/services/${item.id}`} key={item.id} className="group cursor-pointer">
                                    <div className="h-[312px] overflow-hidden rounded-[10px] bg-[#d7d7d7]">
                                        <img src={itemImg} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <p className="mt-3 whitespace-pre-line text-[24px] font-medium tracking-[-0.48px] text-[#0f172a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {item.name}
                                    </p>
                                    <p className="text-[16px] text-muted-foreground mt-1">Starting from ₹{item.base_price}</p>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            )) : (
                <div className="py-20 text-center text-muted-foreground">No services found in database.</div>
            )}

            {/* ====== MORE HOME SOLUTIONS ====== */}
            <section className="mx-auto max-w-[1440px] px-[100px] py-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    More Home Solutions
                </h2>
                <p className="mt-2 text-[24px] font-light tracking-[-0.48px] text-[#0f172a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Professional, reliable home services by skilled technicians for<br />
                    safe and quality installation, repair, and maintenance.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                        { title: 'Cleaning Services', desc: 'Deep cleaning • Sanitization • Sofa cleaning', img: imgCleaningCard },
                        { title: 'AC & Appliance', desc: 'AC repair • Fridge • Washing machine', img: imgACCard },
                        { title: 'Civil Maintenance', desc: 'Tile fix • Waterproofing • Door repair', img: imgCivilCard },
                    ].map((card) => (
                        <div key={card.title} className="relative h-[265px] overflow-hidden rounded-[30px]">
                            <img src={card.img} alt={card.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-[24px] font-semibold">{card.title}</h3>
                                <p className="mt-1 text-[14px]">{card.desc}</p>
                                <Button
                                    className="mt-3 rounded-[40px] bg-[#facc15] px-6 text-black hover:bg-[#e5b800]"
                                    onClick={() => navigate('/services')}
                                >
                                    Book Service
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== JOIN FIXMYHOME PRO CTA ====== */}
            <section className="relative mx-auto max-w-[1440px] overflow-hidden">
                <div className="relative h-[471px] w-full bg-[#001c30]">
                    <div className="absolute left-[112px] top-1/2 -translate-y-1/2">
                        <h2 className="text-[40px] font-bold capitalize leading-[1.2] tracking-[-0.8px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Earn More. Work Flexible.<br />Join FixMyHome Pro
                        </h2>
                        <p className="mt-4 text-[20px] tracking-[-0.4px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Get regular jobs • Flexible schedule • Secure payments
                        </p>
                        <Button
                            size="lg"
                            className="mt-6 rounded-[40px] bg-[#facc15] px-10 py-6 text-[20px] font-semibold tracking-[-0.4px] text-black hover:bg-[#e5b800]"
                            onClick={() => navigate('/join-us')}
                        >
                            Register Now
                        </Button>
                    </div>
                    <div className="absolute right-[100px] top-[-20px] h-[428px] w-[515px]">
                        <img src={imgAppMockup} alt="FixPro App" className="h-full w-full object-contain" />
                    </div>
                </div>
            </section>

            {/* ====== DOWNLOAD APP SECTION ====== */}
            <section className="relative mx-auto max-w-[1440px] overflow-hidden">
                <div className="relative min-h-[458px] w-full">
                    <img src={imgJoinCTA} alt="Upgrade your home" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 flex items-center justify-center py-20">
                        <div className="text-center">
                            <h2 className="text-[40px] font-bold capitalize tracking-[-0.8px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Service Item
                            </h2>
                            <p className="mt-2 text-[20px] text-white">Description</p>
                            <Link to="/services" className="mt-6 inline-flex items-center justify-center rounded-[40px] bg-[#facc15] px-10 py-5 text-[20px] font-semibold text-black transition-colors hover:bg-[#e5b800]">
                                Know More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== MOST BOOKED SERVICES ====== */}
            <section className="mx-auto max-w-[1440px] px-[70px] py-16">
                <h2 className="text-[40px] font-bold capitalize tracking-[-0.8px] text-[#03132c]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Most booked services
                </h2>
                <div className="mt-8 grid grid-cols-1 gap-[38px] sm:grid-cols-2 lg:grid-cols-4">
                    {bookedServices.map((svc) => (
                        <div key={svc.title} className="rounded-[15px] bg-white p-5 shadow-card">
                            <div className="relative h-[251px] w-full overflow-hidden rounded-[10px] bg-[#d7d7d7]">
                                <img src={svc.img} alt={svc.title} className="h-full w-full object-cover" />
                                {/* Heart icon */}
                                <div className="absolute right-2 top-2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white">
                                    <Heart className="h-[18px] w-[18px] text-[#001c30]" />
                                </div>
                                {/* Rating */}
                                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white px-3 py-2">
                                    <Star className="h-[18px] w-[18px] fill-[#facc15] text-[#facc15]" />
                                    <span className="text-[16px] font-medium text-[#001c30]" style={{ fontFamily: "'Roboto', sans-serif" }}>5.0</span>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col gap-6">
                                <div>
                                    <p className="text-[24px] font-bold tracking-[0.5px] text-[#001c30]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                        {svc.title}
                                    </p>
                                    <p className="text-[14px] font-medium text-[#8e96a4]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                        {svc.sold}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[24px] font-bold tracking-[0.5px] text-[#ee9322]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                        {svc.price}
                                    </span>
                                    <Link to="/services" className="flex items-center justify-center rounded-[25px] bg-[#001c30] px-4 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#0a2a45]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== TESTIMONIALS ====== */}
            <section className="mx-auto max-w-[1440px] px-[100px] py-16">
                <h2 className="text-center text-[40px] font-bold capitalize tracking-[-0.8px] text-[#03132c]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    feedback from our valued clients
                </h2>
                <p className="mx-auto mt-2 max-w-[948px] text-center text-[18px] leading-[35px] text-[#454545]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Our customers appreciate our fast response, professional technicians, and reliable service quality.<br />
                    Their trust and positive feedback inspire us to deliver safe, efficient, and high-quality home services every day.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {testimonials.map((t) => (
                        <div key={t.name} className="rounded-[15px] border border-[#d6d6d6] bg-white p-8">
                            <div className="flex items-center gap-4">
                                <img src={imgUserAvatar} alt={t.name} className="h-[63px] w-[63px] rounded-full object-cover" />
                                <div>
                                    <p className="font-display text-[24px] font-semibold leading-[35px] text-black">
                                        {t.name}
                                    </p>
                                    <p className="font-body text-[14px] leading-[20px] text-[#454545]">
                                        {t.location}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-6 font-body text-[16px] leading-[30px] text-[#454545]">
                                {t.text}
                            </p>
                            <div className="mt-6 flex items-center gap-[10px]">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="h-8 w-8 fill-[#facc15] text-[#facc15]" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination dots */}
                <div className="mt-8 flex items-center justify-center gap-[15px]">
                    <div className="h-[15px] w-[35px] rounded-[10px] bg-[#253c78]" />
                    <div className="h-[15px] w-[15px] rounded-[10px] bg-[#d9d9d9]" />
                    <div className="h-[15px] w-[15px] rounded-[10px] bg-[#d9d9d9]" />
                </div>
            </section>
        </div>
    )
}
