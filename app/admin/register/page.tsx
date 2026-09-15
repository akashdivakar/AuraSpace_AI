'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight, Lock, User as UserIcon } from 'lucide-react';
import AnimateIn from '../../../components/AnimateIn';

export default function AdminRegisterPage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <AnimateIn from="top">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Security Protocol</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Administrator Access Only
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Public administrator self-registration is closed. Please sign in with your official administrator credentials.
          </p>
        </div>
      </AnimateIn>

      <AnimateIn from="bottom" delay={100}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900 p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Official Admin Sign In Required
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Use your authorized administrator email and password to access the system controls.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            <Link href="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Switch to Customer Login</span>
            </Link>
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}

