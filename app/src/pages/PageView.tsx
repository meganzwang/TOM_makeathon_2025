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
    <div className="h-screen w-full flex flex-col overflow-hidden" style={{ backgroundColor: bgColor }}>
      <TopBar title={page.title} onOpenSettings={() => setSettingsOpen(true)} />
      <div className="mx-auto w-full max-w-7xl px-8 flex-1 flex items-center justify-center overflow-auto">
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
      className="grid gap-4 w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        maxHeight: "100%"
      }}
    >
      {page.buttons.map((b: any) => (
        <div
          key={b.id}
          className="w-full h-full"
          style={{ gridColumn: `span ${b.colSpan ?? 1}` }}
        >
          <ButtonCard btn={b} pageBg={page.bgColor} radius="xl" />
        </div>
      ))}
    </div>
  );
}

const SettingsLazy = React.lazy(async () => {
  const mod = await import("../components/SettingsModal");
  return { default: mod.default };
});