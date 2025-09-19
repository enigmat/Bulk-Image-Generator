import React from 'react';
import { AspectRatio, ImageStyle } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';
import ImageUploader from './ImageUploader';

type GenerationMode = 'bulk' | 'single';

interface PromptFormProps {
  // Mode state
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
  
  // Bulk state
  bulkPrompts: string;
  setBulkPrompts: (value: string) => void;

  // Single state
  singlePrompt: string;
  setSinglePrompt: (value: string) => void;
  referenceImage: { data: string; mimeType: string } | null;
  setReferenceImage: (image: { data: string; mimeType: string } | null) => void;
  
  // Shared state
  numberOfImages: number;
  setNumberOfImages: (value: number) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (value: AspectRatio) => void;
  imageStyle: ImageStyle;
  setImageStyle: (value: ImageStyle) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  mode,
  setMode,
  bulkPrompts,
  setBulkPrompts,
  singlePrompt,
  setSinglePrompt,
  referenceImage,
  setReferenceImage,
  numberOfImages,
  setNumberOfImages,
  aspectRatio,
  setAspectRatio,
  imageStyle,
  setImageStyle,
  isLoading,
  onSubmit,
}) => {
  const isImageToImage = !!referenceImage;

  const promptsCount = mode === 'bulk' ? bulkPrompts.split('\n').filter(p => p.trim() !== '').length : 0;
  const imagesPerPrompt = isImageToImage ? 1 : numberOfImages;
  const totalImagesToGenerate = mode === 'bulk' ? promptsCount * imagesPerPrompt : 0;
  const isBulkLimitExceeded = mode === 'bulk' && totalImagesToGenerate > 50;


  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setMode('bulk')}
            className={`tab-btn whitespace-nowrap py-3 px-1 text-sm font-medium ${mode === 'bulk' ? 'tab-btn-active' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Bulk Generate
          </button>
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`tab-btn whitespace-nowrap py-3 px-1 text-sm font-medium ${mode === 'single' ? 'tab-btn-active' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Single Generate
          </button>
        </nav>
      </div>

      {mode === 'bulk' ? (
        <div>
          <label htmlFor="prompts" className="block text-sm font-medium text-slate-300 mb-1">
            Prompts (one per line)
          </label>
          <textarea
            id="prompts"
            rows={8}
            className="input-3d block w-full rounded-md sm:text-sm placeholder-slate-500 p-3"
            placeholder="A majestic lion in a futuristic city&#10;A serene bioluminescent forest at night"
            value={bulkPrompts}
            onChange={(e) => setBulkPrompts(e.target.value)}
            required
          />
           <div className="text-xs text-slate-400 mt-2 flex justify-between items-center">
              <span>Prompts: <span className="font-semibold text-slate-200">{promptsCount}</span></span>
              <span className={`font-medium ${isBulkLimitExceeded ? 'text-red-400' : 'text-slate-200'}`}>
                  Total Images: {totalImagesToGenerate} / 50
              </span>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="single-prompt" className="block text-sm font-medium text-slate-300 mb-1">
            Prompt
          </label>
          <textarea
            id="single-prompt"
            rows={8}
            className="input-3d block w-full rounded-md sm:text-sm placeholder-slate-500 p-3"
            placeholder={isImageToImage ? "Describe what you want to change..." : "A cyberpunk cat wearing sunglasses..."}
            value={singlePrompt}
            onChange={(e) => setSinglePrompt(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1 mt-4">
          Reference Image (Optional)
        </label>
        <ImageUploader image={referenceImage} setImage={setReferenceImage} />
      </div>
      
      <div>
        <label htmlFor="imageStyle" className="block text-sm font-medium text-slate-300 mb-1">
          Image Style
        </label>
        <select
          id="imageStyle"
          className="input-3d block w-full rounded-md sm:text-sm p-2"
          value={imageStyle}
          onChange={(e) => setImageStyle(e.target.value as ImageStyle)}
        >
          {Object.values(ImageStyle).map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="numberOfImages" className="block text-sm font-medium text-slate-300 mb-1">
            Images per prompt
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="numberOfImages"
              min="1"
              max="4"
              step="1"
              disabled={isImageToImage}
              className={`slider-3d w-full ${isImageToImage ? 'cursor-not-allowed opacity-50' : ''}`}
              value={isImageToImage ? 1 : numberOfImages}
              onChange={(e) => setNumberOfImages(parseInt(e.target.value, 10))}
            />
            <span className="font-mono text-sm text-cyan-400 bg-slate-700/50 rounded-md px-2 py-1 w-10 text-center">
              {isImageToImage ? 1 : numberOfImages}
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-300 mb-1">
            Aspect ratio
          </label>
          <select
            id="aspectRatio"
            disabled={isImageToImage}
            className={`input-3d block w-full rounded-md sm:text-sm p-2 ${isImageToImage ? 'cursor-not-allowed opacity-50' : ''}`}
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
          >
            {Object.values(AspectRatio).map((ratio) => (
              <option key={ratio} value={ratio}>
                {ratio}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isImageToImage && <p className="text-xs text-slate-400 text-center -mt-2">Aspect Ratio and Number of Images are disabled when using a reference image.</p>}

      <div>
        <button
          type="submit"
          disabled={isLoading || isBulkLimitExceeded}
          className="btn-3d inline-flex w-full items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-sm"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-3 h-5 w-5" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="mr-3 h-5 w-5" />
              Generate Images
            </>
          )}
        </button>
        {isBulkLimitExceeded && (
          <p className="text-xs text-center text-red-400 mt-2">
            You can generate a maximum of 50 images at once.
          </p>
        )}
      </div>
    </form>
  );
};

export default PromptForm;