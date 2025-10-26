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
    <div className="bg-transparent pb-[var(--safe-bottom)] flex justify-center backdrop-blur-sm">
      <div className="flex items-center justify-center gap-8 py-4 px-8">
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
    rounded-3xl
    font-extrabold
    hover:opacity-90 hover:scale-110 active:scale-95
    transition-all duration-300 shadow-2xl
    border-4 border-white/30
    hover:border-white/50
    hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
    "
      style={{
        minWidth: "180px",
        minHeight: "75px",
        backgroundColor: bgColor,
        color: "#ffffff",
        fontSize: "36px",
        lineHeight: "36px",
        padding: "0 48px",
        fontFamily: "Outfit, sans-serif"
      }}
    >
      {label}
    </button>
  );
}