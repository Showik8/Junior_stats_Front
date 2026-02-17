import { useState, useEffect } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";
import { Admin, UpdateAdminPayload } from "@/types/admin";

interface EditAdminFormProps {
  admin: Admin;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditAdminForm = ({ admin, onSuccess, onCancel }: EditAdminFormProps) => {
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"TOURNAMENT_ADMIN" | "CLUB_ADMIN">(
    admin.role === "SUPER_ADMIN" ? "TOURNAMENT_ADMIN" : (admin.role as "TOURNAMENT_ADMIN" | "CLUB_ADMIN")
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setEmail(admin.email);
    setRole(
        admin.role === "SUPER_ADMIN" ? "TOURNAMENT_ADMIN" : (admin.role as "TOURNAMENT_ADMIN" | "CLUB_ADMIN")
    );
    setPassword("");
    setMessage(null);
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload: UpdateAdminPayload = { email, role };
      if (password) {
        payload.password = password;
      }

      await adminService.updateAdmin(admin.id, payload);
      setMessage({ type: "success", text: "Admin updated successfully!" });
      setTimeout(() => {
          onSuccess();
      }, 1000);
    } catch (err) {
       console.error(err);
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const errorMsg = (err as any).message || "Failed to update admin";
       setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
         <div>
            <h3 className="text-2xl font-bold text-gray-800">Edit Admin</h3>
            <p className="text-gray-500 text-sm mt-1">Update administrator details.</p>
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          required
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Password <span className="text-gray-400 font-normal">(Leave empty to keep current)</span></label>
        <input
          type="password"
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
        <div className="relative">
            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              value={role}
              onChange={(e) => setRole(e.target.value as "TOURNAMENT_ADMIN" | "CLUB_ADMIN")}
              disabled={admin.role === 'SUPER_ADMIN'}
            >
              <option value="TOURNAMENT_ADMIN">Tournament Admin</option>
              <option value="CLUB_ADMIN">Club Admin</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
        {admin.role === 'SUPER_ADMIN' && <p className="text-xs text-amber-600 mt-1">Super Admin role cannot be changed.</p>}
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
          {loading ? "Updating..." : "Update Admin"}
        </Button>
      </div>
    </form>
  );
};

export default EditAdminForm;
