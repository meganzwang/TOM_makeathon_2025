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

  const bgColor = page.parentId 
  ? (getPageById(page.parentId)?.bgColor ?? page.bgColor) 
  : page.bgColor;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: bgColor }}>
      <TopBar title={page.title} onOpenSettings={() => setSettingsOpen(true)} />
      <div
        className="mx-auto max-w-6xl px-4 pb-20"
        style={{
          height: "calc(100vh - 64px - 64px - 80px)",
          // topbar ~ 48px + padding, bottom bar ~ 64px
        }}
      >
        <Grid page={page} />
      </div>

      {/* Fixed Bottom Bar */}
      <BottomBar />

      {/* Settings modal */}
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
      className="grid gap-3 h-full place-content-start mt-200"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {page.buttons.map((b: any) => (
        <div
          key={b.id}
          className="m-2 p-6 w-full h-full"
          style={{ gridColumn: `span ${b.colSpan ?? 1}` }}
        >
          <ButtonCard btn={b} pageBg={page.bgColor} />
        </div>
      ))}
    </div>
  );
}

const SettingsLazy = React.lazy(async () => {
  const mod = await import("../components/SettingsModal");
  return { default: mod.default };
});