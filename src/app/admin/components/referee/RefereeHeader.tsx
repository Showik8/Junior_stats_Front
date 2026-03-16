import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

interface RefereeHeaderProps {
  activeTab: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  onLogout: () => void;
}

const RefereeHeader: React.FC<RefereeHeaderProps> = ({
  activeTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case "overview":
        return "მიმოხილვა";
      case "matches":
        return "ჩემი მატჩები";
      case "profile":
        return "ჩემი პროფილი";
      default:
        return "მართვა";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          {getTabTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Right side tools */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition-all"
        >
          <span className="hidden sm:inline">გასვლა</span>
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default RefereeHeader;
