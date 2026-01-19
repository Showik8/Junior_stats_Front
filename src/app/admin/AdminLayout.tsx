"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "../utils/auth";
import ClubDashboard from "./dashboard/ClubDashboard";
import TournamentDashboard from "./dashboard/TournamentDashboard";
import SuperAdminDashboard from "./dashboard/SuperAdminDashboard";

const AdminLayout = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const userRole = getUserRole();
    if (!userRole) {
      router.push("/sign-in");
    } else {
      setRole(userRole);
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!role) {
    return null; // Will redirect
  }

  if (role === "CLUB_ADMIN") {
    return <ClubDashboard />;
  }

  if (role === "TOURNAMENT_ADMIN") {
    return <TournamentDashboard />;
  }

  if (role === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-600 font-medium">
      Unauthorized access
    </div>
  );
};

export default AdminLayout;