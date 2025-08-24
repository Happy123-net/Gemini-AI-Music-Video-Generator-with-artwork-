
import { ArtStyle } from './types';

export const SEGMENT_DURATION = 5; // seconds

export const ART_STYLES: ArtStyle[] = [
  {
    name: 'Cinematic',
    prompt: 'cinematic, hyper-detailed, epic lighting, 8k',
    thumbnail: 'https://picsum.photos/seed/cinematic/100/100',
  },
  {
    name: 'Anime',
    prompt: 'anime style, vibrant colors, detailed background, studio ghibli inspired',
    thumbnail: 'https://picsum.photos/seed/anime/100/100',
  },
  {
    name: 'Surreal',
    prompt: 'surrealism, dreamlike, abstract, imaginative, salvador dali style',
    thumbnail: 'https://picsum.photos/seed/surreal/100/100',
  },
  {
    name: 'Pixel Art',
    prompt: 'pixel art, 16-bit, retro video game style, detailed sprites',
    thumbnail: 'https://picsum.photos/seed/pixel/100/100',
  },
  {
    name: 'Watercolor',
    prompt: 'watercolor painting, soft edges, blended colors, beautiful gradients',
    thumbnail: 'https://picsum.photos/seed/watercolor/100/100',
  },
];
