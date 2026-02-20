"use client";

import { usePathname } from "next/navigation";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayerPage = pathname.startsWith("/players/");
  const isLandingPage = pathname === "/";

  // Hide sidebar on landing page and player details page
  if (isLandingPage || isPlayerPage) return null;

  return <>{children}</>;
}
