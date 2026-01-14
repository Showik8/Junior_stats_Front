import { useState } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";
import { Admin, AgeCategory, AGE_CATEGORIES } from "@/types/admin";

interface CreateTournamentFormProps {
  admins: Admin[];
  onSuccess: () => void;
}

const CreateTournamentForm = ({ admins, onSuccess }: CreateTournamentFormProps) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "FINISHED">("ACTIVE");
  const [selectedAgeCategories, setSelectedAgeCategories] = useState<AgeCategory[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter for Tournament Admins only
  const tournamentAdmins = admins.filter(a => a.role === "TOURNAMENT_ADMIN" || a.role === "SUPER_ADMIN");

  const toggleAgeCategory = (cat: AgeCategory) => {
    setSelectedAgeCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (selectedAgeCategories.length === 0) {
        throw new Error("Please select at least one age category");
      }

      // Find email from selected ID
      const selectedAdmin = tournamentAdmins.find(a => a.id.toString() === selectedAdminId);
      
      await adminService.createTournament({ 
        name, 
        status, 
        adminEmail: selectedAdmin?.email,
        ageCategories: selectedAgeCategories
      });

      setMessage({ type: "success", text: "Tournament created successfully!" });
      setName("");
      setStatus("ACTIVE");
      setSelectedAgeCategories([]);
      setSelectedAdminId("");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Failed to create tournament" });
    } finally {
      setLoading(false);
    }
  };

  const formatAgeCategory = (cat: string) => cat.replace('_', '-');

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Create New Tournament</h3>
        <p className="text-gray-500 text-sm mt-1">Set up a new competition with multiple age categories.</p>
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tournament Name</label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="e.g. Summer Cup 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <div className="relative">
            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE" | "FINISHED")}
            >
              <option value="ACTIVE">Active (Ongoing)</option>
              <option value="INACTIVE">Inactive (Planned)</option>
              <option value="FINISHED">Completed (Finished)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Admin (Optional)</label>
          <div className="relative">
            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
            >
              <option value="">-- No Specific Admin --</option>
              {tournamentAdmins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.email} ({admin.role})
                </option>
              ))}
            </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Age Categories</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {AGE_CATEGORIES.map(cat => (
             <button
               key={cat}
               type="button"
               onClick={() => toggleAgeCategory(cat)}
               className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                 selectedAgeCategories.includes(cat)
                   ? 'bg-blue-600 text-white shadow-md transform scale-105'
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               }`}
             >
               {formatAgeCategory(cat)}
             </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Select all age groups included in this tournament.</p>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={loading} className="w-full py-3 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all">
          {loading ? "Creating..." : "Create Tournament"}
        </Button>
      </div>
    </form>
  );
};

export default CreateTournamentForm;
