'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, QrCode, Building2, CheckCircle2, Lock, ArrowRight, Loader2, Smartphone } from 'lucide-react';

export interface PlanDetails {
  name: string;
  price: string;
  rawPrice: number;
  credits: number;
  creditsLabel: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDetails | null;
  onSuccess: (planName: string, creditsLimit: number) => void;
}

const POPULAR_BANKS = [
  'HDFC Bank',
  'State Bank of India (SBI)',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
];

export default function PaymentModal({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState(POPULAR_BANKS[0]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !plan) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (method === 'upi' && !upiId.trim() && selectedUpiApp === 'custom') {
      setError('Please enter a valid UPI ID (e.g. yourname@okaxis)');
      return;
    }

    if (method === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (!cleanCard || cleanCard.length < 16) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardExpiry.trim() || !cardCvv.trim() || !cardName.trim()) {
        setError('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing with secure gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onSuccess(plan.name, plan.credits);
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1500);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg">
              ₹
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Secure Checkout</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Complete payment to activate {plan.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Payment Success View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Payment Successful!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You have subscribed to <span className="font-bold text-indigo-600 dark:text-indigo-400">{plan.name}</span>.
              </p>
              <p className="text-xs text-slate-400">
                {plan.creditsLabel} have been added to your account. Activating now...
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Transaction ID:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">PAY_AURASPACE_{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount Paid:</span>
                <span className="font-bold text-slate-900 dark:text-white">{plan.price}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Confirmed & Active</span>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Order Summary Pill */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-violet-50/80 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Selected Subscription</span>
                <h4 className="text-base font-black text-slate-900 dark:text-white">{plan.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{plan.creditsLabel}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{plan.price}</span>
                <span className="text-xs text-slate-500 block">/ month</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Payment Method (India ₹)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-1 transition-all text-xs font-bold ${
                    method === 'upi'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-1 transition-all text-xs font-bold ${
                    method === 'card'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('netbanking')}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-1 transition-all text-xs font-bold ${
                    method === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {method === 'upi' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Popular UPI Apps</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-full">Zero Extra Fee</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', label: 'GPay', icon: '🟢' },
                    { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                    { id: 'paytm', label: 'Paytm', icon: '🔵' },
                    { id: 'custom', label: 'Other', icon: '⚡' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        selectedUpiApp === app.id
                          ? 'border-indigo-600 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{app.icon}</span>
                      <span>{app.label}</span>
                    </button>
                  ))}
                </div>

                {selectedUpiApp === 'custom' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <QrCode className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <span>A payment request will be sent to your {selectedUpiApp.toUpperCase()} app.</span>
                  </div>
                )}
              </div>
            )}

            {method === 'card' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4532 •••• •••• 8921"
                    maxLength={19}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full name on card"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">Secure gateway routing via {selectedBank}.</p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Pay Button */}
            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/25 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment ({plan.price})...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {plan.price} & Activate Subscription</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Encrypted & Secure
                </span>
                <span>•</span>
                <span>Cancel anytime</span>
                <span>•</span>
                <span>Instant Activation</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
