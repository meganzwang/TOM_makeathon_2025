import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ButtonItem } from "../types";
import { getAssetUrl } from "../store/db";

type Props = {
  btn: ButtonItem;
  pageBg: string;
  radius?: "sm" | "md" | "lg" | "xl" | "twoxl" | "fourxl" | "sixxl" | "full";
};

const radiusMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg", 
  xl: "rounded-xl",
  twoxl: "rounded-2xl",
  fourxl: "rounded-4xl",
  sixxl: "rounded-6xl",
  full: "rounded-full"
};

export default function ButtonCard({ btn, pageBg, radius = "fourxl" }: Props) {
  const nav = useNavigate();
  const rounding = radiusMap[radius];

  const handleClick = async () => {
    if (btn.type === "link" && btn.linkPageId) return nav(`/p/${btn.linkPageId}`);
    if (btn.type === "audio") {
      if (btn.audioAssetId) {
        const url = await getAssetUrl(btn.audioAssetId);
        if (url) {
          const audio = new Audio(url);
          audio.play().catch(() => {});
          audio.addEventListener("ended", () => URL.revokeObjectURL(url));
          return;
        }
      }
      // Fallback: speak label
      if ("speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(btn.label);
        speechSynthesis.speak(utter);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`m-2 w-full h-full ${rounding} shadow-sm border ring-1 ring-white/20 bg-brand text-white flex flex-col items-center justify-start overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60`}
      style={{ backgroundColor: "#9146FF" }}
    >
      <div className="w-full px-2 pt-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="font-poppins font-bold text-white text-lg">{btn.label}</span>
          {btn.type === "link" && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-brand font-bold">+</span>
          )}
        </div>
      </div>
      <div className="flex-1 w-full px-4 pb-4 flex items-center justify-center">
        <CardImage btn={btn} rounding={rounding} bg={pageBg} />
      </div>
    </button>
  );
}

function CardImage({ btn, rounding }: { btn: ButtonItem; rounding: string; bg: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);


  React.useEffect(() => {
    let revoked: string | null = null;
    (async () => {
      if (btn.imageAssetId) {
        const url = await getAssetUrl(btn.imageAssetId);
        if (url) {
          setImgUrl(url);
          revoked = url;
        }
      }
    })();
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [btn.imageAssetId]);

  if (imgUrl) {
    return <img src={imgUrl} alt={btn.label} className="max-h-full max-w-full object-contain" />;
  }

  // Placeholder: initial
  const placeholderRound = rounding === "rounded-full" ? "rounded-2xl" : rounding;
  const initial = btn.label?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className={`h-24 w-24 ${placeholderRound} bg-white/20 border border-white/30 flex items-center justify-center`}>
      <span className="font-poppins font-bold text-2xl text-white">{initial}</span>
    </div>
  );
}