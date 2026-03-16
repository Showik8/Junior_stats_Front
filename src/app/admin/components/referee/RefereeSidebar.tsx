import { FaChartPie, FaCalendarAlt, FaUserTie } from "react-icons/fa";

interface RefereeSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refereeProfile: { firstName: string; lastName: string; photoUrl?: string | null } | null;
}

const RefereeSidebar: React.FC<RefereeSidebarProps> = ({ activeTab, setActiveTab, refereeProfile }) => {
  const tabs = [
    { id: "overview", label: "მიმოხილვა", icon: FaChartPie },
    { id: "matches", label: "ჩემი მატჩები", icon: FaCalendarAlt },
    { id: "profile", label: "ჩემი პროფილი", icon: FaUserTie },
  ];

  return (
    <aside className="flex h-full w-[260px] flex-col bg-white border-r border-gray-100 p-5 shrink-0">
      {/* Club Identity */}
      <div className="flex items-center gap-3 mb-8 px-2">
        {refereeProfile?.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={refereeProfile.photoUrl}
            alt="Referee Photo"
            className="h-10 w-10 rounded-xl object-cover bg-gray-50 border border-gray-100"
          />
        ) : (
          <div className="flex items-center justify-center h-10 w-10 bg-purple-100 text-purple-600 rounded-xl">
            <FaUserTie className="text-xl" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 truncate">
            {refereeProfile ? `${refereeProfile.firstName} ${refereeProfile.lastName}` : "მსაჯი"}
          </h2>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            მსაჯის პანელი
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-2 mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            მენიუ
          </span>
        </div>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`text-[16px] ${
                  isActive ? "text-purple-600" : "text-gray-400"
                }`}
              />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default RefereeSidebar;
