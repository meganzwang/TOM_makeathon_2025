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