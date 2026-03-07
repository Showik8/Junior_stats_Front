import { useState } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";
import { Sponsor } from "@/types/admin";

interface EditSponsorFormProps {
  sponsor: Sponsor;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditSponsorForm = ({ sponsor, onSuccess, onCancel }: EditSponsorFormProps) => {
  const [name, setName] = useState(sponsor.name);
  const [logoUrl, setLogoUrl] = useState(sponsor.logoUrl);
  const [website, setWebsite] = useState(sponsor.website || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!name.trim()) throw new Error("Sponsor name is required");
      if (!logoUrl.trim()) throw new Error("Logo URL is required");

      await adminService.updateSponsor(sponsor.id, {
        name,
        logoUrl,
        website: website || undefined,
      });

      setMessage({ type: "success", text: "Sponsor updated successfully!" });
      
      // Delay slightly so the user sees the success message before unmounting
      setTimeout(() => {
        onSuccess();
      }, 1000);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to update sponsor" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all focus:bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Edit Sponsor</h3>
          <p className="text-gray-500 text-sm mt-1">Update information for {sponsor.name}</p>
        </div>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {message.text}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Sponsor Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            className={inputClass}
            placeholder="e.g. Nike, Adidas, Local Bank"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Logo URL <span className="text-red-500">*</span></label>
          <input
            type="url"
            required
            className={inputClass}
            placeholder="https://example.com/logo.png"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
          {logoUrl && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo Preview" className="h-16 object-contain mix-blend-multiply" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
        </div>

        <div>
           <label className={labelClass}>Website URL (Optional)</label>
          <input
            type="url"
            className={inputClass}
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading} className="px-6">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditSponsorForm;
