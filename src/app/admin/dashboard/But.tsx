"use client";
import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";

const But = () => {
  async function up() {
    const res = await axiosInstance.post(
      API_PATHS.TOURNAMENT.UPDATE_TOURNAMENT,
      {
        gavanaxlot: "Data",
      }
    );
    console.log(res.data);
  }
  return <button onClick={up}>ganaxlebuli data</button>;
};

export default But;
