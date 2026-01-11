import React from "react";
import { AgeCategory } from "@/types/admin";

interface AgeCategorySelectorProps {
  selectedCategory: AgeCategory;
  onSelectCategory: (category: AgeCategory) => void;
}

const CATEGORIES: AgeCategory[] = ["U-10", "U-12", "U-14", "U-16", "U-18", "U-21"];

const AgeCategorySelector: React.FC<AgeCategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Select Age Category</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgeCategorySelector;
