import React from 'react';
import { Slide, SlideLayout, SlideTheme } from '../types';
import { Layout, Palette, Image as ImageIcon, Type, Clock } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  onChange: (updatedSlide: Slide) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onChange }) => {
  
  const handleChange = (field: keyof Slide, value: any) => {
    onChange({ ...slide, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleChange('backgroundImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 border-l border-slate-700 overflow-y-auto">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <Type size={18} />
          Edit Slide
        </h3>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Text Content */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-400">Title</label>
          <input 
            type="text" 
            value={slide.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter headline..."
          />
          
          <label className="block text-sm font-medium text-slate-400">Description</label>
          <textarea 
            rows={4}
            value={slide.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Enter slide content..."
          />
        </div>

        {/* Layout */}
        <div className="space-y-3">
           <label className="block text-sm font-medium text-slate-400 flex items-center gap-2">
            <Layout size={16} /> Layout
          </label>
           <div className="grid grid-cols-2 gap-2">
             {(['center', 'split-left', 'split-right', 'image-only'] as SlideLayout[]).map((layout) => (
               <button
                key={layout}
                onClick={() => handleChange('layout', layout)}
                className={`p-2 text-xs rounded border ${
                  slide.layout === layout 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
               >
                 {layout.replace('-', ' ').toUpperCase()}
               </button>
             ))}
           </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
           <label className="block text-sm font-medium text-slate-400 flex items-center gap-2">
            <Palette size={16} /> Theme Color
          </label>
           <div className="flex gap-3">
             {(['dark', 'light', 'blue', 'red', 'green'] as SlideTheme[]).map((theme) => (
               <button
                key={theme}
                onClick={() => handleChange('theme', theme)}
                className={`w-8 h-8 rounded-full border-2 ring-offset-2 ring-offset-slate-800 ${
                  slide.theme === theme ? 'ring-2 ring-white scale-110' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: theme === 'dark' ? '#1e293b' : 
                                   theme === 'light' ? '#f8fafc' : 
                                   theme === 'blue' ? '#1e3a8a' :
                                   theme === 'red' ? '#7f1d1d' : '#064e3b'
                }}
               />
             ))}
           </div>
        </div>

        {/* Image */}
        <div className="space-y-3">
           <label className="block text-sm font-medium text-slate-400 flex items-center gap-2">
            <ImageIcon size={16} /> Background Image
          </label>
          <div className="flex flex-col gap-3">
             <div className="relative aspect-video w-full rounded-md overflow-hidden border border-slate-700">
               <img src={slide.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => handleChange('backgroundImage', `https://picsum.photos/seed/${Math.random()}/1920/1080`)}
                  className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 text-white py-2 rounded"
                >
                  Randomize
                </button>
                <label className="flex-1 cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center">
                  Upload
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
             </div>
          </div>
        </div>

         {/* Duration */}
         <div className="space-y-3">
           <label className="block text-sm font-medium text-slate-400 flex items-center gap-2">
            <Clock size={16} /> Duration (seconds)
          </label>
          <input 
            type="range" 
            min="3" 
            max="60" 
            value={slide.duration}
            onChange={(e) => handleChange('duration', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-right text-xs text-slate-400">{slide.duration}s</div>
        </div>

      </div>
    </div>
  );
};
