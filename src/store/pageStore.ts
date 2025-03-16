import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Page, TextBox } from "../types/interfaces";

const initialTextBoxes: TextBox[] = [
  {
    key: uuidv4(),
    text: "Sample Text Box 1",
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
    key: uuidv4(),
    text: "Sample Text Box 2",
    x: 100,
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
];

const createNewPage = (sourceImage: string, order: number): Page => ({
  key: uuidv4(),
  name: `Page ${order}`,
  order,
  sourceImage,
  textBoxes: [],
  segmentData: [],
  lines: [],
});

const initialPage = createNewPage("https://i.redd.it/atxs52s7fnv21.jpg", 1);
initialPage.textBoxes = initialTextBoxes;
initialPage.lines = [
  { tool: "pen", points: [10, 10, 50, 50, 90, 10], strokeWidth: 5 },
  { tool: "eraser", points: [150, 150, 200, 200], strokeWidth: 10 },
];

interface PageState {
  pages: Page[];
  selectedPageKey: string | null;
  addPage: (sourceImage: string) => void;
  updatePage: (key: string, updates: Partial<Page>) => void;
  deletePage: (key: string) => void;
  selectPage: (key: string) => void;
}

export const usePageStore = create<PageState>((set, get) => ({
  pages: [initialPage],
  selectedPageKey: initialPage.key,

  addPage: (sourceImage) =>
    set((state) => {
      const newPageOrder = state.pages.length + 1;
      const newPage = createNewPage(sourceImage, newPageOrder);
      return {
        pages: [...state.pages, newPage],
        selectedPageKey: newPage.key, // Auto-select the new page
      };
    }),

  updatePage: (key, updates) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.key === key ? { ...page, ...updates } : page,
      ),
    })),

  deletePage: (key) =>
    set((state) => {
      // Don't delete if it's the only page
      if (state.pages.length <= 1) {
        return state;
      }

      const updatedPages = state.pages.filter((page) => page.key !== key);

      const reorderedPages = updatedPages.map((page, index) => ({
        ...page,
        order: index + 1,
        name: `Page ${index + 1}`,
      }));

      let newSelectedKey = state.selectedPageKey;
      if (newSelectedKey === key) {
        newSelectedKey = updatedPages.length > 0 ? updatedPages[0].key : null;
      }

      return {
        pages: reorderedPages,
        selectedPageKey: newSelectedKey,
      };
    }),

  selectPage: (key) => set({ selectedPageKey: key }),
}));
