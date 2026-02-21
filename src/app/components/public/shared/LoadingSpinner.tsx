import { IconType } from "react-icons";
import { GiSoccerBall } from "react-icons/gi";

interface LoadingSpinnerProps {
  icon?: IconType;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { spinner: "w-10 h-10", icon: 14, border: "border-[2px]" },
  md: { spinner: "w-16 h-16", icon: 20, border: "border-[3px]" },
  lg: { spinner: "w-20 h-20", icon: 24, border: "border-[3px]" },
};

export default function LoadingSpinner({ icon: Icon = GiSoccerBall, size = "md" }: LoadingSpinnerProps) {
  const s = sizes[size];

  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <div className="relative">
        <div className={`${s.spinner} ${s.border} border-white/5 border-t-emerald-500 rounded-full animate-spin`} />
        <Icon
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"
          size={s.icon}
        />
      </div>
    </div>
  );
}
