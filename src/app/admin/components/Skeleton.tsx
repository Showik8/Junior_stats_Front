import React from "react";

interface SkeletonProps {
  variant?: "text" | "card" | "table-row" | "circle" | "rectangle";
  width?: string;
  height?: string;
  lines?: number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
}) => {
  const baseClass =
    "bg-gray-200 rounded animate-pulse";

  if (variant === "circle") {
    return (
      <div
        className={`${baseClass} rounded-full ${className}`}
        style={{ width: width || "40px", height: height || "40px" }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div className={`${baseClass} rounded-xl ${className}`} style={{ width: width || "100%", height: height || "120px" }} />
    );
  }

  if (variant === "table-row") {
    return (
      <div className={`flex items-center gap-4 py-3 ${className}`}>
        <div className={`${baseClass} h-4 w-1/4`} />
        <div className={`${baseClass} h-4 w-1/3`} />
        <div className={`${baseClass} h-4 w-1/6`} />
        <div className={`${baseClass} h-4 w-1/5`} />
      </div>
    );
  }

  if (variant === "rectangle") {
    return (
      <div
        className={`${baseClass} ${className}`}
        style={{ width: width || "100%", height: height || "40px" }}
      />
    );
  }

  // Text variant
  return (
    <div className={`space-y-2.5 ${className}`} style={{ width: width || "100%" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} h-4`}
          style={{
            width: i === lines - 1 && lines > 1 ? "75%" : "100%",
          }}
        />
      ))}
    </div>
  );
};

/**
 * Table skeleton — renders multiple skeleton rows
 */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-200">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded animate-pulse h-3"
            style={{ width: `${100 / cols}%` }}
          />
        ))}
      </div>
      {/* Row skeletons */}
      <div className="divide-y divide-gray-100 px-6">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="table-row" />
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
