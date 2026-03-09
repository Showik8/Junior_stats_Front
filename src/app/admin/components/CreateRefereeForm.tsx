"use client";
import { useState } from "react";
import Button from "./Button";
import { refereeService } from "@/services/referee.service";

interface CreateRefereeFormProps {
  onSuccess: () => void;
}

const CreateRefereeForm = ({ onSuccess }: CreateRefereeFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (password.length < 6) {
        setMessage({ type: "error", text: "პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს" });
        setLoading(false);
        return;
      }
      await refereeService.createReferee({ email, password, firstName, lastName, phone: phone || undefined });
      setMessage({ type: "success", text: "მსაჯი წარმატებით შეიქმნა!" });
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      onSuccess();
    } catch (err) {
      console.error(err);
      const errorMsg = (err as Error).message || "Failed to create referee";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">ახალი მსაჯის დამატება</h3>
        <p className="text-gray-500 text-sm mt-1">დაარეგისტრირეთ ახალი მსაჯი სისტემაში.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">სახელი *</label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="სახელი"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">გვარი *</label>
          <input
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="გვარი"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">ელ-ფოსტა *</label>
        <input
          type="email"
          required
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          placeholder="referee@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">პაროლი *</label>
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">ტელეფონი</label>
        <input
          type="tel"
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          placeholder="+995 5XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={loading} className="w-full py-3 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all">
          {loading ? "იქმნება..." : "მსაჯის შექმნა"}
        </Button>
      </div>
    </form>
  );
};

export default CreateRefereeForm;
