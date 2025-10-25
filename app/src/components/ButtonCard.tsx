import { useNavigate } from "react-router-dom";
import type { ButtonItem } from "../types";
import { getAssetUrl } from "../store/db";

type Props = {
  btn: ButtonItem;
  pageBg: string;
};

export default function ButtonCard({ btn, pageBg }: Props) {
  const nav = useNavigate();

  const handleClick = async () => {
    if (btn.type === "link" && btn.linkPageId) {
      nav(`/p/${btn.linkPageId}`);
      return;
    }
    // Audio button
    if (btn.type === "audio") {
      if (btn.audioAssetId) {
        const url = await getAssetUrl(btn.audioAssetId);
        if (url) {
          const audio = new Audio(url);
          audio.play();
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
      className="w-full h-full rounded-2xl shadow-sm border border-white/20 bg-brand text-white flex flex-col items-center justify-start overflow-hidden"
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
        <CardImage btn={btn} bg={pageBg} />
      </div>
    </button>
  );
}

function CardImage({ btn }: { btn: ButtonItem; bg: string }) {
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
  const initial = btn.label?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="h-24 w-24 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
      <span className="font-poppins font-bold text-2xl text-white">{initial}</span>
    </div>
  );
}

import React, { useState } from "react";