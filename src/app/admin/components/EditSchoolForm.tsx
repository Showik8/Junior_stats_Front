"use client";
import React, { useState } from "react";
import { schoolService } from "@/services/school.service";
import type { FootballSchool, UpdateSchoolPayload } from "@/types/school.types";
import Button from "./Button";

interface EditSchoolFormProps {
  school: FootballSchool;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditSchoolForm: React.FC<EditSchoolFormProps> = ({ school, onSuccess, onCancel }) => {
  const [form, setForm] = useState<UpdateSchoolPayload>({
    name: school.name,
    city: school.city || "",
    founded: school.founded || undefined,
    logoUrl: school.logoUrl || "",
    website: school.website || "",
    description: school.description || "",
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

    try {
      setLoading(true);
      await schoolService.updateSchool(school.id, form);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "შეცდომა სკოლის რედაქტირებისას";
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
        <label className="block text-sm font-medium text-gray-700 mb-1">სკოლის სახელი</label>
        <input
          type="text"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} type="button">
          გაუქმება
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "ინახება..." : "შენახვა"}
        </Button>
      </div>
    </form>
  );
};

export default EditSchoolForm;
