'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User as UserIcon, LayoutDashboard, Sparkles, Wand2, History, ArrowRight, Trash2, Clock, CheckCircle2, Zap, Star, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimateIn from '../../components/AnimateIn';

interface SavedProject {
  id: string;
  originalImage?: string;
  generatedUrl: string;
  roomType: string;
  designStyle: string;
  prompt?: string;
  type: 'staging' | 'inspiration';
  createdAt?: string;
}

export default function CustomerDashboardPage() {
  const { user, upgradePlan } = useAuth();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [upgradedPlan, setUpgradedPlan] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stagingSaved = localStorage.getItem('decor8ai_history');
      const inspSaved = localStorage.getItem('decor8ai_inspirational_history');

      let projects: SavedProject[] = [];

      if (stagingSaved) {
        const stagingParsed = JSON.parse(stagingSaved);
        projects = projects.concat(
          stagingParsed.map((item: any) => ({
            id: item.id,
            originalImage: item.originalImage,
            generatedUrl: item.generatedUrl,
            roomType: item.roomType,
            designStyle: item.designStyle,
            prompt: item.prompt,
            type: 'staging',
          }))
        );
      }

      if (inspSaved) {
        const inspParsed = JSON.parse(inspSaved);
        projects = projects.concat(
          inspParsed.map((item: any) => ({
            id: item.id,
            generatedUrl: item.generatedUrl,
            roomType: item.roomType,
            designStyle: item.designStyle,
            prompt: item.prompt,
            type: 'inspiration',
          }))
        );
      }

      // Fallback demo items if no history exists yet
      if (projects.length === 0) {
        projects = [
          {
            id: 'proj_demo_1',
            originalImage: '/hero-before.png',
            generatedUrl: '/hero-after.jpg',
            roomType: 'LIVINGROOM',
            designStyle: 'MODERN',
            prompt: 'Modern living room with stylish sofa and warm wooden flooring',
            type: 'staging',
          },
        ];
      }

      setSavedProjects(projects);
    } catch (e) {
      console.error('Failed to load dashboard projects:', e);
    }
  }, []);

  const handleDeleteProject = (id: string, type: 'staging' | 'inspiration') => {
    if (type === 'staging') {
      try {
        const stagingSaved = localStorage.getItem('decor8ai_history');
        if (stagingSaved) {
          const parsed = JSON.parse(stagingSaved).filter((item: any) => item.id !== id);
          if (parsed.length > 0) {
            localStorage.setItem('decor8ai_history', JSON.stringify(parsed));
          } else {
            localStorage.removeItem('decor8ai_history');
          }
        }
      } catch (e) {
        console.error('Failed to delete staging item:', e);
      }
    } else {
      try {
        const inspSaved = localStorage.getItem('decor8ai_inspirational_history');
        if (inspSaved) {
          const parsed = JSON.parse(inspSaved).filter((item: any) => item.id !== id);
          if (parsed.length > 0) {
            localStorage.setItem('decor8ai_inspirational_history', JSON.stringify(parsed));
          } else {
            localStorage.removeItem('decor8ai_inspirational_history');
          }
        }
      } catch (e) {
        console.error('Failed to delete inspirational item:', e);
      }
    }

    setSavedProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleSelectPlan = (planName: string, creditsLimit: number) => {
    upgradePlan(planName, creditsLimit);
    setUpgradedPlan(planName);
    setTimeout(() => setUpgradedPlan(null), 4000);
  };

  const creditsRemaining = user?.creditsRemaining ?? 15;
  const creditsLimit = user?.creditsLimit ?? 20;
  const creditsPercent = Math.min(100, Math.round((creditsRemaining / (creditsLimit || 1)) * 100));

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <AnimateIn from="top">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
                <UserIcon className="w-4 h-4 text-emerald-300" />
                <span>Customer Workspace</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Welcome back, {user?.name || 'Customer'}!
              </h1>
              <p className="mt-1 text-sm text-emerald-100/80 max-w-xl">
                Manage all your past AI virtual staging projects, subscription plan, and credit limits.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/virtual-staging"
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 hover:scale-105"
              >
                <Wand2 className="w-4 h-4" />
                <span>Launch Virtual Staging</span>
              </Link>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Upgraded Notification Toast */}
      {upgradedPlan && (
        <AnimateIn from="top">
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-500 text-white shadow-xl flex items-center gap-3 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Success! Upgraded to {upgradedPlan}. Credits refreshed!</span>
          </div>
        </AnimateIn>
      )}

      {/* Customer Credits & Subscription Status Widget */}
      <AnimateIn from="bottom" delay={100}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Generation Credits & Subscription</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active Plan: <span className="font-bold text-indigo-600 dark:text-indigo-400">{user?.subscriptionPlan || 'Starter Free'}</span>
              </p>
            </div>

            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Get More Credits / Upgrade</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Progress bar */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>Available Credits</span>
                <span className="text-indigo-600 dark:text-indigo-400">{creditsRemaining} / {creditsLimit} Remaining</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${creditsPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">1 Credit is used per AI room generation or virtual staging render.</p>
            </div>

            {/* Plan Badge Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between text-center space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current Plan</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{user?.subscriptionPlan || 'Starter Free'}</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active & Ready</span>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Subscription Pricing Grid in ₹ Rupees */}
      <AnimateIn from="bottom" delay={150}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-600" />
                <span>Subscription Plans (in ₹ Rupees)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upgrade your subscription plan to unlock higher credit limits and HD downloads.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1 */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
              user?.subscriptionPlan === 'Starter Free' ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
            }`}>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Starter Free</h3>
                <div className="my-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹0</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">20 Credits / month</p>
              </div>
              <button
                onClick={() => handleSelectPlan('Starter Free', 20)}
                disabled={user?.subscriptionPlan === 'Starter Free'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  user?.subscriptionPlan === 'Starter Free'
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {user?.subscriptionPlan === 'Starter Free' ? 'Active' : 'Select ₹0'}
              </button>
            </div>

            {/* Plan 2 */}
            <div className={`p-6 rounded-2xl border-2 flex flex-col justify-between space-y-4 ${
              user?.subscriptionPlan === 'Pro Creator' ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/30' : 'border-indigo-500 bg-white dark:bg-slate-900'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Pro Creator</h3>
                  <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">Popular</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹1,999</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">200 Credits / month · HD Renders</p>
              </div>
              <button
                onClick={() => handleSelectPlan('Pro Creator', 200)}
                disabled={user?.subscriptionPlan === 'Pro Creator'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  user?.subscriptionPlan === 'Pro Creator'
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                }`}
              >
                {user?.subscriptionPlan === 'Pro Creator' ? 'Active' : 'Upgrade for ₹1,999/mo'}
              </button>
            </div>

            {/* Plan 3 */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
              user?.subscriptionPlan === 'Unlimited Agency' ? 'border-violet-500 bg-violet-50/20 dark:bg-violet-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
            }`}>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Unlimited Agency</h3>
                <div className="my-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹4,999</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">Unlimited Credits · 4K Renders</p>
              </div>
              <button
                onClick={() => handleSelectPlan('Unlimited Agency', 9999)}
                disabled={user?.subscriptionPlan === 'Unlimited Agency'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  user?.subscriptionPlan === 'Unlimited Agency'
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20'
                }`}
              >
                {user?.subscriptionPlan === 'Unlimited Agency' ? 'Active' : 'Upgrade for ₹4,999/mo'}
              </button>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Quick Launch Cards */}
      <AnimateIn from="bottom" delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              Virtual Staging Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Upload room photos and virtually stage them with photorealistic furniture in 50+ architectural styles.
            </p>
            <Link
              href="/virtual-staging"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all"
            >
              <span>Start Virtual Staging</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              Inspirational Design Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Generate creative moodboards, room redesigns, and color schemes tailored to your specific preferences.
            </p>
            <Link
              href="/inspirational-design"
              className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:gap-3 transition-all"
            >
              <span>Explore Inspirational Design</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimateIn>

      {/* Full Customer Projects & Saved History Gallery */}
      <AnimateIn from="bottom" delay={250}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>My Saved Projects & Staging History</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full gallery of all your generated room designs ({savedProjects.length} saved)
              </p>
            </div>

            <Link
              href="/virtual-staging"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Create New Render
            </Link>
          </div>

          <div className="space-y-6">
            {savedProjects.map((proj) => (
              <div 
                key={proj.id} 
                className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-800/40 hover:shadow-lg transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full text-white ${
                      proj.type === 'staging' ? 'bg-indigo-600' : 'bg-violet-600'
                    }`}>
                      {proj.type === 'staging' ? 'Virtual Staging' : 'Inspirational Concept'}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {proj.roomType.charAt(0) + proj.roomType.slice(1).toLowerCase()} · {proj.designStyle.charAt(0) + proj.designStyle.slice(1).toLowerCase()}
                    </span>
                    {proj.prompt && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-xs">"{proj.prompt}"</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteProject(proj.id, proj.type)}
                    title="Delete project"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Images */}
                {proj.originalImage ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Before</p>
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={proj.originalImage} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">After</p>
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={proj.generatedUrl} alt="After" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-violet-200 dark:border-violet-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proj.generatedUrl} alt="Generated Design" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}
