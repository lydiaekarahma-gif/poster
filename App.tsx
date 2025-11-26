import React, { useState, useCallback } from 'react';
import { Plus, Play, MonitorPlay, Sparkles, AlertCircle } from 'lucide-react';
import { Slide, SlideLayout, SlideTheme } from './types';
import { SlideEditor } from './components/SlideEditor';
import { SlidePreview } from './components/SlidePreview';
import { Player } from './components/Player';
import { generateSlidesFromTopic } from './services/geminiService';

const DEFAULT_SLIDE: Slide = {
  id: '1',
  title: 'Welcome to GenSignage',
  content: 'Edit this slide or generate new ones using AI.',
  backgroundImage: 'https://picsum.photos/seed/start/1920/1080',
  duration: 10,
  theme: SlideTheme.Dark,
  layout: SlideLayout.Center
};

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([DEFAULT_SLIDE]);
  const [activeSlideId, setActiveSlideId] = useState<string>(DEFAULT_SLIDE.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const handleUpdateSlide = (updatedSlide: Slide) => {
    setSlides(prev => prev.map(s => s.id === updatedSlide.id ? updatedSlide : s));
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      ...DEFAULT_SLIDE,
      id: crypto.randomUUID(),
      title: 'New Slide',
      backgroundImage: `https://picsum.photos/seed/${Date.now()}/1920/1080`
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  const handleDeleteSlide = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    if (activeSlideId === id) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please check your Vercel configuration.");
      }

      const generatedData = await generateSlidesFromTopic(prompt);
      const newSlides: Slide[] = generatedData.map(d => ({
        ...DEFAULT_SLIDE,
        ...d,
        id: crypto.randomUUID(),
      } as Slide));

      setSlides(prev => [...prev, ...newSlides]);
      if (newSlides.length > 0) setActiveSlideId(newSlides[0].id);
      setPrompt('');
    } catch (err) {
      setError("Failed to generate slides. Ensure API Key is valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* Play Mode Overlay */}
      {isPlaying && (
        <Player slides={slides} onClose={() => setIsPlaying(false)} />
      )}

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Toolbar */}
        <header className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-950">
          <div className="flex items-center gap-3">
            <MonitorPlay className="text-blue-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GenSignage
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-800 rounded-full border border-slate-700 px-1 py-1 w-96">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="E.g., 'Lunch Menu for Italian Restaurant'..."
                className="bg-transparent border-none outline-none text-sm px-4 flex-1 text-white placeholder-slate-500"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`p-2 rounded-full ${isGenerating ? 'bg-slate-600' : 'bg-blue-600 hover:bg-blue-500'} text-white transition-colors`}
              >
                {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              <Play size={18} fill="currentColor" /> Play
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border-b border-red-500/50 p-2 text-center text-red-200 text-sm flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Canvas Area */}
        <main className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center p-8">
           {/* Preview of Active Slide (WYSIWYG) */}
           <div className="relative aspect-video w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden border border-slate-700 bg-black">
              {/* Reuse logic for rendering the slide in edit mode, but simplified compared to player */}
              <div className="absolute inset-0 z-0">
                 <img src={activeSlide.backgroundImage} alt="bg" className="w-full h-full object-cover opacity-60" />
                 <div className="absolute inset-0 bg-black/20" />
              </div>
              
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-12">
                 {/* Simple representation for editor preview - styling matches Player logic roughly */}
                 <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">{activeSlide.title}</h1>
                 <p className="text-2xl text-white/90 drop-shadow-md max-w-3xl">{activeSlide.content}</p>
                 
                 <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-xs text-white/70">
                   Layout: {activeSlide.layout} | Theme: {activeSlide.theme}
                 </div>
              </div>
           </div>
        </main>

        {/* Timeline */}
        <div className="h-48 border-t border-slate-700 bg-slate-950 p-4 flex gap-4 overflow-x-auto items-center">
           {slides.map((slide) => (
             <SlidePreview 
               key={slide.id} 
               slide={slide} 
               isActive={slide.id === activeSlideId}
               onClick={() => setActiveSlideId(slide.id)}
               onDelete={(e) => handleDeleteSlide(e, slide.id)}
             />
           ))}
           
           <button 
             onClick={handleAddSlide}
             className="flex-shrink-0 w-48 h-28 rounded-lg border-2 border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-500 transition-all"
           >
             <Plus size={24} />
             <span className="text-sm font-medium">Add Slide</span>
           </button>
        </div>

      </div>

      {/* Right Sidebar - Editor */}
      <div className="w-80 border-l border-slate-700 bg-slate-900 h-full">
         <SlideEditor slide={activeSlide} onChange={handleUpdateSlide} />
      </div>
    </div>
  );
};

export default App;
