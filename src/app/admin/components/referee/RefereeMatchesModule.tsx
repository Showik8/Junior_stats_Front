import { useState } from "react";
import { MatchReferee, REFEREE_ROLES } from "@/types/admin";
import MatchReportForm from "../MatchReportForm";
import { FaCalendar, FaMapMarkerAlt, FaUserTie, FaTrophy, FaFileAlt, FaSearch } from "react-icons/fa";

interface RefereeMatchesModuleProps {
  myMatches: MatchReferee[];
  onRefresh: () => void;
}

const RefereeMatchesModule: React.FC<RefereeMatchesModuleProps> = ({ myMatches, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [reportingMatch, setReportingMatch] = useState<MatchReferee | null>(null);

  const filteredMatches = statusFilter
    ? myMatches.filter((mr) => mr.match?.status === statusFilter)
    : myMatches;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">ჩემი მატჩები</h2>
          <p className="text-sm text-gray-500 mt-1">ფილტრაცია სტატუსის მიხედვით</p>
        </div>
        <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1 gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { value: "", label: "ყველა", count: myMatches.length },
            { value: "SCHEDULED", label: "მოსალ.", count: myMatches.filter(m => m.match?.status === "SCHEDULED").length },
            { value: "IN_PROGRESS", label: "ლაივი", count: myMatches.filter(m => m.match?.status === "IN_PROGRESS").length },
            { value: "FINISHED", label: "დასრულ.", count: myMatches.filter(m => m.match?.status === "FINISHED").length },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === f.value
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusFilter === f.value ? "bg-white/20" : "bg-gray-200"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
          <FaCalendar className="mb-4 text-4xl opacity-20" />
          <p className="font-medium text-gray-500 text-lg">მატჩები არ მოიძებნა</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMatches.map((mr) => {
            const match = mr.match;
            if (!match) return null;

            const isScheduled = match.status === "SCHEDULED";
            const isInProgress = match.status === "IN_PROGRESS";
            const isFinished = match.status === "FINISHED";
            const roleLabel =
              REFEREE_ROLES.find((r) => r.value === mr.role)?.label || mr.role;

            return (
              <div
                key={mr.id}
                className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-md ${
                  isScheduled
                    ? "border-blue-100"
                    : isInProgress
                    ? "border-purple-200 ring-1 ring-purple-100"
                    : "border-gray-100"
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                        <FaTrophy className="text-amber-500 text-xs" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        {match.tournament?.name || "ტურნირი"}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-purple-50 text-purple-700 border border-purple-100">
                      {roleLabel}
                    </span>
                  </div>

                  {/* Complete Row Layout for match */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Time & Date Block */}
                    <div className="flex items-center gap-3 md:w-48 bg-gray-50 p-3 rounded-xl">
                      <div className="flex flex-col items-center justify-center h-12 w-12 bg-white rounded-lg border border-gray-100 shadow-sm shrink-0">
                        <span className="text-base font-black text-gray-900">
                          {new Date(match.date).toLocaleDateString("en", { day: "2-digit" })}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                          {new Date(match.date).toLocaleDateString("en", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                           isScheduled ? "bg-blue-100 text-blue-700" :
                           isInProgress ? "bg-purple-100 text-purple-700 animate-pulse" :
                           "bg-emerald-100 text-emerald-700"
                        }`}>
                          {match.status}
                        </span>
                        <p className="text-xs font-medium text-gray-500">
                          {new Date(match.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>

                    {/* Teams & Score */}
                    <div className="flex-1 flex items-center justify-center gap-3 my-2 md:my-0">
                      <div className="flex-1 text-right truncate">
                        <span className="font-bold text-sm text-gray-900">{match.homeTeam?.name || "?"}</span>
                      </div>
                      {isFinished || isInProgress ? (
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 rounded-xl text-white shadow-inner shrink-0">
                          <span className="text-lg font-bold w-6 text-center">{match.homeScore ?? "-"}</span>
                          <span className="text-gray-500">:</span>
                          <span className="text-lg font-bold w-6 text-center">{match.awayScore ?? "-"}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-1.5 bg-gray-100 rounded-lg text-gray-400 font-bold text-xs shrink-0">
                          VS
                        </div>
                      )}
                      <div className="flex-1 text-left truncate">
                        <span className="font-bold text-sm text-gray-900">{match.awayTeam?.name || "?"}</span>
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="md:w-auto flex justify-end">
                      {(isScheduled || isInProgress) && mr.role === "MAIN" ? (
                        <button
                          onClick={() => setReportingMatch(mr)}
                          className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 ${
                            isInProgress 
                              ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' 
                              : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                          }`}
                        >
                          <FaFileAlt /> {isInProgress ? "ოქმის გაგრძელება" : "ოქმის შევსება"}
                        </button>
                      ) : (
                        <div className="px-4 py-2 text-xs font-medium text-gray-400 bg-gray-50 rounded-lg whitespace-nowrap hidden md:block border border-gray-100">
                          <FaMapMarkerAlt className="inline mr-1" /> {match.venue || "სტადიონი ?"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Match Report Modal Overlay */}
      {reportingMatch && reportingMatch.match && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReportingMatch(null)} />
          <div className="relative z-10 w-full max-w-[95vw] sm:max-w-4xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl">
            <MatchReportForm
              match={reportingMatch.match}
              onClose={() => setReportingMatch(null)}
              onSuccess={() => {
                setReportingMatch(null);
                onRefresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RefereeMatchesModule;
