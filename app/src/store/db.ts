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