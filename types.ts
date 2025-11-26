export interface Slide {
  id: string;
  title: string;
  content: string;
  backgroundImage: string;
  duration: number; // in seconds
  theme: 'dark' | 'light' | 'blue' | 'red' | 'green';
  layout: 'center' | 'split-left' | 'split-right' | 'image-only';
}

export interface AppState {
  slides: Slide[];
  activeSlideId: string | null;
  isPlaying: boolean;
  isGenerating: boolean;
}

export enum SlideTheme {
  Dark = 'dark',
  Light = 'light',
  Blue = 'blue',
  Red = 'red',
  Green = 'green'
}

export enum SlideLayout {
  Center = 'center',
  SplitLeft = 'split-left',
  SplitRight = 'split-right',
  ImageOnly = 'image-only'
}
