"use client";
import { useState } from "react";
import Button from "./Button";
import { refereeService } from "@/services/referee.service";
import { Referee } from "@/types/admin";

interface EditRefereeFormProps {
  referee: Referee;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditRefereeForm = ({ referee, onSuccess, onCancel }: EditRefereeFormProps) => {
  const [firstName, setFirstName] = useState(referee.firstName);
  const [lastName, setLastName] = useState(referee.lastName);
  const [email, setEmail] = useState(referee.admin?.email || "");
  const [phone, setPhone] = useState(referee.phone || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (password && password.length < 6) {
        setMessage({ type: "error", text: "პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს" });
        setLoading(false);
        return;
      }
      await refereeService.updateReferee(referee.id, {
        firstName,
        lastName,
        phone: phone || undefined,
        email: email !== referee.admin?.email ? email : undefined,
        password: password || undefined,
      });
      setMessage({ type: "success", text: "მსაჯის ინფორმაცია განახლდა!" });
      onSuccess();
    } catch (err) {
      console.error(err);
      const errorMsg = (err as Error).message || "Failed to update referee";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">მსაჯის რედაქტირება</h3>
        <p className="text-gray-500 text-sm mt-1">{referee.firstName} {referee.lastName}</p>
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">ელ-ფოსტა</label>
        <input
          type="email"
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">ახალი პაროლი</label>
        <input
          type="password"
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          placeholder="ცარიელი დატოვეთ თუ არ გსურთ შეცვლა"
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

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1 py-3 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all">
          {loading ? "ინახება..." : "შენახვა"}
        </Button>
        <Button type="button" onClick={onCancel} className="px-6 py-3 text-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all">
          გაუქმება
        </Button>
      </div>
    </form>
  );
};

export default EditRefereeForm;
