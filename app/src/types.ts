export type ButtonType = "audio" | "menu";

export interface ButtonItem {
  id: string;
  type: ButtonType;
  title: string;
  imageUrl?: string;
  audioUrl?: string;
  children?: ButtonItem[];
}

export const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);