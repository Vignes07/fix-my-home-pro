import { Link, useNavigate } from 'react-router-dom'
import { Star, ChevronRight, Zap, Droplets, Snowflake, Sparkles, Scissors, Paintbrush } from 'lucide-react'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { ServiceCategorySkeleton } from '@/components/common/skeletons'

// Import existing placeholder images from previous design to reuse
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

const imgBookedElectrical = new URL('@/assets/images/electrician-installing-electrical-outlet_1.png', import.meta.url).href
const imgBookedCivil = new URL('@/assets/images/construction-planning-development-building-concept.png', import.meta.url).href
const imgBookedAC = new URL('@/assets/images/hvac-technician-cleaning-dirty-air-conditioner-fil.png', import.meta.url).href
const imgBookedPlumbing = new URL('@/assets/images/man-is-working-pipe-with-red-blue-uniform_1.png', import.meta.url).href

// Hardcoded sections to match Urban Company design
const heroGridIcons = [
    { name: "Women's Salon", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Men's Salon", icon: Scissors, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "AC & Appliance", icon: Snowflake, color: "text-sky-500", bg: "bg-sky-50" },
    { name: "Cleaning", icon: Paintbrush, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Electrician", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Plumber", icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" },
]

export default function HomePage() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

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

    return (
        <div className="animate-fade-in bg-white text-[#1f1f1f]">
            {/* ====== HERO SECTION ====== */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* Left Column: Text & Service Grid */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[44px] font-bold leading-[1.15] text-[#1f1f1f] tracking-[-1px]">
                            Home services at your<br />doorstep
                        </h1>

                        <div className="mt-8 rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h2 className="mb-6 text-[18px] font-medium text-gray-700">What are you looking for?</h2>
                            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                                {heroGridIcons.map((item, idx) => {
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

                    {/* Right Column: Image Grid */}
                    <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4">
                        <img src={imgElectrical} className="h-full w-full rounded-2xl object-cover col-span-1 row-span-1 border border-gray-100" alt="Service 1" />
                        <img src={imgPlumbing} className="h-full w-full rounded-2xl object-cover col-span-1 row-span-1 border border-gray-100" alt="Service 2" />
                        <img src={imgCleaning} className="h-full w-full rounded-2xl object-cover col-span-1 row-span-1 border border-gray-100" alt="Service 3" />
                        <img src={imgSmart} className="h-full w-full rounded-2xl object-cover col-span-1 row-span-1 border border-gray-100" alt="Service 4" />
                    </div>
                </div>
            </section>

            {/* ====== DIVIDER ====== */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <hr className="border-gray-200" />
            </div>

            {/* ====== OFFERS & DISCOUNTS ====== */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="text-[28px] font-bold text-[#1f1f1f]">Offers & discounts</h2>
                <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    <div className="min-w-[400px] flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-[#f0f3f6] relative h-[200px] border border-gray-200 group">
                        <div className="absolute inset-y-0 left-0 w-2/3 p-8 flex flex-col justify-center z-10">
                            <h3 className="text-2xl font-bold text-[#1f1f1f] leading-tight mb-2">Festive discount<br />Flat 30% off</h3>
                            <button className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-lg w-fit shadow-sm mt-3">Book Now</button>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-1/2">
                            <img src={imgACCard} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Offer" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#f0f3f6] to-transparent" />
                        </div>
                    </div>
                    <div className="min-w-[400px] flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-[#4A3088] relative h-[200px] border border-gray-200 group">
                        <div className="absolute inset-y-0 left-0 w-2/3 p-8 flex flex-col justify-center z-10">
                            <h3 className="text-2xl font-bold text-white leading-tight mb-2">Native Water<br />Purifiers</h3>
                            <button className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-lg w-fit shadow-sm mt-3">Book Now</button>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-1/2">
                            <img src={imgCleaningCard} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Offer" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#4A3088] to-transparent" />
                        </div>
                    </div>
                    <div className="min-w-[400px] flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-[#e9e3df] relative h-[200px] border border-gray-200 group">
                        <div className="absolute inset-y-0 left-0 w-2/3 p-8 flex flex-col justify-center z-10">
                            <h3 className="text-2xl font-bold text-[#1f1f1f] leading-tight mb-2">Full Home<br />Painting</h3>
                            <button className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-lg w-fit shadow-sm mt-3">Book Now</button>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-1/2">
                            <img src={imgPainting} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Offer" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#e9e3df] to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== NEW AND NOTEWORTHY ====== */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-[28px] font-bold text-[#1f1f1f]">New and noteworthy</h2>
                <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {[
                        { title: 'Native Water Purifier', img: imgCivilCard },
                        { title: 'AC Service & Repair', img: imgACCard },
                        { title: 'Smart Lock Installation', img: imgSmart },
                        { title: 'Salon for Men', img: imgMechanical },
                        { title: 'Salon for Women', img: imgPainting },
                    ].map((item, id) => (
                        <div key={id} className="min-w-[200px] w-[200px] flex-shrink-0 cursor-pointer snap-start group" onClick={() => navigate('/services')}>
                            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[#f5f5f5] mb-3">
                                <img src={item.img} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" alt={item.title} />
                            </div>
                            <p className="text-[15px] font-medium text-gray-800 text-center">{item.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== MOST BOOKED SERVICES ====== */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h2 className="text-[28px] font-bold text-[#1f1f1f]">Most booked services</h2>
                <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {[
                        { title: 'Intense cleaning (2 bathrooms)', rating: 4.8, price: '899', img: imgCleaning },
                        { title: 'Sofa cleaning (5 seats)', rating: 4.7, price: '1,299', img: imgCleaningCard },
                        { title: 'RO service & repair', rating: 4.9, price: '349', img: imgCivil },
                        { title: 'AC regular service', rating: 4.8, price: '599', img: imgACCard },
                        { title: 'Washing machine repair', rating: 4.7, price: '199', img: imgMechanical },
                    ].map((item, id) => (
                        <div key={id} className="min-w-[220px] w-[220px] flex-shrink-0 cursor-pointer snap-start group relative" onClick={() => navigate('/services')}>
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5f5f5] mb-3 border border-gray-100">
                                <img src={item.img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.title} />
                            </div>
                            <h3 className="text-[15px] font-medium text-gray-900 leading-tight mb-1">{item.title}</h3>
                            <div className="flex items-center text-[13px] text-gray-600 mb-1">
                                <Star className="h-3 w-3 fill-gray-800 text-gray-800 mr-1" />
                                <span>{item.rating} (10K+)</span>
                            </div>
                            <p className="text-[14px] font-semibold text-gray-900">₹{item.price}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== BANNER: SQUEAKY CLEAN BATHROOMS ====== */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="relative h-[250px] w-full cursor-pointer overflow-hidden rounded-2xl bg-[#d4e1fd] group" onClick={() => navigate('/services')}>
                    <div className="absolute inset-y-0 left-0 w-2/3 p-10 flex flex-col justify-center z-10">
                        <p className="font-semibold text-blue-900 tracking-wide mb-2 text-sm uppercase">Professional Cleaning</p>
                        <h2 className="text-4xl font-bold text-[#0f172a] leading-tight mb-4">Get squeaky clean<br />bathrooms</h2>
                        <button className="bg-black text-white font-semibold text-sm px-6 py-2.5 rounded-lg w-fit shadow-md transition-transform group-hover:scale-105">Book Now</button>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-1/2">
                        <img src={imgCleaningCard} className="h-full w-full object-cover object-center" alt="Bathroom Cleaning" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#d4e1fd] to-transparent" />
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
                                        const fallbackImgList = [imgElectrical, imgPlumbing, imgAC, imgCleaning, imgPainting, imgMechanical, imgCivil];
                                        const itemImg = item.image_url || fallbackImgList[(idx + sIdx) % fallbackImgList.length];
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
        </div>
    )
}
