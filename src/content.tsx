import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  SITE,
  HERO_STATS,
  HERO_BG_IMAGE,
  ABOUT,
  SOCIAL,
  CATEGORIES,
  PORTFOLIO_IMAGES,
} from "./config";

/* ─── Types ─── */
export interface PortfolioImage {
  id: string;
  src: string;
  srcFull: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  gear: string;
  location: string;
}

export interface SiteContent {
  site: typeof SITE;
  heroStats: typeof HERO_STATS;
  heroBgImage: string;
  about: typeof ABOUT;
  social: typeof SOCIAL;
  categories: string[];
  portfolioImages: PortfolioImage[];
}

const STORAGE_KEY = "upacers_content_v2";

/* Default content (from config.ts) */
const DEFAULT_CONTENT: SiteContent = {
  site: SITE,
  heroStats: HERO_STATS,
  heroBgImage: HERO_BG_IMAGE,
  about: ABOUT,
  social: SOCIAL,
  categories: CATEGORIES,
  portfolioImages: PORTFOLIO_IMAGES as PortfolioImage[],
};

/** Load saved content from the browser, or fall back to defaults */
function loadContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so new fields aren't missing
      return { ...DEFAULT_CONTENT, ...parsed };
    }
  } catch (e) {
    console.warn("Could not load saved content", e);
  }
  return DEFAULT_CONTENT;
}

/* ─── Image compression ───
 * Resizes + compresses uploaded photos before saving so they:
 *   1. Fit in the browser's storage (avoid quota errors)
 *   2. Protect your full-resolution originals (only a web-size copy is stored)
 */
export async function compressImage(
  file: File,
  maxWidth = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/** Read a file directly as a data URL (fallback when compression isn't possible) */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/* ─── Context ─── */
interface ContentContextValue extends SiteContent {
  update: (partial: Partial<SiteContent>) => void;
  addImage: (image: PortfolioImage) => void;
  updateImage: (id: string, partial: Partial<PortfolioImage>) => void;
  deleteImage: (id: string) => void;
  resetAll: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);

  // Auto-save to browser storage whenever anything changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      alert(
        "⚠️ Storage is full! Try removing some photos or using smaller images."
      );
    }
  }, [content]);

  const update = (partial: Partial<SiteContent>) =>
    setContent((prev) => ({ ...prev, ...partial }));

  const addImage = (image: PortfolioImage) =>
    setContent((prev) => ({
      ...prev,
      portfolioImages: [image, ...prev.portfolioImages],
    }));

  const updateImage = (id: string, partial: Partial<PortfolioImage>) =>
    setContent((prev) => ({
      ...prev,
      portfolioImages: prev.portfolioImages.map((img) =>
        img.id === id ? { ...img, ...partial } : img
      ),
    }));

  const deleteImage = (id: string) =>
    setContent((prev) => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter((img) => img.id !== id),
    }));

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(DEFAULT_CONTENT);
  };

  return (
    <ContentContext.Provider
      value={{ ...content, update, addImage, updateImage, deleteImage, resetAll }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
