import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ButtonItem } from "../types";
import { getAssetUrl } from "../store/db";
import { staticImageMap } from "../utils/imageMap";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Preload audio for faster playback
  React.useEffect(() => {
    if (btn.type === "audio" && btn.audioAssetId) {
      const assetId = btn.audioAssetId;
      (async () => {
        const url = await getAssetUrl(assetId);
        if (url) {
          setAudioUrl(url);
          // Preload audio and force load
          const audio = new Audio(url);
          audio.preload = "auto";
          // Force load by calling load()
          audio.load();
          audioRef.current = audio;
        }
      })();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [btn.type, btn.audioAssetId, audioUrl]);

  const handleClick = () => {
    // Immediate haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    if (btn.type === "link" && btn.linkPageId) {
      setIsLoading(true);
      // Small delay to show loading state
      setTimeout(() => nav(`/p/${btn.linkPageId}`), 100);
      return;
    }
    if (btn.type === "audio") {
      // Use requestAnimationFrame for instant, smooth visual update
      requestAnimationFrame(() => {
        setIsPlaying(true);
        setProgress(0);
      });
      
      // Use preloaded audio if available
      if (audioRef.current && audioUrl) {
        audioRef.current.currentTime = 0;
        // Play immediately - this is synchronous once loaded
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error("Audio playback failed:", err);
            setIsPlaying(false);
          });
        }
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(percent);
          }
        };
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setProgress(0);
        };
        return;
      }
      
      // Fallback: load audio dynamically (if preload failed)
      if (btn.audioAssetId) {
        getAssetUrl(btn.audioAssetId).then(url => {
          if (url) {
            const audio = new Audio(url);
            audio.play().catch((err) => {
              console.error("Audio playback failed:", err);
              setIsPlaying(false);
            });
            audio.addEventListener("ended", () => {
              URL.revokeObjectURL(url);
              setIsPlaying(false);
            });
          } else {
            // Fallback to text-to-speech
            if ("speechSynthesis" in window) {
              const utter = new SpeechSynthesisUtterance(btn.label);
              utter.onend = () => setIsPlaying(false);
              utter.onerror = () => setIsPlaying(false);
              speechSynthesis.speak(utter);
            } else {
              setIsPlaying(false);
            }
          }
        });
      } else if ("speechSynthesis" in window) {
        // No audio asset, use text-to-speech
        const utter = new SpeechSynthesisUtterance(btn.label);
        utter.onend = () => setIsPlaying(false);
        utter.onerror = () => setIsPlaying(false);
        speechSynthesis.speak(utter);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      disabled={isLoading || isPlaying}
      aria-label={`${btn.label} - ${btn.type === 'audio' ? 'Play audio' : 'Navigate'}`}
      aria-busy={isLoading}
      className={`w-full h-full !rounded-2xl shadow-2xl flex flex-col items-center justify-start overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400 ${!isLoading && !isPlaying ? 'hover:scale-105' : ''} ${isPressed ? 'scale-95 brightness-95' : ''} transition-all duration-75 relative hover:shadow-[0_25px_60px_rgba(145,70,255,0.4)] hover:-translate-y-1 ${isPlaying ? 'animate-pulse-subtle ring-4 ring-purple-400' : ''} ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
      style={{ backgroundColor: "#FFFFFF", border: "4px solid #9146FF" }}
    >
      {btn.type === "link" && (
        <div
          className="flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 30,
            width: "36px",
            height: "36px",
            backgroundColor: "#9146FF",
            border: "3px solid #FFFFFF"
          }}
        >
          <span className="font-extrabold" style={{ fontSize: "24px", color: "#FFFFFF", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>+</span>
        </div>
      )}
      <div className="w-full px-4 pt-3 pb-2 text-center relative">
        <span
          className="font-extrabold leading-none tracking-tight"
          style={{
            fontSize: "30px",
            color: "#9146FF",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          {btn.label}
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {isPlaying && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      <div className="flex-1 w-full px-3 pb-3 pt-2 flex items-center justify-center overflow-hidden">
        <CardImage btn={btn} />
      </div>
      {isPlaying && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-200">
          <div 
            className="h-full bg-purple-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
}

function CardImage({ btn }: { btn: ButtonItem }) {
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
    <div className={`h-40 w-40 rounded-2xl bg-purple-100 border-4 flex items-center justify-center shadow-xl hover:scale-105 transition-transform`} style={{ borderColor: "#9146FF" }}>
      <span
        className="font-extrabold"
        style={{
          fontSize: "56px",
          color: "#9146FF",
          fontFamily: "Outfit, sans-serif"
        }}
      >
        {initial}
      </span>
    </div>
  );
}