import { FiUser } from "react-icons/fi";

interface PlayerAvatarProps {
  src?: string | null;
  name?: string;
  shirtNumber?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", icon: 12, text: "text-[10px]", border: "border" },
  md: { container: "w-12 h-12", icon: 16, text: "text-xs", border: "border-2" },
  lg: { container: "w-14 h-14", icon: 20, text: "text-sm", border: "border-2" },
};

export default function PlayerAvatar({ src, name, shirtNumber, size = "md", className = "" }: PlayerAvatarProps) {
  const s = sizeMap[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name || ""}
        className={`${s.container} rounded-full object-cover ${s.border} border-white/8 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${s.container} rounded-full bg-white/[0.04] flex items-center justify-center ${s.border} border-white/5 shrink-0 ${className}`}
    >
      {shirtNumber ? (
        <span className={`${s.text} font-bold text-slate-500`}>{shirtNumber}</span>
      ) : (
        <FiUser size={s.icon} className="text-white/20" />
      )}
    </div>
  );
}
