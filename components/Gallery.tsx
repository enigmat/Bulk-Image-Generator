import React, { useState, useMemo } from 'react';
import { GeneratedImage } from '../types';
import ImageCard from './ImageCard';

interface GalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', '7days'

  const filteredImages = useMemo(() => {
    return images
      .filter(image => {
        // Prompt filter
        if (!searchTerm) return true;
        return image.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .filter(image => {
        // Date filter
        if (dateFilter === 'all') return true;
        const imageDate = new Date(image.createdAt);
        const now = new Date();
        if (dateFilter === 'today') {
          return imageDate.toDateString() === now.toDateString();
        }
        if (dateFilter === '7days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the 7th day
          return imageDate >= sevenDaysAgo;
        }
        return true;
      });
  }, [images, searchTerm, dateFilter]);

  if (images.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-slate-300">Your Gallery is Empty</h3>
        <p className="mt-1 text-sm text-slate-500">Go to the generator to create some images!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Filter by prompt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-3d flex-grow rounded-md sm:text-sm p-2"
          aria-label="Filter by prompt"
        />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input-3d block rounded-md sm:text-sm p-2"
          aria-label="Filter by date"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
        </select>
      </div>

      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredImages.map(image => (
            <ImageCard key={image.id} image={image} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          <h3 className="mt-4 text-lg font-medium text-slate-300">No Images Found</h3>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or date filter.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
