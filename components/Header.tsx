'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, ShieldCheck, User as UserIcon, LogOut, ChevronDown, LayoutDashboard, Lock, Sparkles, RefreshCw, Zap, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, isAuthenticated, isAdmin, isCustomer, logout, switchRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-3 sm:px-6">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Home className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                AuraSpace AI
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400">
                {isAdmin ? 'Admin Portal' : 'Customer Studio'}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 flex-shrink-0">
          <Link href="/" className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap">Home</Link>
          <Link href="/#about-us" className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap">About Us</Link>
          <Link href="/#why-us" className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap">Why Us</Link>
          <Link href="/#room-showcase" className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap hidden lg:inline-block">Design Gallery</Link>
          <Link href="/virtual-staging" className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap hidden xl:inline-block">Virtual Staging</Link>
          <Link href="/inspirational-design" className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap hidden xl:inline-block">Inspirational Design</Link>
          <Link href="/pricing" className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap">Pricing (₹)</Link>
          <Link href="/consultation" className="px-2 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all whitespace-nowrap font-bold">Free Consultation</Link>

          {/* Customer Live Credits Pill */}
          {isAuthenticated && isCustomer && user && (
            <Link
              href="/pricing"
              title="Click to view pricing & upgrade plan"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-bold hover:scale-105 transition-all shadow-xs whitespace-nowrap"
            >
              <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{user.creditsRemaining} / {user.creditsLimit} Credits</span>
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}

          {isAuthenticated && !isAdmin && (
            <Link href="/dashboard" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-sm whitespace-nowrap">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>My Dashboard</span>
            </Link>
          )}

          <ThemeToggle />

          {/* User Account Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden lg:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {user?.role}
                      </span>
                      {user?.subscriptionPlan && (
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {user.subscriptionPlan}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    {isAdmin ? (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors">
                        <ShieldCheck className="w-4 h-4" />Admin Control Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                          <LayoutDashboard className="w-4 h-4" />Customer Dashboard
                        </Link>
                        <Link href="/pricing" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors">
                          <Zap className="w-4 h-4" />Pricing & Credits (₹)
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => { switchRole(isAdmin ? 'customer' : 'admin'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                    >
                      <RefreshCw className="w-4 h-4 text-indigo-500" />
                      Switch to {isAdmin ? 'Customer Role' : 'Admin Role'}
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20">
              <Lock className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
          )}
        </nav>

        {/* Mobile Right Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Credits pill on mobile */}
          {isAuthenticated && isCustomer && user && (
            <Link
              href="/pricing"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-bold whitespace-nowrap"
            >
              <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{user.creditsRemaining}</span>
            </Link>
          )}
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <nav className="flex flex-col px-4 py-4 gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">🏠 Home</Link>
            <Link href="/#about-us" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">ℹ️ About Us</Link>
            <Link href="/#why-us" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✅ Why Us</Link>
            <Link href="/#room-showcase" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">🖼️ Design Gallery</Link>
            <Link href="/virtual-staging" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">📦 Virtual Staging</Link>
            <Link href="/inspirational-design" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✨ Inspirational Design</Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">💰 Pricing (₹)</Link>
            <Link href="/consultation" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold transition-colors flex items-center justify-between">
              <span>🏛️ Free Interior Consultation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase">Top Brands</span>
            </Link>

            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                  Signed in as <span className="font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
                </div>
                {isAdmin ? (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold transition-colors">
                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                  </Link>
                ) : (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> My Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold transition-all hover:bg-indigo-700">
                <Lock className="w-4 h-4" /> Log In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
