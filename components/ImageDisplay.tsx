import React from 'react';
import { Download, AlertCircle } from 'lucide-react';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, error }) => {
  
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!imageUrl && !isLoading && !error) {
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
        <div className="bg-slate-800 p-4 rounded-full mb-4">
          <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">Your imagination awaits</p>
        <p className="text-sm opacity-60">Enter a prompt to start creating</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center bg-red-900/10 border border-red-500/20 rounded-2xl text-red-400 p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-3 opacity-80" />
        <h3 className="text-lg font-semibold mb-1">Generation Failed</h3>
        <p className="text-sm opacity-90">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center bg-slate-800/30 border border-slate-700 rounded-2xl relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4"></div>
          <p className="text-brand-400 font-medium animate-pulse">Creating masterpiece...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
      {/* Main Image */}
      <img
        src={imageUrl!}
        alt="Generated Art"
        className="w-full h-auto object-contain max-h-[800px] mx-auto"
      />

      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
        <button
          onClick={handleDownload}
          className="flex items-center px-6 py-3 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <Download className="w-5 h-5 mr-2" />
          Download High Res
        </button>
      </div>
    </div>
  );
};

export default ImageDisplay;