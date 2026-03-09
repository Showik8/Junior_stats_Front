import { useState, useEffect, useRef } from "react";
import SuperAdminHeader from "../components/SuperAdminHeader";
import CreateAdminForm from "../components/CreateAdminForm";
import EditAdminForm from "../components/EditAdminForm";
import CreateTournamentForm from "../components/CreateTournamentForm";
import EditTournamentForm from "../components/EditTournamentForm";
import CreateClubForm from "../components/CreateClubForm";
import EditClubForm from "../components/EditClubForm";
import CreateSponsorForm from "../components/CreateSponsorForm";
import EditSponsorForm from "../components/EditSponsorForm";
import CreateRefereeForm from "../components/CreateRefereeForm";
import EditRefereeForm from "../components/EditRefereeForm";
import Table from "../components/Table";
import { adminService } from "@/services/adminService";
import { refereeService } from "@/services/referee.service";
import { Admin, Tournament, Team, Sponsor, AuditLog, Referee } from "@/types/admin";
import Button from "../components/Button";
import Modal from "../components/Modal";
import TeamSponsorsModule from "../components/club/TeamSponsorsModule";
import TournamentSponsorsModule from "../components/TournamentSponsorsModule";
import { getCached, setCache, invalidateDashboardCache } from "@/app/utils/dashboardCache";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [clubs, setClubs] = useState<Team[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "admins" | "tournaments" | "clubs" | "sponsors" | "referees" | "logs">("overview");
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editingClub, setEditingClub] = useState<Team | null>(null);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [editingReferee, setEditingReferee] = useState<Referee | null>(null);
  const [referees, setReferees] = useState<Referee[]>([]);
  
  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [selectedLogChanges, setSelectedLogChanges] = useState<Record<string, unknown> | null>(null);
  
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAllData = async (skipCache = false) => {
    try {
      setLoading(true);

      // ── Try cache first ──
      if (!skipCache) {
        const cachedAdmins = getCached<Admin[]>("admins");
        const cachedTournaments = getCached<Tournament[]>("tournaments");
        const cachedClubs = getCached<Team[]>("clubs");
        const cachedSponsors = getCached<Sponsor[]>("sponsors");

        if (cachedAdmins && cachedTournaments && cachedClubs && cachedSponsors) {
          setAdmins(cachedAdmins);
          setTournaments(cachedTournaments);
          setClubs(cachedClubs);
          setSponsors(cachedSponsors);
          setLoading(false);
          return;
        }
      }

      // ── Fetch from API ──
      const [adminsData, tournamentsData, clubsData, sponsorsData] = await Promise.all([
        adminService.getAdmins(),
        adminService.getAllTournaments(),
        adminService.getAllClubs(),
        adminService.getSponsors()
      ]);
      
      const sponsorsList = sponsorsData.sponsors || [];

      setAdmins(adminsData);
      setTournaments(tournamentsData);
      setClubs(clubsData);
      setSponsors(sponsorsList);

      // ── Write to cache ──
      setCache("admins", adminsData);
      setCache("tournaments", tournamentsData);
      setCache("clubs", clubsData);
      setCache("sponsors", sponsorsList);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLogs = async (page: number) => {
    try {
      setLogsLoading(true);
      const res = await adminService.getAuditLogs({ page, limit: 20, sortOrder: "desc" });
      setAuditLogs(res.logs);
      setLogsPage(res.page);
      setLogsTotalPages(res.totalPages);
    } catch (error) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.error("Failed to fetch audit logs:", (error as any).message);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs(logsPage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, logsPage]);

  const refreshData = () => {
    invalidateDashboardCache();
    fetchAllData(true);
    fetchReferees();
    setViewMode("list");
    setEditingAdmin(null);
    setEditingTournament(null);
    setEditingClub(null);
    setEditingSponsor(null);
    setEditingReferee(null);
  };

  const fetchReferees = async () => {
    try {
      const data = await refereeService.getReferees();
      setReferees(data);
    } catch (e) {
      console.error("Failed to fetch referees:", e);
    }
  };

  useEffect(() => {
    fetchReferees();
  }, []);

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setViewMode("edit");
  };

  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setViewMode("edit");
  };

  const handleEditClub = (club: Team) => {
    setEditingClub(club);
    setViewMode("edit");
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setViewMode("edit");
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

  const handleDeleteSponsor = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) return;
    try {
      await adminService.deleteSponsor(id);
      setNotification({ type: "success", text: "Sponsor deleted successfully" });
      refreshData();
    } catch (error) {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (error as any).message || "Failed to delete sponsor";
      setNotification({ type: "error", text: msg });
    }
  };

  const handleEditReferee = (referee: Referee) => {
    setEditingReferee(referee);
    setViewMode("edit");
  };

  const handleDeleteReferee = async (id: number) => {
    if (!window.confirm("ნამდვილად გსურთ ამ მსაჯის წაშლა?")) return;
    try {
      await refereeService.deleteReferee(id);
      setNotification({ type: "success", text: "მსაჯი წაიშალა" });
      refreshData();
    } catch (error) {
      const msg = (error as Error).message || "Failed to delete referee";
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
      ) : viewMode === "edit" && editingAdmin ? (
        <EditAdminForm 
            admin={editingAdmin} 
            onSuccess={refreshData} 
            onCancel={() => { setViewMode("list"); setEditingAdmin(null); }} 
        />
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
                   <div className="flex space-x-2">
                       <button 
                         onClick={() => handleEditAdmin(admin)}
                         className="text-gray-400 hover:text-blue-600 transition-colors"
                         title="Edit"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                       </button>
                       <button 
                         onClick={() => handleDeleteAdmin(admin.id)}
                         className="text-gray-400 hover:text-red-600 transition-colors"
                         title="Delete"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                   </div>
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
      ) : viewMode === "edit" && editingTournament ? (
        <EditTournamentForm 
            tournament={editingTournament} 
            admins={admins} 
            onSuccess={refreshData} 
            onCancel={() => { setViewMode("list"); setEditingTournament(null); }} 
        />
      ) : (
         <div className="animate-in fade-in slide-in-from-bottom-2">
           <Table headers={["Name", "Status", "Format", "Dates", "Categories", "Actions"]}>
             {tournaments.map((tournament) => (
               <tr key={tournament.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tournament.name}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${tournament.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : tournament.status === 'FINISHED' ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-amber-800'}`}>
                      {tournament.status}
                    </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {tournament.format === "GROUP_KNOCKOUT" ? "Group+KO" : tournament.format === "KNOCKOUT" ? "Knockout" : "League"}
                    </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tournament.startDate ? (
                      <span className="text-xs font-mono">
                        {new Date(tournament.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {tournament.endDate && ` - ${new Date(tournament.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
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
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <div className="flex space-x-2">
                       <button 
                         onClick={() => handleEditTournament(tournament)}
                         className="text-gray-400 hover:text-blue-600 transition-colors"
                         title="Edit"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                       </button>
                       <button 
                         onClick={() => handleDeleteTournament(tournament.id)}
                         className="text-gray-400 hover:text-red-600 transition-colors"
                         title="Delete"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                   </div>
                 </td>
               </tr>
             ))}
             {tournaments.length === 0 && (
               <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">No tournaments found</td></tr>
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
      ) : viewMode === "edit" && editingClub ? (
        <EditClubForm 
            club={editingClub} 
            admins={admins} 
            onSuccess={refreshData} 
            onCancel={() => { setViewMode("list"); setEditingClub(null); }} 
        />
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
                   <div className="flex space-x-2">
                       <button 
                         onClick={() => handleEditClub(club)}
                         className="text-gray-400 hover:text-blue-600 transition-colors"
                         title="Edit"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                       </button>
                       <button 
                         onClick={() => handleDeleteClub(club.id)}
                         className="text-gray-400 hover:text-red-600 transition-colors"
                         title="Delete"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                   </div>
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

  const renderSponsorsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Manage Sponsors</h2>
            <p className="text-sm text-gray-500">Add and manage application sponsors.</p>
        </div>
        <Button onClick={() => setViewMode(viewMode === "list" ? "create" : "list")}>
          {viewMode === "list" ? "Create New Sponsor" : "Back to List"}
        </Button>
      </div>

      {viewMode === "create" ? (
        <CreateSponsorForm onSuccess={refreshData} onCancel={() => setViewMode("list")} />
      ) : viewMode === "edit" && editingSponsor ? (
        <EditSponsorForm 
            sponsor={editingSponsor} 
            onSuccess={refreshData} 
            onCancel={() => { setViewMode("list"); setEditingSponsor(null); }} 
        />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
           <Table headers={["Sponsor", "Website", "Created At", "Actions"]}>
             {sponsors.map((sponsor) => (
               <tr key={sponsor.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                        {sponsor.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={sponsor.logoUrl} alt={sponsor.name} className="w-8 h-8 rounded-full object-contain bg-white border border-gray-100 mix-blend-multiply" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                {sponsor.name.charAt(0)}
                            </div>
                        )}
                        <span>{sponsor.name}</span>
                    </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                    {sponsor.website ? (
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                            Link
                        </a>
                    ) : (
                        <span className="text-gray-400 no-underline">—</span>
                    )}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sponsor.createdAt ? new Date(sponsor.createdAt).toLocaleDateString() : 'N/A'}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <div className="flex space-x-2">
                       <button 
                         onClick={() => handleEditSponsor(sponsor)}
                         className="text-gray-400 hover:text-blue-600 transition-colors"
                         title="Edit"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                       </button>
                       <button 
                         onClick={() => handleDeleteSponsor(sponsor.id)}
                         className="text-gray-400 hover:text-red-600 transition-colors"
                         title="Delete"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                   </div>
                 </td>
               </tr>
             ))}
             {sponsors.length === 0 && (
               <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">No sponsors found</td></tr>
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

  const renderRefereesSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">მსაჯების მართვა</h2>
           <p className="text-sm text-gray-500">დაარეგისტრირეთ და მართეთ მსაჯები.</p>
        </div>
        <Button onClick={() => setViewMode(viewMode === "list" ? "create" : "list")}>
          {viewMode === "list" ? "ახალი მსაჯის დამატება" : "სიაზე დაბრუნება"}
        </Button>
      </div>

      {viewMode === "create" ? (
        <CreateRefereeForm onSuccess={refreshData} />
      ) : viewMode === "edit" && editingReferee ? (
        <EditRefereeForm
          referee={editingReferee}
          onSuccess={refreshData}
          onCancel={() => { setViewMode("list"); setEditingReferee(null); }}
        />
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2">
           <Table headers={["სახელი", "ელ-ფოსტა", "ტელეფონი", "შექმნის თარიღი", "მოქმედებები"]}>
             {referees.map((referee) => (
               <tr key={referee.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                   {referee.firstName} {referee.lastName}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {referee.admin?.email || "—"}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {referee.phone || "—"}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {referee.createdAt ? new Date(referee.createdAt).toLocaleDateString() : "N/A"}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <div className="flex space-x-2">
                       <button
                         onClick={() => handleEditReferee(referee)}
                         className="text-gray-400 hover:text-blue-600 transition-colors"
                         title="რედაქტირება"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                       </button>
                       <button
                         onClick={() => handleDeleteReferee(referee.id)}
                         className="text-gray-400 hover:text-red-600 transition-colors"
                         title="წაშლა"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                   </div>
                 </td>
               </tr>
             ))}
             {referees.length === 0 && (
               <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">მსაჯები ვერ მოიძებნა</td></tr>
             )}
           </Table>
        </div>
      )}
    </div>
  );

  const renderLogsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800">System Audit Logs</h2>
            <p className="text-sm text-gray-500">Track all changes made to the system.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => fetchLogs(logsPage)}>
               Refresh
            </Button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2">
        {logsLoading ? (
             <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
        ) : (
          <>
           <Table headers={["Action", "Entity", "Admin", "Date", "Details"]}>
             {auditLogs.map((log) => (
               <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                     <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                         log.action.includes('CREATE') ? 'bg-green-100 text-green-800' :
                         (log.action.includes('DELETE') || log.action.includes('REMOVE')) ? 'bg-red-100 text-red-800' :
                         'bg-blue-100 text-blue-800'
                     }`}>
                         {log.action}
                     </span>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-700">{log.entity}</div>
                    <div className="text-xs text-gray-400 font-mono break-all max-w-[150px]" title={log.entityId}>{log.entityId}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.admin?.email ? (
                        <div className="text-sm">{log.admin.email}</div>
                    ) : (
                        <div className="text-sm text-gray-400">ID: {log.adminId || 'System'}</div>
                    )}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {new Date(log.createdAt).toLocaleString()}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {log.changes ? (
                       <button 
                         onClick={() => setSelectedLogChanges(log.changes as Record<string, unknown>)}
                         className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                       >
                         View Details
                       </button>
                    ) : (
                       <span className="text-gray-400 text-sm italic">No data</span>
                    )}
                 </td>
               </tr>
             ))}
             {auditLogs.length === 0 && (
               <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No audit logs found</td></tr>
             )}
           </Table>
           
           {/* Pagination */}
           {auditLogs.length > 0 && (
             <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-500">Page {logsPage} of {Math.max(1, logsTotalPages)}</span>
                <div className="flex gap-2">
                    <Button 
                        onClick={() => setLogsPage(p => Math.max(1, p - 1))} 
                        disabled={logsPage <= 1}
                        variant="secondary"
                    >
                        Previous
                    </Button>
                    <Button 
                        onClick={() => setLogsPage(p => Math.min(logsTotalPages, p + 1))} 
                        disabled={logsPage >= logsTotalPages}
                        variant="secondary"
                    >
                        Next
                    </Button>
                </div>
             </div>
           )}
          </>
        )}
      </div>
      
      {/* JSON Changes Modal */}
      {selectedLogChanges && (
         <Modal isOpen={!!selectedLogChanges} onClose={() => setSelectedLogChanges(null)} title="Change Details">
             <div className="p-4 bg-gray-50 rounded-lg overflow-x-auto my-4 max-h-[60vh] overflow-y-auto w-[600px] max-w-[90vw]">
                 <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap break-all">
                     {JSON.stringify(selectedLogChanges, null, 2)}
                 </pre>
             </div>
         </Modal>
      )}
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
        <div className="flex flex-wrap border-b border-gray-200 mb-8">
          {(["overview", "admins", "tournaments", "clubs", "sponsors", "referees", "logs"] as const).map((tab) => (
             <button
                key={tab}
                onClick={() => { 
                   if (activeTab === tab) return;
                   setActiveTab(tab); 
                   setViewMode("list"); 
                   if (tab === "logs" && auditLogs.length === 0) {
                      setLogsPage(1);
                   }
                }}
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
                    {activeTab === "sponsors" && renderSponsorsSection()}
                    {activeTab === "referees" && renderRefereesSection()}
                    {activeTab === "logs" && renderLogsSection()}
                </>
             )}
        </div>

      </main>
    </div>
  );
};

export default SuperAdminDashboard;
