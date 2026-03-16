import { MatchReferee } from "@/types/admin";
import { FaCalendar, FaTrophy, FaCalendarCheck, FaPlayCircle } from "react-icons/fa";

interface RefereeOverviewProps {
  myMatches: MatchReferee[];
  refereeProfile: { firstName: string; lastName: string } | null;
}

const RefereeOverview: React.FC<RefereeOverviewProps> = ({ myMatches, refereeProfile }) => {
  const upcomingMatches = myMatches.filter((mr) => mr.match?.status === "SCHEDULED");
  const inProgressMatches = myMatches.filter((mr) => mr.match?.status === "IN_PROGRESS");
  const finishedMatches = myMatches.filter((mr) => mr.match?.status === "FINISHED");

  const nextMatch = upcomingMatches.sort((a, b) => {
    if (!a.match || !b.match) return 0;
    return new Date(a.match.date).getTime() - new Date(b.match.date).getTime();
  })[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            მოგესალმებით, {refereeProfile?.firstName || "მსაჯო"}! 👋
          </h1>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl leading-relaxed">
            მართეთ თქვენი დანიშნული მატჩები, შეავსეთ ოქმები და აკონტროლეთ სტატისტიკა მარტივად.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "სულ მატჩები",
            value: myMatches.length,
            icon: FaCalendar,
            color: "blue",
          },
          {
            label: "მოსალოდნელი",
            value: upcomingMatches.length,
            icon: FaCalendarCheck,
            color: "amber",
          },
          {
            label: "მიმდინარე",
            value: inProgressMatches.length,
            icon: FaPlayCircle,
            color: "purple",
          },
          {
            label: "ჩატარებული",
            value: finishedMatches.length,
            icon: FaTrophy,
            color: "emerald",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${
                  stat.color === "blue"
                    ? "bg-blue-50 text-blue-600"
                    : stat.color === "amber"
                    ? "bg-amber-50 text-amber-500"
                    : stat.color === "purple"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-emerald-50 text-emerald-500"
                }`}
              >
                <stat.icon className="text-xl" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Match Highlight */}
      {nextMatch && nextMatch.match && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <FaCalendarCheck className="text-amber-600 text-xs" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">შემდეგი მატჩი</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Date/Time */}
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl min-w-[120px]">
              <span className="text-3xl font-black text-gray-900">
                {new Date(nextMatch.match.date).toLocaleDateString("en", { day: "2-digit" })}
              </span>
              <span className="text-sm font-bold text-gray-400 uppercase">
                {new Date(nextMatch.match.date).toLocaleDateString("en", { month: "short" })}
              </span>
              <span className="mt-2 text-xs font-semibold bg-white px-2 py-1 rounded-md text-gray-600 shadow-sm">
                {new Date(nextMatch.match.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Teams */}
            <div className="flex-1 flex justify-center items-center gap-4 w-full">
              <div className="flex-1 text-right">
                <p className="font-bold text-lg text-gray-900 truncate">{nextMatch.match.homeTeam?.name || "Home Team"}</p>
                <p className="text-xs text-gray-500 uppercase">Home</p>
              </div>
              <div className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-400 flex-shrink-0">
                VS
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-lg text-gray-900 truncate">{nextMatch.match.awayTeam?.name || "Away Team"}</p>
                <p className="text-xs text-gray-500 uppercase">Away</p>
              </div>
            </div>

            {/* Tournament Info */}
            <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-1">
              <span className="text-sm font-bold text-gray-700">{nextMatch.match.tournament?.name}</span>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                {nextMatch.match.ageCategory.replace('_', ' ')}
              </span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg mt-1 border border-purple-100">
                {nextMatch.role === "MAIN" ? "თავარი მსაჯი" : "დამხმარე მსაჯი"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefereeOverview;
