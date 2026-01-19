import React from "react";
import { Team } from "@/types/admin";
import { FaBell, FaUserCircle } from "react-icons/fa";

interface ClubHeaderProps {
  team: Team | null;
  onLogout: () => void;
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ team, onLogout }) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        
        <div className="flex items-center gap-3">
            {team?.logo ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={team.logo} alt={team.name} className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm" />
            ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-200">
                    {team?.name?.substring(0, 2).toUpperCase() || "CL"}
                </div>
            )}
            <div>
                 <h2 className="text-sm font-bold text-gray-900 leading-tight">{team?.name || "Club Dashboard"}</h2>
                 <div className="flex items-center gap-2">
                     <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {team?.ageCategory?.replace('_', ' ') || "U-Unknown"}
                     </span>
                 </div>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
         <button className="relative rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <FaBell className="text-lg" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
         </button>
         
         <div className="h-8 w-px bg-gray-200"></div>

         <div className="relative group">
            <button className="flex items-center gap-2 rounded-lg p-1 text-left transition hover:bg-gray-50">
                <FaUserCircle className="text-3xl text-gray-300" />
                <div className="hidden sm:block">
                    <p className="text-xs font-medium text-gray-700">Admin</p>
                    <p className="text-[10px] text-gray-500">Manage Account</p>
                </div>
            </button>
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-lg bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                <button className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Edit Profile
                </button>
                <div className="my-1 border-t border-gray-100"></div>
                <button 
                    onClick={onLogout}
                    className="block w-full rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                    Sign Out
                </button>
            </div>
         </div>
      </div>
    </header>
  );
};

export default ClubHeader;
