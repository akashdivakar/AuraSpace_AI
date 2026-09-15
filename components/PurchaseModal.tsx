'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Truck, CreditCard, ShieldCheck, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { ProductItem } from './ProductBreakdown';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ProductItem[];
  totalINR: number;
  roomTheme?: string;
}

export default function PurchaseModal({ isOpen, onClose, items, totalINR, roomTheme }: PurchaseModalProps) {
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [name, setName] = useState('Alex Johnson');
  const [phone, setPhone] = useState('+91 98401 23456');
  const [address, setAddress] = useState('Flat 402, Prestige Palms, Whitefield, Bangalore, Karnataka - 560066');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const newId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newId);
      setIsProcessing(false);
      setStep('success');

      // Log purchase event in localStorage for analytics and dashboard tracking
      try {
        const orderData = {
          id: newId,
          items: items,
          totalINR: totalINR,
          customerName: name,
          phone: phone,
          address: address,
          paymentMethod: paymentMethod,
          theme: roomTheme || 'Custom Room',
          date: new Date().toISOString().split('T')[0],
        };
        const existing = JSON.parse(localStorage.getItem('auraspace_orders') || '[]');
        localStorage.setItem('auraspace_orders', JSON.stringify([orderData, ...existing]));
      } catch (err) {
        console.error('Failed to log order', err);
      }
    }, 1200);
  };

  const handleResetAndClose = () => {
    setStep('checkout');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'checkout' ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Instant Checkout & Delivery
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Room Package Checkout (₹ INR)
                </h3>
              </div>
            </div>

            {/* Itemized list summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Selected Room Items ({items.length})
              </h4>
              <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-850/40">
                {items.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.storeName} · {item.materialStyle}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">₹{item.priceINR.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span>₹{totalINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Direct Home Staging Delivery</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Standard GST Included (18%)</span>
                <span>₹{Math.round(totalINR * 0.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Total Package Price</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{totalINR.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Shipping & Payment Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (for Courier & Staging Delivery)
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery & Installation Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>⚡ Instant UPI</span>
                    <span className="text-[10px] font-normal text-slate-400">GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>💳 Credit/Debit</span>
                    <span className="text-[10px] font-normal text-slate-400">Visa / Master / RuPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>📦 Pay on Setup</span>
                    <span className="text-[10px] font-normal text-slate-400">After Delivery</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'Confirming Order...' : `Complete Purchase (₹${totalINR.toLocaleString('en-IN')})`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase rounded-full border border-emerald-200 dark:border-emerald-800">
                Order Placed Successfully
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Thank You for Your Order!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order Reference: <strong className="text-indigo-600 dark:text-indigo-400">{orderId}</strong> · Total: ₹{totalINR.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Deliver To:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{name} ({phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Theme Setup:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{roomTheme || 'Custom Room'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Delivery:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">3 - 5 Business Days</span>
              </div>
            </div>

            {/* Direct Partner Links */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                You can also track and purchase individually from partner stores:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <a
                  href="https://www.pepperfry.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-semibold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Pepperfry Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.urbanladder.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-semibold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Urban Ladder</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.amazon.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-semibold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Amazon India</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
              >
                Back to Staging Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
