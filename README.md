Below is a minimal, clean React + Vite + Tailwind app that meets your requirements. It includes:

- Central arrays of buttons (audio or page-link type), bold Poppins labels above images, plus-in-circle for link buttons, brand button color #9146FF.
- Three main pages and their subpages with specified layouts that always fit in the viewport (no scrolling).
- A persistent store (pages in localStorage, uploaded assets in IndexedDB via Dexie).
- A settings modal secured with a password (default 123), auto-closing after 30 seconds, with controls to add/remove buttons, change layout, create and link pages, upload and remove audio/images, change password, and confirmation on save.
- Back button (top-left) and Yes/Help/No bottom bar on all pages.

Configuration changes (from a default Vite React + TS project)
- Install dependencies:
  - react-router-dom
  - dexie
  - tailwindcss
  - postcss
  - autoprefixer

- Add Tailwind config and PostCSS config.
- Import Poppins font and Tailwind styles.

package.json (add dependencies)
```json
{
  "dependencies": {
    "dexie": "^4.0.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.7",
    "@types/react-dom": "^18.3.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.2",
    "vite": "^5.4.8"
  }
}
```

tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#9146FF"
      },
      fontFamily: {
        poppins: ["Poppins", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
}
```

postcss.config.js
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

index.html (load Poppins and ensure full-viewport)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AAC App</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet">
  </head>
  <body class="min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Safe area for mobile */
:root {
  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
}

html, body, #root {
  height: 100%;
}

/* Global style tweaks */
button {
  -webkit-tap-highlight-color: transparent;
}
```

React source files

src/main.tsx
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

src/types.ts
```tsx
export type ButtonType = "audio" | "link";

export type ButtonItem = {
  id: string;
  type: ButtonType;
  label: string;
  imageAssetId?: number;
  audioAssetId?: number;
  linkPageId?: string; // for link type
  colSpan?: number;     // for extended buttons spanning columns
};

export type PageDef = {
  id: string;
  slug: string;         // route path, e.g., "/", "/p/hungry"
  title: string;
  bgColor: string;      // e.g., "#C3B1E1"
  grid: { cols: number; rows: number };
  buttons: ButtonItem[];
  parentId?: string;    // subpages inherit parent's bgColor if set
};

export type AssetRecord = {
  id?: number;
  type: "audio" | "image";
  name: string;
  blob: Blob;
  createdAt: number;
};
```

src/store/db.ts
```tsx
import Dexie, { Table } from "dexie";
import type { AssetRecord } from "../types";

export class AACDB extends Dexie {
  assets!: Table<AssetRecord, number>;
  constructor() {
    super("aac-app");
    this.version(1).stores({
      assets: "++id,type,name,createdAt"
    });
  }
}

export const db = new AACDB();

// Helpers
export async function addAsset(type: "audio" | "image", file: File): Promise<number> {
  const rec: AssetRecord = {
    type,
    name: file.name,
    blob: file,
    createdAt: Date.now()
  };
  return db.assets.add(rec);
}

export async function getAssetUrl(id: number): Promise<string | undefined> {
  const rec = await db.assets.get(id);
  if (!rec) return;
  const url = URL.createObjectURL(rec.blob);
  return url;
}

export async function removeAsset(id: number) {
  await db.assets.delete(id);
}
```

src/store/useAppStore.ts
```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PageDef, ButtonItem } from "../types";

// Default colors and pages
const COLOR_HOME = "#C3B1E1";
const COLOR_HUNGRY = "#F3E8FF";     // customizable in settings
const COLOR_ACTIVITIES = "#E0F2FE"; // customizable in settings

const defaultPages: PageDef[] = [
  {
    id: "home",
    slug: "/",
    title: "Homepage",
    bgColor: COLOR_HOME,
    grid: { cols: 3, rows: 3 },
    buttons: [
      { id: "b_home_hungry", type: "link", label: "Hungry", linkPageId: "hungry" },
      { id: "b_home_activities", type: "link", label: "Activities", linkPageId: "activities" },
      { id: "b_home_chat", type: "audio", label: "Chat" },
      { id: "b_home_needs", type: "audio", label: "Needs" },
      { id: "b_home_feelings", type: "audio", label: "Feelings" },
      { id: "b_home_people", type: "audio", label: "People" },
      { id: "b_home_questions", type: "audio", label: "Questions" },
      { id: "b_home_restaurants", type: "link", label: "Restaurants", linkPageId: "restaurants" },
      { id: "b_home_yoga", type: "audio", label: "Yoga" }
    ]
  },
  {
    id: "hungry",
    slug: "/p/hungry",
    title: "Hungry",
    bgColor: COLOR_HUNGRY,
    grid: { cols: 3, rows: 2 },
    buttons: [
      { id: "b_h_rest", type: "link", label: "Restaurant", linkPageId: "restaurants", colSpan: 3 },
      { id: "b_h_meal", type: "link", label: "Meal", linkPageId: "meal" },
      { id: "b_h_snack", type: "link", label: "Snack", linkPageId: "snack" },
      { id: "b_h_drink", type: "link", label: "Drink", linkPageId: "drink" }
    ]
  },
  {
    id: "restaurants",
    parentId: "hungry",
    slug: "/p/restaurants",
    title: "Restaurants",
    bgColor: COLOR_HUNGRY,
    grid: { cols: 4, rows: 3 },
    buttons: [
      { id: "r_zaxbys", type: "audio", label: "Zaxby’s" },
      { id: "r_ihop", type: "audio", label: "iHOP" },
      { id: "r_kroger", type: "audio", label: "Kroger" },
      { id: "r_applebees", type: "audio", label: "Applebees" },
      { id: "r_wendys", type: "audio", label: "Wendy’s" },
      { id: "r_olive_garden", type: "audio", label: "Olive Garden" },
      { id: "r_cheesecake", type: "audio", label: "Cheescake Factory" },
      { id: "r_thida_thai", type: "audio", label: "Thida Thai" },
      { id: "r_taziki", type: "audio", label: "Taziki" },
      { id: "r_panda", type: "audio", label: "Panda Express" },
      { id: "r_thai_papaya", type: "audio", label: "Thai Papaya" },
      { id: "r_fat_mos", type: "audio", label: "Fat MO’s" }
    ]
  },
  {
    id: "drink",
    parentId: "hungry",
    slug: "/p/drink",
    title: "Drink",
    bgColor: COLOR_HUNGRY,
    grid: { cols: 3, rows: 1 },
    buttons: [
      { id: "d_water", type: "audio", label: "Water" },
      { id: "d_juice", type: "audio", label: "Juice" },
      { id: "d_milk", type: "audio", label: "Milk" }
    ]
  },
  {
    id: "meal",
    parentId: "hungry",
    slug: "/p/meal",
    title: "Meal",
    bgColor: COLOR_HUNGRY,
    grid: { cols: 3, rows: 1 },
    buttons: [{ id: "meal_tbd", type: "audio", label: "TBD" }]
  },
  {
    id: "snack",
    parentId: "hungry",
    slug: "/p/snack",
    title: "Snack",
    bgColor: COLOR_HUNGRY,
    grid: { cols: 3, rows: 1 },
    buttons: [{ id: "snack_tbd", type: "audio", label: "TBD" }]
  },
  {
    id: "activities",
    slug: "/p/activities",
    title: "Activities",
    bgColor: COLOR_ACTIVITIES,
    grid: { cols: 2, rows: 4 },
    buttons: [
      { id: "a_art", type: "link", label: "Art", linkPageId: "art" },
      { id: "a_yoga", type: "audio", label: "Yoga" },
      { id: "a_dance", type: "audio", label: "Dance" },
      { id: "a_music", type: "audio", label: "Music" },
      { id: "a_tv", type: "link", label: "TV", linkPageId: "tv" },
      { id: "a_walk", type: "audio", label: "Walk" },
      { id: "a_pottery", type: "audio", label: "Pottery" },
      { id: "a_swim", type: "audio", label: "Swimming" }
    ]
  },
  {
    id: "art",
    parentId: "activities",
    slug: "/p/art",
    title: "Art",
    bgColor: COLOR_ACTIVITIES,
    grid: { cols: 3, rows: 1 },
    buttons: [
      { id: "art_draw", type: "audio", label: "Draw" },
      { id: "art_color", type: "audio", label: "Color" },
      { id: "art_paint", type: "audio", label: "Paint" }
    ]
  },
  {
    id: "tv",
    parentId: "activities",
    slug: "/p/tv",
    title: "TV",
    bgColor: COLOR_ACTIVITIES,
    grid: { cols: 2, rows: 4 },
    buttons: [
      { id: "tv_nursery", type: "audio", label: "Nursery" },
      { id: "tv_lorax", type: "audio", label: "Lorax" },
      { id: "tv_clifford", type: "audio", label: "Clifford" },
      { id: "tv_netflix", type: "audio", label: "Netflix" },
      { id: "tv_wordgirl", type: "audio", label: "Word Girl" },
      { id: "tv_cat_hat", type: "audio", label: "Cat & Hat" },
      { id: "tv_pbs", type: "audio", label: "PBS" },
      { id: "tv_cook", type: "audio", label: "Cooking Show" }
    ]
  }
];

type State = {
  pages: PageDef[];
  password: string;
  setPages: (pages: PageDef[]) => void;
  updatePage: (pageId: string, patch: Partial<PageDef>) => void;
  addPage: (page: PageDef) => void;
  removePage: (pageId: string) => void;
  addButton: (pageId: string, btn: ButtonItem) => void;
  updateButton: (pageId: string, btnId: string, patch: Partial<ButtonItem>) => void;
  removeButton: (pageId: string, btnId: string) => void;
  setPassword: (pw: string) => void;
  getPageBySlug: (slug: string) => PageDef | undefined;
  getPageById: (id: string) => PageDef | undefined;
};

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      pages: defaultPages,
      password: "123",
      setPages: (pages) => set({ pages }),
      updatePage: (pageId, patch) => {
        const pages = get().pages.map(p => p.id === pageId ? { ...p, ...patch } : p);
        set({ pages });
      },
      addPage: (page) => set({ pages: [...get().pages, page] }),
      removePage: (pageId) => set({ pages: get().pages.filter(p => p.id !== pageId) }),
      addButton: (pageId, btn) => {
        const pages = get().pages.map(p => p.id === pageId ? { ...p, buttons: [...p.buttons, btn] } : p);
        set({ pages });
      },
      updateButton: (pageId, btnId, patch) => {
        const pages = get().pages.map(p => {
          if (p.id !== pageId) return p;
          return {
            ...p,
            buttons: p.buttons.map(b => b.id === btnId ? { ...b, ...patch } : b)
          };
        });
        set({ pages });
      },
      removeButton: (pageId, btnId) => {
        const pages = get().pages.map(p => {
          if (p.id !== pageId) return p;
          return { ...p, buttons: p.buttons.filter(b => b.id !== btnId) };
        });
        set({ pages });
      },
      setPassword: (pw) => set({ password: pw }),
      getPageBySlug: (slug) => get().pages.find(p => p.slug === slug),
      getPageById: (id) => get().pages.find(p => p.id === id)
    }),
    {
      name: "aac-pages-store"
    }
  )
);
```

src/components/ButtonCard.tsx
```tsx
import { useNavigate } from "react-router-dom";
import type { ButtonItem } from "../types";
import { getAssetUrl } from "../store/db";

type Props = {
  btn: ButtonItem;
  pageBg: string;
};

export default function ButtonCard({ btn, pageBg }: Props) {
  const nav = useNavigate();

  const handleClick = async () => {
    if (btn.type === "link" && btn.linkPageId) {
      nav(`/p/${btn.linkPageId}`);
      return;
    }
    // Audio button
    if (btn.type === "audio") {
      if (btn.audioAssetId) {
        const url = await getAssetUrl(btn.audioAssetId);
        if (url) {
          const audio = new Audio(url);
          audio.play();
          audio.addEventListener("ended", () => URL.revokeObjectURL(url));
          return;
        }
      }
      // Fallback: speak label
      if ("speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(btn.label);
        speechSynthesis.speak(utter);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-full rounded-2xl shadow-sm border border-white/20 bg-brand text-white flex flex-col items-center justify-start overflow-hidden"
      style={{ backgroundColor: "#9146FF" }}
    >
      <div className="w-full px-2 pt-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="font-poppins font-bold text-white text-lg">{btn.label}</span>
          {btn.type === "link" && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-brand font-bold">+</span>
          )}
        </div>
      </div>
      <div className="flex-1 w-full px-4 pb-4 flex items-center justify-center">
        <CardImage btn={btn} bg={pageBg} />
      </div>
    </button>
  );
}

function CardImage({ btn }: { btn: ButtonItem; bg: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  React.useEffect(() => {
    let revoked: string | null = null;
    (async () => {
      if (btn.imageAssetId) {
        const url = await getAssetUrl(btn.imageAssetId);
        if (url) {
          setImgUrl(url);
          revoked = url;
        }
      }
    })();
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [btn.imageAssetId]);

  if (imgUrl) {
    return <img src={imgUrl} alt={btn.label} className="max-h-full max-w-full object-contain" />;
  }

  // Placeholder: initial
  const initial = btn.label?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="h-24 w-24 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
      <span className="font-poppins font-bold text-2xl text-white">{initial}</span>
    </div>
  );
}

import React, { useState } from "react";
```

src/components/TopBar.tsx
```tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  title?: string;
  onOpenSettings: () => void;
};

export default function TopBar({ title, onOpenSettings }: Props) {
  const nav = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.pathname !== "/") nav(-1);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 h-12 px-2 pt-[var(--safe-top)] flex items-center justify-between">
      <button
        className="text-sm text-white/90 bg-black/30 hover:bg-black/40 rounded-full px-3 py-1"
        onClick={goBack}
        aria-label="Back"
      >
        ← Back
      </button>
      <div className="text-white font-poppins font-bold text-base">{title}</div>
      <button
        className="text-sm text-white/90 bg-black/30 hover:bg-black/40 rounded-full px-3 py-1"
        onClick={onOpenSettings}
        aria-label="Settings"
      >
        ⚙ Settings
      </button>
    </div>
  );
}
```

src/components/BottomBar.tsx
```tsx
import React from "react";

type Props = {
  onYes?: () => void;
  onHelp?: () => void;
  onNo?: () => void;
};

function speak(text: string) {
  if ("speechSynthesis" in window) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
}

export default function BottomBar({ onYes, onHelp, onNo }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 h-16 pb-[var(--safe-bottom)] bg-black/0">
      <div className="h-full flex items-center justify-center gap-3">
        <LowButton label="Yes" onClick={() => (onYes?.(), speak("Yes"))} />
        <LowButton label="Help" onClick={() => (onHelp?.(), speak("Help"))} />
        <LowButton label="No" onClick={() => (onNo?.(), speak("No"))} />
      </div>
    </div>
  );
}

function LowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="rounded-full bg-brand/80 text-white px-4 py-2 shadow-sm border border-white/20 hover:bg-brand"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

src/components/SettingsModal.tsx
```tsx
import React from "react";
import type { PageDef, ButtonItem } from "../types";
import { useAppStore } from "../store/useAppStore";
import { addAsset, removeAsset, db } from "../store/db";

type Props = {
  page: PageDef;
  onClose: () => void;
};

export default function SettingsModal({ page, onClose }: Props) {
  const { pages, updatePage, addButton, updateButton, removeButton, addPage, setPassword, password } = useAppStore();
  const [authorized, setAuthorized] = React.useState(false);
  const [pwInput, setPwInput] = React.useState("");
  const [closeAt, setCloseAt] = React.useState<number | null>(null);
  const [draftPage, setDraftPage] = React.useState<PageDef>(page);
  const [newPageTitle, setNewPageTitle] = React.useState("");
  const [newPageSlug, setNewPageSlug] = React.useState("");
  const [newPageCols, setNewPageCols] = React.useState(2);
  const [newPageRows, setNewPageRows] = React.useState(2);
  const [newPageBg, setNewPageBg] = React.useState(page.bgColor);

  // Auto close after 30 seconds
  React.useEffect(() => {
    if (!authorized) return;
    const t = setTimeout(onClose, 30000);
    setCloseAt(Date.now() + 30000);
    return () => clearTimeout(t);
  }, [authorized, onClose]);

  const remainingMs = closeAt ? Math.max(closeAt - Date.now(), 0) : 0;

  const tryAuth = () => {
    if (pwInput === password) setAuthorized(true);
    else alert("Wrong password.");
  };

  const saveChanges = () => {
    if (!confirm("Save changes?")) return;
    updatePage(page.id, {
      title: draftPage.title,
      bgColor: draftPage.bgColor,
      grid: draftPage.grid,
      buttons: draftPage.buttons
    });
    onClose();
  };

  const addNewButton = () => {
    const btn: ButtonItem = {
      id: "btn_" + Math.random().toString(36).slice(2, 8),
      type: "audio",
      label: "New",
      colSpan: 1
    };
    setDraftPage({ ...draftPage, buttons: [...draftPage.buttons, btn] });
  };

  const createPage = () => {
    if (!newPageTitle || !newPageSlug) {
      alert("Title and slug are required");
      return;
    }
    const newPage: PageDef = {
      id: newPageSlug.replace(/^\/+/, "").replace(/\s+/g, "-"),
      slug: `/p/${newPageSlug.replace(/^\/+/, "").replace(/\s+/g, "-")}`,
      title: newPageTitle,
      bgColor: newPageBg,
      grid: { cols: newPageCols, rows: newPageRows },
      buttons: []
    };
    addPage(newPage);
    alert("Page created. You can link buttons to it now.");
  };

  const uploadAssets = async (type: "audio" | "image", files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      await addAsset(type, f);
    }
    alert("Uploaded.");
  };

  if (!authorized) {
    return (
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
          <div className="flex items-center justify-between mb-4">
            <button className="text-sm px-3 py-1 rounded-full bg-gray-100" onClick={onClose}>Close</button>
            <div className="font-poppins font-bold">Enter Password</div>
          </div>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="123"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-brand text-white rounded-lg" onClick={tryAuth}>Open Settings</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-50 m-auto bg-white w-[95%] max-w-5xl rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b">
          <button className="text-sm px-3 py-1 rounded-full bg-gray-100" onClick={onClose}>Close</button>
          <div className="font-poppins font-bold">Settings ({Math.ceil(remainingMs / 1000)}s)</div>
          <button className="px-3 py-1 rounded-full bg-brand text-white" onClick={saveChanges}>Save</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Page settings */}
          <div className="md:col-span-1 space-y-3">
            <div>
              <div className="font-semibold mb-1">Page Title</div>
              <input
                className="w-full border rounded px-3 py-2"
                value={draftPage.title}
                onChange={(e) => setDraftPage({ ...draftPage, title: e.target.value })}
              />
            </div>
            <div>
              <div className="font-semibold mb-1">Background Color</div>
              <input
                type="color"
                className="w-16 h-10 border rounded"
                value={draftPage.bgColor}
                onChange={(e) => setDraftPage({ ...draftPage, bgColor: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-semibold mb-1">Columns</div>
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="w-full border rounded px-3 py-2"
                  value={draftPage.grid.cols}
                  onChange={(e) => setDraftPage({ ...draftPage, grid: { ...draftPage.grid, cols: Number(e.target.value) } })}
                />
              </div>
              <div>
                <div className="font-semibold mb-1">Rows</div>
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="w-full border rounded px-3 py-2"
                  value={draftPage.grid.rows}
                  onChange={(e) => setDraftPage({ ...draftPage, grid: { ...draftPage.grid, rows: Number(e.target.value) } })}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="font-semibold mb-1">Change Password</div>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons list */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Buttons</div>
              <button className="px-3 py-1 bg-gray-100 rounded" onClick={addNewButton}>+ Add Button</button>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-auto">
              {draftPage.buttons.map((b, idx) => (
                <div key={b.id} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{b.label}</div>
                    <button
                      className="text-sm px-2 py-1 rounded bg-red-100"
                      onClick={() => setDraftPage({ ...draftPage, buttons: draftPage.buttons.filter(x => x.id !== b.id) })}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-xs block mb-1">Label</label>
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={b.label}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, label: e.target.value };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Type</label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={b.type}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, type: e.target.value as "audio" | "link" };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      >
                        <option value="audio">Audio</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Col Span</label>
                      <input
                        type="number"
                        min={1}
                        max={draftPage.grid.cols}
                        className="w-full border rounded px-2 py-1"
                        value={b.colSpan ?? 1}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, colSpan: Number(e.target.value) };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Link Page</label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={b.linkPageId ?? ""}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, linkPageId: e.target.value || undefined, type: "link" };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      >
                        <option value="">(none)</option>
                        {pages.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Audio Asset</label>
                      <input
                        type="number"
                        placeholder="asset id"
                        className="w-full border rounded px-2 py-1"
                        value={b.audioAssetId ?? ""}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          const v = e.target.value ? Number(e.target.value) : undefined;
                          buttons[idx] = { ...b, audioAssetId: v, type: "audio" };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Image Asset</label>
                      <input
                        type="number"
                        placeholder="asset id"
                        className="w-full border rounded px-2 py-1"
                        value={b.imageAssetId ?? ""}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          const v = e.target.value ? Number(e.target.value) : undefined;
                          buttons[idx] = { ...b, imageAssetId: v };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assets & New Page */}
          <div className="md:col-span-1 space-y-4">
            <div>
              <div className="font-semibold mb-2">Upload Audio</div>
              <input type="file" accept="audio/*" multiple onChange={(e) => uploadAssets("audio", e.target.files)} />
            </div>
            <div>
              <div className="font-semibold mb-2">Upload Image</div>
              <input type="file" accept="image/*" multiple onChange={(e) => uploadAssets("image", e.target.files)} />
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-semibold mb-2">Create New Page</div>
              <input
                className="w-full border rounded px-2 py-1 mb-2"
                placeholder="Title"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
              />
              <input
                className="w-full border rounded px-2 py-1 mb-2"
                placeholder="slug (e.g., art-2)"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="cols"
                  value={newPageCols}
                  onChange={(e) => setNewPageCols(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="rows"
                  value={newPageRows}
                  onChange={(e) => setNewPageRows(Number(e.target.value))}
                />
              </div>
              <div className="mb-2">
                <label className="text-xs block mb-1">Background</label>
                <input type="color" value={newPageBg} onChange={(e) => setNewPageBg(e.target.value)} />
              </div>
              <button className="px-3 py-2 bg-gray-100 rounded" onClick={createPage}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

src/pages/PageView.tsx
```tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import ButtonCard from "../components/ButtonCard";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";

export default function PageView() {
  const { getPageBySlug, getPageById } = useAppStore();
  const location = useLocation();
  const page = getPageBySlug(location.pathname);

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  if (!page) return <div className="p-4">Page not found</div>;

  const bgColor = page.parentId ? (getPageById(page.parentId)?.bgColor ?? page.bgColor) : page.bgColor;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: bgColor }}>
      <TopBar title={page.title} onOpenSettings={() => setSettingsOpen(true)} />
      <div
        className="mx-auto max-w-6xl px-4 pt-16 pb-20"
        style={{
          height: "calc(100vh - 16px - 64px - 64px)",
          // topbar ~ 48px + padding, bottom bar ~ 64px
        }}
      >
        <Grid page={page} />
      </div>
      <BottomBar />
      {settingsOpen && (
        <React.Suspense fallback={null}>
          <SettingsLazy page={page} onClose={() => setSettingsOpen(false)} />
        </React.Suspense>
      )}
    </div>
  );
}

function Grid({ page }: { page: any }) {
  const cols = page.grid.cols;
  const rows = page.grid.rows;

  return (
    <div
      className="grid gap-3 h-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {page.buttons.map((b: any) => (
        <div
          key={b.id}
          className="w-full h-full"
          style={{ gridColumn: `span ${b.colSpan ?? 1}` }}
        >
          <ButtonCard btn={b} pageBg={page.bgColor} />
        </div>
      ))}
    </div>
  );
}

const SettingsLazy = React.lazy(async () => {
  const mod = await import("../components/SettingsModal");
  return { default: mod.default };
});
```

src/App.tsx
```tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageView from "./pages/PageView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageView />} />
      <Route path="/p/:id" element={<PageView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

Notes and design decisions
- Button color: brand purple #9146FF is enforced via Tailwind extended color and inline background on the button.
- Label: bold Poppins above image; plus-in-circle shown only for link buttons.
- Layouts: grids compute from page’s cols/rows, span uses colSpan; Hungry page includes a single extended button spanning all columns.
- No scrolling: the grid container height subtracts the top bar and bottom bar so it always fits within the viewport.
- Subpages inherit their main page’s background color via parentId. You can adjust colors in Settings.
- Persistent storage:
  - Pages and configuration are saved in localStorage via Zustand’s persist middleware.
  - Uploaded audio/images are stored in IndexedDB with Dexie; buttons link assets by numeric asset ID.
- Settings modal:
  - Password default 123; you can change it in the modal. Modal auto-closes after 30 seconds.
  - Close button top-left; Save asks for confirmation before committing changes.
  - You can add/remove buttons, change grid size, upload assets, create pages, and link buttons to pages. Asset selection uses IDs for simplicity.
- Navigation:
  - Back button top-left navigates back unless already on home.
  - Bottom bar always shows Yes, Help, No buttons that speak their label when pressed.

If you want me to add more pages like Places or “I Did …”, or wire default audio files to play, I can extend the defaults and settings accordingly.