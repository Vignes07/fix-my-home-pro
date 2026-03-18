import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useSiteContent } from '@/hooks/useSiteContent'

const imgJoinHero = new URL('@/assets/images/01_1.png', import.meta.url).href
const imgAppMockup = new URL('@/assets/images/app_01_1.png', import.meta.url).href
const imgUserAvatar = new URL('@/assets/images/user-icon-vector-profile-logo-isolated-white-backg.png', import.meta.url).href

const benefits = [
    { title: 'Regular Jobs', desc: 'Get consistent work assignments based on your skills and location' },
    { title: 'Flexible Schedule', desc: 'Work when you want, choose your own hours' },
    { title: 'Secure Payments', desc: 'Get paid on time, every time, directly to your account' },
    { title: 'Training & Growth', desc: 'Access to skill development programs and certifications' },
    { title: 'Tools & Support', desc: 'Get support from our dedicated team whenever you need it' },
    { title: 'Insurance Coverage', desc: 'Stay protected while working with our insurance plans' },
]

const steps = [
    { step: '01', title: 'Register', desc: 'Fill out the registration form with your details and skills' },
    { step: '02', title: 'Verification', desc: 'Our team verifies your identity and professional credentials' },
    { step: '03', title: 'Training', desc: 'Complete our onboarding training to get certified' },
    { step: '04', title: 'Start Working', desc: 'Begin accepting jobs and earning money' },
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


export default function JoinUsPage() {

    const { getSection, getItems, loading: contentLoading } = useSiteContent()

    const joinCta = getSection('join_cta')
    const ctaTitle = joinCta?.title || 'Earn More. Work Flexible.\nJoin FixMyHome Pro'
    const ctaSubtitle = joinCta?.subtitle || 'Get regular jobs • Flexible schedule • Secure payments'
    const ctaBtnText = joinCta?.button_text || 'Register Now'
    const ctaBtnLink = joinCta?.button_link || '/join-us'


    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="relative h-[500px] md:h-[860px] w-full overflow-hidden">
                <img src={imgJoinHero} alt="Join FixPro" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[rgba(0,28,48,0.7)]" />
                <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] pt-[100px] md:pt-[160px]">
                    <h1 className="text-shadow-hero text-[36px] md:text-[60px] lg:text-[85px] font-bold leading-[1.1] tracking-[-1.7px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Build Your Future<br />with FixPro
                    </h1>
                    <p className="mt-6 max-w-[560px] text-[20px] leading-[1.4] tracking-[-0.4px] text-white">
                        Join our network of skilled technicians and grow your career with steady work and great earnings.
                    </p>
                    <div className="mt-10 flex items-center gap-4">
                        <Link to="/technician/register" className="flex items-center justify-center rounded-[40px] bg-[#facc15] px-10 py-5 text-[20px] font-semibold tracking-[-0.4px] text-black hover:bg-[#e5b800]">
                            Register Now
                        </Link>
                    </div>
                    <p className="mt-6 text-[20px] font-medium tracking-[-0.4px] text-white">
                        ✔ Verified Technicians • ✔ Transparent Pricing • ✔ Fast Service
                    </p>
                </div>
            </section>

            {/* Rank Based Services */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] py-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]">Rank Based Services</h2>
                <p className="mt-2 text-[18px] text-[#454545]">
                    Our technicians are ranked based on experience, skill level, and customer reviews.
                </p>
            </section>

            {/* Why Join FixPro */}
            <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px] pb-16">
                <h2 className="text-[36px] font-medium tracking-[-0.72px] text-[#0f172a]">Why Join FixPro?</h2>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((b) => (
                        <div key={b.title} className="rounded-[15px] border border-[#d6d6d6] bg-white p-6 transition-shadow hover:shadow-elevated">
                            <h3 className="text-[20px] font-semibold text-[#001c30]">{b.title}</h3>
                            <p className="mt-2 text-[16px] text-[#454545]">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How to join */}
            <section className="bg-[#001c30] py-16 mb-10">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px]">
                    <h2 className="text-center text-[36px] font-medium text-white">How to Join?</h2>
                    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map((s) => (
                            <div key={s.step} className="text-center">
                                <div className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#facc15] text-[24px] font-bold text-[#001c30]">
                                    {s.step}
                                </div>
                                <h3 className="mt-4 text-[20px] font-semibold text-white">{s.title}</h3>
                                <p className="mt-2 text-[16px] text-white/70">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join CTA */}
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
