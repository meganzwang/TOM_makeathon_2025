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
    <div className="bg-transparent pb-[var(--safe-bottom)] flex justify-center">
      <div className="flex items-center justify-center gap-6 py-6">
        <LowButton 
        label="Yes" 
        color="green"
        onClick={() => (onYes?.(), speak("Yes"))} />
        <LowButton 
        label="Help!!"
        color="dark gray" 
        onClick={() => (onHelp?.(), speak("Help"))} />
        <LowButton 
        label="No" 
        color="red"
        onClick={() => (onNo?.(), speak("No"))} />
      </div>
    </div>
  );
}

function LowButton({ label, onClick, color }: { label: string; onClick: () => void; color: "green" | "red" | "dark gray";}) {

  const bgColor = 
    color === "green"
    ? "#13ba50"
    : color === "red"
    ? "#d60f0f"
    : "#363e4a";


  return (
    <button
    onClick={onClick}
    className="
    text-white
    rounded-[5px] px-32 py-100
    front-poppins font-bold
    hover: opacity-90 active:scale-95
    tranition-transform shadow-sm
    "
      //rounded-full bg-brand/80 text-white px-4 py-2 shadow-sm border border-white/20 hover:bg-brand"
      style={{
        minWidth: "175px",
        minHeight: "90px",
        backgroundColor: bgColor,
        border: `2px solid ${bgColor}`,
        color: "#ffffff",
        fontSize: "48px",
        lineHeight: "48px"
      }}
    >
      {label}
    </button>
  );
}