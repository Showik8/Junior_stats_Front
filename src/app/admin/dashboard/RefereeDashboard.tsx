"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { refereeService } from "@/services/referee.service";
import { adminService } from "@/services/adminService";
import { MatchReferee, REFEREE_ROLES } from "@/types/admin";
import { FaCalendar, FaMapMarkerAlt, FaUserTie, FaFileAlt, FaTrophy, FaSignOutAlt } from "react-icons/fa";
import MatchReportForm from "../components/MatchReportForm";

const RefereeDashboard = () => {
  const router = useRouter();
  const [myMatches, setMyMatches] = useState<MatchReferee[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [reportingMatch, setReportingMatch] = useState<MatchReferee | null>(null);

  const handleLogout = () => {
    adminService.logoutAdmin();
    router.push("/sign-in");
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await refereeService.getMyMatches(statusFilter || undefined);
      setMyMatches(data);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const upcomingMatches = myMatches.filter(
    (mr) => mr.match?.status === "SCHEDULED"
  );
  const finishedMatches = myMatches.filter(
    (mr) => mr.match?.status === "FINISHED"
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <FaUserTie className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  მსაჯის პანელი
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  თქვენი დანიშნული მატჩები და ინფორმაცია
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
            >
              <FaSignOutAlt />
              გასვლა
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                სულ მატჩები
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FaCalendar />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {myMatches.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                მოსალოდნელი
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <FaCalendar />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {upcomingMatches.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                ჩატარებული
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <FaTrophy />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {finishedMatches.length}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {[
              { value: "", label: "ყველა" },
              { value: "SCHEDULED", label: "მოსალოდნელი" },
              { value: "FINISHED", label: "ჩატარებული" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === f.value
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : myMatches.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <FaUserTie className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              ჯერ არ ხართ დანიშნული არცერთ მატჩზე
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myMatches.map((mr) => {
              const match = mr.match;
              if (!match) return null;

              const isScheduled = match.status === "SCHEDULED";
              const roleLabel =
                REFEREE_ROLES.find((r) => r.value === mr.role)?.label ||
                mr.role;

              return (
                <div
                  key={mr.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                    isScheduled
                      ? "border-blue-100 hover:border-blue-200"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="p-6">
                    {/* Tournament info */}
                    <div className="flex items-center gap-2 mb-4">
                      <FaTrophy className="text-amber-500 text-xs" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {match.tournament?.name || "ტურნირი"}
                      </span>
                      <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        {roleLabel}
                      </span>
                    </div>

                    {/* Teams & score */}
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-right flex-1 font-bold text-gray-800 text-lg truncate">
                        {match.homeTeam?.name || "?"}
                      </div>

                      {match.status === "FINISHED" ? (
                        <div className="flex items-center bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-200 min-w-[100px] justify-center">
                          <span className="font-extrabold text-2xl text-blue-600 w-8 text-center">
                            {match.homeScore ?? "-"}
                          </span>
                          <span className="text-gray-300 mx-2 text-xl">:</span>
                          <span className="font-extrabold text-2xl text-blue-600 w-8 text-center">
                            {match.awayScore ?? "-"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center px-5 py-2.5 bg-blue-50 rounded-xl border border-blue-100 min-w-[80px]">
                          <span className="text-blue-400 font-extrabold text-xl">
                            VS
                          </span>
                        </div>
                      )}

                      <div className="text-left flex-1 font-bold text-gray-800 text-lg truncate">
                        {match.awayTeam?.name || "?"}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <FaCalendar className="text-gray-400 text-xs" />
                        <span className="font-mono text-xs">
                          {new Date(match.date).toLocaleString("ka-GE", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      {match.venue && (
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <FaMapMarkerAlt className="text-gray-400 text-xs" />
                          <span className="text-xs font-medium">
                            {match.venue}
                          </span>
                        </div>
                      )}

                      {/* Other referees on this match */}
                      {match.referees &&
                        match.referees.filter((r: MatchReferee) => r.id !== mr.id).length >
                          0 && (
                          <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 text-purple-600">
                            <FaUserTie className="text-xs" />
                            <span className="text-xs font-medium">
                              +
                              {
                                match.referees.filter((r: MatchReferee) => r.id !== mr.id)
                                  .length
                              }{" "}
                              მსაჯი
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Submit report button */}
                    {isScheduled && mr.role === "MAIN" && (
                      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
                        <button
                          onClick={() => setReportingMatch(mr)}
                          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                        >
                          <FaFileAlt /> ოქმის შევსება
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Match Report Modal */}
      {reportingMatch && reportingMatch.match && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <MatchReportForm
            match={reportingMatch.match}
            onClose={() => setReportingMatch(null)}
            onSuccess={() => {
              setReportingMatch(null);
              fetchMatches();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RefereeDashboard;
