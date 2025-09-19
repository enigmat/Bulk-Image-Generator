import React from 'react';
import { GeneratedImage } from '../types';
import TrashIcon from './icons/TrashIcon';

interface ImageCardProps {
  image: GeneratedImage;
  onDelete?: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `${image.prompt.replace(/\s+/g, '_').slice(0, 30)}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-cyan-500/30">
      <img
        src={image.src}
        alt={image.prompt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-sm font-medium line-clamp-2">{image.prompt}</p>
        <p className="text-xs text-slate-400 mt-1">{new Date(image.createdAt).toLocaleDateString()}</p>
        <div className="mt-2 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={handleDownload}
            className="inline-flex items-center rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>
          {onDelete && (
             <button
              onClick={() => onDelete(image.id)}
              className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40"
              aria-label="Delete image"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
