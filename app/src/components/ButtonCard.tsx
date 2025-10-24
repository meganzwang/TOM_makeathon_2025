import type { ButtonItem } from "../types";

interface ButtonCardProps {
  item: ButtonItem;
  onClick: (item: ButtonItem) => void;
}

export default function ButtonCard({ item, onClick }: ButtonCardProps) {
  const isAudio = item.type === "audio";
  const isMenu = item.type === "menu";

  return (
    <button
      onClick={() => onClick(item)}
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft transition hover:shadow-md focus-visible:shadow-md"
      aria-label={`${item.title} (${item.type})`}
    >
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-zinc-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl">{isAudio ? "🔊" : "🗂️"}</span>
        )}
      </div>

      <div className="text-center">
        <div className="text-sm font-medium">{item.title}</div>
        <div className="mt-0.5 text-xs text-zinc-500">
          {isAudio ? "Audio" : "Menu"}
        </div>
      </div>

      {isAudio && (
        <div className="absolute right-2 top-2 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-600">
          Play
        </div>
      )}
      {isMenu && (
        <div className="absolute right-2 top-2 rounded-full bg-sky-50 px-2 py-1 text-xs text-sky-600">
          Open
        </div>
      )}
    </button>
  );
}