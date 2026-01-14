"use client";
import { removeToken } from "@/app/utils/auth";
import Link from "next/link";

const SuperAdminHeader = () => {
  const logout = () => {
    removeToken();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side: Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Super Admin Dashboard
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-purple-100 text-purple-800">
              GOD MODE
            </span>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Exit Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
            <button
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors focus:outline-none"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
