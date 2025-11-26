import React from 'react';
import { Slide } from '../types';
import { Trash2, Clock } from 'lucide-react';

interface SlidePreviewProps {
  slide: Slide;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, isActive, onClick, onDelete }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative flex-shrink-0 w-48 h-28 rounded-lg border-2 cursor-pointer transition-all overflow-hidden group ${
        isActive ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      {/* Background Thumbnail */}
      <img 
        src={slide.backgroundImage} 
        alt={slide.title} 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/40 p-2 flex flex-col justify-end">
        <h4 className="text-white text-xs font-bold truncate">{slide.title}</h4>
        <div className="flex items-center text-[10px] text-slate-300 gap-1 mt-1">
          <Clock size={10} />
          <span>{slide.duration}s</span>
        </div>
      </div>

      {/* Delete Button (Visible on Hover) */}
      <button 
        onClick={onDelete}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <Trash2 size={12} />
      </button>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};
