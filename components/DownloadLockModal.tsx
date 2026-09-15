'use client';

import React from 'react';
import Link from 'next/link';
import { X, Lock, Sparkles, CheckCircle2, ArrowRight, Download, Zap } from 'lucide-react';

interface DownloadLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

export default function DownloadLockModal({ isOpen, onClose, onUpgradeClick }: DownloadLockModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Badge */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20">
          <Lock className="w-8 h-8" />
        </div>

        {/* Header Content */}
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase rounded-full border border-amber-200 dark:border-amber-800 tracking-wider">
            Pro Feature Locked
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Image Downloads are Pro Only
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            High-resolution watermark-free downloads and 100 AI image creations/month are exclusively available on the <strong>Pro Plan (₹1,999/mo)</strong> and <strong>Unlimited Agency</strong> plans.
          </p>
        </div>

        {/* Features list */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-left space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>100 AI Image Creations / month</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Unlimited High-Res Watermark-Free Downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Shop the Look & Product Price Description</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Commercial License & Priority Processing</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5 pt-1">
          {onUpgradeClick ? (
            <button
              onClick={() => {
                onClose();
                onUpgradeClick();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade to Pro Plan (₹1,999/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/pricing"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade to Pro Plan (₹1,999/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Stay on Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}

