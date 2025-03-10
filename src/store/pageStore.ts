// src/store/pageStore.ts
import { create } from 'zustand';
import { Page } from '../types/interfaces';
import { v4 as uuidv4 } from 'uuid';

interface PageState {
  pages: Page[];
  selectedPageKey: string | null;
  addPage: (sourceImage: string) => void;
  updatePage: (key: string, updates: Partial<Page>) => void;
  deletePage: (key: string) => void;
  selectPage: (key: string) => void;
}

export const usePageStore = create<PageState>((set) => ({
  pages: [],
  selectedPageKey: null,
  addPage: (sourceImage) =>
    set((state) => {
      const newPage: Page = {
        key: uuidv4(),
        name: `Page ${state.pages.length + 1}`,
        order: state.pages.length + 1,
        sourceImage: sourceImage,
        textBoxes: [],
        segmentData: [],
        lines: [],
      };
      return { pages: [...state.pages, newPage] };
    }),
  updatePage: (key, updates) =>
    set((state) => ({
      pages: state.pages.map((page) => (page.key === key ? { ...page, ...updates } : page)),
    })),
  deletePage: (key) =>
    set((state) => ({
      pages: state.pages.filter((page) => page.key !== key),
    })),
  selectPage: (key) => set({ selectedPageKey: key }),
}));
