
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  ShieldCheck,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Lock,
  Zap,
  Menu,
  X,
  ShoppingCart,
  Trash2,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { ProductItem } from './ProductBreakdown';
import PurchaseModal from './PurchaseModal';

export default function Header() {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [cartItems, setCartItems] = useState<ProductItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const syncCart = () => {
    try {
      const saved = localStorage.getItem('auraspace_cart');

      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error('Failed to sync cart', e);
      setCartItems([]);
    }
  };

  useEffect(() => {
    syncCart();

    const handleCartUpdate = () => {
      syncCart();
    };

    window.addEventListener(
      'auraspace_cart_updated',
      handleCartUpdate
    );

    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener(
        'auraspace_cart_updated',
        handleCartUpdate
      );

      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter((p) => p.id !== id);

    setCartItems(updated);

    try {
      localStorage.setItem(
        'auraspace_cart',
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new Event('auraspace_cart_updated')
      );
    } catch (e) {
      console.error('Failed to update cart', e);
    }
  };

  const cartTotalINR = cartItems.reduce(
    (acc, p) => acc + p.priceINR,
    0
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
        <div className="flex h-16 w-full items-center justify-between px-3 sm:px-5">

          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform hover:scale-105"
            >
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

            <Link
              href="/#about-us"
              className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap"
            >
              About Us
            </Link>

            <Link
              href="/#room-showcase"
              className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap hidden lg:inline-block"
            >
              Design Gallery
            </Link>

            <Link
              href="/virtual-staging"
              className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap hidden xl:inline-block"
            >
              Virtual Staging
            </Link>

            <Link
              href="/inspirational-design"
              className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap hidden xl:inline-block"
            >
              Inspirational Design
            </Link>

            <Link
              href="/pricing"
              className="px-2 py-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap"
            >
              Pricing (₹)
            </Link>

            <Link
              href="/consultation"
              className="px-2 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all whitespace-nowrap font-bold"
            >
              Free Consultation
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-xs"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />

              <span>Cart</span>

              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold">
                {cartItems.length}
              </span>

              {cartItems.length > 0 && (
                <span className="hidden xl:inline text-[11px] font-black text-indigo-600 dark:text-indigo-400 pl-0.5">
                  ₹{cartTotalINR.toLocaleString('en-IN')}
                </span>
              )}
            </button>

            {/* Customer Credits */}
            {isAuthenticated && isCustomer && user && (
              <Link
                href="/pricing"
                title="Click to view pricing & upgrade plan"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-bold hover:scale-105 transition-all shadow-xs whitespace-nowrap"
              >
                <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />

                <span>
                  {user.creditsRemaining} / {user.creditsLimit} Credits
                </span>
              </Link>
            )}

            {/* Admin Panel */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Customer Dashboard */}
            {isAuthenticated && !isAdmin && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-sm whitespace-nowrap"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>My Dashboard</span>
              </Link>
            )}

            <ThemeToggle />

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>

                  <span className="hidden lg:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user?.name}
                  </span>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>

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
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Control Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Customer Dashboard
                          </Link>

                          <Link
                            href="/pricing"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors"
                          >
                            <Zap className="w-4 h-4" />
                            Pricing & Credits (₹)
                          </Link>

                          <Link
                            href="/admin/login"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Portal Sign In
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Link>
            )}
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />

              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

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
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
            <nav className="flex flex-col px-4 py-4 gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">

              <Link
                href="/#about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ℹ️ About Us
              </Link>


              <Link
                href="/#room-showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                🖼️ Design Gallery
              </Link>

              <Link
                href="/virtual-staging"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                📦 Virtual Staging
              </Link>

              <Link
                href="/inspirational-design"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✨ Inspirational Design
              </Link>

              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                💰 Pricing (₹)
              </Link>

              <Link
                href="/consultation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold transition-colors flex items-center justify-between"
              >
                <span>🏛️ Free Interior Consultation</span>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
                  Top Brands
                </span>
              </Link>

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                    Signed in as{' '}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {user?.name}
                    </span>
                  </div>

                  {isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold transition-all hover:bg-indigo-700"
                >
                  <Lock className="w-4 h-4" />
                  Log In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Your Room Design Cart ({cartItems.length})
                </h3>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-7 h-7" />
                </div>

                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Your cart is empty.
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add furniture and décor pieces from the Virtual Staging catalog.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.name}
                        </p>

                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.storeName} · {item.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          ₹{item.priceINR.toLocaleString('en-IN')}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-rose-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                  <span>Cart Total (₹ INR)</span>

                  <span className="text-indigo-600 dark:text-indigo-400">
                    ₹{cartTotalINR.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsPurchaseOpen(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <CreditCard className="w-4 h-4" />

                  <span>Proceed to Purchase</span>

                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        items={cartItems}
        totalINR={cartTotalINR}
        roomTheme="Room Setup"
      />
    </>
  );
}

