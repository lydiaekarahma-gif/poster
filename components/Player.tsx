import React, { useEffect, useState } from 'react';
import { Slide, SlideLayout, SlideTheme } from '../types';
import { X } from 'lucide-react';

interface PlayerProps {
  slides: Slide[];
  onClose: () => void;
}

export const Player: React.FC<PlayerProps> = ({ slides, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;

    const slideDuration = slides[currentIndex].duration * 1000;
    
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  if (slides.length === 0) return <div className="bg-black text-white p-10">No slides to play.</div>;

  const currentSlide = slides[currentIndex];

  // Theme Helpers
  const getThemeClasses = (theme: SlideTheme) => {
    switch (theme) {
      case 'dark': return 'bg-slate-900 text-white';
      case 'light': return 'bg-white text-slate-900';
      case 'blue': return 'bg-blue-900 text-white';
      case 'red': return 'bg-red-900 text-white';
      case 'green': return 'bg-emerald-900 text-white';
      default: return 'bg-slate-900 text-white';
    }
  };

  // Layout Helpers
  const renderLayout = () => {
    const themeClass = getThemeClasses(currentSlide.theme);
    
    const Background = () => (
      <>
        <div className="absolute inset-0 bg-black/50 z-0" />
        <img 
          src={currentSlide.backgroundImage} 
          className="absolute inset-0 w-full h-full object-cover -z-10" 
          alt="bg"
        />
      </>
    );

    switch (currentSlide.layout) {
      case 'split-left':
        return (
          <div className={`w-full h-full flex ${themeClass}`}>
            <div className="w-1/2 relative p-20 flex flex-col justify-center z-10 bg-inherit/90 backdrop-blur-sm">
              <h1 className="text-7xl font-bold mb-8 leading-tight">{currentSlide.title}</h1>
              <p className="text-3xl opacity-90 leading-relaxed">{currentSlide.content}</p>
            </div>
            <div className="w-1/2 relative">
              <img src={currentSlide.backgroundImage} className="w-full h-full object-cover" alt="visual" />
            </div>
          </div>
        );
      case 'split-right':
        return (
          <div className={`w-full h-full flex ${themeClass}`}>
            <div className="w-1/2 relative">
              <img src={currentSlide.backgroundImage} className="w-full h-full object-cover" alt="visual" />
            </div>
            <div className="w-1/2 relative p-20 flex flex-col justify-center z-10 bg-inherit/90 backdrop-blur-sm">
              <h1 className="text-7xl font-bold mb-8 leading-tight">{currentSlide.title}</h1>
              <p className="text-3xl opacity-90 leading-relaxed">{currentSlide.content}</p>
            </div>
          </div>
        );
      case 'image-only':
        return (
          <div className="w-full h-full relative">
             <img src={currentSlide.backgroundImage} className="w-full h-full object-cover" alt="visual" />
             <div className="absolute bottom-10 left-10 p-8 bg-black/70 backdrop-blur-md rounded-xl max-w-3xl">
                <h1 className="text-5xl font-bold text-white mb-2">{currentSlide.title}</h1>
             </div>
          </div>
        );
      default: // Center
        return (
          <div className={`w-full h-full relative flex flex-col items-center justify-center text-center p-20 ${themeClass}`}>
            <Background />
            <div className="z-10 max-w-5xl p-12 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10">
              <h1 className="text-8xl font-black mb-12 drop-shadow-xl">{currentSlide.title}</h1>
              <p className="text-4xl font-medium drop-shadow-md opacity-90">{currentSlide.content}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden animate-fade-in">
      {renderLayout()}
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20">
        <div 
          key={currentIndex} // Reset animation on change
          className="h-full bg-blue-500 origin-left animate-progress"
          style={{ animationDuration: `${currentSlide.duration}s` }}
        />
      </div>

      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors z-50"
      >
        <X size={24} />
      </button>
      
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};
