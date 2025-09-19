export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_3_4 = '3:4',
  LANDSCAPE_4_3 = '4:3',
  PORTRAIT_9_16 = '9:16',
  LANDSCAPE_16_9 = '16:9',
}

export enum ImageStyle {
  NONE = 'None (Default)',
  REALISTIC = 'Realistic',
  PHOTOGRAPHIC = 'Photographic',
  ANIME = 'Anime',
  CARTOONISH = 'Cartoonish',
  FANTASY_ART = 'Fantasy Art',
  CINEMATIC = 'Cinematic',
  MINIMALIST = 'Minimalist',
  NEON_PUNK = 'Neon Punk',
}

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  createdAt: number;
}
