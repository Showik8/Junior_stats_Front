import { useState, useEffect } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";
import { Admin, Tournament, AgeCategory, AGE_CATEGORIES, TournamentFormat, TOURNAMENT_FORMATS, UpdateTournamentPayload } from "@/types/admin";

interface EditTournamentFormProps {
  tournament: Tournament;
  admins: Admin[];
  onSuccess: () => void;
  onCancel: () => void;
}

const EditTournamentForm = ({ tournament, admins, onSuccess, onCancel }: EditTournamentFormProps) => {
  const [name, setName] = useState(tournament.name);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "FINISHED">(tournament.status);
  const [format, setFormat] = useState<TournamentFormat>(tournament.format);
  const [description, setDescription] = useState(tournament.description || "");
  const [startDate, setStartDate] = useState(tournament.startDate ? new Date(tournament.startDate).toISOString().split('T')[0] : "");
  const [endDate, setEndDate] = useState(tournament.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : "");
  const [location, setLocation] = useState(tournament.location || "");
  const [rules, setRules] = useState(tournament.rules || "");
  const [logoUrl, setLogoUrl] = useState(tournament.logoUrl || "");
  const [bannerUrl, setBannerUrl] = useState(tournament.bannerUrl || "");
  const [selectedAgeCategories, setSelectedAgeCategories] = useState<AgeCategory[]>(
    tournament.ageCategories?.map(ac => ac.ageCategory) || []
  );
  
  // Find current admin if any
  const currentAdmin = tournament.admins && tournament.admins.length > 0 ? tournament.admins[0].admin : null;
  const [selectedAdminId, setSelectedAdminId] = useState(currentAdmin?.id.toString() || "");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter for Tournament Admins only
  const tournamentAdmins = admins.filter(a => a.role === "TOURNAMENT_ADMIN" || a.role === "SUPER_ADMIN");

  useEffect(() => {
    setName(tournament.name);
    setStatus(tournament.status);
    setFormat(tournament.format);
    setDescription(tournament.description || "");
    setStartDate(tournament.startDate ? new Date(tournament.startDate).toISOString().split('T')[0] : "");
    setEndDate(tournament.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : "");
    setLocation(tournament.location || "");
    setRules(tournament.rules || "");
    setLogoUrl(tournament.logoUrl || "");
    setBannerUrl(tournament.bannerUrl || "");
    setSelectedAgeCategories(tournament.ageCategories?.map(ac => ac.ageCategory) || []);
    
    const admin = tournament.admins && tournament.admins.length > 0 ? tournament.admins[0].admin : null;
    setSelectedAdminId(admin?.id.toString() || "");
  }, [tournament]);

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

      const payload: UpdateTournamentPayload = { 
        name, 
        status, 
        format,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        location: location || undefined,
        rules: rules || undefined,
        logoUrl: logoUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        ageCategories: selectedAgeCategories
      };

      // Only add adminEmail if selectedAdminId changed or is set
      const selectedAdmin = tournamentAdmins.find(a => a.id.toString() === selectedAdminId);
      if (selectedAdmin) {
          payload.adminEmail = selectedAdmin.email;
      }

      await adminService.updateTournament(tournament.id, payload);

      setMessage({ type: "success", text: "Tournament updated successfully!" });
      setTimeout(() => {
          onSuccess();
      }, 1000);
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg = (err as any).message || "Failed to update tournament";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const formatAgeCategory = (cat: string) => cat.replace('_', '-');

  const selectClass = "w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none";
  const inputClass = "w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  const SelectArrow = () => (
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
        <div>
           <h3 className="text-2xl font-bold text-gray-800">Edit Tournament</h3>
           <p className="text-gray-500 text-sm mt-1">Update tournament details and settings.</p>
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

      {/* Row 1: Name */}
      <div>
        <label className={labelClass}>Tournament Name</label>
        <input
          type="text"
          required
          className={inputClass}
          placeholder="e.g. Summer Cup 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Row 2: Status, Format, Admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Status</label>
          <div className="relative">
            <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE" | "FINISHED")}>
              <option value="ACTIVE">Active (Ongoing)</option>
              <option value="INACTIVE">Inactive (Planned)</option>
              <option value="FINISHED">Completed (Finished)</option>
            </select>
            <SelectArrow />
          </div>
        </div>

        <div>
          <label className={labelClass}>Format</label>
          <div className="relative">
            <select className={selectClass} value={format} onChange={(e) => setFormat(e.target.value as TournamentFormat)}>
              {TOURNAMENT_FORMATS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <SelectArrow />
          </div>
        </div>

        <div>
          <label className={labelClass}>Assign Admin (Optional)</label>
          <div className="relative">
            <select className={selectClass} value={selectedAdminId} onChange={(e) => setSelectedAdminId(e.target.value)}>
              <option value="">-- No Specific Admin --</option>
              {tournamentAdmins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.email} ({admin.role})
                </option>
              ))}
            </select>
            <SelectArrow />
          </div>
        </div>
      </div>

      {/* Row 3: Description */}
      <div>
        <label className={labelClass}>Description (Optional)</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Brief description of the tournament..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Row 4: Dates & Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Start Date</label>
          <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input type="date" className={inputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input type="text" className={inputClass} placeholder="e.g. Tbilisi, Georgia" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      {/* Age Categories */}
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

      {/* Advanced Section */}
      <div className="border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
        </button>
        
        {showAdvanced && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className={labelClass}>Rules (Optional)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Tournament rules and regulations..."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Logo URL (Optional)</label>
                <input type="url" className={inputClass} placeholder="https://example.com/logo.png" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Banner URL (Optional)</label>
                <input type="url" className={inputClass} placeholder="https://example.com/banner.png" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} />
              </div>
            </div>
          </div>
        )}
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
          {loading ? "Update Tournament" : "Update Tournament"}
        </Button>
      </div>
    </form>
  );
};

export default EditTournamentForm;
