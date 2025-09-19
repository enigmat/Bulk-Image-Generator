import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBulkImages = async (
  prompts: string[],
  numberOfImages: number,
  aspectRatio: AspectRatio
): Promise<{ src: string; prompt: string }[]> => {
  if (prompts.length === 0) {
    return [];
  }

  const imageGenerationPromises = prompts.map(prompt => 
    ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    }).then(response => ({
      status: 'fulfilled' as const,
      value: { response, prompt }
    })).catch(error => ({
      status: 'rejected' as const,
      reason: error,
      prompt: prompt
    }))
  );

  const results = await Promise.all(imageGenerationPromises);
  const generatedImages: { src: string; prompt: string }[] = [];

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      const { response, prompt } = result.value;
      response.generatedImages.forEach(generatedImage => {
        const base64ImageBytes: string = generatedImage.image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        generatedImages.push({ src: imageUrl, prompt });
      });
    } else {
      console.error(`Failed to generate image for prompt "${result.prompt}":`, result.reason);
    }
  });

  return generatedImages;
};

export const generateSingleImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  numberOfImages: number,
  referenceImage: { data: string; mimeType: string } | null
): Promise<{ src: string; prompt: string }[]> => {
  if (referenceImage) {
    // Image-to-Image / Editing with gemini-2.5-flash-image-preview
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: referenceImage.data, mimeType: referenceImage.mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
    if (imagePart?.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
      return [{ src: imageUrl, prompt }];
    } else {
      throw new Error("The model did not return an image. It may have refused the request.");
    }
  } else {
    // Text-to-Image with imagen-4.0-generate-001
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    return response.generatedImages.map(generatedImage => {
      const base64ImageBytes: string = generatedImage.image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      return { src: imageUrl, prompt };
    });
  }
};