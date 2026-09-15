'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Loader2, UploadCloud, X, Box, Wand2, ImageIcon, CheckCircle2, 
  ArrowRight, Trash2, Download, Zap, Sparkles, Star, Lock, 
  SlidersHorizontal, Palette, User, Layers, CheckSquare, Square, 
  ShoppingCart, CreditCard, ChevronDown, ChevronUp, RefreshCw,
  Eye, Tag, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CompareSlider from '../../components/CompareSlider';
import AnimateIn from '../../components/AnimateIn';
import ProductBreakdown, { ProductItem } from '../../components/ProductBreakdown';
import DownloadLockModal from '../../components/DownloadLockModal';
import PaymentModal, { PlanDetails } from '../../components/PaymentModal';
import PurchaseModal from '../../components/PurchaseModal';

// 1. Space Types
const SPACE_TYPES = [
  { id: 'LIVINGROOM', label: 'Living Room', icon: '🛋️' },
  { id: 'BEDROOM', label: 'Master Bedroom', icon: '🛏️' },
  { id: 'GAMING_ROOM', label: 'Gaming Battlestation', icon: '🎮' },
  { id: 'OFFICE', label: 'Home Office / Study', icon: '💼' },
  { id: 'DININGROOM', label: 'Dining Room', icon: '🍽️' },
  { id: 'KITCHEN', label: 'Kitchen & Island', icon: '🍳' },
  { id: 'BALCONY_PATIO', label: 'Balcony / Patio', icon: '🌿' },
  { id: 'BATHROOM', label: 'Luxury Bathroom', icon: '🛁' },
];

// 2. Room Sizes
const ROOM_SIZES = [
  { id: 'compact', label: 'Compact Studio', desc: '< 150 sq.ft' },
  { id: 'medium', label: 'Standard Medium', desc: '150 – 250 sq.ft' },
  { id: 'large', label: 'Spacious Large', desc: '250 – 400 sq.ft' },
  { id: 'luxury', label: 'Luxury Penthouse', desc: '400+ sq.ft' },
];

// 3. Design Styles
const DESIGN_STYLES = [
  { id: 'MODERN', label: 'Modern Minimalist' },
  { id: 'SCANDINAVIAN', label: 'Scandinavian' },
  { id: 'CONTEMPORARY', label: 'Luxury Contemporary' },
  { id: 'INDUSTRIAL', label: 'Industrial Loft' },
  { id: 'JAPANDI', label: 'Japandi Calm' },
  { id: 'BOHO', label: 'Bohemian Chic' },
  { id: 'FARMHOUSE', label: 'Modern Farmhouse' },
  { id: 'TRADITIONAL', label: 'Traditional Heritage' },
];

// 4. Color Palettes
const COLOR_PALETTES = [
  { id: 'warm_neutrals', name: 'Warm Neutrals & Cream', hex: '#D7C4B7', border: '#BFA899' },
  { id: 'emerald_gold', name: 'Emerald Green & Gold', hex: '#065F46', border: '#D97706' },
  { id: 'charcoal_brass', name: 'Moody Charcoal & Brass', hex: '#1E293B', border: '#F59E0B' },
  { id: 'royal_blue', name: 'Royal Blue & Silver', hex: '#1E40AF', border: '#94A3B8' },
  { id: 'terracotta', name: 'Earthy Terracotta & Clay', hex: '#C2410C', border: '#EA580C' },
  { id: 'cyber_neon', name: 'Cyberpunk Neon Glow', hex: '#A855F7', border: '#06B6D4' },
  { id: 'pastel_dream', name: 'Pastel Dream', hex: '#F472B6', border: '#C084FC' },
  { id: 'monochrome', name: 'Monochrome Slate', hex: '#475569', border: '#64748B' },
];

// 5. Thematic Personalities (Ronaldo, Messi, Marvel, Anime, F1, etc.)
export interface ThemeOption {
  id: string;
  name: string;
  icon: string;
  badge: string;
  description: string;
  promptSnippet: string;
  accentColor: string;
  suggestedItems: string[];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'none',
    name: 'Standard Design (No Thematic Overlay)',
    icon: '✨',
    badge: 'Neutral Elegance',
    description: 'Classic architectural styling based strictly on selected room style and colors.',
    promptSnippet: '',
    accentColor: '#6366F1',
    suggestedItems: ['L-Shaped Velvet Sectional', 'Solid Oak Coffee Table', 'Indoor Fiddle Leaf Fig Plants']
  },
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo (CR7)',
    icon: '⚽',
    badge: 'Athletic Luxury',
    description: 'Sleek black & champagne gold trims, framed signed CR7 jersey, trophy showcase, athletic luxury lounge.',
    promptSnippet: 'Cristiano Ronaldo CR7 athletic luxury modern interior, sleek matte black and champagne gold trims, framed signed CR7 football jersey wall art, modern trophy display case, minimalist premium lounge furniture, cinematic warm ambient lighting',
    accentColor: '#EAB308',
    suggestedItems: ['L-Shaped Velvet Sectional', 'Floating Bookshelf & Trophy Display', 'Smart RGB Ambient LED Strip', 'Framed Themed Wall Art & Posters']
  },
  {
    id: 'messi',
    name: 'Lionel Messi (GOAT)',
    icon: '🐐',
    badge: 'Golden Elegance',
    description: 'Ballon d\'Or gold luxury, soft Albiceleste sky-blue & white palette, iconic champion #10 jersey wall art.',
    promptSnippet: 'Lionel Messi inspired modern luxury interior, Ballon d\'Or golden elegance, soft Albiceleste sky blue and clean white palette, framed world champion #10 jersey, modern Italian marble coffee table, refined lounge aesthetic',
    accentColor: '#38BDF8',
    suggestedItems: ['L-Shaped Velvet Sectional', 'Solid Oak Coffee Table', 'Wall-Mounted 4K OLED TV', 'Framed Themed Wall Art & Posters']
  },
  {
    id: 'marvel',
    name: 'Marvel Universe & Stark Tech',
    icon: '🦸',
    badge: 'Cyber Sci-Fi',
    description: 'Stark Industries high-tech cyberpunk styling, Avengers holographic artwork, Arc Reactor glowing ambient LED illumination.',
    promptSnippet: 'Marvel Cinematic Universe high-tech luxury interior, Stark Industries futuristic design, glowing Arc Reactor ambient lighting, Avengers themed metallic wall art, sleek modern ergonomic battlestation, deep charcoal and crimson accents',
    accentColor: '#EF4444',
    suggestedItems: ['Carbon Fiber Gaming/Work Desk', 'Ergonomic Racing Chair', 'Smart RGB Ambient LED Strip', 'Wall-Mounted 4K OLED TV']
  },
  {
    id: 'anime',
    name: 'Anime & Otaku Lounge',
    icon: '🎌',
    badge: 'Neo-Tokyo & Ghibli',
    description: 'Neo-Tokyo cyberpunk vibe, illuminated Manga display wall, Studio Ghibli botanical warmth, RGB lightbars.',
    promptSnippet: 'Neo-Tokyo anime inspired modern aesthetic room, illuminated manga bookshelf collection, Studio Ghibli cozy botanical plants, glowing neon kanji wall art, modern low-profile platform sofa, diffused pastel and cyberpunk ambient lighting',
    accentColor: '#EC4899',
    suggestedItems: ['Floating Bookshelf & Trophy Display', 'Smart RGB Ambient LED Strip', 'Indoor Fiddle Leaf Fig Plants', 'Custom Neon Signature Sign']
  },
  {
    id: 'f1',
    name: 'Formula 1 Racing (F1)',
    icon: '🏎️',
    badge: 'Pitlane Speed Luxe',
    description: 'Pitlane motorsport modern architecture, carbon fiber desks & trims, race track circuit wall art, Pirelli tire table.',
    promptSnippet: 'Formula 1 motorsport racing themed luxury room, genuine carbon fiber accents and desk finishes, iconic Monaco and Silverstone racetrack LED wall art, Alcantara and leather bucket seating, high-octane speed aesthetic, modern architectural lighting',
    accentColor: '#F97316',
    suggestedItems: ['Carbon Fiber Gaming/Work Desk', 'Ergonomic Racing Chair', 'Smart RGB Ambient LED Strip', 'Framed Themed Wall Art & Posters']
  },
  {
    id: 'classic_luxury',
    name: 'Classic Penthouse Luxury',
    icon: '🏛️',
    badge: 'Timeless Opulence',
    description: 'Italian marble, crystal chandelier, warm cove lighting, tailored European upholstery.',
    promptSnippet: 'High-end luxury penthouse interior, Italian Calacatta marble, bespoke velvet furniture, warm architectural cove lighting, elegant contemporary detailing',
    accentColor: '#D97706',
    suggestedItems: ['L-Shaped Velvet Sectional', 'Solid Oak Coffee Table', 'Arc Floor Lamp', 'Geometric Plush Area Rug']
  },
  {
    id: 'zen_sanctuary',
    name: 'Zen Nature Sanctuary',
    icon: '🌿',
    badge: 'Organic Serenity',
    description: 'Natural bamboo, cascading indoor planters, stone water elements, peaceful meditation minimalism.',
    promptSnippet: 'Zen Japandi nature sanctuary, organic light oak wood and bamboo, lush indoor fiddle leaf fig planters, minimalist floating furniture, soothing natural sunlight',
    accentColor: '#10B981',
    suggestedItems: ['Solid Oak Coffee Table', 'Indoor Fiddle Leaf Fig Plants', 'Geometric Plush Area Rug', 'Arc Floor Lamp']
  }
];

// 6. Furniture & Decor Checklist
const FURNITURE_OPTIONS = [
  'L-Shaped Velvet Sectional',
  'Carbon Fiber Gaming/Work Desk',
  'Ergonomic Racing Chair',
  'Solid Oak Coffee Table',
  'Floating Bookshelf & Trophy Display',
  'King Size Platform Bed',
  'Minimalist Dining Set',
  'Designer Lounge Armchair'
];

const DECOR_OPTIONS = [
  'Smart RGB Ambient LED Strip',
  'Framed Themed Wall Art & Posters',
  'Indoor Fiddle Leaf Fig Plants',
  'Geometric Plush Area Rug',
  'Arc Floor Lamp',
  'Wall-Mounted 4K OLED TV',
  'Custom Neon Signature Sign',
  'Floating LED Glass Shelves'
];

// 7. Custom Materials & Finishes
const MATERIALS = ['Italian Velvet', 'Solid Oak Wood', 'Carbon Fiber', 'Brushed Brass', 'Matte Steel', 'Top-Grain Leather'];
const FINISHES = ['Matte Black', 'Warm Walnut', 'Polished Chrome', 'Champagne Gold', 'Raw Concrete', 'Natural Birch'];

interface GenerationEntry {
  id: string;
  originalImage: string;
  generatedUrl: string;
  roomType: string;
  designStyle: string;
  theme: string;
  prompt: string;
  isNew: boolean;
}

// Compress base64 images to lightweight thumbnails (<25KB)
const compressImageDataUrl = (dataUrl: string, maxDim = 500, quality = 0.65): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

export default function VirtualStagingPage() {
  const { user, deductCredit, upgradePlan, isAdmin } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [showDownloadLock, setShowDownloadLock] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PlanDetails | null>(null);

  const isProOrAbove = user && (
    isAdmin || 
    user.subscriptionPlan === 'Pro Plan' || 
    user.subscriptionPlan === 'Pro Creator' || 
    user.subscriptionPlan === 'Unlimited Agency' || 
    user.subscriptionPlan === 'Enterprise Admin'
  );

  // 11 Core Steps State
  const [spaceType, setSpaceType] = useState(SPACE_TYPES[0].id);
  const [roomSize, setRoomSize] = useState(ROOM_SIZES[1].id);
  const [designStyle, setDesignStyle] = useState(DESIGN_STYLES[0].id);
  const [colorPalette, setColorPalette] = useState(COLOR_PALETTES[0].id);
  const [selectedTheme, setSelectedTheme] = useState('none');
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>(['L-Shaped Velvet Sectional', 'Solid Oak Coffee Table']);
  const [selectedDecor, setSelectedDecor] = useState<string[]>(['Smart RGB Ambient LED Strip', 'Framed Themed Wall Art & Posters']);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [finish, setFinish] = useState(FINISHES[0]);
  const [customNotes, setCustomNotes] = useState('');

  // Cart & Purchase State (Steps 10 & 11)
  const [cartItems, setCartItems] = useState<ProductItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState<ProductItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const ESTIMATED_SECONDS = 30;

  useEffect(() => {
    let interval: any;
    if (loading) {
      setElapsed(0);
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const [activeEntry, setActiveEntry] = useState<GenerationEntry | null>(null);
  const [history, setHistory] = useState<GenerationEntry[]>([]);

  // Load history & URL param on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('decor8ai_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({ ...item, isNew: false })));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('inputImageUrl');
      if (urlParam) {
        setInputImageUrl(urlParam);
        setPreviewUrl(null);
        setFile(null);
        setToastMessage('Image loaded as input photo for virtual staging!');
        setTimeout(() => setToastMessage(null), 3500);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('decor8ai_history', JSON.stringify(history));
      } catch (e) {
        console.error('Failed to save history', e);
      }
    }
  }, [history]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentOriginal = previewUrl || inputImageUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setInputImageUrl('');
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleFurniture = (item: string) => {
    setSelectedFurniture(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const toggleDecor = (item: string) => {
    setSelectedDecor(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    const themeObj = THEME_OPTIONS.find(t => t.id === themeId);
    if (themeObj && themeObj.suggestedItems.length > 0) {
      // Auto-suggest furniture
      setSelectedFurniture(prev => Array.from(new Set([...prev, ...themeObj.suggestedItems])));
    }
  };

  // Build the complete combined AI prompt from the 8 specification steps
  const buildCombinedPrompt = (): string => {
    const parts: string[] = [];
    
    // Space & Size
    const spaceLabel = SPACE_TYPES.find(s => s.id === spaceType)?.label || spaceType;
    const sizeLabel = ROOM_SIZES.find(s => s.id === roomSize)?.label || roomSize;
    const styleLabel = DESIGN_STYLES.find(s => s.id === designStyle)?.label || designStyle;
    const colorObj = COLOR_PALETTES.find(c => c.id === colorPalette);
    
    parts.push(`${styleLabel} ${spaceLabel} (${sizeLabel})`);

    if (colorObj) {
      parts.push(`Color palette: ${colorObj.name}`);
    }

    // Theme overlay (Ronaldo, Messi, Marvel, Anime, F1)
    const themeObj = THEME_OPTIONS.find(t => t.id === selectedTheme);
    if (themeObj && themeObj.promptSnippet) {
      parts.push(`Theme & Personality: ${themeObj.promptSnippet}`);
    }

    // Furniture & Decor
    if (selectedFurniture.length > 0) {
      parts.push(`Key furniture: ${selectedFurniture.join(', ')}`);
    }
    if (selectedDecor.length > 0) {
      parts.push(`Decorations: ${selectedDecor.join(', ')}`);
    }

    // Material & Finish
    parts.push(`Primary material: ${material}, Finish: ${finish}`);

    // Custom personalized user notes (Step 8)
    if (customNotes.trim()) {
      parts.push(`Personalized details: ${customNotes.trim()}`);
    }

    return parts.join('. ') + '.';
  };

  // Cart Management
  const handleAddToCart = (items: ProductItem[]) => {
    setCartItems(prev => {
      const newItems = items.filter(item => !prev.some(p => p.id === item.id));
      const updated = [...prev, ...newItems];
      // Sync to localStorage so Header cart stays updated
      try {
        localStorage.setItem('auraspace_cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('auraspace_cart_updated'));
      } catch (e) {
        console.error('Failed to sync cart', e);
      }
      return updated;
    });
    setToastMessage(`Added ${items.length} items to cart!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Direct Purchase
  const handleBuyNow = (items: ProductItem[]) => {
    setPurchaseItems(items);
    setIsPurchaseOpen(true);
  };

  const cartTotalINR = cartItems.reduce((acc, p) => acc + p.priceINR, 0);

  const handleDownload = async (url: string, filename = 'auraspace-staged-design.png') => {
    if (!isProOrAbove) {
      setShowDownloadLock(true);
      return;
    }
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleDeleteEntry = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      if (updated.length > 0) {
        localStorage.setItem('decor8ai_history', JSON.stringify(updated));
      } else {
        localStorage.removeItem('decor8ai_history');
      }
      return updated;
    });

    if (activeEntry?.id === id) {
      setActiveEntry(null);
    }
  };

  const handleUseAsInput = (url: string) => {
    setInputImageUrl(url);
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setToastMessage('Generated design loaded as input photo for restaging!');
    setTimeout(() => setToastMessage(null), 3500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !inputImageUrl) {
      setError('Please provide a room image file or URL first (Upload Room Photo)');
      return;
    }

    if (user && user.creditsRemaining <= 0) {
      setError('You have used all 3 free trial image creations. Please upgrade to Pro Plan (₹1,999/mo) to generate more images.');
      return;
    }

    setLoading(true);
    setError('');

    setHistory(prev => prev.map(h => ({ ...h, isNew: false })));

    try {
      const combinedPrompt = buildCombinedPrompt();

      const formData = new FormData();
      if (file) formData.append('image', file);
      else formData.append('inputImageUrl', inputImageUrl);

      formData.append('roomType', spaceType);
      formData.append('designStyle', designStyle);
      formData.append('numImages', '1');
      formData.append('prompt', combinedPrompt);

      const res = await fetch('/api/virtual-staging', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to generate virtual staging');

      const images: any[] = data.images || [];
      if (!images.length) throw new Error('No images returned. Try a different photo or style.');

      // Deduct credit
      deductCredit();

      let storedOriginal = currentOriginal;
      if (storedOriginal && storedOriginal.startsWith('data:')) {
        storedOriginal = await compressImageDataUrl(storedOriginal, 500, 0.65);
      }

      const newEntry: GenerationEntry = {
        id: Date.now().toString(),
        originalImage: storedOriginal || images[0].url,
        generatedUrl: images[0].url,
        roomType: spaceType,
        designStyle,
        theme: selectedTheme,
        prompt: combinedPrompt,
        isNew: true,
      };

      try {
        const existing = localStorage.getItem('decor8ai_history');
        const list = existing ? JSON.parse(existing) : [];
        const updated = [newEntry, ...list.filter((x: any) => x.id !== newEntry.id)];
        localStorage.setItem('decor8ai_history', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync staging to localStorage', err);
      }

      setHistory(prev => [newEntry, ...prev]);
      setActiveEntry(newEntry);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeThemeObj = THEME_OPTIONS.find(t => t.id === selectedTheme) || THEME_OPTIONS[0];

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Purchase & Checkout Modal */}
      <PurchaseModal
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        items={purchaseItems}
        totalINR={purchaseItems.reduce((acc, p) => acc + p.priceINR, 0)}
        roomTheme={activeThemeObj.name}
      />

      {/* Download Lock Modal */}
      <DownloadLockModal
        isOpen={showDownloadLock}
        onClose={() => setShowDownloadLock(false)}
        onUpgradeClick={() => {
          setPaymentPlan({
            name: 'Pro Plan',
            price: '₹1,999',
            rawPrice: 1999,
            credits: 100,
            creditsLabel: '100 AI Image Generations / month',
          });
        }}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={!!paymentPlan}
        onClose={() => setPaymentPlan(null)}
        plan={paymentPlan}
        onSuccess={(planName, creditsLimit) => {
          upgradePlan(planName, creditsLimit);
        }}
      />

      {/* Main Studio Row */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] w-full max-w-full min-w-0">

        {/* Left Column: 11-Step Interactive Form */}
        <AnimateIn from="left" className="w-full lg:w-[460px] flex-shrink-0 min-w-0">
          <div className="mb-6">
            <a href="/" className="inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
              Back to Home
            </a>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                <span>Virtual Staging Studio</span>
              </h1>
              <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                11 Steps
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Customize space, themes (Ronaldo, Messi, Marvel, Anime, F1), materials & buy products.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">

            {/* Upload Area */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                  Upload Room Photo
                </label>
                <span className="text-[11px] text-slate-400">Empty or furnished photo</span>
              </div>

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 rounded-full shadow-sm backdrop-blur-sm z-10 transition-transform hover:scale-105"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="w-full aspect-[4/3] object-cover" />
                </div>
              ) : inputImageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setInputImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 rounded-full shadow-sm backdrop-blur-sm z-10 transition-transform hover:scale-105"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={inputImageUrl} alt="Input URL" className="w-full aspect-[4/3] object-cover" />
                </div>
              ) : (
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 border-dashed transition-colors group-hover:border-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40"></div>
                  <div className="relative px-4 py-8 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                      <UploadCloud className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Click to upload room photo</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            {/* STEP 1: Select Type of Space */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">1</span>
                <span>Select Type of Space</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SPACE_TYPES.map(space => (
                  <button
                    key={space.id}
                    type="button"
                    onClick={() => setSpaceType(space.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex flex-col justify-between transition-all ${
                      spaceType === space.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">{space.icon}</span>
                    <span className="truncate mt-1">{space.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Select Room/Space Size */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">2</span>
                <span>Select Room Size</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROOM_SIZES.map(size => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setRoomSize(size.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      roomSize === size.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="font-bold">{size.label}</p>
                    <p className="text-[10px] text-slate-400">{size.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: Select Design Style */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">3</span>
                <span>Select Design Style</span>
              </label>
              <select 
                value={designStyle} 
                onChange={(e) => setDesignStyle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-xs font-semibold outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {DESIGN_STYLES.map(style => (
                  <option key={style.id} value={style.id} className="dark:bg-slate-900">
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            {/* STEP 4: Select Favorite Colors */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">4</span>
                <span>Select Color Palette</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PALETTES.map(color => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setColorPalette(color.id)}
                    className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                      colorPalette === color.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs" 
                      style={{ backgroundColor: color.hex, border: `2px solid ${color.border}` }}
                    />
                    <span className="truncate text-[11px]">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 5: Select Theme / Personality (Ronaldo, Messi, Marvel, Anime, F1) */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/60 dark:from-slate-850 dark:via-slate-900 dark:to-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">5</span>
                  <span>Select Theme / Personality</span>
                </label>
                <span className="text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">
                  Featured
                </span>
              </div>

              <select
                value={selectedTheme}
                onChange={(e) => handleThemeSelect(e.target.value)}
                className="w-full rounded-xl border-2 border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs font-bold outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                {THEME_OPTIONS.map(theme => (
                  <option key={theme.id} value={theme.id} className="dark:bg-slate-900">
                    {theme.icon} {theme.name} ({theme.badge})
                  </option>
                ))}
              </select>

              {/* Theme Details Preview Card */}
              {selectedTheme !== 'none' && (
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 text-xs space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{activeThemeObj.icon}</span>
                      <span>{activeThemeObj.name}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white bg-indigo-600">
                      {activeThemeObj.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {activeThemeObj.description}
                  </p>
                </div>
              )}
            </div>

            {/* STEP 6: Add/Remove Furniture & Decorations */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">6</span>
                <span>Add / Remove Furniture & Decor</span>
              </label>

              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">Key Furniture:</p>
                <div className="flex flex-wrap gap-1.5">
                  {FURNITURE_OPTIONS.map(item => {
                    const isSelected = selectedFurniture.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleFurniture(item)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-3 h-3" /> : '+'}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">Decorations & Accents:</p>
                <div className="flex flex-wrap gap-1.5">
                  {DECOR_OPTIONS.map(item => {
                    const isSelected = selectedDecor.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleDecor(item)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-violet-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-3 h-3" /> : '+'}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 7: Customize Individual Products */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">7</span>
                <span>Customize Materials & Finishes</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Primary Material</span>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-semibold outline-none"
                  >
                    {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Hardware Finish</span>
                  <select
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-semibold outline-none"
                  >
                    {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 8: Add Personalized Designs */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">8</span>
                <span>Add Personalized Designs & Custom Notes</span>
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Add glowing neon wall art with 'CR7', custom ambient cove lighting, and floating shelves."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3.5 py-2.5 text-xs outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Generate Button (Executes Staging & Previews Step 9) */}
            <button
              type="submit"
              disabled={loading || (!file && !inputImageUrl)}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Synthesizing 11-Step Design...</>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  <span>Generate Complete Virtual Staging (1 Credit)</span>
                </>
              )}
            </button>
          </form>
        </AnimateIn>

        {/* Right Column: STEP 9 Preview & Compare Slider + STEP 10 & 11 Products */}
        <AnimateIn from="right" delay={200} className="flex-1 min-w-0 w-full">
          <div className="h-full min-h-[500px] w-full max-w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 flex flex-col min-w-0 overflow-hidden">
            
            {!activeEntry && !error && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="max-w-sm space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">Step 9: Interactive Preview</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Ready for Virtual Staging</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upload your room photo, select your theme ({activeThemeObj.name}), adjust furniture & materials, then click Generate to preview Before/After results.
                  </p>
                </div>
              </div>
            )}

            {/* Precision Loading Meter */}
            {loading && (() => {
              const radius = 54;
              const circumference = 2 * Math.PI * radius;
              let progressPercent = 0;
              let currentStepText = 'Analyzing space geometry & floor dimensions...';

              if (elapsed <= 5) {
                progressPercent = Math.round((elapsed / 5) * 20);
                currentStepText = `Analyzing room geometry & ${activeThemeObj.name} aesthetic...`;
              } else if (elapsed <= 12) {
                progressPercent = Math.round(20 + ((elapsed - 5) / 7) * 25);
                currentStepText = 'Synthesizing furniture pieces, materials & lighting...';
              } else if (elapsed <= 22) {
                progressPercent = Math.round(45 + ((elapsed - 12) / 10) * 35);
                currentStepText = 'Rendering textures, shadows & photorealistic depth...';
              } else if (elapsed <= 30) {
                progressPercent = Math.round(80 + ((elapsed - 22) / 8) * 15);
                currentStepText = 'Finalizing HD photorealistic details & product tags...';
              } else {
                progressPercent = Math.min(99, 95 + Math.round((elapsed - 30) / 2));
                currentStepText = 'Packaging high-res staging output...';
              }

              const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
              const remainingSeconds = Math.max(0, ESTIMATED_SECONDS - elapsed);

              return (
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-md mx-auto w-full">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r={radius} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                      <defs>
                        <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <circle cx="64" cy="64" r={radius} stroke="url(#circleGrad)" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-700 ease-out" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{progressPercent}%</span>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-0.5">
                        {remainingSeconds > 0 ? `~${remainingSeconds}s left` : 'Finalizing'}
                      </span>
                    </div>
                  </div>

                  <div className="text-center space-y-2 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                      </span>
                      <span>{currentStepText}</span>
                    </div>
                    <p className="text-xs text-slate-400">Applying {activeThemeObj.name} Theme Overlay</p>
                  </div>
                </div>
              );
            })()}

            {/* Error Message Display */}
            {error && (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                {error.includes('free trial') || error.includes('credit') ? (
                  <div className="max-w-md w-full p-6 sm:p-8 bg-gradient-to-b from-indigo-50/90 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 text-center shadow-xl space-y-5">
                    <div className="relative mx-auto w-14 h-14 bg-gradient-to-tr from-amber-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                      <Zap className="w-7 h-7 fill-white" />
                    </div>
                    <div className="space-y-2">
                      <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-extrabold uppercase rounded-full border border-amber-200 dark:border-amber-800">
                        Credits Exhausted
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Unlock More AI Designs
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        You&apos;ve enjoyed your 3 free creations! Upgrade to the <strong>Pro Plan (₹1,999/mo)</strong> to unlock 100 monthly renders, priority speed, and unlimited downloads.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        href="/pricing"
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Upgrade Plan (₹1,999/mo)</span>
                      </Link>
                      <button
                        onClick={() => setError('')}
                        className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md p-6 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900 text-center space-y-2">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{error}</p>
                    <button onClick={() => setError('')} className="text-xs font-bold text-indigo-600 hover:underline pt-1">Try again</button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 9: Before / After Preview */}
            {activeEntry && !loading && (
              <div className="flex flex-col h-full space-y-4 min-w-0 w-full max-w-full">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 w-full min-w-0">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
                      Step 9: Before & After Preview
                    </span>
                    {activeEntry.theme && activeEntry.theme !== 'none' && (
                      <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full uppercase border border-amber-200 dark:border-amber-800 whitespace-nowrap">
                        {THEME_OPTIONS.find(t => t.id === activeEntry.theme)?.name || activeEntry.theme}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleUseAsInput(activeEntry.generatedUrl)}
                      title="Use this generated design as input photo"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs whitespace-nowrap"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Use as Input</span>
                    </button>
                    {/* Primary Download Action Button */}
                    <button
                      onClick={() => handleDownload(activeEntry.generatedUrl, `auraspace-staged-${activeEntry.roomType.toLowerCase()}-${Date.now()}.png`)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <CompareSlider
                    originalImage={activeEntry.originalImage}
                    stagedImage={activeEntry.generatedUrl}
                  />
                  <p className="text-center text-slate-400 text-xs">Drag slider to compare Before & After · Double click for fullscreen</p>

                  {/* STEP 10 & 11: Shop the Look & Purchase Breakdown */}
                  <ProductBreakdown 
                    roomType={activeEntry.roomType} 
                    designStyle={activeEntry.designStyle}
                    theme={activeEntry.theme}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                </div>
              </div>
            )}
          </div>
        </AnimateIn>
      </div>

      {/* Bottom: Latest Generated Result */}
      {history.length > 0 && (
        <AnimateIn from="bottom" delay={300} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Latest Generated Design</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your most recent virtual staging result</p>
            </div>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-slate-700"
            >
              <span>View All ({history.length}) Saved Designs in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-8">
            {history.slice(0, 1).map((entry) => (
              <div key={entry.id}
                className="rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-5 space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 text-xs font-bold rounded-full">
                      Latest
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {entry.roomType.charAt(0) + entry.roomType.slice(1).toLowerCase()} · {entry.designStyle.charAt(0) + entry.designStyle.slice(1).toLowerCase()}
                    </span>
                    {entry.prompt && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-xs">"{entry.prompt}"</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveEntry(entry)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeEntry?.id === entry.id ? 'bg-slate-900 dark:bg-slate-700 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                      {activeEntry?.id === entry.id
                        ? <><CheckCircle2 className="w-3.5 h-3.5" /> In Slider</>
                        : 'View in Slider'}
                    </button>
                    <button
                      onClick={() => handleUseAsInput(entry.generatedUrl)}
                      title="Use this generated design as input photo"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs">
                      <ArrowRight className="w-3.5 h-3.5" /> Use as Input
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      title="Delete from history"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                {/* Full Before & After Images */}
                {entry.originalImage && entry.originalImage !== entry.generatedUrl ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Before</p>
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={entry.originalImage} alt="Before" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">After</p>
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={entry.generatedUrl} alt="After" className="w-full h-full object-cover cursor-zoom-in" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">Generated Design</p>
                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.generatedUrl} alt="Generated Design" className="w-full h-full object-cover cursor-zoom-in" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimateIn>
      )}
    </div>
  );
}
