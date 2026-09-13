'use client';

import { useState } from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimateIn from './AnimateIn';

export default function PricingSection() {
  const { user, upgradePlan } = useAuth();
  const [upgradedPlan, setUpgradedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string, creditsLimit: number) => {
    upgradePlan(planName, creditsLimit);
    setUpgradedPlan(planName);
    setTimeout(() => setUpgradedPlan(null), 4000);
  };

  return (
    <section id="pricing" className="w-full py-20 bg-gradient-to-b from-white via-slate-50/60 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 border-t border-slate-200/80 dark:border-slate-800 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <AnimateIn from="top" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Pricing in ₹ Rupees</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Subscription Plans & AI Credits
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Choose the perfect plan for your virtual staging needs. Free trial includes 3 image generations, Pro plan offers 200 generations/mo.
          </p>
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
            
            {/* Plan 1: Free Trial */}
            <div className={`bg-white dark:bg-slate-900 rounded-3xl border p-8 flex flex-col justify-between shadow-lg transition-all relative ${
              user?.subscriptionPlan === 'Free Trial'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}>
              <div>
                {user?.subscriptionPlan === 'Free Trial' && (
                  <span className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    Current Active Plan
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Trial</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For new users & casual exploration</p>
                
                <div className="my-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">₹0</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400"> (3 Total creations)</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>3 Total Free Image Generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Full Access to All 8 Room Types</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Access to 50+ Design Styles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Before/After Compare Slider</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPlan('Free Trial', 3)}
                  disabled={user?.subscriptionPlan === 'Free Trial'}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                    user?.subscriptionPlan === 'Free Trial'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800'
                  }`}
                >
                  {user?.subscriptionPlan === 'Free Trial' ? 'Active Plan' : 'Select Free Trial'}
                </button>
              </div>
            </div>

            {/* Plan 2: Pro Plan (POPULAR) */}
            <div className={`bg-white dark:bg-slate-900 rounded-3xl border-2 p-8 flex flex-col justify-between shadow-2xl transition-all relative ${
              user?.subscriptionPlan === 'Pro Plan'
                ? 'border-indigo-600 ring-4 ring-indigo-500/20'
                : 'border-indigo-500 dark:border-indigo-500'
            }`}>
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                MOST POPULAR
              </span>

              <div>
                {user?.subscriptionPlan === 'Pro Plan' && (
                  <span className="absolute top-4 right-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                    Current Active Plan
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Plan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For realtors, stagers & designers</p>
                
                <div className="my-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">₹1,999</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400"> / month</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">200 Image Generations / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span>Priority Queue Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span>Commercial License & Full Downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span>Shop the Look Product Price Detection</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPlan('Pro Plan', 200)}
                  disabled={user?.subscriptionPlan === 'Pro Plan'}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                    user?.subscriptionPlan === 'Pro Plan'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 hover:scale-[1.02]'
                  }`}
                >
                  {user?.subscriptionPlan === 'Pro Plan' ? 'Active Plan' : 'Subscribe for ₹1,999/mo'}
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
                    <span className="font-bold text-violet-600 dark:text-violet-400">Unlimited Image Generations</span>
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
    </section>
  );
}
