import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  title?: string;
  onOpenSettings: () => void;
};

export default function TopBar({ title, onOpenSettings }: Props) {
  const nav = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.pathname !== "/") nav(-1);
  };

  return (
    <div className="w-full px-8 py-3">
      <div className="flex items-start justify-between">
        <button
          className="text-white bg-white/10 hover:bg-white/25 hover:scale-105 hover:shadow-xl backdrop-blur-sm rounded-2xl px-5 py-2.5 font-bold transition-all duration-200 ease-out shadow-lg border border-white/20 active:scale-95 active:bg-white/30 cursor-pointer select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          onClick={goBack}
          aria-label="Back"
          style={{
            fontSize: "18px",
            fontFamily: "Outfit, sans-serif",
            willChange: "transform, background-color, box-shadow"
          }}
        >
          ← Back
        </button>
        <div
          className="text-white font-bold tracking-tight"
          style={{
            fontSize: "28px",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          {title}
        </div>
        <button
          className="text-white bg-white/10 hover:bg-white/25 hover:scale-105 hover:shadow-xl backdrop-blur-sm rounded-2xl px-5 py-2.5 font-bold transition-all duration-200 ease-out shadow-lg border border-white/20 active:scale-95 active:bg-white/30 cursor-pointer select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          onClick={onOpenSettings}
          aria-label="Settings"
          style={{
            fontSize: "18px",
            fontFamily: "Outfit, sans-serif",
            willChange: "transform, background-color, box-shadow"
          }}
        >
          ⚙ Settings
        </button>
      </div>
    </div>
  );
}