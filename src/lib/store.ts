"use client";

import { create } from "zustand";
import type { Lens, Locale, PaletteEntry } from "./types";

interface AppState {
  // Navigation
  currentView: "landing" | "explore" | "palette" | "about";
  setView: (view: AppState["currentView"]) => void;

  // Lens
  activeLens: Lens;
  setLens: (lens: Lens) => void;

  // Selected color
  selectedColorId: string | null;
  selectColor: (id: string | null) => void;

  // Cursor position (for ambient interactions)
  cursorPos: { x: number; y: number };
  setCursorPos: (x: number, y: number) => void;

  // Ambient / neutral mode
  neutralMode: boolean;
  toggleNeutralMode: () => void;

  // Language
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Palette
  palette: PaletteEntry[];
  addToPalette: (colorId: string) => void;
  removeFromPalette: (colorId: string) => void;
  clearPalette: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: "landing",
  setView: (view) => set({ currentView: view }),

  activeLens: "hue",
  setLens: (lens) => set({ activeLens: lens }),

  selectedColorId: null,
  selectColor: (id) => set({ selectedColorId: id }),

  cursorPos: { x: 0, y: 0 },
  setCursorPos: (x, y) => set({ cursorPos: { x, y } }),

  neutralMode: false,
  toggleNeutralMode: () => set((s) => ({ neutralMode: !s.neutralMode })),

  locale: "zh",
  setLocale: (locale) => set({ locale }),

  palette: [],
  addToPalette: (colorId) =>
    set((s) => {
      if (s.palette.length >= 8) return s;
      if (s.palette.some((p) => p.colorId === colorId)) return s;
      return { palette: [...s.palette, { colorId, addedAt: Date.now() }] };
    }),
  removeFromPalette: (colorId) =>
    set((s) => ({
      palette: s.palette.filter((p) => p.colorId !== colorId),
    })),
  clearPalette: () => set({ palette: [] }),
}));
