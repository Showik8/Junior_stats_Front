import React from "react";
import { Tournament } from "@/types/admin";

interface TournamentInfoProps {
  tournament: Tournament | null;
  loading: boolean;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  tournament,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!tournament) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {tournament.name}
          </h2>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
              Category:{" "}
              {tournament.ageCategories?.length
                ? tournament.ageCategories.join(", ")
                : tournament.ageCategory || "N/A"}
            </span>
            <span className="text-gray-400">|</span>
            <span className="font-mono text-xs">ID: {tournament.id}</span>
          </div>
        </div>
        <div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tournament.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tournament.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TournamentInfo;
