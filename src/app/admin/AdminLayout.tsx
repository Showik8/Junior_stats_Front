"use client";
import { useEffect, useState } from "react";
import { getUserRole } from "../utils/auth";
import ClubDashboard from "./dashboard/ClubDashboard";
import TournamentDashboard from "./dashboard/TournamentDashboard";
import Header from "./ui/Header";


const AdminLayout = () => {
  const [role, setRole] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if(!role){
    return window.location.href = "/sign-in"
  }

  if (role === "CLUB_ADMIN") {
    return <>
    <Header/>
    <ClubDashboard />
    </>;
  }

  if (role === "TOURNAMENT_ADMIN") {
    return <>
      <Header/>
      <TournamentDashboard />
    </>;
  }
  


  return <div>Unauthorized access</div>;
};

export default AdminLayout;