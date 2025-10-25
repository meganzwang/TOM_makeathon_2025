import { useEffect, useMemo, useState } from "react";
import { type ButtonItem, makeId } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (item: ButtonItem) => void;
  parentTitle?: string; // optional context
}

export default function CreateButtonModal({
  isOpen,
  onClose,
  onCreate,
  parentTitle,
}: Props) {
  const [type, setType] = useState<"audio" | "menu">("audio");
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setImageFile(null);
      setAudioFile(null);
      setType("audio");
    }
  }, [isOpen]);

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : undefined),
    [imageFile]
  );

  const canSubmit =
    title.trim().length > 0 && (type === "menu" || (!!audioFile && type === "audio"));

  const createItem = () => {
    if (!canSubmit) return;
    const item: ButtonItem = {
      id: makeId(),
      type,
      title: title.trim(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
      audioUrl: audioFile ? URL.createObjectURL(audioFile) : undefined,
      children: type === "menu" ? [] : undefined,
    };
    onCreate(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-lg font-semibold">
            {parentTitle ? `Add in "${parentTitle}"` : "Create Button"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-5 pb-5 pt-3">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              createItem();
            }}
          >
            <div className="flex gap-2">
              <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <input
                  type="radio"
                  name="type"
                  value="audio"
                  checked={type === "audio"}
                  onChange={() => setType("audio")}
                />
                <span className="text-sm">Audio</span>
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <input
                  type="radio"
                  name="type"
                  value="menu"
                  checked={type === "menu"}
                  onChange={() => setType("menu")}
                />
                <span className="text-sm">Folder</span>
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Title</span>
              <input
                type="text"
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm"
                placeholder="e.g., Chime"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[auto,1fr]">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">🖼️</span>
                )}
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Image (optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
              </label>
            </div>

            {type === "audio" && (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Audio file</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                  className="text-sm"
                  required={type === "audio"}
                />
                <span className="text-xs text-zinc-500">
                  Supported browser formats (mp3, wav, ogg).
                </span>
              </label>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}