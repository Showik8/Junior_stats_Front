import { GiShield } from "react-icons/gi";

interface TeamLogoProps {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  rounded?: "full" | "lg" | "xl" | "2xl";
}

const sizeMap = {
  xs: { container: "w-7 h-7", icon: 12, img: "w-[65%] h-[65%]" },
  sm: { container: "w-8 h-8", icon: 14, img: "w-[70%] h-[70%]" },
  md: { container: "w-10 h-10", icon: 18, img: "w-7 h-7" },
  lg: { container: "w-16 h-16", icon: 28, img: "w-[70%] h-[70%]" },
  xl: { container: "w-20 h-20 md:w-24 md:h-24", icon: 36, img: "w-[70%] h-[70%]" },
};

export default function TeamLogo({ src, alt = "", size = "md", className = "", rounded = "xl" }: TeamLogoProps) {
  const s = sizeMap[size];

  return (
    <div
      className={`${s.container} rounded-${rounded} bg-white/5 border border-white/8 flex items-center justify-center shrink-0 overflow-hidden ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className={`${s.img} object-contain`} />
      ) : (
        <GiShield size={s.icon} className="text-white/20" />
      )}
    </div>
  );
}
