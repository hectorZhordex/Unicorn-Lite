"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Artwork } from "@/types";

interface UploadsStore {
  uploads: Artwork[];
  addUpload: (artwork: Artwork) => void;
  removeUpload: (id: string) => void;
  getAll: () => Artwork[];
}

export const useUploadsStore = create<UploadsStore>()(
  persist(
    (set, get) => ({
      uploads: [],

      addUpload: (artwork) => {
        set((state) => ({ uploads: [artwork, ...state.uploads] }));
      },

      removeUpload: (id) => {
        set((state) => ({ uploads: state.uploads.filter((u) => u.id !== id) }));
      },

      getAll: () => get().uploads,
    }),
    { name: "blueorbit-uploads" }
  )
);
