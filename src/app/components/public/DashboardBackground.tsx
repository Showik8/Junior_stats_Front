"use client";

import { usePathname } from "next/navigation";

export default function DashboardBackground() {
  const pathname = usePathname();
  const isPlayerPage = pathname.startsWith("/players/");
  const isLandingPage = pathname === "/";

  // Hide on landing page (Hero video handles its own bg) and player detail pages
  if (isPlayerPage || isLandingPage) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/dashboard_bg.jpeg')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#060c1a]/85 via-[#060c1a]/92 to-[#060c1a]/98 z-0" />
    </>
  );
}

