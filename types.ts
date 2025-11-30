export enum AspectRatio {
  Square = "1:1",
  Portrait = "3:4",
  Landscape = "4:3",
  WidePortrait = "9:16",
  WideLandscape = "16:9",
}

export enum ArtStyle {
  None = "No Style",
  Photorealistic = "Photorealistic",
  Anime = "Anime",
  Cinematic = "Cinematic",
  Surreal = "Surreal",
  Watercolor = "Watercolor",
  Moebius = "Moebius",
  HyperRealistic = "Hyper-realistic",
  Cyberpunk = "Cyberpunk",
  OilPainting = "Oil Painting",
  Minimalist = "Minimalist",
  Fantasy = "Fantasy Art",
}

export interface GenerationRequest {
  prompt: string;
  style: ArtStyle;
  aspectRatio: AspectRatio;
  isFaceSwap: boolean;
  sourceFaceImage?: string; // Data URL
  targetSceneImage?: string; // Data URL
}

export interface GenerationResult {
  imageUrl: string | null;
  error: string | null;
  loading: boolean;
}