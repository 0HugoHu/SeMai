export interface TraditionalColor {
  id: string;
  name: string;
  pinyin: string;
  hex: string;
  rgb: [number, number, number];
  cmyk: [number, number, number, number];
  hsl: [number, number, number];
  dynasties: string[];
  category: string;
  moods: string[];
  material: string;
  description: string;
  descriptionEn: string;
  artifactImage: string | null;
  artifactSource: string | null;
  artifactLicense: string | null;
}

export type Lens = "hue" | "dynasty" | "mood";

export type Locale = "zh" | "en";

export interface PaletteEntry {
  colorId: string;
  addedAt: number;
}
