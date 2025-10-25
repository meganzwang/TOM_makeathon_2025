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
    <div className="fixed top-0 left-0 right-0 z-30 h-12 px-2 pt-[var(--safe-top)] flex items-center justify-between">
      <button
        className="text-sm text-white/90 bg-black/30 hover:bg-black/40 rounded-full px-3 py-1"
        onClick={goBack}
        aria-label="Back"
      >
        ← Back
      </button>
      <div className="text-white font-poppins font-bold text-base">{title}</div>
      <button
        className="text-sm text-white/90 bg-black/30 hover:bg-black/40 rounded-full px-3 py-1"
        onClick={onOpenSettings}
        aria-label="Settings"
      >
        ⚙ Settings
      </button>
    </div>
  );
}