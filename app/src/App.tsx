import { useCallback, useState } from "react";
import type { ButtonItem, makeId } from "./types";
import ButtonCard from "./components/ButtonCard";
import CreateButtonModal from "./components/CreateButtonModal";
import MenuOverlay from "./components/MenuOverlay";

function addChildTo(items: ButtonItem[], parentId: string, child: ButtonItem): ButtonItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      const kids = item.children ? [...item.children, child] : [child];
      return { ...item, children: kids };
    }
    if (item.type === "menu" && item.children && item.children.length) {
      return { ...item, children: addChildTo(item.children, parentId, child) };
    }
    return item;
  });
}

export default function App() {
  const [items, setItems] = useState<ButtonItem[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<ButtonItem | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    // Stop any currently playing audio
    if (audioEl) {
      audioEl.pause();
      setAudioEl(null);
    }
    const a = new Audio(audioUrl);
    setAudioEl(a);
    a.play().catch(() => {
      // Silently fail; e.g., user gesture required
    });
  }, [audioEl]);

  const onItemClick = (item: ButtonItem) => {
    if (item.type === "audio" && item.audioUrl) {
      playAudio(item.audioUrl);
    } else if (item.type === "menu") {
      setOpenMenu(item);
    }
  };

  const addTopLevelItem = (item: ButtonItem) => {
    setItems((prev) => [...prev, item]);
  };

  const addChildItem = (parentId: string, child: ButtonItem) => {
    setItems((prev) => addChildTo(prev, parentId, child));
  };

  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col">
      <header className="px-4 pt-8">
        <h1 className="text-center text-2xl font-semibold">Sound & Menu Board</h1>
        <p className="mt-1 text-center text-sm text-zinc-*600">
          Minimal, friendly buttons. Tap to play or open menus.
        </p>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <ButtonCard key={item.id} item={item} onClick={onItemClick} />
          ))}

          {/* Create button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-*300 bg-zinc-*50 p-4 text-zinc-*500 hover:border-zinc-*400 hover:bg-zinc-*100"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-zinc-*300 bg-white">
              <span className="text-3xl">＋</span>
            </div>
            <div className="text-sm font-medium">Create</div>
            <div className="text-xs">Add a new button</div>
          </button>
        </div>
      </main>

      <footer className="pb-6 text-center text-xs text-zinc-*500">
        <span>Built with React, Vite, Tailwind</span>
      </footer>

      {/* Create modal for top-level buttons */}
      <CreateButtonModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={addTopLevelItem}
      />

      {/* Menu overlay */}
      <MenuOverlay
        isOpen={!!openMenu}
        rootMenu={openMenu}
        onClose={() => setOpenMenu(null)}
        onCreateChild={addChildItem}
        onPlayAudio={playAudio}
      />
    </div>
  );
}