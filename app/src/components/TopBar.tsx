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
    <div className="w-full px-8 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <button
          className="text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl px-6 py-3 font-bold transition-all duration-300 shadow-xl border border-white/30 hover:border-white/50 hover:scale-105 active:scale-95 hover:shadow-2xl"
          onClick={goBack}
          aria-label="Back"
          style={{
            fontSize: "18px",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          ← Back
        </button>
        <div
          className="text-white font-extrabold tracking-tight drop-shadow-lg"
          style={{
            fontSize: "32px",
            fontFamily: "Outfit, sans-serif",
            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}
        >
          {title}
        </div>
        <button
          className="text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl px-6 py-3 font-bold transition-all duration-300 shadow-xl border border-white/30 hover:border-white/50 hover:scale-105 active:scale-95 hover:shadow-2xl"
          onClick={onOpenSettings}
          aria-label="Settings"
          style={{
            fontSize: "18px",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          ⚙ Settings
        </button>
      </div>
    </div>
  );
}