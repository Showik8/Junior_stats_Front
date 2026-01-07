"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import But from "./But";
import Link from "next/link";

const TournamentDashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.get(API_PATHS.TOURNAMENT.GET_TOURNAMENTS);
        console.log(res.data);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching tournament data", error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <main className="flex justify-center items-center flex-col">
        <h1>turniris saxeli</h1>
        <Link href={"/"}> gasvlis gilaki</Link>
        <h1>{JSON.stringify(data)}</h1>
        <But />
      </main>
    </>
  );
};

export default TournamentDashboard;
