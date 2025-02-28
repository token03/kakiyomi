import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useContext,
} from 'react';
import { Page } from '../types/interfaces';

interface PageContextType {
  pages: Page[];
  addPage: (page: Omit<Page, 'key'>) => void;
  updatePage: (key: string, updates: Partial<Page>) => void;
  deletePage: (key: string) => void;
  selectedPageKey: string | null;
  selectPage: (key: string) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const usePageContext = (): PageContextType => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageContext must be used within a PageContextProvider');
  }
  return context;
};

export const PageContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  /**
   * Helper function to create a page with a unique key.
   * Defined *before* it's used in `useState` initializer to avoid ReferenceError.
   * @param {Omit<Page, 'key'>} page - Page data without a key.
   * @returns {Page} - Page data with a generated key.
   */
  const createPageWithKey = (page: Omit<Page, 'key'>): Page => ({
    ...page,
    key: crypto.randomUUID(),
  });

  const [pages, setPages] = useState<Page[]>(() => {
    const initialPage: Omit<Page, 'key'> = {
      name: 'Page 1',
      order: 1,
      sourceImage: 'https://i.redd.it/atxs52s7fnv21.jpg',
      textBoxes: [
        {
          key: crypto.randomUUID(),
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
          key: crypto.randomUUID(),
          text: "Sample Text Box 2",
          x: 250,
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
    return [createPageWithKey(initialPage)];
  });
  const [selectedPageKey, setSelectedPageKey] = useState<string | null>(pages[0]?.key || null);


  const addPage = useCallback((newPage: Omit<Page, 'key'>) => {
    setPages((prevPages) => [...prevPages, createPageWithKey(newPage)]);
  }, []);

  const updatePage = useCallback((key: string, updates: Partial<Page>) => {
    setPages((prevPages) =>
      prevPages.map((page) => (page.key === key ? { ...page, ...updates } : page))
    );
  }, []);

  const deletePage = useCallback((key: string) => {
    setPages((prevPages) => prevPages.filter((page) => page.key !== key));
  }, []);

  const selectPage = useCallback((key: string) => {
    setSelectedPageKey(key);
  }, []);


  const contextValue: PageContextType = {
    pages,
    addPage,
    updatePage,
    deletePage,
    selectedPageKey,
    selectPage,
  };

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
};
