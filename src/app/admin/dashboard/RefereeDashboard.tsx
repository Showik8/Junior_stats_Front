"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { refereeService } from "@/services/referee.service";
import { adminService } from "@/services/adminService";
import { MatchReferee, Referee } from "@/types/admin";
import RefereeSidebar from "../components/referee/RefereeSidebar";
import RefereeHeader from "../components/referee/RefereeHeader";
import RefereeOverview from "../components/referee/RefereeOverview";
import RefereeMatchesModule from "../components/referee/RefereeMatchesModule";
import RefereeProfileModule from "../components/referee/RefereeProfileModule";

/* ── Skeleton loader ── */
const DashboardSkeleton = () => (
  <div className="flex h-screen w-full bg-gray-50">
    <aside className="hidden md:flex h-full w-[260px] flex-col bg-white border-r border-gray-100 p-5 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
        <div className="space-y-1.5 flex-1,">
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-1/2 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    </aside>
    <div className="flex-1 flex flex-col">
      <div className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-24 rounded-xl bg-gray-100 animate-pulse" />
      </div>
      <div className="flex-1 p-8 space-y-6">
        <div className="h-32 w-full rounded-3xl bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-2 bg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
        </div>
      </div>
    </div>
  </div>
);

const RefereeDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [myMatches, setMyMatches] = useState<MatchReferee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refereeProfile, setRefereeProfile] = useState<Referee | null>(null);

  const handleLogout = () => {
    adminService.logoutAdmin();
    router.push("/sign-in");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesData, profileData] = await Promise.all([
        refereeService.getMyMatches(),
        refereeService.getMyProfile().catch(() => null)
      ]);
      setMyMatches(matchesData);
      if (profileData) setRefereeProfile(profileData);
    } catch (err) {
      console.error("Failed to fetch referee data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  // Mobile menu intercept logic
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar Component container */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <RefereeSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          refereeProfile={refereeProfile}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <RefereeHeader
          activeTab={activeTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={handleLogout}
        />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {activeTab === "overview" && (
            <RefereeOverview myMatches={myMatches} refereeProfile={refereeProfile} />
          )}

          {activeTab === "matches" && (
            <RefereeMatchesModule myMatches={myMatches} onRefresh={fetchData} />
          )}

          {activeTab === "profile" && (
            <RefereeProfileModule
              refereeProfile={refereeProfile}
              adminEmail={refereeProfile?.admin?.email} // Assume the backend can return this embedded if needed or just blank if unsupported
              myMatchesCount={myMatches.length}
            />
          )}

          {/* Fallbacks */}
          {!["overview", "matches", "profile"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <span className="text-4xl shadow-sm mb-4">🚧</span>
              <p className="text-gray-500">მოდული მზადების პროცესშია</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RefereeDashboard;
