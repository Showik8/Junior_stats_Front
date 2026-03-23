import { useState } from "react";
import Button from "./Button";
import { adminService } from "@/services/adminService";

interface CreateAdminFormProps {
  onSuccess: () => void;
}

const CreateAdminForm = ({ onSuccess }: CreateAdminFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"TOURNAMENT_ADMIN" | "CLUB_ADMIN" | "SCHOOL_ADMIN">("TOURNAMENT_ADMIN");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await adminService.createAdmin({ email, password, role });
      setMessage({ type: "success", text: "Admin created successfully!" });
      setEmail("");
      setPassword("");
      setRole("TOURNAMENT_ADMIN");
      onSuccess();
    } catch (err) {
       console.error(err);
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const errorMsg = (err as any).response?.data?.message || (err as Error).message || "Failed to create admin";
       setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6">
         <h3 className="text-2xl font-bold text-gray-800">Create New Admin</h3>
         <p className="text-gray-500 text-sm mt-1">Add a new administrator to the system.</p>
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
        <input
          type="password"
          required
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
              onChange={(e) => setRole(e.target.value as "TOURNAMENT_ADMIN" | "CLUB_ADMIN" | "SCHOOL_ADMIN")}
            >
              <option value="TOURNAMENT_ADMIN">Tournament Admin</option>
              <option value="CLUB_ADMIN">Club Admin</option>
              <option value="SCHOOL_ADMIN">School Admin</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={loading} className="w-full py-3 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all">
          {loading ? "Creating..." : "Create Admin"}
        </Button>
      </div>
    </form>
  );
};

export default CreateAdminForm;
