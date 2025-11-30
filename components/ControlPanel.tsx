import React, { useRef } from 'react';
import { ArtStyle, AspectRatio, GenerationRequest } from '../types';
import { Wand2, Image as ImageIcon, LayoutTemplate, User, Upload, RefreshCw, X, Shuffle, ArrowRightLeft } from 'lucide-react';

interface ControlPanelProps {
  request: GenerationRequest;
  isLoading: boolean;
  onRequestChange: (req: GenerationRequest) => void;
  onGenerate: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  request,
  isLoading,
  onRequestChange,
  onGenerate,
}) => {
  const styles = Object.values(ArtStyle);
  const ratios = Object.values(AspectRatio);
  
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onRequestChange({ ...request, prompt: e.target.value });
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRequestChange({ ...request, style: e.target.value as ArtStyle });
  };

  const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRequestChange({ ...request, aspectRatio: e.target.value as AspectRatio });
  };

  const handleToggleFaceSwap = () => {
    onRequestChange({ ...request, isFaceSwap: !request.isFaceSwap });
  };

  const handleResetCharacter = () => {
    onRequestChange({ 
      ...request, 
      sourceFaceImage: undefined, 
      targetSceneImage: undefined 
    });
    if (sourceInputRef.current) sourceInputRef.current.value = '';
    if (targetInputRef.current) targetInputRef.current.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'sourceFaceImage' | 'targetSceneImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onRequestChange({ ...request, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl space-y-8">
      
      {/* --- Character Controls Section --- */}
      <div className="space-y-4 pb-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-slate-200 flex items-center">
            <User className="w-4 h-4 mr-2 text-brand-400" />
            Character Controls
          </h3>
          <div className="flex items-center space-x-3">
             <button
              onClick={handleToggleFaceSwap}
              disabled={isLoading}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center ${
                request.isFaceSwap 
                  ? 'bg-brand-900/30 border-brand-500/50 text-brand-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <ArrowRightLeft className="w-3 h-3 mr-1.5" />
              {request.isFaceSwap ? 'Face Swap: ON' : 'Face Swap: OFF'}
            </button>
            {(request.sourceFaceImage || request.targetSceneImage) && (
              <button 
                onClick={handleResetCharacter}
                disabled={isLoading}
                className="text-xs text-red-400 hover:text-red-300 flex items-center px-2 py-1"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Source Face Upload */}
          <div className={`space-y-2 ${request.isFaceSwap ? '' : 'col-span-2'}`}>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              {request.isFaceSwap ? 'Source Face (Who)' : 'Character Reference (Optional)'}
            </label>
            <div 
              onClick={() => !isLoading && sourceInputRef.current?.click()}
              className={`
                relative h-32 w-full rounded-xl border-2 border-dashed border-slate-700 
                bg-slate-900/50 hover:bg-slate-800 transition-colors cursor-pointer overflow-hidden
                flex flex-col items-center justify-center text-slate-500 group
                ${request.sourceFaceImage ? 'border-brand-500/50' : ''}
              `}
            >
              {request.sourceFaceImage ? (
                <>
                  <img src={request.sourceFaceImage} alt="Source" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="z-10 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <RefreshCw className="w-4 h-4 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mb-2 opacity-70" />
                  <span className="text-xs">Upload Face</span>
                </>
              )}
              <input 
                ref={sourceInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleImageUpload(e, 'sourceFaceImage')}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Target Scene Upload (Only for Face Swap) */}
          {request.isFaceSwap && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Target Scene (Where)
              </label>
              <div 
                onClick={() => !isLoading && targetInputRef.current?.click()}
                className={`
                  relative h-32 w-full rounded-xl border-2 border-dashed border-slate-700 
                  bg-slate-900/50 hover:bg-slate-800 transition-colors cursor-pointer overflow-hidden
                  flex flex-col items-center justify-center text-slate-500 group
                  ${request.targetSceneImage ? 'border-brand-500/50' : ''}
                `}
              >
                {request.targetSceneImage ? (
                  <>
                    <img src={request.targetSceneImage} alt="Target" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="z-10 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <RefreshCw className="w-4 h-4 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 mb-2 opacity-70" />
                    <span className="text-xs">Upload Target</span>
                  </>
                )}
                <input 
                  ref={targetInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, 'targetSceneImage')}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </div>
        {request.sourceFaceImage && !request.isFaceSwap && (
          <p className="text-[10px] text-brand-400/80 bg-brand-900/20 p-2 rounded border border-brand-900/50">
            Feature Active: Character identity will be preserved across styles.
          </p>
        )}
      </div>

      {/* --- Standard Controls --- */}
      <div className="space-y-6">
        
        {/* Prompt Input */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="flex items-center text-sm font-medium text-slate-300">
            <Wand2 className="w-4 h-4 mr-2 text-brand-400" />
            {request.isFaceSwap ? 'Additional Instructions (Optional)' : 'Image Description'}
          </label>
          <textarea
            id="prompt"
            value={request.prompt}
            onChange={handlePromptChange}
            placeholder={request.isFaceSwap ? "E.g., Make the lighting slightly warmer..." : "A futuristic city with flying cars at sunset..."}
            disabled={isLoading}
            className="w-full h-24 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none text-slate-100 placeholder-slate-500 transition-all disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Style Selector */}
          <div className="space-y-2">
            <label htmlFor="style" className="flex items-center text-sm font-medium text-slate-300">
              <ImageIcon className="w-4 h-4 mr-2 text-brand-400" />
              Artistic Style
            </label>
            <div className="relative">
              <select
                id="style"
                value={request.style}
                onChange={handleStyleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl appearance-none focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-100 transition-all disabled:opacity-50 cursor-pointer"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label htmlFor="ratio" className="flex items-center text-sm font-medium text-slate-300">
              <LayoutTemplate className="w-4 h-4 mr-2 text-brand-400" />
              Aspect Ratio
            </label>
            <div className="relative">
              <select
                id="ratio"
                value={request.aspectRatio}
                onChange={handleRatioChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl appearance-none focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-100 transition-all disabled:opacity-50 cursor-pointer"
              >
                {ratios.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isLoading || (!request.isFaceSwap && !request.prompt.trim()) || (request.isFaceSwap && (!request.sourceFaceImage || !request.targetSceneImage))}
          className={`
            w-full py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-all transform duration-200
            ${isLoading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white hover:shadow-brand-500/25 active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {request.isFaceSwap ? 'Swapping Faces...' : 'Generating Creative...'}
            </span>
          ) : (
            request.isFaceSwap ? 'Perform Face Swap' : 'Generate Image'
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;