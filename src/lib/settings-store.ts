"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SiteSettings {
  // Logo
  logoText: string;
  logoImage: string; // base64 data URL or empty string
  // Hero
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSubtitle: string;
  // Footer
  footerTagline: string;
  footerCopyright: string;
  // Categories (name|slug pairs separated by newlines)
  categoriesRaw: string;
  // Search
  searchPlaceholder: string;
}

interface SettingsStore {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  resetSettings: () => void;
  clearAllData: () => void;
}

const DEFAULT: SiteSettings = {
  logoText: "ArtFlow",
  logoImage: "",
  heroHeadlineLine1: "Download Premium",
  heroHeadlineLine2: "Design Assets",
  heroSubtitle: "Logos, mockups, PSDs, posters, flyers and more. Unlock for free with quick verification.",
  footerTagline: "Premium design resources, templates and assets. Free with verification.",
  footerCopyright: "ArtFlow. All rights reserved.",
  categoriesRaw: `All|all\nLogos|logos\nPosters|posters\nFlyers|flyers\nWallpapers|wallpapers\nMockups|mockups\nSocial Media|social-media\nPSD Templates|psd-templates`,
  searchPlaceholder: "Search",
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT,
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
      resetSettings: () => set({ settings: DEFAULT }),
      clearAllData: () => {
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
        set({ settings: DEFAULT });
      },
    }),
    { name: "artflow-settings" }
  )
);

export function parseCategories(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, slug] = line.split("|");
      return { name: name?.trim() || "", slug: slug?.trim() || "" };
    })
    .filter((c) => c.name && c.slug);
}

export { DEFAULT as DEFAULT_SETTINGS };
