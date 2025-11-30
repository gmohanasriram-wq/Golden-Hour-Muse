import React, { useState } from 'react';
import { ArtStyle, AspectRatio, GenerationRequest } from './types';
import { generateImage } from './services/geminiService';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import { Sparkles, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [request, setRequest] = useState<GenerationRequest>({
    prompt: '',
    style: ArtStyle.None,
    aspectRatio: AspectRatio.Square,
    isFaceSwap: false,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Validation for Face Swap
    if (request.isFaceSwap) {
      if (!request.sourceFaceImage || !request.targetSceneImage) {
        setError("Please upload both a Source Face and a Target Scene for Face Swap mode.");
        return;
      }
    } else {
      if (!request.prompt.trim() && !request.sourceFaceImage) {
        // If no text, we need at least an image, but usually text is required for generation unless purely img2img
        if (!request.prompt.trim()) return;
      }
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const result = await generateImage(
        request.prompt, 
        request.style, 
        request.aspectRatio,
        request.isFaceSwap,
        request.sourceFaceImage,
        request.targetSceneImage
      );
      setImageUrl(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-100 selection:bg-brand-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-brand-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-brand-500/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              NanoBanana Studio
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-slate-400">
            <span className="flex items-center"><Sparkles className="w-3 h-3 mr-1.5 text-brand-400" /> Pro Model</span>
            <span className="flex items-center">High Resolution</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Transform text into <span className="text-brand-400">visual art</span>.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Unleash the power of the Gemini NanoBanana Pro model. Create stunning visuals in seconds with professional styles and control.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <ControlPanel 
              request={request}
              isLoading={isLoading}
              onRequestChange={setRequest}
              onGenerate={handleGenerate}
            />
            
            {/* Helper Tips */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-sm text-slate-400">
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2"></span>
                Pro Tips
              </h4>
              <ul className="space-y-2 list-disc list-inside opacity-80">
                <li>Be specific about lighting (e.g., "soft morning light").</li>
                <li>Mention the camera angle (e.g., "wide angle shot").</li>
                <li>Select a style to guide the artistic direction.</li>
              </ul>
            </div>
          </div>

          {/* Display Column */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <ImageDisplay 
                imageUrl={imageUrl} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} NanoBanana Studio. Powered by Google Gemini.</p>
      </footer>

    </div>
  );
};

export default App;