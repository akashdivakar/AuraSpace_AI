'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Zap, Sparkles, ShieldCheck, ArrowRight, Star, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimateIn from '../../components/AnimateIn';

export default function PricingPage() {
  const { user, isCustomer, isAdmin, upgradePlan } = useAuth();
  const [upgradedPlan, setUpgradedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string, creditsLimit: number) => {
    upgradePlan(planName, creditsLimit);
    setUpgradedPlan(planName);
    setTimeout(() => setUpgradedPlan(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12 pb-16">
      {/* Top Header */}
      <AnimateIn from="top">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Pricing in ₹ Rupees</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Subscription Plans & AI Credits
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Choose the perfect plan for your virtual staging needs. All plans include photorealistic AI rendering and full ownership of generated designs.
          </p>
        </div>
      </AnimateIn>

      {/* Upgraded Notification Toast */}
      {upgradedPlan && (
        <AnimateIn from="top">
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-500 text-white shadow-xl flex items-center gap-3 text-sm font-bold animate-bounce">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Success! You have upgraded to the {upgradedPlan} plan. Credits refreshed!</span>
          </div>
        </AnimateIn>
      )}

      {/* Pricing Cards Grid (in ₹ Rupees) */}
      <AnimateIn from="bottom" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Starter Free */}
          <div className={`bg-white dark:bg-slate-900 rounded-3xl border p-8 flex flex-col justify-between shadow-lg transition-all relative ${
            user?.subscriptionPlan === 'Starter Free'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}>
            <div>
              {user?.subscriptionPlan === 'Starter Free' && (
                <span className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                  Current Active Plan
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Starter Free</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For casual exploration & individuals</p>
              
              <div className="my-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₹0</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400"> / month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>20 AI Generation Credits / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Standard Resolution Renders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Access to 50+ Architectural Styles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Before/After Compare Slider</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPlan('Starter Free', 20)}
                disabled={user?.subscriptionPlan === 'Starter Free'}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  user?.subscriptionPlan === 'Starter Free'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800'
                }`}
              >
                {user?.subscriptionPlan === 'Starter Free' ? 'Active Plan' : 'Select Starter Plan'}
              </button>
            </div>
          </div>

          {/* Plan 2: Pro Creator (POPULAR) */}
          <div className={`bg-white dark:bg-slate-900 rounded-3xl border-2 p-8 flex flex-col justify-between shadow-2xl transition-all relative ${
            user?.subscriptionPlan === 'Pro Creator'
              ? 'border-indigo-600 ring-4 ring-indigo-500/20'
              : 'border-indigo-500 dark:border-indigo-500'
          }`}>
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
              MOST POPULAR
            </span>

            <div>
              {user?.subscriptionPlan === 'Pro Creator' && (
                <span className="absolute top-4 right-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                  Current Active Plan
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Creator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For realtors, stagers & designers</p>
              
              <div className="my-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₹1,999</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400"> / month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">200 AI Generation Credits / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>HD Photorealistic 1080p Renders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>Priority Queue Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>Commercial License & HD Downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>Custom Style Prompts & Fine-Tuning</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPlan('Pro Creator', 200)}
                disabled={user?.subscriptionPlan === 'Pro Creator'}
                className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                  user?.subscriptionPlan === 'Pro Creator'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:scale-[1.02]'
                }`}
              >
                {user?.subscriptionPlan === 'Pro Creator' ? 'Active Plan' : 'Subscribe for ₹1,999/mo'}
              </button>
            </div>
          </div>

          {/* Plan 3: Unlimited Agency */}
          <div className={`bg-white dark:bg-slate-900 rounded-3xl border p-8 flex flex-col justify-between shadow-lg transition-all relative ${
            user?.subscriptionPlan === 'Unlimited Agency'
              ? 'border-violet-500 ring-2 ring-violet-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}>
            <div>
              {user?.subscriptionPlan === 'Unlimited Agency' && (
                <span className="absolute top-4 right-4 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                  Current Active Plan
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unlimited Agency</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For high-volume agencies & teams</p>
              
              <div className="my-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₹4,999</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400"> / month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                  <span className="font-bold text-violet-600 dark:text-violet-400">Unlimited AI Generation Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                  <span>4K Ultra-HD Resolution Renders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                  <span>Instant Priority Server Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                  <span>Full Commercial & Reseller Rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500" />
                  <span>Team Seats & API Key Access</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectPlan('Unlimited Agency', 9999)}
                disabled={user?.subscriptionPlan === 'Unlimited Agency'}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  user?.subscriptionPlan === 'Unlimited Agency'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25 hover:scale-[1.02]'
                }`}
              >
                {user?.subscriptionPlan === 'Unlimited Agency' ? 'Active Plan' : 'Subscribe for ₹4,999/mo'}
              </button>
            </div>
          </div>

        </div>
      </AnimateIn>
    </div>
  );
}
