import type { TraditionalColor } from "./types";

/** Get relative luminance of a hex color */
export function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** Determine if text on this color should be white or dark */
export function getContrastText(hex: string): string {
  return getLuminance(hex) > 0.35 ? "#1a1a1a" : "#f5f0e8";
}

/** Convert hex to HSL values */
export function hexToHsl(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/** Get Euclidean distance between two colors in RGB space */
export function colorDistance(a: TraditionalColor, b: TraditionalColor): number {
  const dr = a.rgb[0] - b.rgb[0];
  const dg = a.rgb[1] - b.rgb[1];
  const db = a.rgb[2] - b.rgb[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Find the N most similar colors */
export function findSimilarColors(
  target: TraditionalColor,
  allColors: TraditionalColor[],
  count: number = 4
): TraditionalColor[] {
  return allColors
    .filter((c) => c.id !== target.id)
    .sort((a, b) => colorDistance(target, a) - colorDistance(target, b))
    .slice(0, count);
}

/** Category to approximate hue range for sorting */
export const categoryHueOrder: Record<string, number> = {
  红: 0,
  橙: 30,
  黄: 55,
  绿: 120,
  青: 175,
  蓝: 220,
  紫: 280,
  棕: 25,
  白: 0,
  黑: 0,
};

/** Sort colors by hue within their category */
export function sortByHue(colors: TraditionalColor[]): TraditionalColor[] {
  return [...colors].sort((a, b) => {
    const aHue = a.hsl[0];
    const bHue = b.hsl[0];
    return aHue - bHue;
  });
}

/** Dynasty timeline order */
export const dynastyOrder = [
  "夏",
  "商",
  "周",
  "秦",
  "汉",
  "三国",
  "两晋",
  "南北朝",
  "隋",
  "唐",
  "五代十国",
  "辽",
  "宋",
  "西夏",
  "金",
  "元",
  "明",
  "清",
];

export const majorDynasties = new Set(["唐", "宋", "元", "明", "清", "汉", "周"]);

/** Dynasty display info */
export const dynastyInfo: Record<string, { en: string; years: string }> = {
  夏: { en: "Xia", years: "c.2070-1600 BC" },
  商: { en: "Shang", years: "c.1600-1046 BC" },
  周: { en: "Zhou", years: "1046-256 BC" },
  秦: { en: "Qin", years: "221-206 BC" },
  汉: { en: "Han", years: "206 BC-220 AD" },
  三国: { en: "Three Kingdoms", years: "220-280" },
  两晋: { en: "Jin", years: "266-420" },
  南北朝: { en: "N&S Dynasties", years: "420-589" },
  隋: { en: "Sui", years: "581-618" },
  唐: { en: "Tang", years: "618-907" },
  五代十国: { en: "Five Dynasties", years: "907-979" },
  辽: { en: "Liao", years: "916-1125" },
  宋: { en: "Song", years: "960-1279" },
  西夏: { en: "Western Xia", years: "1038-1227" },
  金: { en: "Jin", years: "1115-1234" },
  元: { en: "Yuan", years: "1271-1368" },
  明: { en: "Ming", years: "1368-1644" },
  清: { en: "Qing", years: "1644-1912" },
};

/** Mood display info */
export const moodInfo: Record<string, { en: string; description: string }> = {
  威严: { en: "Majestic", description: "Imperial authority and power" },
  温润: { en: "Gentle", description: "Jade-like warmth" },
  庄重: { en: "Solemn", description: "Ritual and ceremony" },
  空灵: { en: "Ethereal", description: "Misty and transcendent" },
  深沉: { en: "Deep", description: "Night and depth" },
  喜庆: { en: "Joyous", description: "Festival and celebration" },
  雅致: { en: "Elegant", description: "Refined literati taste" },
  天然: { en: "Natural", description: "Earth and mineral" },
};
