import Link from "next/link";
import { Team } from "@/types/admin";
import { FaBell, FaUserCircle, FaSignOutAlt, FaHome } from "react-icons/fa";

interface ClubHeaderProps {
  team: Team | null;
  onLogout: () => void;
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ team, onLogout }) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-4 sm:px-6 backdrop-blur-lg">
      {/* Left — Team info */}
      <div className="flex items-center gap-3 ml-12 md:ml-0">
        {team?.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={team.logo}
            alt={team.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {team?.name?.substring(0, 2).toUpperCase() || "CL"}
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-gray-900 leading-tight">
            {team?.name || "Club Dashboard"}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/10 uppercase tracking-wide">
              {team?.ageCategory?.replace("_", " ") || "U-Unknown"}
            </span>
            {team?.coach && (
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                Coach: {team.coach}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Home Button */}
        <Link 
          href="/" 
          className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
          title="Go to Home"
        >
          <FaHome className="text-lg" />
        </Link>

        {/* Notification bell */}
        <button className="relative rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
          <FaBell className="text-base" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

        {/* Profile dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2.5 rounded-xl p-1.5 text-left transition hover:bg-gray-50">
            <FaUserCircle className="text-2xl text-gray-300" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-700 leading-tight">
                Club Admin
              </p>
              <p className="text-[10px] text-gray-400">
                Manage
              </p>
            </div>
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 before:absolute before:-top-2 before:left-0 before:h-2 before:w-full">
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition">
              <FaUserCircle className="text-gray-400" />
              Edit Profile
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
            >
              <FaSignOutAlt className="text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClubHeader;
