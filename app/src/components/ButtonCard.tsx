import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ButtonItem } from "../types";
import { getAssetUrl } from "../store/db";
import { staticImageMap } from "../utils/imageMap";

type Props = {
  btn: ButtonItem;
  pageBg: string;
};

export default function ButtonCard({ btn, pageBg }: Props) {
  const nav = useNavigate();

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
      className={`m-1 w-full h-full !rounded-xl shadow-xl flex flex-col items-center justify-start overflow-hidden
        focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400
         hover:scale-[1.05] hover:shadow-2xl hover:border-purple-600
         active:scale-[0.95] active:shadow-lg active:border-purple-700
         transition-all duration-200 ease-out
         relative cursor-pointer select-none
         touch-manipulation`}
      style={{ 
        backgroundColor: "#FFFFFF",
        border: "3px solid #9146FF",
        borderRadius: "1rem"
      }}
    >
      {btn.type === "link" && (
        <div
          className="flex items-center justify-center rounded-full shadow-md"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            zIndex: 30,
            width: "32px",
            height: "32px",
            backgroundColor: "transparent",
            border: "2.5px solid #9146FF"
          }}
        >
          <span className="font-extrabold" style={{ fontSize: "22px", color: "#9146FF", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>+</span>
        </div>
      )}
      <div className="w-full px-3 pt-2 pb-2 text-center">
        <span
          className="font-bold leading-none tracking-tight"
          style={{
            fontSize: "28px",
            color: "#9146FF",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          {btn.label}
        </span>
      </div>
      <div className="flex-1 w-full px-2 pb-2 pt-2 flex items-center justify-center overflow-hidden">
        <CardImage btn={btn} bg={pageBg} />
      </div>
    </button>
  );
}

function CardImage({ btn }: { btn: ButtonItem; bg: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  // Check for static image first
  const staticImage = staticImageMap[btn.label];

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

  // Prefer static image, then dynamic asset, then placeholder
  if (staticImage) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img src={staticImage} alt={btn.label} className="max-h-full max-w-full object-contain" style={{ maxHeight: "100%", maxWidth: "100%" }} />
      </div>
    );
  }

  if (imgUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img src={imgUrl} alt={btn.label} className="max-h-full max-w-full object-contain" style={{ maxHeight: "100%", maxWidth: "100%" }} />
      </div>
    );
  }

  // Placeholder: initial
  const initial = btn.label?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className={`h-36 w-36 rounded-xl bg-purple-100 border-2 flex items-center justify-center shadow-lg`} style={{ borderColor: "#9146FF" }}>
      <span
        className="font-extrabold"
        style={{
          fontSize: "48px",
          color: "#9146FF",
          fontFamily: "Outfit, sans-serif"
        }}
      >
        {initial}
      </span>
    </div>
  );
}