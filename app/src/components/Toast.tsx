import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
};

export default function Toast({ message, type = "info", duration = 2000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = 
    type === "success" 
      ? "bg-green-500" 
      : type === "error" 
      ? "bg-red-500" 
      : "bg-purple-500";

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] ${bgColor} text-white px-6 py-3 rounded-2xl shadow-2xl animate-slideInUp`}>
      <div className="font-bold text-lg flex items-center gap-2">
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "ℹ"}
        <span>{message}</span>
      </div>
    </div>
  );
}
