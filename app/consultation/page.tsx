'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Calendar, Clock, Star, Award, ShieldCheck, 
  CheckCircle2, ArrowRight, PhoneCall, Sparkles, MapPin, BadgeCheck,
  Send, DollarSign, MessageSquare
} from 'lucide-react';
import AnimateIn from '../../components/AnimateIn';
import { useAuth } from '../../context/AuthContext';

export interface PartnerCompany {
  id: string;
  name: string;
  logo: string;
  badge: string;
  rating: number;
  reviewCount: number;
  projectsCount: string;
  specialization: string[];
  startingPrice: string;
  location: string;
  description: string;
  featuredImg: string;
}

export const PARTNER_COMPANIES: PartnerCompany[] = [
  {
    id: 'comp_livspace',
    name: 'Livspace India',
    logo: '🏛️',
    badge: 'Premier Partner',
    rating: 4.9,
    reviewCount: 4200,
    projectsCount: '50,000+',
    specialization: ['Full Home Interior', 'Modular Kitchen', 'Turnkey Renovation', 'Luxury Staging'],
    startingPrice: '₹1,500 / sq.ft',
    location: 'Bangalore, Mumbai, Delhi, Chennai, Hyderabad',
    description: "India's leading interior design powerhouse offering end-to-end design, modular furniture installation, and 10-year warranty execution.",
    featuredImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'comp_homelane',
    name: 'HomeLane',
    logo: '🏡',
    badge: '45-Day Delivery Guarantee',
    rating: 4.8,
    reviewCount: 3100,
    projectsCount: '35,000+',
    specialization: ['Modern Modular Kitchen', 'Wardrobes', 'Smart Living Rooms', 'Budget Luxury'],
    startingPrice: '₹1,200 / sq.ft',
    location: 'Chennai, Bangalore, Hyderabad, Pune, Kolkata',
    description: "Fast-track personalized interiors delivered within 45 days. Perfect for new apartment buyers and rental yield enhancements.",
    featuredImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'comp_designcafe',
    name: 'Design Cafe',
    logo: '✨',
    badge: 'Award Winning Designers',
    rating: 4.9,
    reviewCount: 2800,
    projectsCount: '20,000+',
    specialization: ['Space-Saving Interiors', 'Custom Woodwork', 'Scandinavian Villas', 'Architectural Staging'],
    startingPrice: '₹1,400 / sq.ft',
    location: 'Bangalore, Mumbai, Hyderabad, Chennai',
    description: "Architect-backed interior firm specializing in 20% extra space optimization innovations and customized 3D finishes.",
    featuredImg: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'comp_decorpot',
    name: 'Decorpot Studio',
    logo: '🛋️',
    badge: 'Luxury Curated',
    rating: 4.7,
    reviewCount: 1950,
    projectsCount: '12,000+',
    specialization: ['Premium Penthouse', 'Italian Finishes', 'Custom Lighting', 'Artisan Furnishing'],
    startingPrice: '₹1,800 / sq.ft',
    location: 'Bangalore, Chennai, Kochi, Coimbatore',
    description: "Bespoke interior craft studio with own manufacturing units for seamless luxury and designer-exclusive bespoke pieces.",
    featuredImg: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=600&auto=format&fit=crop'
  }
];

export default function ConsultationPage() {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<PartnerCompany>(PARTNER_COMPANIES[0]);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Chennai');
  const [propertyType, setPropertyType] = useState('2 BHK Apartment');
  const [budgetRange, setBudgetRange] = useState('₹50,000 - ₹1 Lakh');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [savedBookingsCount, setSavedBookingsCount] = useState(0);

  useEffect(() => {
    try {
      const existing = localStorage.getItem('auraspace_consultations');
      if (existing) {
        setSavedBookingsCount(JSON.parse(existing).length);
      }
    } catch {}
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      id: `cons_${Date.now()}`,
      partnerId: selectedCompany.id,
      partnerName: selectedCompany.name,
      customerName: name || 'Customer',
      customerEmail: email || 'customer@auraspace.ai',
      customerPhone: phone || '+91 98765 43210',
      city,
      propertyType,
      budgetRange,
      preferredDate: preferredDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes,
      status: 'Confirmed',
      commissionEarnedINR: 1500, // Partner Lead referral fee
      createdAt: new Date().toISOString()
    };

    try {
      const existing = localStorage.getItem('auraspace_consultations');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem('auraspace_consultations', JSON.stringify(list));
      setSavedBookingsCount(list.length);
    } catch (err) {
      console.error(err);
    }

    // Trigger explicit alert message
    alert(`🎉 Consultation Request Received!\n\nThank you ${name || 'Customer'}! Your free interior consultation request with ${selectedCompany.name} has been booked successfully.\n\nA senior design architect from ${selectedCompany.name} will call you at ${phone || 'your phone number'} within 24 hours.`);

    setBookingSuccess(true);
  };

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full py-6">
      
      {/* Hero Header */}
      <AnimateIn from="top" className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>AuraSpace Verified Partner Network</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Expert Interior Design <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400">
            Consultation & Execution
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Take your AI generated designs into the real world. Book a free 1-on-1 personalized site consultation with India&apos;s top certified interior design studios.
        </p>
      </AnimateIn>

      {/* Success Modal Toast */}
      {bookingSuccess && (
        <AnimateIn from="top">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-2xl space-y-4 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black">Consultation Booked Successfully!</h3>
            <p className="text-sm sm:text-base text-emerald-100 max-w-lg mx-auto">
              We have shared your space details with <span className="font-bold underline">{selectedCompany.name}</span>. A senior design architect will call you within 24 hours to schedule your free 3D design & site walkthrough.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setBookingSuccess(false)}
                className="px-6 py-2.5 bg-white text-emerald-800 rounded-xl font-bold text-xs shadow-md hover:bg-emerald-50 transition-all"
              >
                Book Another Consultation
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-emerald-700/80 text-white border border-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-800 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </AnimateIn>
      )}

      {/* Main Layout: Partner Cards + Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4 sm:px-6">
        
        {/* Left: Partner Studios (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Select Design Partner</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {PARTNER_COMPANIES.length} Verified Brands
            </span>
          </div>

          <div className="space-y-4">
            {PARTNER_COMPANIES.map((company) => (
              <div 
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${
                  selectedCompany.id === company.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xl shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Company Thumbnail Image */}
                  <div className="w-full sm:w-36 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={company.featuredImg} alt={company.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-xl bg-white/90 dark:bg-slate-900/90 rounded-lg p-1 shadow-sm">
                      {company.logo}
                    </span>
                  </div>

                  {/* Company Info */}
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {company.name}
                          <BadgeCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{company.location}</span>
                        </p>
                      </div>

                      <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase rounded-full border border-indigo-200 dark:border-indigo-800">
                        {company.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {company.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {company.specialization.map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Stats & Pricing */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> {company.rating}
                        </span>
                        <span className="text-slate-400">({company.projectsCount} Delivered)</span>
                      </div>
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">
                        From {company.startingPrice}
                      </div>
                    </div>

                  </div>
                </div>

                {selectedCompany.id === company.id && (
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Form (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>Free 1-on-1 Consultation</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Book with {selectedCompany.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Zero consultation charge • No commitment required
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Akash Diva"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5">City / Location</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  >
                    <option>Chennai</option>
                    <option>Bangalore</option>
                    <option>Hyderabad</option>
                    <option>Mumbai</option>
                    <option>Delhi NCR</option>
                    <option>Pune</option>
                    <option>Kolkata</option>
                    <option>Coimbatore</option>
                    <option>Kochi</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  >
                    <option>1 BHK Apartment</option>
                    <option>2 BHK Apartment</option>
                    <option>3 BHK Apartment</option>
                    <option>4+ BHK / Villa</option>
                    <option>Independent House</option>
                    <option>Commercial / Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5">Estimated Budget (₹)</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  >
                    <option>₹50,000 - ₹1 Lakh</option>
                    <option>₹1 Lakh - ₹3 Lakhs</option>
                    <option>₹3 Lakhs - ₹5 Lakhs</option>
                    <option>₹5 Lakhs - ₹10 Lakhs</option>
                    <option>₹10 Lakhs - ₹20 Lakhs</option>
                    <option>₹20 Lakhs - ₹50 Lakhs</option>
                    <option>₹50 Lakhs+</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5">Project Scope / Specific Ideas (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Want modular kitchen, Scandinavian TV wall unit, warm ambient lighting"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Request Free Consultation Call</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 text-center">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Privacy</span>
                <span>•</span>
                <span>No Spam Guarantee</span>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
