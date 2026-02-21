"use client";

import { usePathname } from "next/navigation";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isPlayersPage = pathname.startsWith("/players");
  const isTeamsPage = pathname.startsWith("/teams");

  // Hide sidebar on landing, players, and teams pages
  if (isLandingPage || isPlayersPage || isTeamsPage) return null;

  return <>{children}</>;
}
