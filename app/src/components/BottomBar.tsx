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
      <div className="flex items-center justify-center gap-48 py-3 px-8">
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
    rounded-2xl
    font-bold
    hover:opacity-90 hover:scale-110 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]
    active:scale-95 active:shadow-xl
    transition-all duration-200 ease-out shadow-2xl
    border-2 border-white/20
    cursor-pointer select-none touch-manipulation
    focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50
    "
      style={{
        border: "3px solid #9146FF",
        borderRadius: "1rem",
        minWidth: "150px",
        minHeight: "60px",
        backgroundColor: bgColor,
        color: "#ffffff",
        fontSize: "32px",
        lineHeight: "32px",
        padding: "0 40px",
        willChange: "transform, box-shadow, opacity"
      }}
    >
      {label}
    </button>
  );
}