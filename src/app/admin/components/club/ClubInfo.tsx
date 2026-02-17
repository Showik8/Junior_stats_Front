import React, { useState } from "react";
import { Team, AgeCategory } from "@/types/admin";
import { adminService } from "@/services/adminService";
import {
  FaSave,
  FaEdit,
  FaTimes,
  FaShieldAlt,
  FaUserTie,
  FaCalendarAlt,
  FaHashtag,
} from "react-icons/fa";

interface ClubInfoProps {
  team: Team | null;
  onUpdate: () => void;
}

const ClubInfo: React.FC<ClubInfoProps> = ({ team, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    coach: "",
    ageCategory: "" as AgeCategory | "",
  });

  const startEditing = () => {
    if (team) {
      setFormData({
        name: team.name,
        coach: team.coach || "",
        ageCategory: team.ageCategory,
      });
      setIsEditing(true);
      setError(null);
      setSuccess(false);
    }
  };

  const handleSave = async () => {
    if (!team) return;
    try {
      setLoading(true);
      setError(null);
      await adminService.updateTeam(team.id, {
        name: formData.name,
        coach: formData.coach,
      });
      onUpdate();
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update club info"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!team)
    return (
      <div className="p-8 text-center text-gray-500">
        No club information available.
      </div>
    );

  const infoFields = [
    {
      icon: FaShieldAlt,
      label: "Club Name",
      value: team.name,
      key: "name" as const,
      editable: true,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      icon: FaUserTie,
      label: "Head Coach",
      value: team.coach || "Not Assigned",
      key: "coach" as const,
      editable: true,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50",
    },
    {
      icon: FaCalendarAlt,
      label: "Age Category",
      value: team.ageCategory.replace("_", " "),
      key: "ageCategory" as const,
      editable: false,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
    },
    {
      icon: FaHashtag,
      label: "Team ID",
      value: team.id.slice(0, 8) + "...",
      key: null,
      editable: false,
      iconColor: "text-gray-400",
      iconBg: "bg-gray-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Club Information
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your club&apos;s details and profile information
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all"
          >
            <FaEdit />
            Edit Details
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            <FaTimes />
            Cancel
          </button>
        )}
      </div>

      {/* Success toast */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="text-lg">✅</span>
          Club details updated successfully!
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Club Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
          </div>

          {/* Avatar */}
          <div className="px-6 -mt-12 relative">
            <div className="h-24 w-24 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
              {team.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={team.logo}
                  alt={team.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {team.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Club meta */}
          <div className="p-6 pt-4 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/10">
                  {team.ageCategory.replace("_", " ")}
                </span>
                {team.coach && (
                  <span className="text-xs text-gray-400">
                    Coach: {team.coach}
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {team.players?.length || 0}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                  Players
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {team.tournaments?.length || 0}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                  Tourneys
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {team.finishedMatches?.length || 0}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                  Played
                </p>
              </div>
            </div>

            {/* Created date */}
            {team.createdAt && (
              <p className="text-[10px] text-gray-400 text-center border-t border-gray-100 pt-3">
                Registered{" "}
                {new Date(team.createdAt).toLocaleDateString("en", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        {/* Right — Details */}
        <div className="lg:col-span-2 space-y-4">
          {infoFields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.label}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
              >
                <div
                  className={`h-11 w-11 rounded-xl ${field.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`text-base ${field.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {field.label}
                  </p>
                  {isEditing && field.editable && field.key ? (
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={formData[field.key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.key!]: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{field.value}</p>
                  )}
                </div>

                {!field.editable && (
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full font-medium shrink-0">
                    Read only
                  </span>
                )}
              </div>
            );
          })}

          {/* Save button */}
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubInfo;
