import React from "react";
import { Tournament, TournamentAgeCategory } from "@/types/admin";

interface TournamentInfoProps {
  tournament: Tournament | null;
  loading: boolean;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const isActive = status === "ACTIVE";
  
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
        }`}
      ></div>
      {status}
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
          // Handle both object wrapper (Backend return) and direct string (optimistic updates/legacy)
          if (typeof cat === 'object' && cat !== null && 'ageCategory' in cat) {
            return (cat as TournamentAgeCategory).ageCategory;
          }
          // Fallback if data structure is unexpected but still iterable
          return String(cat);
        })
        .join(", ")
        .replace(/_/g, "-");
    }
    
    // Fallback for legacy single category
    return legacyCategory?.replace(/_/g, "-") || "N/A";
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
      <span className="text-gray-400 uppercase text-xs font-bold">
        Categories
      </span>
      <span className="font-semibold text-gray-700">
        {getFormattedCategories()}
      </span>
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
    <div 
      className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group/id cursor-pointer active:scale-95 transition-transform" 
      onClick={handleCopy}
      title="Click to copy ID"
    >
      <span className="text-gray-400 uppercase text-xs font-bold">
        ID
      </span>
      <span className={`font-mono text-xs transition-colors ${copied ? 'text-green-600' : 'text-gray-600 group-hover/id:text-blue-600'}`}>
        {copied ? 'Copied!' : id}
      </span>
    </div>
  );
};

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournament,
  loading,
}) => {
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

  if (!tournament) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group">
      {/* Decorative Background Icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <svg
          className="w-32 h-32 text-blue-600 transform rotate-12"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {tournament.name}
            </h2>
            <StatusBadge status={tournament.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <CategoryList 
              ageCategories={tournament.ageCategories} 
              legacyCategory={tournament.ageCategory} 
            />
            <CopyableId id={tournament.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentInfo;
