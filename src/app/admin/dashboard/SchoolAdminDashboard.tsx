"use client";
import React, { useState, useEffect } from "react";
import { schoolService } from "@/services/school.service";
import type { FootballSchool, SchoolTeam } from "@/types/school.types";
import type { Player } from "@/types/admin";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/adminService";
import { FaExternalLinkAlt, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import type { ApiResponse } from "@/types/admin";
import SchoolStatsPanel from "../components/SchoolStatsPanel";
import TransferHistoryTable from "../components/TransferHistoryTable";
import TransferPlayerModal from "../components/TransferPlayerModal";
import EditSchoolForm from "../components/EditSchoolForm";
import AgeCategoryBadge from "../components/AgeCategoryBadge";
import Modal from "../components/Modal";
import Button from "../components/Button";

type Tab = "overview" | "teams" | "players" | "transfers" | "info";

const SchoolAdminDashboard = () => {
  const router = useRouter();
  const [school, setSchool] = useState<FootballSchool | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const schoolData = await schoolService.getMySchool();
      setSchool(schoolData);
    } catch (err) {
      console.error("Failed to fetch school:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all players across school teams
  useEffect(() => {
    if (school?.teams && activeTab === "players") {
      const fetchAllPlayers = async () => {
        setPlayersLoading(true);
        try {
          const allPlayers: Player[] = [];
          for (const team of school.teams!) {
            const response = await axiosInstance.get<ApiResponse<Player[]>>(
              `${API_PATHS.PLAYERS.GET_PLAYERS}?teamId=${team.id}`
            );
            if (response.data.data) {
              allPlayers.push(
                ...response.data.data.map((p) => ({ ...p, team: { id: team.id, name: team.name, ageCategory: team.ageCategory } as Player["team"] }))
              );
            }
          }
          setPlayers(allPlayers);
        } catch (err) {
          console.error("Failed to fetch players:", err);
        } finally {
          setPlayersLoading(false);
        }
      };
      fetchAllPlayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, school?.id]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const refreshSchool = () => {
    fetchSchool();
    setShowTransferModal(false);
    setShowEditModal(false);
    setNotification({ type: "success", text: "წარმატებით განახლდა" });
  };

  const handleLogout = () => {
    adminService.logoutAdmin();
  };

  const handleExit = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500">
        სკოლა ვერ მოიძებნა ან თქვენ არ ხართ სკოლის ადმინი
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "მიმოხილვა" },
    { key: "teams", label: "გუნდები" },
    { key: "players", label: "მოთამაშეები" },
    { key: "transfers", label: "გადაყვანები" },
    { key: "info", label: "ინფორმაცია" },
  ];

  const filteredPlayers = players.filter(
    (p) => p.name.toLowerCase().includes(playerSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header Navigation */}
      <nav className="shadow-sm border-b border-gray-200 sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & School Name */}
            <div className="flex items-center gap-3">
              {school.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={school.logoUrl} alt={school.name} className="w-9 h-9 rounded-xl object-contain bg-gray-50 border border-gray-100" />
              ) : (
                <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {school.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">
                  {school.name}
                </h1>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">
                  School Admin
                </span>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleExit}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Go to Home"
              >
                <FaExternalLinkAlt className="text-xs" />
                View Site
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign Out"
              >
                <FaSignOutAlt className="text-xs" />
                Sign Out
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => { handleExit(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
            >
              <FaExternalLinkAlt className="text-xs text-gray-400" />
              View Site
            </button>
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <FaSignOutAlt className="text-xs" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`p-4 rounded-xl shadow-sm border ${notification.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
            {notification.text}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        {activeTab === "overview" && <SchoolStatsPanel schoolId={school.id} />}

        {/* Teams */}
        {activeTab === "teams" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">გუნდები</h2>
            {(!school.teams || school.teams.length === 0) ? (
              <p className="text-gray-400 italic text-center py-12">გუნდები არ არის მიმაგრებული</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {school.teams.map((team: SchoolTeam) => (
                  <div
                    key={team.id}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {team.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-lg object-contain bg-gray-50" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                          {team.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{team.name}</p>
                        <AgeCategoryBadge category={team.ageCategory} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {team._count?.players ?? 0} მოთამაშე
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Players */}
        {activeTab === "players" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">მოთამაშეები</h2>
              <input
                type="text"
                placeholder="ძებნა..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 w-64 bg-white"
              />
            </div>
            {playersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">სახელი</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">გუნდი</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">პოზიცია</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">♯</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPlayers.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {player.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{player.team?.name}</span>
                            {player.team?.ageCategory && (
                              <AgeCategoryBadge category={player.team.ageCategory} />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.position || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {player.shirtNumber || "—"}
                        </td>
                      </tr>
                    ))}
                    {filteredPlayers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                          მოთამაშეები ვერ მოიძებნა
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Transfers */}
        {activeTab === "transfers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">გადაყვანები</h2>
              <Button onClick={() => setShowTransferModal(true)}>გადაყვანა</Button>
            </div>
            <TransferHistoryTable schoolId={school.id} />
          </div>
        )}

        {/* School Info */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">სკოლის ინფორმაცია</h2>
              <Button onClick={() => setShowEditModal(true)}>რედაქტირება</Button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <InfoRow label="სახელი" value={school.name} />
              <InfoRow label="ქალაქი" value={school.city} />
              <InfoRow label="დაარსების წელი" value={school.founded ? String(school.founded) : null} />
              <InfoRow label="ვებსაიტი" value={school.website} isLink />
              <InfoRow label="აღწერა" value={school.description} />
            </div>
          </div>
        )}
      </main>

      {/* Transfer Modal */}
      <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} title="მოთამაშის გადაყვანა" size="lg">
        <TransferPlayerModal school={school} onSuccess={refreshSchool} onClose={() => setShowTransferModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="სკოლის რედაქტირება" size="lg">
        <EditSchoolForm school={school} onSuccess={refreshSchool} onCancel={() => setShowEditModal(false)} />
      </Modal>
    </div>
  );
};

const InfoRow = ({ label, value, isLink }: { label: string; value?: string | null; isLink?: boolean }) => (
  <div className="flex items-start gap-4">
    <span className="text-sm font-medium text-gray-500 w-32 shrink-0">{label}</span>
    {isLink && value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
        {value}
      </a>
    ) : (
      <span className="text-sm text-gray-900">{value || "—"}</span>
    )}
  </div>
);

export default SchoolAdminDashboard;
