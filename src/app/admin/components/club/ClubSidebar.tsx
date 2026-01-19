import React from "react";
import { 
  FaChartPie, 
  FaUsers, 
  FaFutbol, 
  FaTrophy, 
  FaCog, 
  FaInfoCircle 
} from "react-icons/fa";

interface ClubSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClubSidebar: React.FC<ClubSidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: FaChartPie },
    { id: "players", label: "Players", icon: FaUsers },
    { id: "matches", label: "Matches", icon: FaFutbol },
    { id: "tournaments", label: "Tournaments", icon: FaTrophy },
    { id: "info", label: "Club Info", icon: FaInfoCircle },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  return (
    <aside className="hidden h-full w-64 flex-col border-r border-gray-200 bg-white shadow-sm md:flex">
      <div className="flex h-16 items-center justify-center border-b border-gray-100 px-6">
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
             JA
           </div>
           <span className="text-lg font-bold tracking-tight text-gray-900">Junior Admin</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`text-lg ${isActive ? "text-blue-500" : "text-gray-400"}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 p-4">
           <p className="text-xs font-semibold text-blue-800">Support</p>
           <p className="mb-2 mt-1 text-xs text-blue-600">Need help? Contact support.</p>
           <button className="w-full rounded bg-white py-1.5 text-xs font-medium text-blue-600 shadow-sm transition hover:bg-blue-50">
             Contact Us
           </button>
        </div>
      </div>
    </aside>
  );
};

export default ClubSidebar;
