'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, ChevronDown, ChevronUp, Tag, Sparkles, CheckCircle2, Building2, ArrowRight } from 'lucide-react';

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
}

export default function ProductBreakdown({ roomType = 'LIVINGROOM', designStyle = 'MODERN' }: ProductBreakdownProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const products = SAMPLE_PRODUCTS[roomType.toUpperCase()] || SAMPLE_PRODUCTS.DEFAULT;
  const totalPrice = products.reduce((acc, p) => acc + p.priceINR, 0);

  const handleAffiliateClick = (item: ProductItem) => {
    setClickedItem(item.id);

    // Track simulated affiliate sale in localStorage for Admin Dashboard analytics
    try {
      const commissionINR = Math.round(item.priceINR * item.commissionRate);
      const newRecord: AffiliateSaleRecord = {
        id: 'sale_' + Date.now().toString().slice(-6),
        productName: item.name,
        storeName: item.storeName,
        priceINR: item.priceINR,
        commissionEarnedINR: commissionINR,
        buyerEmail: 'customer@auraspace.ai',
        purchasedAt: new Date().toISOString().split('T')[0],
      };

      const existingSales = JSON.parse(localStorage.getItem('auraspace_affiliate_sales') || '[]');
      localStorage.setItem('auraspace_affiliate_sales', JSON.stringify([newRecord, ...existingSales]));
    } catch (e) {
      console.error('Failed to log affiliate click', e);
    }

    setTimeout(() => setClickedItem(null), 3000);
  };

  return (
    <div className="mt-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/30 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 overflow-hidden shadow-sm transition-all">
      {/* Card Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer select-none border-b border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Shop the Look & Product Specs</h4>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-500" /> Verified Partner Links
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {products.length} items detected · Total Setup: <strong className="text-indigo-600 dark:text-indigo-400">₹{totalPrice.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Table */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2 pl-2">Product Item</th>
                  <th className="pb-2">Material / Style</th>
                  <th className="pb-2">Partner Store</th>
                  <th className="pb-2 text-right pr-4">Price (₹)</th>
                  <th className="pb-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-colors group">
                    <td className="py-3 pl-2 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                      <div>
                        {item.name}
                        <span className="block text-[10px] font-normal text-slate-400">{item.category}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{item.materialStyle}</td>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                        {item.storeName}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-4 font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{item.priceINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-center">
                      <a
                        href={item.affiliateUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleAffiliateClick(item)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs ${
                          clickedItem === item.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
                        }`}
                      >
                        {clickedItem === item.id ? (
                          <><CheckCircle2 className="w-3 h-3" /> Tracked!</>
                        ) : (
                          <>Buy on {item.storeName} <ExternalLink className="w-3 h-3" /></>
                        )}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total summary bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-100/60 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Estimated Total Room Setup Cost ({designStyle.charAt(0) + designStyle.slice(1).toLowerCase()} Style)
            </span>
            <span className="font-extrabold text-sm text-indigo-700 dark:text-indigo-300">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Turnkey Interior Consultation Partner Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 border border-indigo-800 shadow-md">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Want turnkey execution for this {roomType.toLowerCase()} design?</p>
                <p className="text-[11px] text-indigo-200">Collab with top studios (Livspace, HomeLane, Design Cafe) for free site measurement & customized 3D plan.</p>
              </div>
            </div>
            <Link
              href="/consultation"
              className="flex-shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
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
