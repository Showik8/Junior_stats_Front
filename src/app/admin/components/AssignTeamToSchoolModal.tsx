"use client";
import React, { useState, useEffect } from "react";
import { schoolService } from "@/services/school.service";
import { teamService } from "@/services/team.service";
import { adminService } from "@/services/adminService";
import type { FootballSchool, SchoolTeam, SchoolAdminEntry } from "@/types/school.types";
import type { Team, Admin } from "@/types/admin";
import AgeCategoryBadge from "./AgeCategoryBadge";
import Button from "./Button";

interface AssignTeamToSchoolModalProps {
  school: FootballSchool;
  onSuccess: () => void;
  onClose: () => void;
}

const AssignTeamToSchoolModal: React.FC<AssignTeamToSchoolModalProps> = ({
  school,
  onSuccess,
  onClose,
}) => {
  // ── Teams State ──
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [assignedTeams, setAssignedTeams] = useState<SchoolTeam[]>(school.teams || []);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [teamLoading, setTeamLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ── Admins State ──
  const [allAdmins, setAllAdmins] = useState<Admin[]>([]);
  const [assignedAdmins, setAssignedAdmins] = useState<SchoolAdminEntry[]>(school.admins || []);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"teams" | "admins">("teams");

  // ── Fetch available teams ──
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setFetchLoading(true);
        const allTeams = await teamService.getAllClubs();
        const unassigned = allTeams.filter(
          (t) => !assignedTeams.some((at) => at.id === t.id)
        );
        setAvailableTeams(unassigned);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch available admins ──
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setAdminsLoading(true);
        const admins = await adminService.getAdmins();
        // Show only SCHOOL_ADMIN role admins that aren't already assigned
        const schoolAdmins = admins.filter(
          (a: Admin) => a.role === "SCHOOL_ADMIN" && !assignedAdmins.some((aa) => aa.adminId === a.id)
        );
        setAllAdmins(schoolAdmins);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      } finally {
        setAdminsLoading(false);
      }
    };
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Team actions ──
  const handleAssignTeam = async () => {
    if (!selectedTeamId) return;
    setError(null);
    try {
      setTeamLoading(true);
      await schoolService.assignTeamToSchool(school.id, selectedTeamId);
      const team = availableTeams.find((t) => t.id === selectedTeamId);
      if (team) {
        setAssignedTeams((prev) => [
          ...prev,
          { id: team.id, name: team.name, ageCategory: team.ageCategory, logo: team.logo },
        ]);
        setAvailableTeams((prev) => prev.filter((t) => t.id !== selectedTeamId));
      }
      setSelectedTeamId("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "შეცდომა გუნდის დამატებისას");
    } finally {
      setTeamLoading(false);
    }
  };

  const handleRemoveTeam = async (teamId: string) => {
    setError(null);
    try {
      await schoolService.removeTeamFromSchool(school.id, teamId);
      const team = assignedTeams.find((t) => t.id === teamId);
      setAssignedTeams((prev) => prev.filter((t) => t.id !== teamId));
      if (team) {
        setAvailableTeams((prev) => [
          ...prev,
          { id: team.id, name: team.name, ageCategory: team.ageCategory } as Team,
        ]);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "შეცდომა გუნდის წაშლისას");
    }
  };

  // ── Admin actions ──
  const handleAssignAdmin = async () => {
    if (!selectedAdminId) return;
    setError(null);
    try {
      setAdminLoading(true);
      await schoolService.assignSchoolAdmin(school.id, Number(selectedAdminId));
      const admin = allAdmins.find((a) => a.id === Number(selectedAdminId));
      if (admin) {
        setAssignedAdmins((prev) => [
          ...prev,
          {
            id: 0,
            adminId: admin.id,
            schoolId: school.id,
            role: "SCHOOL_ADMIN",
            admin: { id: admin.id, email: admin.email, role: admin.role },
            createdAt: new Date().toISOString(),
          },
        ]);
        setAllAdmins((prev) => prev.filter((a) => a.id !== Number(selectedAdminId)));
      }
      setSelectedAdminId("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "შეცდომა ადმინის მიბმისას");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: number) => {
    setError(null);
    try {
      await schoolService.removeSchoolAdmin(school.id, adminId);
      const admin = assignedAdmins.find((a) => a.adminId === adminId);
      setAssignedAdmins((prev) => prev.filter((a) => a.adminId !== adminId));
      if (admin) {
        setAllAdmins((prev) => [
          ...prev,
          { id: admin.adminId, email: admin.admin.email, role: admin.admin.role } as Admin,
        ]);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "შეცდომა ადმინის ამოღებისას");
    }
  };

  const filteredTeams = availableTeams.filter(
    (t) => t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSection("teams")}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-all ${
            activeSection === "teams"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          გუნდები
        </button>
        <button
          onClick={() => setActiveSection("admins")}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-all ${
            activeSection === "admins"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          ადმინები
        </button>
      </div>

      {/* ═══════════════════ TEAMS SECTION ═══════════════════ */}
      {activeSection === "teams" && (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">გუნდის დამატება</h4>
            <input
              type="text"
              placeholder="გუნდის ძებნა..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-3"
            />
            {fetchLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">აირჩიეთ გუნდი...</option>
                  {filteredTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.ageCategory.replace("_", "")})
                    </option>
                  ))}
                </select>
                <Button onClick={handleAssignTeam} disabled={!selectedTeamId || teamLoading}>
                  {teamLoading ? "..." : "დამატება"}
                </Button>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              მიმაგრებული გუნდები ({assignedTeams.length})
            </h4>
            {assignedTeams.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">
                გუნდები არ არის მიმაგრებული
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {assignedTeams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{team.name}</span>
                      <AgeCategoryBadge category={team.ageCategory} />
                    </div>
                    <button
                      onClick={() => handleRemoveTeam(team.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      ამოღება
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ ADMINS SECTION ═══════════════════ */}
      {activeSection === "admins" && (
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">ადმინის მიბმა</h4>
            <p className="text-xs text-gray-400 mb-3">
              აირჩიეთ SCHOOL_ADMIN როლის ადმინი. ჯერ შექმენით ადმინი „Admins" ტაბიდან SCHOOL_ADMIN როლით.
            </p>
            {adminsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={selectedAdminId}
                  onChange={(e) => setSelectedAdminId(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">აირჩიეთ ადმინი...</option>
                  {allAdmins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.email}
                    </option>
                  ))}
                </select>
                <Button onClick={handleAssignAdmin} disabled={!selectedAdminId || adminLoading}>
                  {adminLoading ? "..." : "მიბმა"}
                </Button>
              </div>
            )}
            {!adminsLoading && allAdmins.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠ SCHOOL_ADMIN როლის თავისუფალი ადმინი ვერ მოიძებნა. ჯერ შექმენით „Admins" ტაბიდან.
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              მიბმული ადმინები ({assignedAdmins.length})
            </h4>
            {assignedAdmins.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">
                ადმინი არ არის მიბმული
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {assignedAdmins.map((entry) => (
                  <div key={entry.adminId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{entry.admin.email}</span>
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        SCHOOL ADMIN
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveAdmin(entry.adminId)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      ამოღება
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>
          დახურვა
        </Button>
      </div>
    </div>
  );
};

export default AssignTeamToSchoolModal;
