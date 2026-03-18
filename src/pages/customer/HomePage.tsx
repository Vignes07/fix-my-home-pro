import { Link, useNavigate } from 'react-router-dom'
import { Star, ChevronRight, Zap, Droplets, Snowflake, Sparkles, Scissors, Paintbrush } from 'lucide-react'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { ServiceCategorySkeleton } from '@/components/common/skeletons'
import { useSiteContent, type SiteItem } from '@/hooks/useSiteContent'

// Fallback images if CMS items don't have images yet
const imgElectrical = new URL('@/assets/images/rectangle_4417.png', import.meta.url).href
const imgMechanical = new URL('@/assets/images/rectangle_4421.png', import.meta.url).href
const imgPlumbing = new URL('@/assets/images/rectangle_4425.png', import.meta.url).href
const imgPainting = new URL('@/assets/images/rectangle_4429.png', import.meta.url).href
const imgCleaning = new URL('@/assets/images/rectangle_4433.png', import.meta.url).href
const imgCivil = new URL('@/assets/images/rectangle_4437.png', import.meta.url).href
const imgAC = new URL('@/assets/images/rectangle_4441.png', import.meta.url).href
const imgSmart = new URL('@/assets/images/rectangle_4445.png', import.meta.url).href

const imgCleaningCard = new URL('@/assets/images/rectangle_4396.png', import.meta.url).href
const imgACCard = new URL('@/assets/images/rectangle_4408.png', import.meta.url).href
const imgCivilCard = new URL('@/assets/images/rectangle_4409.png', import.meta.url).href

const imgAppMockup = new URL('@/assets/images/app_01_1.png', import.meta.url).href
const imgHero = new URL('@/assets/images/01_1.png', import.meta.url).href

const fallbackImgList = [imgElectrical, imgPlumbing, imgAC, imgCleaning, imgPainting, imgMechanical, imgCivil, imgSmart]

// Default hero icons
const defaultHeroIcons = [
    { name: "Women's Salon", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Men's Salon", icon: Scissors, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "AC & Appliance", icon: Snowflake, color: "text-sky-500", bg: "bg-sky-50" },
    { name: "Cleaning", icon: Paintbrush, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Electrician", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Plumber", icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" },
]

// Default fallback data
const defaultOffers: SiteItem[] = [
    { title: 'Festive discount\nFlat 30% off', image_url: imgACCard, bg_color: '#f0f3f6', button_text: 'Book Now' },
    { title: 'Native Water\nPurifiers', image_url: imgCleaningCard, bg_color: '#4A3088', button_text: 'Book Now' },
    { title: 'Full Home\nPainting', image_url: imgPainting, bg_color: '#e9e3df', button_text: 'Book Now' },
]

const defaultNewItems: SiteItem[] = [
    { title: 'Native Water Purifier', image_url: imgCivilCard },
    { title: 'AC Service & Repair', image_url: imgACCard },
    { title: 'Smart Lock Installation', image_url: imgSmart },
    { title: 'Salon for Men', image_url: imgMechanical },
    { title: 'Salon for Women', image_url: imgPainting },
]

const defaultMostBooked: SiteItem[] = [
    { title: 'Intense cleaning (2 bathrooms)', rating: '4.8', price: '899', image_url: imgCleaning },
    { title: 'Sofa cleaning (5 seats)', rating: '4.7', price: '1,299', image_url: imgCleaningCard },
    { title: 'RO service & repair', rating: '4.9', price: '349', image_url: imgCivil },
    { title: 'AC regular service', rating: '4.8', price: '599', image_url: imgACCard },
    { title: 'Washing machine repair', rating: '4.7', price: '199', image_url: imgMechanical },
]

export default function HomePage() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // CMS dynamic content
    const { getSection, getItems, loading: contentLoading } = useSiteContent()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/services/grouped')
                if (response.data?.success) {
                    setCategories(response.data.data)
                }
            } catch (error) {
                console.error("Error fetching categories", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    // Pull dynamic data with fallbacks
    const hero = getSection('hero')
    const heroTitle = hero?.title || 'Home services at your doorstep'
    const heroSubtitle = hero?.subtitle || 'What are you looking for?'

    const offers = getItems('offers')
    const offerCards = offers.length > 0 ? offers : defaultOffers
    const isDarkOffer = (bg: string) => ['#4A3088', '#001c30', '#09172e', '#000'].some(c => bg?.toLowerCase().includes(c.toLowerCase()))

    const newItems = getItems('new_noteworthy')
    const newCards = newItems.length > 0 ? newItems : defaultNewItems

    const bookedItems = getItems('most_booked')
    const bookedCards = bookedItems.length > 0 ? bookedItems : defaultMostBooked

    const banner = getSection('banner')
    const bannerTitle = banner?.title || 'Get squeaky clean bathrooms'
    const bannerSubtitle = banner?.subtitle || 'Professional Cleaning'
    const bannerBtnText = banner?.button_text || 'Book Now'
    const bannerBgColor = banner?.bg_color || banner?.metadata?.bg_color || '#d4e1fd'
    const bannerImg = banner?.image_url || imgCleaningCard

    const joinCta = getSection('join_cta')
    const ctaTitle = joinCta?.title || 'Earn More. Work Flexible.\nJoin FixMyHome Pro'
    const ctaSubtitle = joinCta?.subtitle || 'Get regular jobs • Flexible schedule • Secure payments'
    const ctaBtnText = joinCta?.button_text || 'Register Now'
    const ctaBtnLink = joinCta?.button_link || '/join-us'

    return (
        <div className="animate-fade-in bg-white text-[#1f1f1f]">
            {/* ====== HERO SECTION ====== */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* Left Column: Text & Service Grid */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[44px] font-bold leading-[1.15] text-[#1f1f1f] tracking-[-1px]">
                            {heroTitle.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
                        </h1>

                        <div className="mt-8 rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="mb-6 text-[18px] font-medium text-gray-700">{heroSubtitle}</h2>
                            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                                {defaultHeroIcons.map((item, idx) => {
                                    const Icon = item.icon
                                    return (
                                        <div
                                            key={idx}
                                            className="group flex cursor-pointer flex-col items-center text-center transition-transform hover:-translate-y-1"
                                            onClick={() => navigate('/services')}
                                        >
                                            <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${item.bg} mb-3`}>
                                                <Icon className={`h-8 w-8 ${item.color}`} />
                                            </div>
                                            <p className="text-[14px] font-medium text-gray-800 leading-tight">
                                                {item.name}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-8 flex items-center justify-start gap-12 border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 rounded bg-black px-2 py-1 text-white">
                                    <Star className="h-4 w-4 fill-white" />
                                    <span className="font-bold text-sm">4.8</span>
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-gray-900">12M+</p>
                                    <p className="text-[12px] text-gray-500">Customers Globally</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 rounded bg-black px-2 py-1 text-white">
                                    <Zap className="h-4 w-4 fill-white text-white" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-gray-900">Guarantee</p>
                                    <p className="text-[12px] text-gray-500">Safe & Reliable</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hero Image */}
                    <div className="hidden lg:flex items-center justify-center">
                        <img src={imgHero} className="h-full w-full rounded-2xl object-cover border border-gray-100" alt="FixMyHome Pro" />
                    </div>
                </div>
            </section>

            {/* ====== DIVIDER ====== */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <hr className="border-gray-200" />
            </div>

            {/* ====== OFFERS & DISCOUNTS (Dynamic) ====== */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="text-[28px] font-bold text-[#1f1f1f]">Offers & discounts</h2>
                <div className="mt-6 flex justify-between overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {offerCards.map((offer, idx) => {
                        const bgColor = offer.bg_color || '#f0f3f6'
                        const dark = isDarkOffer(bgColor)
                        const img = offer.image_url || fallbackImgList[idx % fallbackImgList.length]
                        return (
                            <div key={idx} className="min-w-[20vw] flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl relative h-[200px] border border-gray-200 group" style={{ background: bgColor }}>
                                <div className="absolute inset-y-0 left-0 w-2/3 p-8 flex flex-col justify-center z-10">
                                    <h3 className={`text-2xl font-bold leading-tight mb-2 ${dark ? 'text-white' : 'text-[#1f1f1f]'}`}>
                                        {offer.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                                    </h3>
                                    <button className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-lg w-fit shadow-sm mt-3">{offer.button_text || 'Book Now'}</button>
                                </div>
                                <div className="absolute inset-y-0 right-0 w-1/2">
                                    <img src={img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Offer" />
                                    <div className="absolute inset-0 bg-gradient-to-r to-transparent" style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* ====== NEW AND NOTEWORTHY (Dynamic) ====== */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-[28px] font-bold text-[#1f1f1f]">New and noteworthy</h2>
                <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {newCards.map((item, id) => (
                        <div key={id} className="min-w-[220px] w-[220px] flex-shrink-0 cursor-pointer snap-start group" onClick={() => navigate(item.button_link || '/services')}>
                            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[#f5f5f5] mb-3">
                                <img src={item.image_url || fallbackImgList[id % fallbackImgList.length]} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" alt={item.title} />
                            </div>
                            <p className="text-[15px] font-medium text-gray-800 text-center">{item.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== MOST BOOKED SERVICES (Dynamic) ====== */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-[28px] font-bold text-[#1f1f1f]">Most booked services</h2>
                <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {bookedCards.map((item, id) => (
                        <div key={id} className="min-w-[220px] w-[220px] flex-shrink-0 cursor-pointer snap-start group relative" onClick={() => navigate(item.button_link || '/services')}>
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5f5f5] mb-3 border border-gray-100">
                                <img src={item.image_url || fallbackImgList[id % fallbackImgList.length]} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.title} />
                            </div>
                            <h3 className="text-[15px] font-medium text-gray-900 leading-tight mb-1">{item.title}</h3>
                            <div className="flex items-center text-[13px] text-gray-600 mb-1">
                                <Star className="h-3 w-3 fill-gray-800 text-gray-800 mr-1" />
                                <span>{item.rating || '4.8'} (10K+)</span>
                            </div>
                            <p className="text-[14px] font-semibold text-gray-900">₹{item.price || '349'}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== BANNER (Dynamic) ====== */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="relative h-[250px] w-full cursor-pointer overflow-hidden rounded-2xl group" style={{ background: bannerBgColor }} onClick={() => navigate(banner?.button_link || '/services')}>
                    <div className="absolute inset-y-0 left-0 w-2/3 p-10 flex flex-col justify-center z-10">
                        <p className="font-semibold text-blue-900 tracking-wide mb-2 text-sm uppercase">{bannerSubtitle}</p>
                        <h2 className="text-4xl font-bold text-[#0f172a] leading-tight mb-4">
                            {bannerTitle.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                        </h2>
                        <button className="bg-black text-white font-semibold text-sm px-6 py-2.5 rounded-lg w-fit shadow-md transition-transform group-hover:scale-105">{bannerBtnText}</button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-1/2">
                        <img src={bannerImg} className="h-full w-full object-cover object-center" alt="Banner" />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${bannerBgColor}, transparent)` }} />
                    </div>
                </div>
            </section>

            {/* ====== DYNAMIC CATEGORY RENDER ====== */}
            <div className="pb-16 pt-8">
                {isLoading ? (
                    <div className="mx-auto max-w-7xl px-4">
                        <ServiceCategorySkeleton />
                        <ServiceCategorySkeleton />
                    </div>
                ) : categories.length > 0 ? (
                    <div className="flex flex-col gap-12">
                        {categories.map((cat, idx) => (
                            <section key={cat.id} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[28px] font-bold text-[#1f1f1f]">
                                        {cat.name}
                                    </h2>
                                    <Link to={`/services`} className="text-[14px] font-medium text-blue-600 transition-colors hover:text-blue-800">
                                        See All
                                    </Link>
                                </div>
                                <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                                    {cat.services?.map((item: any, sIdx: number) => {
                                        const itemImg = item.thumbnail_url || item.image_url || fallbackImgList[(idx + sIdx) % fallbackImgList.length];
                                        return (
                                            <div key={item.id} className="min-w-[220px] w-[220px] flex-shrink-0 cursor-pointer snap-start group" onClick={() => navigate(`/services/${item.id}`)}>
                                                <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5f5f5] mb-3 border border-gray-100">
                                                    <img src={itemImg} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.name} />
                                                </div>
                                                <h3 className="text-[15px] font-medium text-gray-900 leading-tight mb-1 whitespace-pre-wrap">{item.name}</h3>
                                                <div className="flex items-center text-[13px] text-gray-600 mb-1">
                                                    <Star className="h-3 w-3 fill-gray-800 text-gray-800 mr-1" />
                                                    <span>{item.rating || '4.8'} (1K+)</span>
                                                </div>
                                                <p className="text-[14px] font-semibold text-gray-900">₹{item.base_price}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500">No services found in database.</div>
                )}
            </div>

            {/* ====== Join CTA (Dynamic) ====== */}
            <section className="relative mx-auto max-w-[1440px] overflow-hidden rounded-2xl mb-10">
                <div className="relative h-[471px] w-full bg-[#001c30]">
                    <div className="absolute left-[112px] top-1/2 -translate-y-1/2">
                        <h2 className="text-[40px] font-bold capitalize leading-[1.2] tracking-[-0.8px] text-white">
                            {ctaTitle.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                        </h2>
                        <p className="mt-4 text-[20px] text-white">{ctaSubtitle}</p>
                        <Link to={ctaBtnLink} className="mt-6 inline-flex rounded-[40px] bg-[#facc15] px-10 py-5 text-[20px] font-semibold text-black hover:bg-[#e5b800]">
                            {ctaBtnText}
                        </Link>
                    </div>
                    <div className="absolute right-[100px] top-[20px] h-[428px] w-[515px]">
                        <img src={joinCta?.image_url || imgAppMockup} alt="FixPro App" className="h-full w-full object-contain" />
                    </div>
                </div>
            </section>
        </div>
    )
}
