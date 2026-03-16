import { FaUserTie, FaEnvelope, FaPhoneAlt, FaCalendarCheck } from "react-icons/fa";

interface RefereeProfileModuleProps {
  refereeProfile: {
    firstName: string;
    lastName: string;
    photoUrl?: string | null;
    phone?: string | null;
  } | null;
  adminEmail?: string;
  myMatchesCount: number;
}

const RefereeProfileModule: React.FC<RefereeProfileModuleProps> = ({
  refereeProfile,
  adminEmail,
  myMatchesCount,
}) => {
  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 relative z-10 mb-6">
            <div className="relative">
              {refereeProfile?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={refereeProfile.photoUrl}
                  alt={`${refereeProfile.firstName} ${refereeProfile.lastName}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover bg-white p-1 shadow-lg border border-gray-100"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 shadow-lg border border-gray-100 flex items-center justify-center">
                  <div className="w-full h-full bg-purple-50 rounded-xl flex items-center justify-center text-purple-400">
                    <FaUserTie className="text-4xl" />
                  </div>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" title="Active"></div>
            </div>

            <div className="flex-1 text-center sm:text-left mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {refereeProfile ? `${refereeProfile.firstName} ${refereeProfile.lastName}` : "მსაჯი"}
              </h1>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mt-1">
                ლიცენზირებული მსაჯი
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                <FaEnvelope />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ელ-ფოსტა</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {adminEmail || "არ არის მითითებული"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-lg">
                <FaPhoneAlt />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ტელეფონი</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {refereeProfile?.phone || "არ არის მითითებული"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                <FaCalendarCheck />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">მონაწილეობდა</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {myMatchesCount} მატჩში
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RefereeProfileModule;
