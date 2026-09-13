'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, UploadCloud, X, Box, Wand2, ImageIcon, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CompareSlider from '../../components/CompareSlider';
import AnimateIn from '../../components/AnimateIn';
import ProductBreakdown from '../../components/ProductBreakdown';

const ROOM_TYPES = ['LIVINGROOM', 'BEDROOM', 'KITCHEN', 'BATHROOM', 'OFFICE', 'DININGROOM', 'SUNROOM', 'FAMILYROOM'];
const DESIGN_STYLES = ['MODERN', 'MINIMALIST', 'SCANDINAVIAN', 'INDUSTRIAL', 'CONTEMPORARY', 'FARMHOUSE', 'BOHO', 'TRADITIONAL'];

interface GenerationEntry {
  id: string;
  originalImage: string;
  generatedUrl: string;
  roomType: string;
  designStyle: string;
  prompt: string;
  isNew: boolean;
}

export default function VirtualStagingPage() {
  const { user, deductCredit } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputImageUrl, setInputImageUrl] = useState('');

  const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
  const [designStyle, setDesignStyle] = useState(DESIGN_STYLES[0]);
  const [prompt, setPrompt] = useState('');
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

  // Load history on mount
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
  }, []);

  // Save history on change
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('decor8ai_history', JSON.stringify(history));
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

  const useAsInput = (entry: GenerationEntry) => {
    clearFile();
    setInputImageUrl(entry.generatedUrl);
    setActiveEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      if (updated.length > 0) {
        localStorage.setItem('decor8ai_virtual_staging_history', JSON.stringify(updated));
      } else {
        localStorage.removeItem('decor8ai_virtual_staging_history');
      }
      return updated;
    });

    if (activeEntry?.id === id) {
      setActiveEntry(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !inputImageUrl) {
      setError('Please provide an image file or URL');
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
      const formData = new FormData();
      if (file) formData.append('image', file);
      else formData.append('inputImageUrl', inputImageUrl);

      formData.append('roomType', roomType);
      formData.append('designStyle', designStyle);
      formData.append('numImages', '1');
      if (prompt.trim()) formData.append('prompt', prompt.trim());

      const res = await fetch('/api/virtual-staging', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to generate');

      const images: any[] = data.images || [];
      if (!images.length) throw new Error('No images returned. Try a different photo or style.');

      // Deduct credit
      deductCredit();

      const newEntry: GenerationEntry = {
        id: Date.now().toString(),
        originalImage: currentOriginal || images[0].url,
        generatedUrl: images[0].url,
        roomType,
        designStyle,
        prompt: prompt.trim(),
        isNew: true,
      };

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

      {/* Main Row: Controls + Compare Slider */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">

        {/* Left Column: Controls (Slide Left to Right using AnimateIn) */}
        <AnimateIn from="left" className="w-full lg:w-[400px] flex-shrink-0">
          <div className="mb-8">
            <a href="/" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="m15 18-6-6 6-6"/></svg>
              Back to Home
            </a>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Box className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Virtual Staging
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Upload an empty room and let AI furnish it.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">

            {/* Upload Area */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block">Room Photo</label>

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
                  <div className="relative px-6 py-10 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                      <UploadCloud className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Click to upload</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">or drag and drop here</p>
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

              {!previewUrl && !inputImageUrl && (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  </div>
                  <input
                    type="url"
                    value={inputImageUrl}
                    onChange={(e) => { setInputImageUrl(e.target.value); if (e.target.value) clearFile(); }}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Paste image URL..."
                  />
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block mb-2">Room Type</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type} className="text-slate-900 dark:text-slate-100 dark:bg-slate-900">{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block mb-2">Design Style</label>
                <select value={designStyle} onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  {DESIGN_STYLES.map((style) => (
                    <option key={style} value={style} className="text-slate-900 dark:text-slate-100 dark:bg-slate-900">{style.charAt(0) + style.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 block mb-2">
                  Describe the Look <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Modern minimalist with floating shelves and warm lighting"
                />
              </div>
            </div>

            <button type="submit" disabled={loading || (!file && !inputImageUrl)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
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

        {/* Right Column: Compare Slider (Slide Right to Left using AnimateIn) */}
        <AnimateIn from="right" delay={200} className="flex-1">
          <div className="h-full min-h-[500px] w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
            {!activeEntry && !error && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-500 dark:text-slate-400">No design generated yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Upload a photo and click generate.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-md mx-auto w-full">
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                      </span>
                      Generating your design...
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {Math.min(95, Math.round((elapsed / ESTIMATED_SECONDS) * 100))}%
                    </span>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                      style={{ width: `${Math.min(95, Math.round((elapsed / ESTIMATED_SECONDS) * 100))}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Remaining time & status indicator */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>
                      {elapsed < ESTIMATED_SECONDS 
                        ? `Estimated remaining time: ~${Math.max(1, ESTIMATED_SECONDS - elapsed)}s`
                        : 'Finalizing high-res render...'}
                    </span>
                    <span className="font-mono font-medium">{elapsed}s elapsed</span>
                  </div>
                </div>

                <p className="text-xs text-center text-slate-400 dark:text-slate-500 max-w-xs">
                  AI is analyzing room lighting, geometry, and rendering photorealistic furnishings.
                </p>
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
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Comparison</h3>
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-900">Ready</span>
                </div>
                <div className="flex-1">
                  <CompareSlider
                    originalImage={activeEntry.originalImage}
                    stagedImage={activeEntry.generatedUrl}
                  />
                  <p className="text-center text-slate-400 text-xs mt-3">Drag slider to compare · Click expand for fullscreen</p>

                  {/* Product Details Breakdown Card */}
                  <ProductBreakdown roomType={activeEntry.roomType} designStyle={activeEntry.designStyle} />
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
            {history.slice(0, 1).map((entry, index) => (
              <div key={entry.id}
                className={`rounded-2xl border-2 transition-all p-5 space-y-4 ${activeEntry?.id === entry.id ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/40' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'}`}>

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {entry.isNew && (
                      <span className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">NEW</span>
                    )}
                    {!entry.isNew && (
                      <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full">Latest</span>
                    )}
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeEntry?.id === entry.id ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                      {activeEntry?.id === entry.id
                        ? <><CheckCircle2 className="w-3.5 h-3.5" /> In Slider</>
                        : 'View in Slider'}
                    </button>
                    <button
                      onClick={() => useAsInput(entry)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-700 dark:hover:bg-indigo-500 transition-all">
                      <ArrowRight className="w-3.5 h-3.5" /> Use as Input
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      title="Delete from history"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                {/* Full Before & After Images */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Before</p>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.originalImage} alt="Before" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">After</p>
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.generatedUrl} alt="After" className="w-full h-full object-cover cursor-zoom-in" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      )}
    </div>
  );
}
