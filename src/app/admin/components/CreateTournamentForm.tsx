import { useState } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";
import { Admin, AgeCategory, AGE_CATEGORIES, TournamentFormat, TOURNAMENT_FORMATS, Sponsor, SponsorTier } from "@/types/admin";
import { useEffect } from "react";

interface CreateTournamentFormProps {
  admins: Admin[];
  onSuccess: () => void;
}

const CreateTournamentForm = ({ admins, onSuccess }: CreateTournamentFormProps) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "FINISHED">("ACTIVE");
  const [format, setFormat] = useState<TournamentFormat>("LEAGUE");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [rules, setRules] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [selectedAgeCategories, setSelectedAgeCategories] = useState<AgeCategory[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sponsors State
  const [availableSponsors, setAvailableSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsors, setSelectedSponsors] = useState<{ sponsorId: string; tier: SponsorTier }[]>([]);

  // Filter for Tournament Admins only
  const tournamentAdmins = admins.filter(a => a.role === "TOURNAMENT_ADMIN" || a.role === "SUPER_ADMIN");

  const toggleAgeCategory = (cat: AgeCategory) => {
    setSelectedAgeCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await adminService.getSponsors();
        setAvailableSponsors(data.sponsors);
      } catch (error) {
        console.error("Failed to load sponsors", error);
      }
    };
    fetchSponsors();
  }, []);

  const handleSponsorToggle = (sponsorId: string) => {
    setSelectedSponsors((prev) => {
      const exists = prev.find((s) => s.sponsorId === sponsorId);
      if (exists) {
        return prev.filter((s) => s.sponsorId !== sponsorId);
      } else {
        return [...prev, { sponsorId, tier: "BRONZE" }];
      }
    });
  };

  const handleSponsorTierChange = (sponsorId: string, tier: SponsorTier) => {
    setSelectedSponsors((prev) =>
      prev.map((s) => (s.sponsorId === sponsorId ? { ...s, tier } : s))
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
        format,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        location: location || undefined,
        rules: rules || undefined,
        logoUrl: logoUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        adminEmail: selectedAdmin?.email,
        ageCategories: selectedAgeCategories,
        sponsors: selectedSponsors.length > 0 ? selectedSponsors : undefined,
      });

      setMessage({ type: "success", text: "Tournament created successfully!" });
      setName("");
      setStatus("ACTIVE");
      setFormat("LEAGUE");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setRules("");
      setLogoUrl("");
      setBannerUrl("");
      setSelectedAgeCategories([]);
      setSelectedAdminId("");
      setSelectedSponsors([]);
      setShowAdvanced(false);
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Failed to create tournament" });
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
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Create New Tournament</h3>
        <p className="text-gray-500 text-sm mt-1">Set up a new competition with multiple age categories.</p>
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

            {/* Sponsor Selection */}
            {availableSponsors.length > 0 && (
              <div className="pt-4 border-t border-gray-100 mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Attach Sponsors</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableSponsors.map((sponsor) => {
                    const isSelected = selectedSponsors.some((s) => s.sponsorId === sponsor.id);
                    const selectedData = selectedSponsors.find((s) => s.sponsorId === sponsor.id);
                    
                    return (
                      <div 
                        key={sponsor.id} 
                        className={`flex flex-col p-4 rounded-lg border transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSponsorToggle(sponsor.id)}
                              className="w-5 h-5 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2">
                              {sponsor.logoUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={sponsor.logoUrl} alt={sponsor.name} className="w-6 h-6 object-contain rounded-full bg-white" />
                              )}
                              <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{sponsor.name}</span>
                            </div>
                          </label>
                        </div>
                        
                        {isSelected && (
                          <div className="ml-8 mt-1 animate-in fade-in">
                            <label className="text-xs text-gray-500 mb-1 block">Sponsorship Tier</label>
                            <div className="relative">
                              <select 
                                className="w-full text-sm rounded-md border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none appearance-none bg-white"
                                value={selectedData?.tier || "BRONZE"}
                                onChange={(e) => handleSponsorTierChange(sponsor.id, e.target.value as SponsorTier)}
                              >
                                <option value="BRONZE">Bronze</option>
                                <option value="SILVER">Silver</option>
                                <option value="GOLD">Gold</option>
                                <option value="MAIN">Main</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        )}
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
