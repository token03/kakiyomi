// src/store/pageStore.ts
import { create } from 'zustand';
import { Page } from '../types/interfaces';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper function to create a page with a unique key.
 * Defined *before* it's used in `useState` initializer to avoid ReferenceError.
 * @param {Omit<Page, 'key'>} page - Page data without a key.
 * @returns {Page} - Page data with a generated key.
 */
const createPageWithKey = (page: Omit<Page, 'key'>): Page => ({
  ...page,
  key: uuidv4(), // uuidv4() from 'uuid' instead of crypto.randomUUID()
});

const initialPage: Omit<Page, 'key'> = {
  name: 'Page 1',
  order: 1,
  sourceImage: 'https://i.redd.it/atxs52s7fnv21.jpg',
  textBoxes: [
    {
      key: uuidv4(), // uuidv4() from 'uuid' instead of crypto.randomUUID()
      text:  "Sample Text Box 1",
      x: 50,
      y: 50,
      width: 150,
      height: 50,
      fontColor: "black",
      fontWeight: "normal",
      fontSize: 16,
      fontFamily: "Arial",
      isSelected: false,
      isEditing: false,
      isTransforming: false,
    },
    {
      key: uuidv4(), // uuidv4() from 'uuid' instead of crypto.randomUUID()
      text: "Sample Text Box 2",
      y: 100,
      width: 200,
      height: 80,
      fontColor: "blue",
      fontWeight: "bold",
      fontSize: 20,
      fontFamily: "Verdana",
      isSelected: false,
      isEditing: false,
      isTransforming: false,
    },
  ],
  segmentData: [],
  lines: [
    { tool: 'pen', points: [10, 10, 50, 50, 90, 10], strokeWidth: 5 },
    { tool: 'eraser', points: [150, 150, 200, 200], strokeWidth: 10 },
  ],
};

interface PageState {
  pages: Page[];
  selectedPageKey: string | null;
  addPage: (sourceImage: string) => void;
  updatePage: (key: string, updates: Partial<Page>) => void;
  deletePage: (key: string) => void;
  selectPage: (key: string) => void;
}

export const usePageStore = create<PageState>((set) => ({
  pages: [
    createPageWithKey(initialPage),
  ],
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
