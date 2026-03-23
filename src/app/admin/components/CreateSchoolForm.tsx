"use client";
import React, { useState } from "react";
import { schoolService } from "@/services/school.service";
import type { CreateSchoolPayload } from "@/types/school.types";
import Button from "./Button";

interface CreateSchoolFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateSchoolForm: React.FC<CreateSchoolFormProps> = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState<CreateSchoolPayload>({
    name: "",
    city: "",
    founded: undefined,
    logoUrl: "",
    website: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "founded" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("სკოლის სახელი სავალდებულოა");
      return;
    }

    try {
      setLoading(true);
      const payload: CreateSchoolPayload = { name: form.name.trim() };
      if (form.city?.trim()) payload.city = form.city.trim();
      if (form.founded) payload.founded = form.founded;
      if (form.logoUrl?.trim()) payload.logoUrl = form.logoUrl.trim();
      if (form.website?.trim()) payload.website = form.website.trim();
      if (form.description?.trim()) payload.description = form.description.trim();

      await schoolService.createSchool(payload);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "შეცდომა სკოლის შექმნისას";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">სკოლის სახელი *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ქალაქი</label>
          <input
            type="text"
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">დაარსების წელი</label>
          <input
            type="number"
            name="founded"
            value={form.founded || ""}
            onChange={handleChange}
            min={1800}
            max={new Date().getFullYear()}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ლოგოს URL</label>
        <input
          type="text"
          name="logoUrl"
          value={form.logoUrl || ""}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ვებსაიტი</label>
        <input
          type="text"
          name="website"
          value={form.website || ""}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">აღწერა</label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
        />
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
        💡 ადმინის მისაბმელად: ჯერ შექმენით სკოლა, შემდეგ „მართვა" ღილაკიდან მიაბით ადმინი.
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} type="button">
          გაუქმება
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "იქმნება..." : "შექმნა"}
        </Button>
      </div>
    </form>
  );
};

export default CreateSchoolForm;
