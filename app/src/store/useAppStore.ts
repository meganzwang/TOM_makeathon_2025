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
    title: "Chizenum's Board",
    bgColor: COLOR_HOME,
    grid: { cols: 3, rows: 3 },
    buttons: [
      { id: "b_home_hungry", type: "link", label: "Hungry", linkPageId: "hungry" },
      { id: "b_home_activities", type: "link", label: "Activities", linkPageId: "activities" },
      { id: "b_home_places", type: "link", label: "Places", linkPageId: "places" },
      { id: "b_home_chat", type: "link", label: "Chat", linkPageId: "chat" },
      { id: "b_home_needs", type: "link", label: "Needs", linkPageId: "i_need" },
      { id: "b_home_feelings", type: "link", label: "Feelings", linkPageId: "feelings" },
      { id: "b_home_i_did", type: "link", label: "I Did", linkPageId: "I_Did" },
      { id: "b_home_people", type: "link", label: "People" , linkPageId:"people"},
      { id: "b_home_questions", type: "audio", label: "Question" },
      { id: "b_home_greetings", type: "link", label: "Greetings", linkPageId:"greetings" },
    ]
  },
  {
    id: "greetings",
    slug :"/p/greetings",
    title:"Greetings",
    bgColor: COLOR_HOME,
    grid: {cols:2, rows:1},
    buttons:[
      {id:"greetings_hi", type:"audio", label:"Hi"},
      {id:"greetings_bye", type:"audio", label:"Bye"}
    ]
  },
  {
    id: "hungry",
    slug: "/p/hungry",
    title: "Hungry",
    bgColor: COLOR_HUNGRY,
    grid: { cols: 2, rows: 3 },
    buttons: [
      { id: "b_h_rest", type: "link", label: "Restaurant", linkPageId: "restaurants", colSpan: 2 },
      { id: "b_h_meal", type: "audio", label: "Meal", linkPageId: "meal" }, //changed from link as
      { id: "b_h_snack", type: "audio", label: "Snack", linkPageId: "snack" }, //dont know what to put on page
      { id: "b_h_drink", type: "link", label: "Drink", linkPageId: "drink" },
      { id: "b_h_dessert", type: "link", label: "Dessert", linkPageId: "Dessert" }
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
    id: "Dessert",
    parentId: "hungry",
    slug: "/p/Dessert",
    title: "Dessert",
    bgColor: COLOR_HUNGRY,
    grid: { cols: 3, rows: 1 },
    buttons: [{ id: "Dessert_tbd", type: "audio", label: "TBD" }]
  },
  {
    id: "activities",
    slug: "/p/activities",
    title: "Activities",
    bgColor: COLOR_ACTIVITIES,
    grid: { cols: 4, rows: 2 },
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
    grid: { cols: 4, rows: 2 },
    buttons: [
      { id: "tv_nursery", type: "audio", label: "Nursery Rhymes" },
      { id: "tv_lorax", type: "audio", label: "Lorax" },
      { id: "tv_clifford", type: "audio", label: "Clifford" },
      { id: "tv_netflix", type: "audio", label: "Netflix" },
      { id: "tv_wordgirl", type: "audio", label: "Word Girl" },
      { id: "tv_cat_hat", type: "audio", label: "Cat & Hat" },
      { id: "tv_pbs", type: "audio", label: "PBS" },
      { id: "tv_cook", type: "audio", label: "Cooking Show" }
    ]
  },
  {
    id: "places",
    parentId: "home",
    slug: "/p/places",
    title: "Places",
    bgColor: COLOR_HOME, //todo change color
    grid: { cols: 3, rows: 3 },
    buttons: [
      { id: "places_resturants", type: "link", label: "Restaurants", linkPageId: "restaurants" },
      { id: "places_bathroom", type: "audio", label: "Bathroom" },
      { id: "places_bowling", type: "audio", label: "Bowling" },
      { id: "places_shopping", type: "link", label: "Shopping", linkPageId: "Shopping" },
      { id: "places_home", type: "audio", label: "Home" },
      { id: "places_park", type: "audio", label: "Park" },
      { id: "places_movies", type: "audio", label: "Movies" },
      { id: "places_church", type: "audio", label: "Church" },
      { id: "places_dave_n_busters", type: "audio", label: "Dave & Busters" },
    ]
  },
  {
    id: "shopping",
    parentId: "places",
    slug: "/p/Shopping",
    title: "Shopping",
    bgColor: COLOR_HOME, //todo change color
    grid: { cols: 3, rows: 1 },
    buttons: [
      { id: "places_mall", type: "audio", label: "Mall" },
      { id: "places_target", type: "audio", label: "Target" },
      { id: "places_dollar_general", type: "audio", label: "Dollar General" }
    ]
  },
  {
    id: "I_Did",
    parentId: "home",
    slug: "/p/I_Did",
    title: "I Did",
    bgColor: COLOR_HOME, //todo change color
    grid: { cols: 2, rows: 2 },
    buttons: [
      { id: "i_did_i_felt", type: "link", label: "I Felt ...", linkPageId: "feelings" },
      { id: "i_did_i_ate", type: "link", label: "I Ate ...", linkPageId: "hungry" },
      { id: "i_did_i_went_to", type: "link", label: "I went to ...", linkPageId: "places" },
      { id: "i_did_i_taked_to", type: "link", label: "I talked to ...", linkPageId: "people" }
    ]
  },
  {
    id: "i_need",
    parentId: "home",
    slug: "/p/i_need",
    title: "I Need ...",
    bgColor: COLOR_HOME,
    grid: { cols: 2, rows: 2 },
    buttons: [
      { id: "i_need_bathroom", type: "audio", label: "Bathroom" },
      { id: "i_need_help", type: "audio", label: "Help" },
      { id: "i_need_sleep", type: "audio", label: "Sleep" },
      { id: "i_need_nedicine", type: "audio", label: "Medicine" }
    ]
  },
  {
    id: "feelings",
    parentId: "home",
    slug: "/p/feelings",
    title: "Feelings" ,
    bgColor: COLOR_HOME,
    grid: { cols: 4, rows: 2 },
    buttons: [
      { id: "feelings_sick", type: "link", label: "Sick", linkPageId :"sick" },
      { id: "feelings_hot", type: "audio", label: "Hot" },
      { id: "feelings_hurt", type: "link", label: "Hurt", linkPageId :"hurt" },
      { id: "feelings_cold", type: "audio", label: "Cold" },
      { id: "feelings_angry", type: "audio", label: "Angry" },
      { id: "feelings_happy", type: "audio", label: "Happy" },
      { id: "feelings_bored", type: "audio", label: "Bored" },
      { id: "feelings_sad", type: "audio", label: "Sad" }
    ]
  },
  {
    id: "sick",
    parentId: "feelings",
    slug: "/p/sick",
    title: "Sick" ,
    bgColor: COLOR_HOME,
    grid: { cols: 2, rows: 2 },
    buttons: [
      { id: "feelings_sore_throat", type: "audio", label: "Sore Throat" },
      { id: "feelings_cramps", type: "audio", label: "Cramps" },
      { id: "feelings_headache", type: "audio", label: "Headache" },
      { id: "feelings_stoamch_ache", type: "audio", label: "Stomach Ache" }
    ]
  },
  {
    id: "hurt",
    parentId: "feelings",
    slug: "/p/hurt",
    title: "Hurt" ,
    bgColor: COLOR_HOME,
    grid: { cols: 2, rows: 2 },
    buttons: [
      { id: "feelings_head", type: "audio", label: "Head" },
      { id: "feelings_stomach", type: "audio", label: "Stomach" },
      { id: "feelings_legs", type: "audio", label: "Legs" },
      { id: "feelings_arms", type: "audio", label: "Arms" }
    ]
  },
  {
    id: "chat",
    parentId: "home",
    slug: "/p/chat",
    title: "Chat" ,
    bgColor: COLOR_HOME,
    grid: { cols: 4, rows: 2 },
    buttons: [
      { id: "chat_maybe", type: "audio", label: "Maybe" },
      { id: "chat_done", type: "audio", label: "Done" },
      { id: "chat_later", type: "audio", label: "Later" },
      { id: "chat_more", type: "audio", label: "More" },
      { id: "chat_idk", type: "audio", label: "I Don't Know" },
      { id: "chat_stop", type: "audio", label: "Stop" },
      { id: "chat_ty", type: "audio", label: "Thank You" },
      { id: "chat_please", type: "audio", label: "Please" }
    ]
  },
  {
    id: "people",
    parentId: "home",
    slug: "/p/people",
    title: "People" ,
    bgColor: COLOR_HOME,
    grid: { cols: 2, rows: 4 },
    buttons: [
      { id: "people_mom", type: "audio", label: "Mom" },
      { id: "people_doctor", type: "audio", label: "Doctor" },
      { id: "people_teacher", type: "audio", label: "Teacher" },
      { id: "people_dog", type: "audio", label: "Dog" },
      { id: "people_cat", type: "audio", label: "Cat" },
      { id: "people_he", type: "audio", label: "He" },
      { id: "people_her", type: "audio", label: "Her" },
      { id: "people_chizenum", type: "audio", label: "Chizenum" }
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