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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate page load and reset loading state
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!page) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-white text-2xl font-bold">Page not found</div>
    </div>
  );

  const bgColor = page.parentId 
  ? (getPageById(page.parentId)?.bgColor ?? page.bgColor) 
  : page.bgColor;

  return (
    <div className="min-h-screen w-full transition-colors duration-500" style={{ backgroundColor: bgColor }}>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-purple-600 font-bold text-xl">Loading...</div>
          </div>
        </div>
      )}
      <TopBar title={page.title} onOpenSettings={() => setSettingsOpen(true)} />
      <div
        className="mx-auto max-w-7xl px-6 pb-24"
        style={{
          height: "calc(100vh - 64px - 64px - 80px)",
          // topbar ~ 48px + padding, bottom bar ~ 64px
        }}
      >
        <Grid page={page} isLoading={isLoading} />
      </div>

      {/* Fixed Bottom Bar */}
      <BottomBar />

      {/* Settings modal */}
      {settingsOpen && (
        <React.Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        }>
          <SettingsLazy page={page} onClose={() => setSettingsOpen(false)} />
        </React.Suspense>
      )}
    </div>
  );
}

function Grid({ page, isLoading }: { page: any; isLoading: boolean }) {
  const cols = page.grid.cols;
  const rows = page.grid.rows;

  return (
    <div
      className={`grid gap-6 h-full place-content-start mt-8 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100 animate-fadeIn'}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {page.buttons.map((b: any, index: number) => (
        <div
          key={b.id}
          className="w-full h-full"
          style={{ 
            gridColumn: `span ${b.colSpan ?? 1}`,
            animation: `slideInUp 0.5s ease-out ${index * 0.05}s both`
          }}
        >
          <ButtonCard btn={b} pageBg={page.bgColor} radius="full" />
        </div>
      ))}
    </div>
  );
}

const SettingsLazy = React.lazy(async () => {
  const mod = await import("../components/SettingsModal");
  return { default: mod.default };
});