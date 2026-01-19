import React, { useState, useEffect } from "react";
import { Team } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaSave, FaBuilding, FaUserTie } from "react-icons/fa";

interface ClubInfoProps {
  team: Team | null;
  onUpdate: () => void;
}

const ClubInfo: React.FC<ClubInfoProps> = ({ team, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    coach: "",
    logo: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        coach: team.coach || "",
        logo: team.logo || "",
      });
    }
  }, [team]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    
    setLoading(true);
    setMessage(null);
    try {
      await adminService.updateTeam(team.id, {
         name: formData.name,
         coach: formData.coach,
         logo: formData.logo,
         // We do not change ageCategory here as it's structurally bound
      });
      setMessage({ type: 'success', text: "Club information updated successfully!" });
      onUpdate();
    } catch (err: any) {
        console.error(err);
        setMessage({ type: 'error', text: err.message || "Failed to update information." });
    } finally {
        setLoading(false);
    }
  };

  if (!team) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Club & Coach Information</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your club details and coach contact information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Club Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                  <FaBuilding className="text-blue-500" />
                  <h2 className="font-semibold text-gray-800">Club Details</h2>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                       <input 
                           type="text" 
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                           className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="Enter club name"
                           required
                       />
                  </div>
                  <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-2">Club Logo URL</label>
                       <input 
                           type="url" 
                           name="logo"
                           value={formData.logo}
                           onChange={handleChange}
                           className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="https://example.com/logo.png"
                       />
                       <p className="mt-1 text-xs text-gray-500">Enter a direct URL to your logo image.</p>
                  </div>
             </div>
        </div>

        {/* Coach Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                  <FaUserTie className="text-purple-500" />
                  <h2 className="font-semibold text-gray-800">Coach Information</h2>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-2">Coach Name</label>
                       <input 
                           type="text" 
                           name="coach"
                           value={formData.coach}
                           onChange={handleChange}
                           className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="Enter coach's full name"
                       />
                  </div>
                  {/* Note: Phone and Email are not in the Team model yet, but requested. 
                      For now I will skip or add them as mock fields if backend updates later 
                      The user request says 'Phone Number' 'Email'. I will assume they are not persisted differently. 
                      Actually the prompt says: "Coach Info: Full name, Phone number, Email".
                      The Team interface only has `coach` string. 
                      I will add placeholders for Phone/Email but they won't persist unless I update the backend.
                      I will stick to what the backend supports to avoid broken promises, 
                      or put them in UI but disabled/mocked.
                      "Ability to edit or replace the coach" - handled by editing the name.
                  */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                        type="tel" 
                        disabled
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500"
                        placeholder="Not available in this version"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        disabled
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500"
                        placeholder="Not available in this version"
                    />
                  </div>
             </div>
        </div>

        {message && (
             <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                 {message.text}
             </div>
        )}

        <div className="flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                       <span>Saving...</span>
                    </>
                ) : (
                    <>
                       <FaSave />
                       <span>Save Changes</span>
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ClubInfo;
