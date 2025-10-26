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
      { id: "r_zaxbys", type: "audio", label: "Zaxby's" },
      { id: "r_ihop", type: "audio", label: "iHOP" },
      { id: "r_kroger", type: "audio", label: "Kroger" },
      { id: "r_applebees", type: "audio", label: "Applebees" },
      { id: "r_wendys", type: "audio", label: "Wendy's" },
      { id: "r_olive_garden", type: "audio", label: "Olive Garden" },
      { id: "r_cheesecake", type: "audio", label: "Cheescake Factory" },
      { id: "r_thida_thai", type: "audio", label: "Thida Thai" },
      { id: "r_taziki", type: "audio", label: "Taziki" },
      { id: "r_panda", type: "audio", label: "Panda Express" },
      { id: "r_thai_papaya", type: "audio", label: "Thai Papaya" },
      { id: "r_fat_mos", type: "audio", label: "Fat MO's" }
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