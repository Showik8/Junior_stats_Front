"use client";
import React, { useState } from "react";
import {
  FaChartPie,
  FaUsers,
  FaFutbol,
  FaTrophy,
  FaCog,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface ClubSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClubSidebar: React.FC<ClubSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: FaChartPie },
    { id: "players", label: "Squad", icon: FaUsers },
    { id: "matches", label: "Matches", icon: FaFutbol },
    { id: "tournaments", label: "Tournaments", icon: FaTrophy },
    { id: "info", label: "Club Info", icon: FaInfoCircle },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const renderNavContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-gray-100/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
            JS
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-gray-900 block leading-tight">
              Junior Stats
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              Club Panel
            </span>
          </div>
        </div>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
        >
          <FaTimes />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`text-base ${
                  isActive ? "text-blue-500" : "text-gray-400"
                }`}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <div className="rounded-xl bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 ring-1 ring-blue-100/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-semibold text-gray-700">System Status</p>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            All systems operational. Last sync: just now.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden p-2.5 rounded-xl bg-white shadow-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
      >
        <FaBars className="text-lg" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden h-full w-[260px] flex-col bg-white border-r border-gray-100 shadow-sm md:flex">
        {renderNavContent()}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 flex flex-col shadow-2xl md:hidden animate-slide-in-right">
            {renderNavContent()}
          </aside>
        </>
      )}
    </>
  );
};

export default ClubSidebar;
