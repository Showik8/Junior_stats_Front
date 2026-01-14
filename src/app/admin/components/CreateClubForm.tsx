import { useState } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";
import { Admin, AgeCategory, AGE_CATEGORIES } from "@/types/admin";

interface CreateClubFormProps {
  admins: Admin[];
  onSuccess: () => void;
}

const CreateClubForm = ({ admins, onSuccess }: CreateClubFormProps) => {
  const [name, setName] = useState("");
  const [ageCategory, setAgeCategory] = useState<AgeCategory>(AGE_CATEGORIES[0]);
  const [coach, setCoach] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter for Club Admins only
  const clubAdmins = admins.filter(a => a.role === "CLUB_ADMIN" || a.role === "SUPER_ADMIN");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Find email from selected ID
      const selectedAdmin = clubAdmins.find(a => a.id.toString() === selectedAdminId);
      
      await adminService.addTeam({ 
        name, 
        ageCategory,
        coach: coach || null,
        adminEmail: selectedAdmin?.email 
      });

      setMessage({ type: "success", text: "Club created successfully!" });
      setName("");
      setCoach("");
      setAgeCategory(AGE_CATEGORIES[0]);
      setSelectedAdminId("");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Failed to create club" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6">
         <h3 className="text-2xl font-bold text-gray-800">Create New Club</h3>
         <p className="text-gray-500 text-sm mt-1">Register a new team and assign it to an age group.</p>
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
                  <option value="">-- No Specific Admin --</option>
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
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={loading} className="w-full py-3 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all">
          {loading ? "Creating..." : "Create Club"}
        </Button>
      </div>
    </form>
  );
};

export default CreateClubForm;
