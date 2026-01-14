import { useState, useEffect } from "react";
import SuperAdminHeader from "../components/SuperAdminHeader";
import CreateAdminForm from "../components/CreateAdminForm";
import CreateTournamentForm from "../components/CreateTournamentForm";
import CreateClubForm from "../components/CreateClubForm";
import Table from "../components/Table";
import { adminService } from "@/services/adminService";
import { Admin, Tournament, Team } from "@/types/admin";
import Button from "../components/Button";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [clubs, setClubs] = useState<Team[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "admins" | "tournaments" | "clubs">("overview");
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [adminsData, tournamentsData, clubsData] = await Promise.all([
        adminService.getAdmins(),
        adminService.getAllTournaments(),
        adminService.getAllClubs()
      ]);
      
      setAdmins(adminsData);
      setTournaments(tournamentsData);
      setClubs(clubsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = () => {
    fetchAllData();
    setViewMode("list");
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await adminService.deleteAdmin(id);
      setNotification({ type: "success", text: "Admin deleted successfully" });
      refreshData();
    } catch (error) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any).message || "Failed to delete admin";
      setNotification({ type: "error", text: msg });
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tournament? This will also delete all related matches and team assignments.")) return;
    try {
      await adminService.deleteTournament(id);
      setNotification({ type: "success", text: "Tournament deleted successfully" });
      refreshData();
    } catch (error) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any).message || "Failed to delete tournament";
      setNotification({ type: "error", text: msg });
    }
  };

  const handleDeleteClub = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try {
      await adminService.removeTeam(id);
      setNotification({ type: "success", text: "Club deleted successfully" });
      refreshData();
    } catch (error) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any).message || "Failed to delete club";
      setNotification({ type: "error", text: msg });
    }
  };

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const renderAdminsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Manage Admins</h2>
           <p className="text-sm text-gray-500">Add or remove system administrators.</p>
        </div>
        <Button onClick={() => setViewMode(viewMode === "list" ? "create" : "list")}>
          {viewMode === "list" ? "Create New Admin" : "Back to List"}
        </Button>
      </div>

      {viewMode === "create" ? (
        <CreateAdminForm onSuccess={refreshData} />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
           <Table headers={["Email", "Role", "Created At", "Actions"]}>
             {admins.map((admin) => (
               <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.email}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                        admin.role === 'TOURNAMENT_ADMIN' ? 'bg-blue-100 text-blue-700' : 
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {admin.role.replace('_', ' ')}
                    </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <button 
                     onClick={() => handleDeleteAdmin(admin.id)}
                     className="text-gray-400 hover:text-red-600 transition-colors"
                     title="Delete"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                 </td>
               </tr>
             ))}
             {admins.length === 0 && (
               <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">No admins found</td></tr>
             )}
           </Table>
        </div>
      )}
    </div>
  );

  const renderTournamentsSection = () => (
     <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
             <h2 className="text-xl font-bold text-gray-800">Manage Tournaments</h2>
             <p className="text-sm text-gray-500">Create and oversee tournaments.</p>
        </div>
        <Button onClick={() => setViewMode(viewMode === "list" ? "create" : "list")}>
          {viewMode === "list" ? "Create New Tournament" : "Back to List"}
        </Button>
      </div>

      {viewMode === "create" ? (
        <CreateTournamentForm admins={admins} onSuccess={refreshData} />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
           <Table headers={["Name", "Status", "Categories", "Created At", "Actions"]}>
             {tournaments.map((tournament) => (
               <tr key={tournament.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tournament.name}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${tournament.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {tournament.status}
                    </span>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-500">
                     <div className="flex flex-wrap gap-1 max-w-xs">
                         {tournament.ageCategories && tournament.ageCategories.length > 0 ? (
                             tournament.ageCategories.map(ac => (
                                 <span key={ac.ageCategory} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                     {ac.ageCategory.replace('_', '-')}
                                 </span>
                             ))
                         ) : (
                             <span className="text-gray-400 italic">None</span>
                         )}
                     </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tournament.createdAt ? new Date(tournament.createdAt).toLocaleDateString() : 'N/A'}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <button 
                     onClick={() => handleDeleteTournament(tournament.id)}
                     className="text-gray-400 hover:text-red-600 transition-colors"
                     title="Delete"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                 </td>
               </tr>
             ))}
             {tournaments.length === 0 && (
               <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No tournaments found</td></tr>
             )}
           </Table>
        </div>
      )}
    </div>
  );

  const renderClubsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Manage Clubs</h2>
            <p className="text-sm text-gray-500">Registered teams and coaches.</p>
        </div>
        <Button onClick={() => setViewMode(viewMode === "list" ? "create" : "list")}>
          {viewMode === "list" ? "Create New Club" : "Back to List"}
        </Button>
      </div>

      {viewMode === "create" ? (
        <CreateClubForm admins={admins} onSuccess={refreshData} />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
           <Table headers={["Name", "Cat.", "Coach", "Created At", "Actions"]}>
             {clubs.map((club) => (
               <tr key={club.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{club.name}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-gray-50/50 rounded-sm">{club.ageCategory.replace('_', '-')}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.coach || "-"}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.createdAt ? new Date(club.createdAt).toLocaleDateString() : 'N/A'}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <button 
                     onClick={() => handleDeleteClub(club.id)}
                     className="text-gray-400 hover:text-red-600 transition-colors"
                     title="Delete"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                 </td>
               </tr>
             ))}
             {clubs.length === 0 && (
               <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No clubs found</td></tr>
             )}
           </Table>
        </div>
      )}
    </div>
  );

  const renderOverviewSection = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Admins</div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{admins.length}</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tournaments</div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{tournaments.length}</div>
            </div>
            
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Clubs</div>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{clubs.length}</div>
            </div>
        </div>

        {/* Recent Activity / Lists Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Admins</h3>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {admins.slice(0, 5).map(admin => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        admin.role === 'TOURNAMENT_ADMIN' ? 'bg-blue-100 text-blue-700' : 
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {admin.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SuperAdminHeader />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Super Admin Dashboard</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage platform resources and administrators.</p>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-xl shadow-sm border ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {notification.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          {(["overview", "admins", "tournaments", "clubs"] as const).map((tab) => (
             <button
                key={tab}
                onClick={() => { setActiveTab(tab); setViewMode("list"); }}
                className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="min-h-[500px]">
             {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                 </div>
             ) : (
                <>
                    {activeTab === "overview" && renderOverviewSection()}
                    {activeTab === "admins" && renderAdminsSection()}
                    {activeTab === "tournaments" && renderTournamentsSection()}
                    {activeTab === "clubs" && renderClubsSection()}
                </>
             )}
        </div>

      </main>
    </div>
  );
};

export default SuperAdminDashboard;
