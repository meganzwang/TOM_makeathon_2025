import React from "react";
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
          className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-2.5 font-bold transition-all shadow-lg border border-white/20"
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
          className="text-white font-bold tracking-tight"
          style={{
            fontSize: "28px",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          {title}
        </div>
        <button
          className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-2.5 font-bold transition-all shadow-lg border border-white/20"
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