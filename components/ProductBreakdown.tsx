'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, ChevronDown, ChevronUp, Tag, Sparkles, CheckCircle2, Building2, ArrowRight, Lock, CheckSquare, Square, ShoppingCart, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  priceINR: number;
  materialStyle: string;
  storeName: string;
  affiliateUrl: string;
  commissionRate: number; // e.g. 0.08 = 8%
}

const THEMED_PRODUCTS: Record<string, ProductItem[]> = {
  ronaldo: [
    { id: 'cr7_1', name: 'CR7 Framed Autograph Jersey & Signature Canvas Art', category: 'Wall Art', priceINR: 4999, materialStyle: 'Matte Black Aluminum Frame & Ultra-HD Print', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=cristiano+ronaldo+cr7+framed+jersey+art', commissionRate: 0.10 },
    { id: 'cr7_2', name: 'Matte Charcoal & Champagne Gold Velvet Sectional Sofa', category: 'Furniture', priceINR: 38999, materialStyle: 'Italian Velvet with Brushed Gold Steel Legs', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=charcoal+velvet+sectional+sofa', commissionRate: 0.08 },
    { id: 'cr7_3', name: 'Trophy & Memorabilia Glass Showcase Cabinet', category: 'Display', priceINR: 14499, materialStyle: 'Tempered Glass with Warm Backlit LED', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=glass+display+cabinet+trophy', commissionRate: 0.07 },
    { id: 'cr7_4', name: 'Carbon Fiber Geometric Modern Coffee Table', category: 'Tables', priceINR: 9999, materialStyle: 'Hydro-Dipped Carbon Weave & Metal', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=modern+black+coffee+table&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'cr7_5', name: 'Smart Reactive RGB Ambient Backlight Bar', category: 'Lighting', priceINR: 2499, materialStyle: 'Custom Gold & White Ambient Glow', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=smart+led+light+bar&tag=auraspaceai-21', commissionRate: 0.06 },
  ],
  messi: [
    { id: 'messi_1', name: 'Lionel Messi Ballon d\'Or Golden Trophy Display Stand', category: 'Decor', priceINR: 3999, materialStyle: '24K Gold Electroplated Brass Finish', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=ballon+dor+trophy+replica&tag=auraspaceai-21', commissionRate: 0.07 },
    { id: 'messi_2', name: 'Albiceleste Sky-Blue & Velvet Lounge Armchair', category: 'Furniture', priceINR: 16999, materialStyle: 'Sky Blue Premium Velvet with Solid Walnut Frame', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=sky+blue+velvet+armchair', commissionRate: 0.08 },
    { id: 'messi_3', name: 'Framed World Champion #10 Memorabilia Jersey Canvas', category: 'Wall Art', priceINR: 4999, materialStyle: 'Museum Grade Glass Frame', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=lionel+messi+framed+jersey+canvas', commissionRate: 0.10 },
    { id: 'messi_4', name: 'Italian White Carrara Marble & Brass Coffee Table', category: 'Tables', priceINR: 12999, materialStyle: 'Natural Polished Carrara Marble Top', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=white+marble+brass+coffee+table', commissionRate: 0.08 },
    { id: 'messi_5', name: 'Smart Dimmable Warm Ambient Cove Light Kit', category: 'Lighting', priceINR: 2999, materialStyle: '3000K Warm Glow Wi-Fi Controller', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=warm+cove+lighting+strip&tag=auraspaceai-21', commissionRate: 0.06 },
  ],
  marvel: [
    { id: 'mvl_1', name: 'Stark Industries Cyberpunk RGB Floating Desk', category: 'Furniture', priceINR: 18999, materialStyle: 'Matte Black Aluminum & Integrated Cable Matrix', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=cyberpunk+gaming+desk', commissionRate: 0.07 },
    { id: 'mvl_2', name: 'Iron Man Arc Reactor Ambient Glowing Table Lamp', category: 'Lighting', priceINR: 2999, materialStyle: 'Diecast Metal & Optical Cyan LED', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=arc+reactor+lamp&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'mvl_3', name: 'Avengers Holographic 3D Framed Wall Canvas', category: 'Wall Art', priceINR: 3499, materialStyle: 'Lenticular Holographic Print & LED Backing', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=marvel+avengers+wall+art', commissionRate: 0.10 },
    { id: 'mvl_4', name: 'Futuristic Ergonomic Gaming Pod Chair', category: 'Seating', priceINR: 14999, materialStyle: 'Perforated Crimson & Black Faux Leather', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=ergonomic+gaming+chair&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'mvl_5', name: 'Smart TV Soundbar with Underglow Sync', category: 'Electronics', priceINR: 6999, materialStyle: 'Dolby Audio with Reactive Backlight', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=soundbar+with+led+tv&tag=auraspaceai-21', commissionRate: 0.05 },
  ],
  anime: [
    { id: 'anm_1', name: 'Neo-Tokyo Cyberpunk LED Manga Display Shelf', category: 'Shelving', priceINR: 11999, materialStyle: 'Matte Acrylic & Diffused RGB Backing', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=led+bookshelf+manga+display', commissionRate: 0.07 },
    { id: 'anm_2', name: 'Studio Ghibli Botanical Wall Tapestry & Planter Set', category: 'Decor', priceINR: 2499, materialStyle: 'Woven Cotton Tapestry & Ceramic Pots', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=ghibli+wall+decor+plants', commissionRate: 0.10 },
    { id: 'anm_3', name: 'Japanese Low-Profile Modern Platform Sofa', category: 'Furniture', priceINR: 26999, materialStyle: 'Natural Ash Wood & Sage Linen Cushions', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=japanese+platform+sofa', commissionRate: 0.08 },
    { id: 'anm_4', name: 'Anime RGB Backlit Gaming Battlestation Desk', category: 'Furniture', priceINR: 15999, materialStyle: 'Carbon Textured Top & Full-Surface Mousepad', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=rgb+gaming+desk&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'anm_5', name: 'Custom Neon Japanese Kanji Silhouette Wall Sign', category: 'Lighting', priceINR: 3799, materialStyle: 'Silicone Neon Flex & Clear Acrylic Backboard', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=japanese+neon+sign&tag=auraspaceai-21', commissionRate: 0.06 },
  ],
  f1: [
    { id: 'f1_1', name: 'Formula 1 Carbon Fiber Racing Desk with Cable Ducting', category: 'Furniture', priceINR: 22999, materialStyle: 'Authentic 3K Carbon Fiber Finish & Steel Truss Legs', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=carbon+fiber+desk', commissionRate: 0.07 },
    { id: 'f1_2', name: 'Ergonomic Alcantara Pitlane Racing Bucket Chair', category: 'Seating', priceINR: 16999, materialStyle: 'Italian Alcantara & High-Density Memory Foam', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=racing+bucket+chair+alcantara', commissionRate: 0.08 },
    { id: 'f1_3', name: 'Monaco & Silverstone Circuit Track Wall Art with LED', category: 'Wall Art', priceINR: 4499, materialStyle: 'Laser-Cut Matte Black Metal & Edge Glow LED', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=f1+circuit+wall+art+led&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'f1_4', name: 'Pirelli Compound Aesthetic Glass Side Table', category: 'Tables', priceINR: 5999, materialStyle: 'Motorsport Tire Replica Base with Tempered Glass', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=tire+rim+table+glass', commissionRate: 0.07 },
    { id: 'f1_5', name: 'Carbon Fiber Floating Display Shelves (Set of 3)', category: 'Shelving', priceINR: 6499, materialStyle: 'Glossy Carbon Fiber & Concealed Wall Brackets', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=carbon+fiber+floating+shelves', commissionRate: 0.08 },
  ]
};

const SAMPLE_PRODUCTS: Record<string, ProductItem[]> = {
  LIVINGROOM: [
    { id: 'aff_1', name: 'L-Shaped Velvet Sectional Sofa', category: 'Furniture', priceINR: 34999, materialStyle: 'Modern Emerald Green Velvet', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=pepperfry+emerald+velvet+sectional+sofa', commissionRate: 0.08 },
    { id: 'aff_2', name: 'Scandinavian Solid Oak Coffee Table', category: 'Tables', priceINR: 8499, materialStyle: 'Natural Light Oak Finish', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=urbanladder+scandinavian+oak+coffee+table', commissionRate: 0.07 },
    { id: 'aff_3', name: 'Arc Brass Floor Standing Lamp', category: 'Lighting', priceINR: 4299, materialStyle: 'Brushed Brass Metal & Warm LED', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=arc+brass+floor+lamp&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'aff_4', name: 'Abstract Minimalist Canvas Prints (Set of 3)', category: 'Decor', priceINR: 2999, materialStyle: 'Textured Linen Framing', storeName: 'Home Centre', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=home+centre+abstract+canvas+wall+art', commissionRate: 0.10 },
    { id: 'aff_5', name: 'Boho Handwoven Jute Area Rug (6x9 ft)', category: 'Rugs', priceINR: 6499, materialStyle: 'Organic Braided Jute Fiber', storeName: 'IKEA India', affiliateUrl: 'https://www.ikea.com/in/en/search/?q=jute+rug', commissionRate: 0.05 },
  ],
  BEDROOM: [
    { id: 'aff_6', name: 'Upholstered Platform Bed Frame with Headboard', category: 'Furniture', priceINR: 28999, materialStyle: 'Beige Linen Weave', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=pepperfry+upholstered+bed+king', commissionRate: 0.08 },
    { id: 'aff_7', name: 'Minimalist Walnut Bedside Nightstands (Pair)', category: 'Furniture', priceINR: 9999, materialStyle: 'Mid-Century Walnut Veneer', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=urbanladder+walnut+nightstands', commissionRate: 0.07 },
    { id: 'aff_8', name: 'Warm Ceramic Table Lamps (Set of 2)', category: 'Lighting', priceINR: 3799, materialStyle: 'Matte Terracotta Base with Linen Shade', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=ceramic+table+lamps+set+of+2&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'aff_9', name: 'Egyptian Cotton Duvet Cover Set (300 TC)', category: 'Bedding', priceINR: 3499, materialStyle: 'Soft White Organic Cotton', storeName: 'Home Centre', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=home+centre+egyptian+cotton+duvet', commissionRate: 0.10 },
  ],
  KITCHEN: [
    { id: 'aff_10', name: 'Contemporary Marble Top Kitchen Island Counter', category: 'Counters', priceINR: 42999, materialStyle: 'Italian Carrara Marble & Black Metal Base', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=pepperfry+marble+kitchen+island', commissionRate: 0.08 },
    { id: 'aff_11', name: 'Counter-Height Leather Bar Stools (Set of 3)', category: 'Seating', priceINR: 14999, materialStyle: 'Cognac Faux Leather with Steel Legs', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=urbanladder+bar+stools+leather', commissionRate: 0.07 },
    { id: 'aff_12', name: 'Nordic Dome Glass Pendant Lights', category: 'Lighting', priceINR: 4899, materialStyle: 'Amber Tinted Glass & Gold Hardware', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=nordic+glass+pendant+lights&tag=auraspaceai-21', commissionRate: 0.06 },
  ],
  DEFAULT: [
    { id: 'aff_13', name: 'Designer Ergonomic Lounge Armchair', category: 'Furniture', priceINR: 18999, materialStyle: 'Boucle Fabric & Natural Birch Wood Frame', storeName: 'Urban Ladder', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=urbanladder+boucle+armchair', commissionRate: 0.07 },
    { id: 'aff_14', name: 'Nordic Geometric Side Table', category: 'Tables', priceINR: 4999, materialStyle: 'Black Powder-Coated Metal', storeName: 'Pepperfry', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=pepperfry+side+table+metal', commissionRate: 0.08 },
    { id: 'aff_15', name: 'Handcrafted Ceramic Vase Collection', category: 'Decor', priceINR: 1999, materialStyle: 'Glazed Stoneware Clay', storeName: 'Amazon India', affiliateUrl: 'https://www.amazon.in/s?k=ceramic+vase+decor&tag=auraspaceai-21', commissionRate: 0.06 },
    { id: 'aff_16', name: 'Warm LED Dimmable Accent Spotlights', category: 'Lighting', priceINR: 2499, materialStyle: 'Warm White 3000K Lumens', storeName: 'Home Centre', affiliateUrl: 'https://www.google.com/search?tbm=shop&q=home+centre+led+accent+light', commissionRate: 0.10 },
  ]
};

export interface AffiliateSaleRecord {
  id: string;
  productName: string;
  storeName: string;
  priceINR: number;
  commissionEarnedINR: number;
  buyerEmail: string;
  purchasedAt: string;
}

interface ProductBreakdownProps {
  roomType?: string;
  designStyle?: string;
  theme?: string;
  onAddToCart?: (items: ProductItem[]) => void;
  onBuyNow?: (items: ProductItem[]) => void;
}

export default function ProductBreakdown({ 
  roomType = 'LIVINGROOM', 
  designStyle = 'MODERN',
  theme,
  onAddToCart,
  onBuyNow
}: ProductBreakdownProps) {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const isProOrAbove = user && (
    isAdmin || 
    user.subscriptionPlan === 'Pro Plan' || 
    user.subscriptionPlan === 'Pro Creator' || 
    user.subscriptionPlan === 'Unlimited Agency' || 
    user.subscriptionPlan === 'Enterprise Admin'
  );

  // Pick theme-specific or room-specific products
  const normalizedTheme = theme?.toLowerCase();
  const products = (normalizedTheme && THEMED_PRODUCTS[normalizedTheme]) 
    ? THEMED_PRODUCTS[normalizedTheme]
    : (SAMPLE_PRODUCTS[roomType.toUpperCase()] || SAMPLE_PRODUCTS.DEFAULT);

  const [selectedIds, setSelectedIds] = useState<string[]>(products.map(p => p.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(products.map(p => p.id));
  const deselectAll = () => setSelectedIds([]);

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));
  const selectedTotal = selectedProducts.reduce((acc, p) => acc + p.priceINR, 0);

  const handleAffiliateClick = (item: ProductItem) => {
    setClickedItem(item.id);

    try {
      const commissionINR = Math.round(item.priceINR * item.commissionRate);
      const newRecord: AffiliateSaleRecord = {
        id: 'sale_' + Date.now().toString().slice(-6),
        productName: item.name,
        storeName: item.storeName,
        priceINR: item.priceINR,
        commissionEarnedINR: commissionINR,
        buyerEmail: user?.email || 'customer@auraspace.ai',
        purchasedAt: new Date().toISOString().split('T')[0],
      };

      const existingSales = JSON.parse(localStorage.getItem('auraspace_affiliate_sales') || '[]');
      localStorage.setItem('auraspace_affiliate_sales', JSON.stringify([newRecord, ...existingSales]));
    } catch (e) {
      console.error('Failed to log affiliate click', e);
    }

    setTimeout(() => setClickedItem(null), 3000);
  };

  // Locked state for Basic / Free Trial users
  if (!isProOrAbove) {
    return (
      <div className="mt-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/40 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 overflow-hidden shadow-sm relative">
        <div className="p-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-extrabold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Pro Plan Feature</span>
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Shop the Look & Product Price Description
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Item-by-item furniture pricing in ₹ INR, material specifications, and verified vendor store links (Pepperfry, Urban Ladder, Amazon India) are exclusively available for <strong>Pro Plan (₹1,999/mo)</strong> and <strong>Unlimited Agency</strong> subscribers.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Pro Plan (100 Creations & Pricing)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>🔒 Locked in Free Plan</span>
            <span>•</span>
            <span>Unlocks on Pro Plan (₹1,999/mo)</span>
            <span>•</span>
            <span>Includes 100 Creations</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/30 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 overflow-hidden shadow-lg transition-all w-full max-w-full min-w-0">
      {/* Card Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none border-b border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors flex-wrap sm:flex-nowrap min-w-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl shadow-md flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-black text-slate-900 dark:text-white">Shop the Look · Items & Pricing</h4>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-emerald-500" /> Direct Purchase Available
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {products.length} AI-Detected Furniture Items · Total Look: <strong className="text-indigo-600 dark:text-indigo-400">₹{selectedTotal.toLocaleString('en-IN')}</strong> ({selectedProducts.length} selected)
            </p>
          </div>
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Table */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-5 min-w-0 max-w-full">
          {/* Quick selection bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button 
                onClick={selectAll}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-bold whitespace-nowrap"
              >
                Select All ({products.length})
              </button>
              <span>•</span>
              <button 
                onClick={deselectAll}
                className="text-slate-400 hover:underline text-xs whitespace-nowrap"
              >
                Clear Selection
              </button>
            </div>
            <span className="text-[11px] text-slate-400">Select items to add to cart or purchase together</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 w-full max-w-full min-w-0">
            <table className="w-full text-left text-xs min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold bg-slate-50/70 dark:bg-slate-850/70 text-[11px]">
                  <th className="py-3 px-3 w-12 text-center">Select</th>
                  <th className="py-3 px-3 min-w-[170px]">Product Item</th>
                  <th className="py-3 px-3 min-w-[140px]">Material / Specs</th>
                  <th className="py-3 px-3 min-w-[100px]">Vendor Store</th>
                  <th className="py-3 px-3 text-right min-w-[90px]">Price (₹)</th>
                  <th className="py-3 px-3 text-center min-w-[100px]">Store Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {products.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} className={`hover:bg-indigo-50/40 dark:hover:bg-indigo-950/40 transition-colors ${isSelected ? 'bg-indigo-50/20 dark:bg-indigo-950/15' : ''}`}>
                      <td className="py-3.5 px-3 text-center">
                        <button 
                          onClick={() => toggleSelect(item.id)}
                          className="text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform inline-flex items-center justify-center"
                          aria-label={isSelected ? `Deselect ${item.name}` : `Select ${item.name}`}
                        >
                          {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white block leading-snug">{item.name}</span>
                            <span className="block text-[10px] font-normal text-slate-400 mt-0.5">{item.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{item.materialStyle}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold border border-slate-200 dark:border-slate-700 inline-block whitespace-nowrap">
                          {item.storeName}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-indigo-600 dark:text-indigo-400 text-sm whitespace-nowrap">
                        ₹{item.priceINR.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <a
                          href={item.affiliateUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => handleAffiliateClick(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-xs whitespace-nowrap ${
                            clickedItem === item.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {clickedItem === item.id ? (
                            <><CheckCircle2 className="w-3 h-3" /> Linked</>
                          ) : (
                            <>View Store <ExternalLink className="w-3 h-3" /></>
                          )}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Bar: Add to Cart & Purchase Products */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-indigo-800 w-full min-w-0">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">Selected Setup Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">₹{selectedTotal.toLocaleString('en-IN')}</span>
                <span className="text-xs text-indigo-200">({selectedProducts.length} items selected)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(selectedProducts)}
                  disabled={selectedProducts.length === 0}
                  className="flex-1 sm:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              )}

              {onBuyNow && (
                <button
                  onClick={() => onBuyNow(selectedProducts)}
                  disabled={selectedProducts.length === 0}
                  className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Purchase Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Turnkey Interior Consultation Partner Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Need Turnkey Installation for this Room?</p>
                <p className="text-slate-500 dark:text-slate-400">Book free site measurement & 3D planning with Livspace, HomeLane, or Design Cafe.</p>
              </div>
            </div>
            <Link
              href="/consultation"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

