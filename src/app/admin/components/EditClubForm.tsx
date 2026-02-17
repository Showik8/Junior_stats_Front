import { useState, useEffect } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";
import { Admin, Team, AgeCategory, AGE_CATEGORIES, CreateTeamPayload } from "@/types/admin";

interface EditClubFormProps {
  club: Team;
  admins: Admin[];
  onSuccess: () => void;
  onCancel: () => void;
}

const EditClubForm = ({ club, admins, onSuccess, onCancel }: EditClubFormProps) => {
  const [name, setName] = useState(club.name);
  const [ageCategory, setAgeCategory] = useState<AgeCategory>(club.ageCategory);
  const [coach, setCoach] = useState(club.coach || "");
  
  // Find current admin if any (Assuming team has an admin linked differently or we just set it)
  // Backend doesn't return linked admin directly on Team object in standard interface yet, 
  // but if we are super admin we might want to set it.
  // We will start with empty or try to find if we can. 
  // For now, we default to empty as "No Change" unless user selects one.
  const [selectedAdminId, setSelectedAdminId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter for Club Admins only
  const clubAdmins = admins.filter(a => a.role === "CLUB_ADMIN" || a.role === "SUPER_ADMIN");

  useEffect(() => {
    setName(club.name);
    setAgeCategory(club.ageCategory);
    setCoach(club.coach || "");
    setSelectedAdminId(""); // Reset on new club
  }, [club]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload: Partial<CreateTeamPayload> = { 
        name, 
        ageCategory,
        coach: coach || null,
      };

      // Find email from selected ID if set
      const selectedAdmin = clubAdmins.find(a => a.id.toString() === selectedAdminId);
      if (selectedAdmin) {
          payload.adminEmail = selectedAdmin.email;
      }

      await adminService.updateTeam(club.id, payload);

      setMessage({ type: "success", text: "Club updated successfully!" });
      setTimeout(() => {
          onSuccess();
      }, 1000);
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg = (err as any).message || "Failed to update club";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
         <div>
            <h3 className="text-2xl font-bold text-gray-800">Edit Club</h3>
            <p className="text-gray-500 text-sm mt-1">Update team details and admin assignment.</p>
         </div>
         <button 
            type="button" 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
         >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
         </button>
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Club Name</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="e.g. FC Dinamo Junior"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age Category</label>
            <div className="relative">
                <select
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                  value={ageCategory}
                  onChange={(e) => setAgeCategory(e.target.value as AgeCategory)}
                >
                  {AGE_CATEGORIES.map(cat => (
                     <option key={cat} value={cat}>{cat.replace('_', '-')}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Coach name (Optional)</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="e.g. John Doe"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
            />
        </div>

        <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Admin (Optional)</label>
            <div className="relative">
                <select
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                  value={selectedAdminId}
                  onChange={(e) => setSelectedAdminId(e.target.value)}
                >
                  <option value="">-- No Change --</option>
                  {clubAdmins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.email} ({admin.role})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Select an admin to re-assign/update the club admin.</p>
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <Button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-3 text-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-all"
        >
          Cancel
        </Button>
        <Button 
            type="submit" 
            disabled={loading} 
            className="flex-1 py-3 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all"
        >
          {loading ? "Update Club" : "Update Club"}
        </Button>
      </div>
    </form>
  );
};

export default EditClubForm;
