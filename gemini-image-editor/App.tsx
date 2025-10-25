
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { editImageWithGemini } from './services/geminiService';
import type { ImageFile } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: ImageFile) => {
    setImageFile(file);
    setEditedImage(null);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const generatedImage = await editImageWithGemini(imageFile.base64, imageFile.mimeType, prompt);
      setEditedImage(`data:image/png;base64,${generatedImage}`);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Generation failed: ${error}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, prompt]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
            AI Image Editor
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Upload an image, describe the changes you want, and let Gemini's magic transform your photo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
            <ImageUploader onImageUpload={handleImageUpload} />
            
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
                2. Describe your edit
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'add a cat wearing a wizard hat next to the person' or 'change the background to a futuristic city'"
                className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-slate-500"
                rows={3}
              />
            </div>
            
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !imageFile || !prompt}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-center">
                {error}
              </div>
            )}
            <ImageDisplay
              originalImage={imageFile?.dataUrl}
              editedImage={editedImage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
