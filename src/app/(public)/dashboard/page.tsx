import { publicService } from "@/services/public.service";
import DashboardClient from "./DashboardClient";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function DashboardPage() {
  let allMatches: any[] = [];
  try {
    allMatches = await publicService.getAllMatches();
  } catch (error) {
    console.error("Failed to load matches for dashboard", error);
  }

  return <DashboardClient allMatches={allMatches} />;
}
