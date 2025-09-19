
import React from 'react';
import { GeneratedImage } from '../types';
import ImageCard from './ImageCard';
import Spinner from './Spinner';

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Spinner className="h-12 w-12 text-cyan-400" />
        <h3 className="mt-4 text-lg font-medium text-slate-300">Generating Images</h3>
        <p className="mt-1 text-sm text-slate-500">This may take a few moments. Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-red-400">An Error Occurred</h3>
        <p className="mt-1 text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-slate-300">Ready to create?</h3>
        <p className="mt-1 text-sm text-slate-500">Your generated images will appear here.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};

export default ImageGrid;
