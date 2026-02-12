import React, { useState } from "react";
import { Team, AgeCategory, AGE_CATEGORIES } from "@/types/admin";
import { adminService } from "@/services/adminService";
import { FaSave, FaEdit, FaTimes } from "react-icons/fa";

interface ClubInfoProps {
  team: Team | null;
  onUpdate: () => void;
}

const ClubInfo: React.FC<ClubInfoProps> = ({ team, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    coach: "",
    ageCategory: "" as AgeCategory | "",
  });

  // Initialize form data when entering edit mode
  const startEditing = () => {
    if (team) {
      setFormData({
        name: team.name,
        coach: team.coach || "",
        ageCategory: team.ageCategory,
      });
      setIsEditing(true);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!team) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await adminService.updateTeam(team.id, {
        name: formData.name,
        coach: formData.coach,
        // logo: ... (handle logo upload separately if needed)
      });
      
      onUpdate();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update club info");
    } finally {
      setLoading(false);
    }
  };

  if (!team) return <div className="p-4 text-center text-gray-500">No club information available.</div>;

  return (
    <div className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Club Details</h2>
        {!isEditing ? (
          <button 
            onClick={startEditing}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <FaEdit /> Edit Details
          </button>
        ) : (
          <button 
             onClick={() => setIsEditing(false)}
             className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
             <FaTimes /> Cancel
          </button>
        )}
      </div>

      <div className="p-6">
        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Left Column - Logo */}
             <div className="flex flex-col items-center justify-center space-y-4">
                 <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                     {team.logo ? (
                         <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
                     ) : (
                         <span className="text-4xl text-gray-300 font-bold">{team.name.substring(0, 2).toUpperCase()}</span>
                     )}
                 </div>
                 <p className="text-xs text-gray-400">Logo update not available in quick edit</p>
             </div>

             {/* Right Column - Form/Details */}
             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                     {isEditing ? (
                         <input 
                            type="text" 
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                         />
                     ) : (
                         <p className="text-gray-900 font-semibold">{team.name}</p>
                     )}
                 </div>

                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
                     {isEditing ? (
                         <input 
                            type="text" 
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            value={formData.coach}
                            onChange={(e) => setFormData({...formData, coach: e.target.value})}
                         />
                     ) : (
                         <p className="text-gray-900">{team.coach || "Not Assigned"}</p>
                     )}
                 </div>

                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Age Category</label>
                     <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                         {team.ageCategory.replace('_', ' ')}
                     </div>
                     <p className="mt-1 text-xs text-gray-500">Age category currently cannot be changed</p>
                 </div>

                 {isEditing && (
                     <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                        </button>
                     </div>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default ClubInfo;
