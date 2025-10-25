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
    <div
      className="relative flex flex-col h-[100dvh] w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Fixed Top Bar */}
      <TopBar title={page.title} onOpenSettings={() => setSettingsOpen(true)} />
<<<<<<< HEAD
      <div style={{ height: "calc(12px + env(safe-area-inset-top))" }} />

      {/* Content area fills remaining space */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-hidden">
        {/* Title Section */}
        <h1 className="text-3xl font-bold text-white mb-6 text-center shrink-0">
          {page.title}
        </h1>

        {/* Grid fills all remaining space under title */}
        <div className="
        flex-1 flex items-center justify-center w-full 
        px-6 sm:px-6 md:px-10 lg:px-16 overflow-hidden"
        >
          <Grid page={page} />
        </div>
=======
      <div
        className="mx-auto max-w-6xl px-4 pb-20"
        style={{
          height: "calc(100vh - 64px - 64px - 80px)",
          // topbar ~ 48px + padding, bottom bar ~ 64px
        }}
      >
        <Grid page={page} />
>>>>>>> 5e85e7d3b51c7ee4b059cfec2b0586bd6d46354f
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
  //const rows = page.grid.rows;

  return (
    <div
<<<<<<< HEAD
      className="grid
        gap-y-10 gap-x-10              /* gaps between buttons */
        sm:gap-y-8 sm:gap-x-8
        md:gap-y-10 md:gap-x-10
        lg:gap-y-12 lg:gap-x-12
        justify-center               /* horizontally center full grid */
        transition-all"
      
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        //gridAutoRows: "1fr", // ensures rows auto-size evenly
        //gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
=======
      className="grid gap-6 p-6 h-full place-content-start mt-200"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
>>>>>>> 5e85e7d3b51c7ee4b059cfec2b0586bd6d46354f
      }}
    >
      {page.buttons.map((b: any) => (
        <div
          key={b.id}
<<<<<<< HEAD
          className="flex items-center justify-center"
          style={{ 
            gridColumn: `span ${b.colSpan ?? 1}`,
           // aspectRatio: "1 / 1", // keeps buttons square
            //maxWidth: "240px",
            //maxHeight: "240px",
            width: "clamp(180px, 18vw, 260px)",
            height: "clamp(180px, 18vw, 260px)",
          }}
=======
          className="m-2 p-6 w-full h-full"
          style={{ gridColumn: `span ${b.colSpan ?? 1}` }}
>>>>>>> 5e85e7d3b51c7ee4b059cfec2b0586bd6d46354f
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