import { IconType } from "react-icons";
import Link from "next/link";
import { GiSoccerBall } from "react-icons/gi";

interface EmptyStateProps {
  icon?: IconType;
  title: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
}

export default function EmptyState({
  icon: Icon = GiSoccerBall,
  title,
  message,
  backHref = "/",
  backLabel = "← მთავარზე დაბრუნება",
}: EmptyStateProps) {
  return (
    <div className="text-center py-24 animate-fade-in">
      <Icon size={64} className="text-slate-800 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      {message && <p className="text-sm text-slate-500 mb-4">{message}</p>}
      <Link
        href={backHref}
        className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
      >
        {backLabel}
      </Link>
    </div>
  );
}
