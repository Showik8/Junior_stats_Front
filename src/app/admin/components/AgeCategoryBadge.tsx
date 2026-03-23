"use client";
import React from "react";
import type { AgeCategory } from "@/types/admin";

interface AgeCategoryBadgeProps {
  category: AgeCategory;
  size?: "sm" | "md";
}

const categoryColors: Record<string, string> = {
  U_10: "bg-emerald-100 text-emerald-700",
  U_11: "bg-emerald-100 text-emerald-700",
  U_12: "bg-green-100 text-green-700",
  U_13: "bg-green-100 text-green-700",
  U_14: "bg-teal-100 text-teal-700",
  U_15: "bg-teal-100 text-teal-700",
  U_16: "bg-cyan-100 text-cyan-700",
  U_17: "bg-blue-100 text-blue-700",
  U_18: "bg-blue-100 text-blue-700",
  U_19: "bg-indigo-100 text-indigo-700",
  U_20: "bg-indigo-100 text-indigo-700",
  U_21: "bg-violet-100 text-violet-700",
};

const AgeCategoryBadge: React.FC<AgeCategoryBadgeProps> = ({ category, size = "sm" }) => {
  const display = category.replace("_", "");
  const color = categoryColors[category] || "bg-gray-100 text-gray-700";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${color} ${sizeClass}`}>
      {display}
    </span>
  );
};

export default AgeCategoryBadge;
