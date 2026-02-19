"use client";

import { usePathname } from "next/navigation";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayerPage = pathname.startsWith("/players/");

  if (isPlayerPage) return null;

  return <>{children}</>;
}
