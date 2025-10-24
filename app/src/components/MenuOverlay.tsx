import { useMemo, useState } from "react";
import Modal from "./Modal";
import ButtonCard from "./ButtonCard";
import CreateButtonModal from "./CreateButtonModal";
import type { ButtonItem } from "../types";

interface Props {
  isOpen: boolean;
  rootMenu: ButtonItem | null;
  onClose: () => void;
  onCreateChild: (parentId: string, child: ButtonItem) => void;
  onPlayAudio: (audioUrl: string) => void;
}

export default function MenuOverlay({
  isOpen,
  rootMenu,
  onClose,
  onCreateChild,
  onPlayAudio,
}: Props) {
  const [stack, setStack] = useState<ButtonItem[]>([]);
  const [creatingFor, setCreatingFor] = useState<ButtonItem | null>(null);

  const current = useMemo(() => {
    if (!rootMenu) return null;
    return stack.length ? stack[stack.length - 1] : rootMenu;
  }, [rootMenu, stack]);

  const openChild = (item: ButtonItem) => {
    if (item.type === "menu") {
      setStack((s) => [...s, item]);
    } else if (item.type === "audio" && item.audioUrl) {
      onPlayAudio(item.audioUrl);
    }
  };

  const goBack = () => {
    setStack((s) => s.slice(0, -1));
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setStack([]);
          onClose();
        }}
        title={
          current
            ? `Menu: ${current.title}${stack.length ? ` (${stack.length} deep)` : ""}`
            : "Menu"
        }
      >
        {current && (
          <div className="flex flex-col gap-4">
            {stack.length > 0 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  ← Back
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(current.children ?? []).map((child) => (
                <ButtonCard key={child.id} item={child} onClick={openChild} />
              ))}

              {/* Create new inside this menu */}
              <button
                onClick={() => setCreatingFor(current)}
                className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-zinc-300 bg-white">
                  <span className="text-3xl">＋</span>
                </div>
                <div className="text-sm font-medium">Create</div>
                <div className="text-xs">Add here</div>
              </button>
            </div>
          </div>
        )}
      </Modal>

      <CreateButtonModal
        isOpen={!!creatingFor}
        onClose={() => setCreatingFor(null)}
        onCreate={(item) => {
          if (!creatingFor) return;
          onCreateChild(creatingFor.id, item);
        }}
        parentTitle={creatingFor?.title}
      />
    </>
  );
}