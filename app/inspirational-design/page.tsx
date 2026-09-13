'use client';

import { useState, useEffect } from 'react';
import { Loader2, Wand2, Sparkles, X, ImageIcon, CheckCircle2, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimateIn from '../../components/AnimateIn';
import ProductBreakdown from '../../components/ProductBreakdown';

import { useSearchParams } from 'next/navigation';

const ROOM_TYPES = ['LIVINGROOM', 'BEDROOM', 'KITCHEN', 'BATHROOM', 'OFFICE', 'DININGROOM', 'SUNROOM', 'FAMILYROOM'];
const DESIGN_STYLES = ['MODERN', 'MINIMALIST', 'SCANDINAVIAN', 'INDUSTRIAL', 'CONTEMPORARY', 'FARMHOUSE', 'BOHO', 'TRADITIONAL'];

interface InspirationEntry {
  id: string;
  generatedUrl: string;
  roomType: string;
  designStyle: string;
  prompt: string;
  isNew: boolean;
}

export default function InspirationalDesignPage() {
  const { user, deductCredit } = useAuth();
  const searchParams = useSearchParams();
  const roomParam = searchParams.get('room')?.toUpperCase();
  const initialRoom = ROOM_TYPES.includes(roomParam || '') ? (roomParam as string) : ROOM_TYPES[0];

  const [roomType, setRoomType] = useState(initialRoom);
  const [designStyle, setDesignStyle] = useState(DESIGN_STYLES[0]);
  const [prompt, setPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activeEntry, setActiveEntry] = useState<InspirationEntry | null>(null);
  const [history, setHistory] = useState<InspirationEntry[]>([]);

  // Sync roomType if room parameter in URL changes
  useEffect(() => {
    if (roomParam && ROOM_TYPES.includes(roomParam)) {
      setRoomType(roomParam);
    }
  }, [roomParam]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('decor8ai_inspirational_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({ ...item, isNew: false })));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('decor8ai_inspirational_history', JSON.stringify(history));
    }
  }, [history]);

  const handleDeleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      if (updated.length > 0) {
        localStorage.setItem('decor8ai_inspirational_history', JSON.stringify(updated));
      } else {
        localStorage.removeItem('decor8ai_inspirational_history');
      }
      return updated;
    });

    if (activeEntry?.id === id) {
      setActiveEntry(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user && user.creditsRemaining <= 0) {
      setError('You have used all 3 free trial image creations. Please upgrade to Pro Plan (₹1,999/mo) to generate more images.');
      return;
    }

    setLoading(true);
    setError('');

    setHistory(prev => prev.map(h => ({ ...h, isNew: false })));

    try {
      const res = await fetch('/api/inspirational-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomType, 
          designStyle, 
          prompt: prompt.trim() || undefined,
          numImages: 1 
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to generate');
      
      const images = data.images || [];
      if (!images.length) throw new Error('No images returned. Try a different style.');

      const newEntry: InspirationEntry = {
        id: Date.now().toString(),
        generatedUrl: images[0].url,
        roomType,
        designStyle,
        prompt: prompt.trim(),
        isNew: true,
      };

      deductCredit();
      setHistory(prev => [newEntry, ...prev]);
      setActiveEntry(newEntry);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Main Row: Controls + Concept Display */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[550px]">
        
        {/* Left Column: Controls (Slide Left to Right using AnimateIn) */}
        <AnimateIn from="left" className="w-full lg:w-[400px] flex-shrink-0">
          <div className="mb-8">
            <a href="/" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Home
            </a>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-violet-600 dark:text-violet-400" />
              Inspirational Design
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Generate stunning interior concepts from scratch.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block mb-2">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                >
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type} className="text-slate-900 dark:text-slate-100 dark:bg-slate-900">{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block mb-2">Design Style</label>
                <select
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                >
                  {DESIGN_STYLES.map((style) => (
                    <option key={style} value={style} className="text-slate-900 dark:text-slate-100 dark:bg-slate-900">{style.charAt(0) + style.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Generating Image...</>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" /> Generate Image
                  <span className="ml-1 text-xs opacity-70">
                    (1 Credit)
                  </span>
                </>
              )}
            </button>
          </form>
        </AnimateIn>

        {/* Right Column: Output Preview (Slide Right to Left using AnimateIn) */}
        <AnimateIn from="right" delay={200} className="flex-1">
          <div className="h-full min-h-[500px] w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
            
            {!activeEntry && !error && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-500 dark:text-slate-400">Ready to design</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Select your preferences and click generate.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-violet-100 dark:border-violet-950 border-t-violet-600 animate-spin"></div>
                <p className="font-medium text-slate-600 dark:text-slate-300 animate-pulse">Dreaming up your concept...</p>
              </div>
            )}

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="max-w-md p-6 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-100 dark:border-red-900 text-center space-y-2">
                  <X className="w-8 h-8 text-red-500 mx-auto" />
                  <h3 className="font-semibold text-red-800 dark:text-red-300">Generation Failed</h3>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {activeEntry && !loading && (
              <div className="space-y-6 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your AI Concept</h3>
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-900">
                    Ready
                  </span>
                </div>
                
                <div className="flex-1 flex justify-center items-center">
                  <div className="w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-violet-200 dark:border-violet-900 shadow-md relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={activeEntry.generatedUrl} alt="Concept" className="w-full h-full object-cover" />
                    
                    {/* Download overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={activeEntry.generatedUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                </div>

                {/* Product & Price Details Component */}
                <ProductBreakdown roomType={activeEntry.roomType} designStyle={activeEntry.designStyle} />
              </div>
            )}
          </div>
        </AnimateIn>

      </div>

      {/* Bottom: Concept History Gallery (Slide Bottom to Top using AnimateIn) */}
      {history.length > 0 && (
        <AnimateIn from="bottom" delay={300} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Concept Gallery</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">{history.length} concept{history.length > 1 ? 's' : ''} generated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {history.map((entry) => (
              <div key={entry.id}
                className={`rounded-2xl border-2 transition-all p-4 space-y-3 cursor-pointer ${activeEntry?.id === entry.id ? 'border-violet-500 bg-violet-50/30 dark:bg-violet-950/40' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:border-violet-300'}`}
                onClick={() => setActiveEntry(entry)}
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.generatedUrl} alt="Concept" className="w-full h-full object-cover" />
                  {entry.isNew && (
                    <span className="absolute top-2 right-2 px-2.5 py-1 bg-violet-600 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {entry.roomType.charAt(0) + entry.roomType.slice(1).toLowerCase()} · {entry.designStyle.charAt(0) + entry.designStyle.slice(1).toLowerCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeEntry?.id === entry.id && (
                      <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    )}
                    <button
                      onClick={(e) => handleDeleteEntry(entry.id, e)}
                      title="Delete concept"
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {entry.prompt && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic truncate">"{entry.prompt}"</p>
                )}
              </div>
            ))}
          </div>
        </AnimateIn>
      )}

    </div>
  );
}
