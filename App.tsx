import React, { useState, useEffect } from 'react';
import PromptForm from './components/PromptForm';
import ImageGrid from './components/ImageGrid';
import Gallery from './components/Gallery';
import SparklesIcon from './components/icons/SparklesIcon';
import { generateBulkImages, generateSingleImage } from './services/geminiService';
import { AspectRatio, GeneratedImage, ImageStyle } from './types';

type GenerationMode = 'bulk' | 'single';
type View = 'generator' | 'gallery';

const App: React.FC = () => {
  // App view
  const [view, setView] = useState<View>('generator');
  
  // Mode
  const [mode, setMode] = useState<GenerationMode>('bulk');

  // Form state
  const [bulkPrompts, setBulkPrompts] = useState<string>('');
  const [singlePrompt, setSinglePrompt] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<{ data: string; mimeType: string } | null>(null);
  
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [imageStyle, setImageStyle] = useState<ImageStyle>(ImageStyle.NONE);
  
  // App status
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]); // Images from current generation job
  const [allImages, setAllImages] = useState<GeneratedImage[]>([]); // All images for the gallery
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load all images from localStorage on initial mount
  useEffect(() => {
    try {
      const storedImages = localStorage.getItem('generatedImagesGallery');
      if (storedImages) {
        setAllImages(JSON.parse(storedImages));
      }
    } catch (err) {
      console.error("Failed to load images from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    // Reset only text inputs when mode changes
    setBulkPrompts('');
    setSinglePrompt('');
  }, [mode]);

  const saveImagesToLocalStorage = (images: GeneratedImage[]) => {
    try {
      localStorage.setItem('generatedImagesGallery', JSON.stringify(images));
    } catch (err) {
      console.error("Failed to save images to localStorage:", err);
      // Potentially notify user if storage is full
    }
  };
  
  const handleDeleteImage = (idToDelete: string) => {
    const updatedImages = allImages.filter(image => image.id !== idToDelete);
    setAllImages(updatedImages);
    saveImagesToLocalStorage(updatedImages);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if(mode === 'bulk' && !bulkPrompts.trim()) return;
    if(mode === 'single' && !singlePrompt.trim()) return;

    if (mode === 'bulk') {
      const promptList = bulkPrompts.split('\n').filter(p => p.trim() !== '');
      const imagesPerPrompt = referenceImage ? 1 : numberOfImages;
      const totalImages = promptList.length * imagesPerPrompt;

      if (totalImages > 50) {
          setError(`Cannot generate more than 50 images at once (you requested ${totalImages}). Please reduce the number of prompts or images per prompt.`);
          return;
      }
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    const applyStyle = (prompt: string, style: ImageStyle): string => {
      if (style === ImageStyle.NONE || !prompt) {
        return prompt;
      }
      return `${prompt}, in a ${style.toLowerCase()} style`;
    };

    try {
      let imagesData: { src: string; prompt: string }[] = [];
      if (mode === 'bulk') {
        const promptList = bulkPrompts.split('\n').filter(p => p.trim() !== '');

        if (referenceImage) {
          // Bulk Image-to-Image
          const promises = promptList.map(prompt => {
              const styledPrompt = applyStyle(prompt, imageStyle);
              return generateSingleImage(styledPrompt, aspectRatio, 1, referenceImage);
          });
          const results = await Promise.all(promises);
          imagesData = results.flat();
        } else {
          // Bulk Text-to-Image
          const styledPrompts = promptList.map(p => applyStyle(p, imageStyle));
          imagesData = await generateBulkImages(styledPrompts, numberOfImages, aspectRatio);
        }
      } else { // single mode
        const styledPrompt = applyStyle(singlePrompt, imageStyle);
        const numImages = referenceImage ? 1 : numberOfImages;
        imagesData = await generateSingleImage(styledPrompt, aspectRatio, numImages, referenceImage);
      }

      const imagesWithIds: GeneratedImage[] = imagesData.map((img, index) => ({
        ...img,
        id: `${Date.now()}-${index}`,
        createdAt: Date.now(),
      }));

      setGeneratedImages(imagesWithIds);
      const updatedAllImages = [...imagesWithIds, ...allImages];
      setAllImages(updatedAllImages);
      saveImagesToLocalStorage(updatedAllImages);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <SparklesIcon className="h-8 w-8 text-cyan-400" />
                    <h1 className="ml-3 text-2xl font-bold tracking-tight text-slate-100">
                        AI Image Generator
                    </h1>
                </div>
                <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                        onClick={() => setView('generator')}
                        className={`tab-btn whitespace-nowrap py-3 px-1 text-sm font-medium ${view === 'generator' ? 'tab-btn-active' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Generator
                    </button>
                    <button
                        onClick={() => setView('gallery')}
                        className={`tab-btn whitespace-nowrap py-3 px-1 text-sm font-medium ${view === 'gallery' ? 'tab-btn-active' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Gallery ({allImages.length})
                    </button>
                </nav>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {view === 'generator' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 rounded-lg bg-slate-800/50 p-6 border border-slate-700">
                <PromptForm
                  mode={mode}
                  setMode={setMode}
                  bulkPrompts={bulkPrompts}
                  setBulkPrompts={setBulkPrompts}
                  singlePrompt={singlePrompt}
                  setSinglePrompt={setSinglePrompt}
                  referenceImage={referenceImage}
                  setReferenceImage={setReferenceImage}
                  numberOfImages={numberOfImages}
                  setNumberOfImages={setNumberOfImages}
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  imageStyle={imageStyle}
                  setImageStyle={setImageStyle}
                  isLoading={isLoading}
                  onSubmit={handleGenerate}
                />
              </div>
            </aside>
            
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="min-h-[75vh] rounded-lg bg-slate-800/50 p-6 border border-slate-700 flex">
                  <div className="w-full">
                    <ImageGrid
                        images={generatedImages}
                        isLoading={isLoading}
                        error={error}
                    />
                  </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-800/50 p-6 border border-slate-700">
            <Gallery images={allImages} onDelete={handleDeleteImage} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
