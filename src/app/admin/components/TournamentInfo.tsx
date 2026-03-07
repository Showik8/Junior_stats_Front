import React from "react";
import { Tournament, TournamentAgeCategory } from "@/types/admin";
import { FaMapMarkerAlt, FaCalendarAlt, FaTrophy } from "react-icons/fa";

interface TournamentInfoProps {
  tournament: Tournament | null;
  loading: boolean;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    INACTIVE: "bg-amber-100 text-amber-700",
    FINISHED: "bg-gray-100 text-gray-600",
  };
  const dotColors: Record<string, string> = {
    ACTIVE: "bg-emerald-500 animate-pulse",
    INACTIVE: "bg-amber-500",
    FINISHED: "bg-gray-400",
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || colors.ACTIVE}`}>
      <div className={`w-2 h-2 rounded-full ${dotColors[status] || dotColors.ACTIVE}`}></div>
      {status}
    </div>
  );
};

const FormatBadge: React.FC<{ format: string }> = ({ format }) => {
  const labels: Record<string, string> = {
    LEAGUE: "League",
    KNOCKOUT: "Knockout",
    GROUP_KNOCKOUT: "Group + Knockout",
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
      <FaTrophy className="text-blue-500 text-[10px]" />
      {labels[format] || format}
    </div>
  );
};

const CategoryList: React.FC<{ 
  ageCategories?: TournamentAgeCategory[] | null;
  legacyCategory?: string | null; 
}> = ({ ageCategories, legacyCategory }) => {
  
  const getFormattedCategories = (): string => {
    if (ageCategories && ageCategories.length > 0) {
      return ageCategories
        .map((cat) => {
          if (typeof cat === 'object' && cat !== null && 'ageCategory' in cat) {
            return (cat as TournamentAgeCategory).ageCategory;
          }
          return String(cat);
        })
        .join(", ")
        .replace(/_/g, "-");
    }
    return legacyCategory?.replace(/_/g, "-") || "N/A";
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
      <span className="text-gray-400 uppercase text-xs font-bold">Categories</span>
      <span className="font-semibold text-gray-700">{getFormattedCategories()}</span>
    </div>
  );
};

const CopyableId: React.FC<{ id: string }> = ({ id }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group/id cursor-pointer active:scale-95 transition-transform" onClick={handleCopy} title="Click to copy ID">
      <span className="text-gray-400 uppercase text-xs font-bold">ID</span>
      <span className={`font-mono text-xs transition-colors ${copied ? 'text-green-600' : 'text-gray-600 group-hover/id:text-blue-600'}`}>
        {copied ? 'Copied!' : id}
      </span>
    </div>
  );
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

const TournamentInfo: React.FC<TournamentInfoProps> = ({ tournament, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
        <div className="flex gap-4">
          <div className="h-6 bg-gray-200 rounded-md w-24"></div>
          <div className="h-6 bg-gray-200 rounded-md w-32"></div>
        </div>
      </div>
    );
  }

  if (!tournament) return null;

  const hasDateRange = tournament.startDate || tournament.endDate;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group">
      {/* Decorative Background Icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <svg className="w-32 h-32 text-blue-600 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
        </svg>
      </div>

      {/* Logo */}
      {tournament.logoUrl && (
        <div className="absolute top-4 right-4 z-10">
          <img src={tournament.logoUrl} alt={`${tournament.name} logo`} className="w-16 h-16 object-contain rounded-xl border border-gray-100 bg-white p-1 shadow-sm" />
        </div>
      )}

      <div className="relative z-10">
        {/* Header: Name + Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{tournament.name}</h2>
          <StatusBadge status={tournament.status} />
          {tournament.format && <FormatBadge format={tournament.format} />}
        </div>

        {/* Description */}
        {tournament.description && (
          <p className="text-gray-600 text-sm mb-4 max-w-2xl leading-relaxed">{tournament.description}</p>
        )}

        {/* Info chips row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <CategoryList ageCategories={tournament.ageCategories} legacyCategory={tournament.ageCategory} />

          {hasDateRange && (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <FaCalendarAlt className="text-gray-400 text-xs" />
              <span className="font-semibold text-gray-700 text-xs">
                {formatDate(tournament.startDate)}
                {tournament.startDate && tournament.endDate && " → "}
                {formatDate(tournament.endDate)}
              </span>
            </div>
          )}

          {tournament.location && (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <FaMapMarkerAlt className="text-gray-400 text-xs" />
              <span className="font-semibold text-gray-700 text-xs">{tournament.location}</span>
            </div>
          )}

          <CopyableId id={tournament.id} />
        </div>
      </div>
    </div>
  );
};

export default TournamentInfo;
