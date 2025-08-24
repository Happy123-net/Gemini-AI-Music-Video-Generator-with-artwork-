
export enum AppState {
  IDLE = 'idle',
  GENERATING = 'generating',
  READY = 'ready',
}

export interface ArtStyle {
  name: string;
  prompt: string;
  thumbnail: string;
}

export interface GeneratedImage {
  timestamp: number;
  imageUrl: string;
}
