import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  image: { data: string; mimeType: string } | null;
  setImage: (image: { data: string; mimeType: string } | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        if (base64) {
          setImage({ data: base64, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, [handleFileChange]);

  if (image) {
    return (
      <div className="relative">
        <img
          src={`data:${image.mimeType};base64,${image.data}`}
          alt="Reference preview"
          className="w-full rounded-md object-cover"
        />
        <button
          type="button"
          onClick={() => setImage(null)}
          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-500"
          aria-label="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`flex justify-center rounded-md border-2 border-dashed border-slate-600 px-6 pt-5 pb-6 transition-colors ${isDragging ? 'border-cyan-500 bg-slate-800' : ''}`}
    >
      <div className="space-y-1 text-center">
        <svg
          className="mx-auto h-12 w-12 text-slate-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex text-sm text-slate-400">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md font-medium text-cyan-400 focus-within:outline-none hover:text-cyan-300"
          >
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;
