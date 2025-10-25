
import React from 'react';

interface ImageDisplayProps {
  originalImage: string | undefined;
  editedImage: string | null;
  isLoading: boolean;
}

const ImagePlaceholder: React.FC<{ title: string, isLoading?: boolean }> = ({ title, isLoading = false }) => (
  <div className="w-full aspect-square bg-slate-800/50 border border-slate-700 rounded-2xl flex flex-col justify-center items-center p-4 text-center">
    <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
    <div className="w-full flex-grow bg-slate-900/50 rounded-lg flex justify-center items-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
           <p className="text-slate-400">AI is thinking...</p>
        </div>
      ) : (
        <p className="text-slate-500">Your image will appear here</p>
      )}
    </div>
  </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, editedImage, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {originalImage ? (
         <div className="w-full aspect-square bg-slate-800/50 border border-slate-700 rounded-2xl flex flex-col justify-center items-center p-4 text-center">
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Original</h3>
          <div className="w-full flex-grow rounded-lg overflow-hidden flex justify-center items-center">
             <img src={originalImage} alt="Original" className="object-contain max-h-full max-w-full" />
          </div>
        </div>
      ) : (
        <ImagePlaceholder title="Original" />
      )}
      
      {editedImage ? (
         <div className="w-full aspect-square bg-slate-800/50 border border-slate-700 rounded-2xl flex flex-col justify-center items-center p-4 text-center">
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Edited</h3>
           <div className="w-full flex-grow rounded-lg overflow-hidden flex justify-center items-center">
            <img src={editedImage} alt="Edited" className="object-contain max-h-full max-w-full" />
           </div>
        </div>
      ) : (
        <ImagePlaceholder title="Edited" isLoading={isLoading} />
      )}
    </div>
  );
};
