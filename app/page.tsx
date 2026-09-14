'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Box, CheckCircle2, Zap, Shield, Wand2, Building2, Users, Star, BadgeCheck, PhoneCall } from 'lucide-react';
import CompareSlider from '../components/CompareSlider';
import AnimateIn from '../components/AnimateIn';
import PricingSection from '../components/PricingSection';

export default function Home() {
  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-500/20 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none animate-float animation-delay-300"></div>

      {/* 1. HERO SECTION */}
      <section className="w-full pt-6 pb-12 lg:pt-12 lg:pb-20 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center px-4 sm:px-6 lg:px-8">
          
          {/* Left: Text & CTA */}
          <AnimateIn from="left" className="flex flex-col items-start text-left space-y-5 sm:space-y-7">
            <div className="inline-flex items-center rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/50 backdrop-blur-md px-3 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Next-Gen AuraSpace AI Engine</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-7xl leading-[1.15]">
              Design spaces with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 animate-gradient-x">
                artificial intelligence.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Transform empty rooms into beautifully furnished spaces instantly. Save thousands on traditional staging and wow your clients with photorealistic interior concepts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link 
                href="/virtual-staging" 
                className="group inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 dark:bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all active:scale-95"
              >
                <Wand2 className="mr-2 h-4 w-4 text-indigo-400 dark:text-white group-hover:rotate-12 transition-transform" />
                Start Staging Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="#services" 
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                View Services
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 w-full">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Photorealistic</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 50+ Styles</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Instant Renders</div>
            </div>
          </AnimateIn>

          {/* Right: Compare Slider */}
          <AnimateIn from="right" delay={200} className="w-full relative group lg:pl-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-3xl blur-2xl opacity-30 dark:opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CompareSlider originalImage="/hero-before.png" stagedImage="/hero-after.jpg" />
            </div>
          </AnimateIn>
          
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about-us" className="w-full py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 border-y border-slate-200/80 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            
            {/* Left Image */}
            <AnimateIn from="left" className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" 
                  alt="AuraSpace AI Team and Studio" 
                  className="w-full h-[280px] sm:h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-3 sm:-right-6 p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-[180px] sm:max-w-xs hidden sm:block">
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">100k+</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Virtual Staging Renders Created Across India & Globally</p>
              </div>
            </AnimateIn>

            {/* Right Content */}
            <AnimateIn from="right" className="space-y-5 sm:space-y-6">
              <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest">
                About AuraSpace AI
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Revolutionizing Interior Staging with Generative AI
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                AuraSpace AI was founded with a single mission: to empower real estate agents, interior designers, property developers, and homeowners to visualize potential in any empty space instantly.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                Traditional physical staging takes up to 3 weeks and costs thousands of rupees per room. With our proprietary AI Vision and Generative Engine, you can transform photos into high-converting, fully furnished interior designs in seconds.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Photorealistic AI</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Matches room depth, shadow & natural light</p>
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Shop the Look</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Detects furniture items with ₹ INR price tags</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/virtual-staging" className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all hover:scale-105">
                  Experience AuraSpace AI Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </AnimateIn>

          </div>
        </div>
      </section>

      {/* 3. WHY US SECTION */}
      <section id="why-us" className="w-full py-12 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn from="top">
            <div className="inline-block px-4 py-1.5 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Why Choose Us
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              The future of real estate marketing & interior design
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-500 dark:text-slate-400 mx-auto leading-relaxed">
              AuraSpace AI solves the most expensive and time-consuming problems in real estate: staging empty homes. Our AI engine understands room geometry, lighting, and architectural styles seamlessly.
            </p>
          </AnimateIn>
          
          <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 max-w-5xl mx-auto text-left items-stretch">
            <AnimateIn from="bottom" delay={100} className="h-full">
              <div className="group p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Lightning Fast</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">Skip weeks of physical staging logistics. Get stunning photos ready for your listing in seconds.</p>
              </div>
            </AnimateIn>

            <AnimateIn from="bottom" delay={250} className="h-full">
              <div className="group p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Cost Effective</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">Traditional staging costs thousands of dollars per month. Virtual staging costs a tiny fraction of the price.</p>
              </div>
            </AnimateIn>

            <AnimateIn from="bottom" delay={400} className="h-full">
              <div className="group p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">Unlimited Styles</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">Switch between Modern, Scandinavian, Farmhouse, and 50+ architectural styles instantly.</p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* 4. DESIGN GALLERY SECTION */}
      <section id="room-showcase" className="w-full py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn from="top" className="text-center mb-8 sm:mb-12">
            <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Design Gallery
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore Room Categories & Styles
            </h2>
            <p className="mt-4 max-w-2xl text-slate-500 dark:text-slate-400 mx-auto text-sm sm:text-base">
              From bedrooms to kitchens, see how AuraSpace AI stages every room in your home with photorealistic furniture.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { title: 'Livingroom', style: 'Modern & Scandinavian', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop', tag: 'Popular', href: '/inspirational-design?room=LIVINGROOM' },
              { title: 'Bedroom', style: 'Boho & Minimalist', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop', tag: 'Trending', href: '/inspirational-design?room=BEDROOM' },
              { title: 'Kitchen', style: 'Contemporary & Industrial', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop', tag: 'Hot', href: '/inspirational-design?room=KITCHEN' },
              { title: 'Bathroom', style: 'Spa & Contemporary', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop', tag: 'Featured', href: '/inspirational-design?room=BATHROOM' },
              { title: 'Office', style: 'Modern & Minimalist', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop', tag: 'New', href: '/inspirational-design?room=OFFICE' },
              { title: 'Diningroom', style: 'Traditional & Modern', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop', tag: 'Elegant', href: '/inspirational-design?room=DININGROOM' },
              { title: 'Sunroom', style: 'Bohemian & Rustic', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop', tag: 'Outdoor', href: '/inspirational-design?room=SUNROOM' },
              { title: 'Familyroom', style: 'Cozy & Scandinavian', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600&auto=format&fit=crop', tag: 'Cozy', href: '/inspirational-design?room=FAMILYROOM' }
            ].map((room, idx) => (
              <AnimateIn key={room.title} from="bottom" delay={idx * 75}>
                <Link 
                  href={room.href}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="h-36 sm:h-48 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] sm:text-[11px] font-bold rounded-full shadow-sm">
                      {room.tag}
                    </span>
                    <div className="absolute bottom-2 sm:bottom-3 left-3 right-3">
                      <h3 className="text-sm sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{room.title}</h3>
                      <p className="text-[10px] sm:text-xs text-slate-300">{room.style}</p>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-white dark:bg-slate-900 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 transition-colors">
                    <span>Generate {room.title}</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRODUCTS & TOOLS SECTION */}
      <section id="services" className="w-full py-12 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn from="top" className="text-center mb-10 sm:mb-16">
            <div className="inline-block px-4 py-1.5 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Our Products
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Powerful AI design tools
            </h2>
          </AnimateIn>

          <div className="grid w-full gap-5 sm:gap-8 sm:grid-cols-2">
            
            {/* Virtual Staging Card */}
            <AnimateIn from="left">
              <Link href="/virtual-staging" className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-2 transition-all duration-500">
                <div className="h-48 sm:h-72 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" alt="Virtual Staging Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-5 sm:left-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Box className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Tool #1</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Virtual Staging</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-8 flex-1 flex flex-col">
                  <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-5 sm:mb-8 flex-1 leading-relaxed">
                    Upload an empty room photo and let AI perfectly furnish it to match your chosen style and dimensions. Ideal for real estate agents and property managers.
                  </p>
                  <div className="flex items-center font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform text-sm sm:text-base">
                    Try Virtual Staging <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </Link>
            </AnimateIn>

            {/* Inspirational Design Card */}
            <AnimateIn from="right" delay={150}>
              <Link href="/inspirational-design" className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-violet-500/15 hover:-translate-y-2 transition-all duration-500">
                <div className="h-48 sm:h-72 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" alt="Inspirational Design Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-5 sm:left-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-violet-300">Tool #2</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Inspirational Design</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-8 flex-1 flex flex-col">
                  <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-5 sm:mb-8 flex-1 leading-relaxed">
                    Generate stunning, photorealistic interior concepts from scratch using just a room type and design style. Perfect for brainstorming renovations.
                  </p>
                  <div className="flex items-center font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform text-sm sm:text-base">
                    Generate Concepts <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </Link>
            </AnimateIn>
            
          </div>
        </div>
      </section>

      {/* 6. INTERIOR DESIGN CONSULTATION PARTNER COLLAB SECTION */}
      <section id="consultation" className="w-full py-16 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 border-t border-slate-200/80 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimateIn from="top" className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Turnkey Execution Partner Network</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Turn Your AI Staging into Reality
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              We collaborate with India&apos;s leading interior firms to execute your generated designs. Get free on-site measurements, customized 3D walkthroughs, and turnkey furnishing.
            </p>
          </AnimateIn>

          {/* Partner Brands Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                name: 'Livspace India',
                tag: 'Premier Partner',
                desc: 'Full home interiors with 10-year warranty & modular precision.',
                rating: '4.9 ★',
                delivered: '50k+ Homes',
                img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop'
              },
              {
                name: 'HomeLane',
                tag: '45-Day Delivery',
                desc: 'Fast track modern modular kitchens & space-efficient bedrooms.',
                rating: '4.8 ★',
                delivered: '35k+ Homes',
                img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=500&auto=format&fit=crop'
              },
              {
                name: 'Design Cafe',
                tag: 'Award Winning',
                desc: '20% extra space optimization by top certified architects.',
                rating: '4.9 ★',
                delivered: '20k+ Homes',
                img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=500&auto=format&fit=crop'
              },
              {
                name: 'Decorpot Studio',
                tag: 'Luxury Curated',
                desc: 'Bespoke Italian-style interiors with in-house craftsmanship.',
                rating: '4.7 ★',
                delivered: '12k+ Homes',
                img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=500&auto=format&fit=crop'
              }
            ].map((p, idx) => (
              <AnimateIn key={p.name} from="bottom" delay={idx * 80}>
                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="h-32 w-full rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/90 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                        {p.tag}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1">
                        {p.name}
                        <BadgeCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs mt-3">
                    <span className="font-bold text-amber-500">{p.rating}</span>
                    <span className="text-slate-400 font-medium">{p.delivered}</span>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* CTA Banner */}
          <AnimateIn from="bottom">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-900/50 shadow-2xl">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Ready to consult with a Senior Interior Architect?
                </h3>
                <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
                  Free 1-on-1 consultation • Site measurement • Real material samples • Accurate budget estimate in ₹ INR
                </p>
              </div>
              <Link
                href="/consultation"
                className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Book Free Consultation Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateIn>

        </div>
      </section>

      {/* 7. PRICING SECTION (LAST) */}
      <PricingSection />

    </div>
  );
}

