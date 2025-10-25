import React from "react";

type Props = {
  onYes?: () => void;
  onHelp?: () => void;
  onNo?: () => void;
};

function speak(text: string) {
  if ("speechSynthesis" in window) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
}

export default function BottomBar({ onYes, onHelp, onNo }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 h-16 pb-[var(--safe-bottom)] bg-black/0">
      <div className="h-full flex items-center justify-center gap-3">
        <LowButton label="Yes" onClick={() => (onYes?.(), speak("Yes"))} />
        <LowButton label="Help" onClick={() => (onHelp?.(), speak("Help"))} />
        <LowButton label="No" onClick={() => (onNo?.(), speak("No"))} />
      </div>
    </div>
  );
}

function LowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="rounded-full bg-brand/80 text-white px-4 py-2 shadow-sm border border-white/20 hover:bg-brand"
      onClick={onClick}
    >
      {label}
    </button>
  );
}