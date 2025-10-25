
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { fileToBase64 } from '../utils/imageUtils';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const { base64, mimeType } = await fileToBase64(file);
        const dataUrl = `data:${mimeType};base64,${base64}`;
        setPreview(dataUrl);
        onImageUpload({ file, base64, mimeType, dataUrl });
      }
    }
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div>
       <label className="block text-sm font-medium text-slate-300 mb-2">
        1. Upload an Image
      </label>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-purple-500 bg-slate-800' : 'border-slate-600 bg-slate-900 hover:border-slate-500'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {preview ? (
          <img src={preview} alt="Image preview" className="object-contain h-full w-full rounded-lg p-2" />
        ) : (
          <div className="text-center text-slate-400">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="mt-2">Drag & drop an image here, or click to select a file</p>
            <p className="text-xs text-slate-500">PNG, JPG, WEBP, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
};
