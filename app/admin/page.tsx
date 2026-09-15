'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Users, Activity, HardDrive, Key, CheckCircle2, 
  AlertTriangle, RefreshCw, Layers, ArrowUpRight, Lock, Eye,
  Trash2, Download, Search, Filter, ShieldAlert, ShoppingBag, Tag,
  Building2, Calendar, Phone, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimateIn from '../../components/AnimateIn';

// Mock registered accounts data for Admin view
const INITIAL_USERS = [
  { id: 'usr_01', name: 'Sarath (System Admin)', email: 'sarath1234@gmail.com', role: 'admin', status: 'Active', renders: 42, joined: '2026-01-01' },
  { id: 'usr_02', name: 'Alex Johnson', email: 'customer@auraspace.ai', role: 'customer', status: 'Active', renders: 18, joined: '2026-02-15' },
  { id: 'usr_03', name: 'Sarah Miller (Real Estate)', email: 'sarah.realty@gmail.com', role: 'customer', status: 'Active', renders: 34, joined: '2026-02-28' },
  { id: 'usr_04', name: 'David Chen (Interior Architect)', email: 'd.chen@designstudio.io', role: 'customer', status: 'Active', renders: 56, joined: '2026-03-04' },
  { id: 'usr_05', name: 'Elena Rostova', email: 'elena@luxurystaging.com', role: 'customer', status: 'Active', renders: 29, joined: '2026-03-10' },
];

// Mock global activity log
const RECENT_ACTIVITY = [
  { id: 'act_1', user: 'Alex Johnson', type: 'Virtual Staging', style: 'Modern Minimalist', room: 'Living Room', status: 'Success', time: '10 mins ago' },
  { id: 'act_2', user: 'Sarah Miller', type: 'Inspirational Design', style: 'Scandinavian', room: 'Bedroom', status: 'Success', time: '25 mins ago' },
  { id: 'act_3', user: 'David Chen', type: 'Virtual Staging', style: 'Industrial Loft', room: 'Kitchen', status: 'Success', time: '1 hour ago' },
  { id: 'act_4', user: 'Elena Rostova', type: 'Virtual Staging', style: 'Coastal Chic', room: 'Dining Room', status: 'Success', time: '2 hours ago' },
];

// Initial mock affiliate sales data
const INITIAL_AFFILIATE_SALES = [
  { id: 'sale_90412', productName: 'L-Shaped Velvet Sectional Sofa', storeName: 'Pepperfry', priceINR: 34999, commissionEarnedINR: 2800, buyerEmail: 'customer@decor8.ai', purchasedAt: '2026-03-12' },
  { id: 'sale_90413', productName: 'Scandinavian Solid Oak Coffee Table', storeName: 'Urban Ladder', priceINR: 8499, commissionEarnedINR: 595, buyerEmail: 'sarah.realty@gmail.com', purchasedAt: '2026-03-13' },
  { id: 'sale_90414', productName: 'Arc Brass Floor Standing Lamp', storeName: 'Amazon India', priceINR: 4299, commissionEarnedINR: 258, buyerEmail: 'd.chen@designstudio.io', purchasedAt: '2026-03-13' },
];

// Initial mock consultations data
const INITIAL_CONSULTATIONS = [
  { id: 'cons_101', partnerId: 'comp_livspace', partnerName: 'Livspace India', customerName: 'Alex Johnson', customerEmail: 'customer@decor8.ai', customerPhone: '+91 98401 23456', city: 'Bangalore', propertyType: '3 BHK Apartment', budgetRange: '₹10 Lakhs - ₹20 Lakhs', preferredDate: '2026-03-18', notes: 'Need Scandinavian living room + modern modular kitchen', status: 'Confirmed', commissionEarnedINR: 1500, createdAt: '2026-03-13' },
  { id: 'cons_102', partnerId: 'comp_homelane', partnerName: 'HomeLane', customerName: 'Sarah Miller', customerEmail: 'sarah.realty@gmail.com', customerPhone: '+91 98840 98765', city: 'Chennai', propertyType: '2 BHK Apartment', budgetRange: '₹5 Lakhs - ₹10 Lakhs', preferredDate: '2026-03-20', notes: 'Turnkey interior with 45-day handover', status: 'In Progress', commissionEarnedINR: 1500, createdAt: '2026-03-13' },
  { id: 'cons_103', partnerId: 'comp_designcafe', partnerName: 'Design Cafe', customerName: 'David Chen', customerEmail: 'd.chen@designstudio.io', customerPhone: '+91 97910 11223', city: 'Hyderabad', propertyType: '4+ BHK / Villa', budgetRange: '₹20 Lakhs - ₹50 Lakhs', preferredDate: '2026-03-22', notes: 'Space saving interior design for luxury duplex villa', status: 'Confirmed', commissionEarnedINR: 2000, createdAt: '2026-03-14' },
];

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [cacheCleared, setCacheCleared] = useState(false);

  const [affiliateSales, setAffiliateSales] = useState(INITIAL_AFFILIATE_SALES);
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS);

  useEffect(() => {
    try {
      const savedSales = localStorage.getItem('auraspace_affiliate_sales');
      if (savedSales) {
        const parsed = JSON.parse(savedSales);
        if (parsed.length > 0) {
          setAffiliateSales([...parsed, ...INITIAL_AFFILIATE_SALES]);
        }
      }

      const savedConsultations = localStorage.getItem('auraspace_consultations');
      if (savedConsultations) {
        const parsedCons = JSON.parse(savedConsultations);
        if (parsedCons.length > 0) {
          setConsultations([...parsedCons, ...INITIAL_CONSULTATIONS]);
        }
      }
    } catch (e) {
      console.error('Failed to load storage data', e);
    }
  }, []);

  const affiliateEarnings = affiliateSales.reduce((acc, item) => acc + item.commissionEarnedINR, 0);
  const consultationEarnings = consultations.reduce((acc, item) => acc + item.commissionEarnedINR, 0);
  const totalMonetization = affiliateEarnings + consultationEarnings;

  // Protected route check
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <AnimateIn from="top">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 p-8 shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Admin Access Restricted
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              You are currently logged in as a <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">{user?.role || 'Guest'}</span>. Only authorized administrators with valid credentials can access this panel.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/admin/login"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In with Admin Credentials</span>
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    );
  }

  const toggleUserRole = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const nextRole = u.role === 'admin' ? 'customer' : 'admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <AnimateIn from="top">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Administrator Dashboard</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Platform Control Center
              </h1>
              <p className="mt-1 text-sm text-indigo-200/80 max-w-xl">
                Monitor system metrics, user roles, virtual staging activity, and AI API health.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearCache}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${cacheCleared ? 'animate-spin' : ''}`} />
                <span>{cacheCleared ? 'Cache Cleared!' : 'Clear Image Cache'}</span>
              </button>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Metrics Cards Grid */}
      <AnimateIn from="bottom" delay={100}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Staging Renders
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">179</h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24% this week
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Accounts
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">5</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                1 Admin • 4 Customers
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 3: Total Monetization */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Total Earnings (₹)
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{totalMonetization.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Affiliate + Consultation Fees
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 4: Consultation Leads */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Partner Consultations
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {consultations.length}
              </h3>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                ₹{consultationEarnings.toLocaleString('en-IN')} Lead Referral Fees
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* NEW: Affiliate Marketing Analytics & Purchased Products Section */}
      <AnimateIn from="bottom" delay={150}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Affiliate Sales & Commission Tracker</h2>
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                  Live Monetization
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track products bought by users via Pepperfry, Amazon, Urban Ladder & IKEA affiliate links.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Total Commissions Earned</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{affiliateEarnings.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Sale ID</th>
                  <th className="pb-3 px-3">Purchased Product Item</th>
                  <th className="pb-3 px-3">Partner Store</th>
                  <th className="pb-3 px-3 text-right">Product Price (₹)</th>
                  <th className="pb-3 px-3 text-right">Commission Earned (₹)</th>
                  <th className="pb-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {affiliateSales.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400">{sale.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-indigo-500" />
                      {sale.productName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                        {sale.storeName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                      ₹{sale.priceINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                      +₹{sale.commissionEarnedINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{sale.purchasedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimateIn>

      {/* NEW: Partner Consultation Bookings & Referral Leads Tracker */}
      <AnimateIn from="bottom" delay={180}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Partner Interior Consultation Leads</h2>
                <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full border border-indigo-200 dark:border-indigo-800">
                  Collab Partners
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Client consultations booked with Livspace, HomeLane, Design Cafe & Decorpot.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-900 text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Consultation Referral Revenue</p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{consultationEarnings.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 px-3">Lead ID</th>
                  <th className="pb-3 px-3">Design Partner</th>
                  <th className="pb-3 px-3">Client Contact</th>
                  <th className="pb-3 px-3">Property & City</th>
                  <th className="pb-3 px-3">Budget</th>
                  <th className="pb-3 px-3 text-right">Referral Payout</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                  <th className="pb-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {consultations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 font-semibold">{item.id}</td>
                    <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {item.partnerName}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{item.customerName}</p>
                      <p className="text-[11px] text-slate-400">{item.customerEmail} • {item.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-700 dark:text-slate-300">{item.propertyType}</p>
                      <p className="text-[11px] text-slate-400">{item.city}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {item.budgetRange}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                      +₹{item.commissionEarnedINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Confirmed' 
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{item.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimateIn>

      {/* User Management Section */}
      <AnimateIn from="bottom" delay={200}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>User Roles & Account Management</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle roles between Customer and Administrator or manage status.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e: any) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin Only</option>
                <option value="customer">Customer Only</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">User</th>
                  <th className="pb-3 px-3">Email</th>
                  <th className="pb-3 px-3">Assigned Role</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Total Renders</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        <span className="uppercase">{u.role}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {u.renders} designs
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => toggleUserRole(u.id)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                      >
                        Switch to {u.role === 'admin' ? 'Customer' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimateIn>

      {/* Global Activity Stream */}
      <AnimateIn from="bottom" delay={300}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span>Live System Activity Log</span>
          </h2>

          <div className="space-y-3">
            {RECENT_ACTIVITY.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {act.user} generated <span className="text-indigo-600 dark:text-indigo-400">{act.style}</span> ({act.room})
                    </p>
                    <p className="text-[11px] text-slate-400">{act.type} • {act.time}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}
