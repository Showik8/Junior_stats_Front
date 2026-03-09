"use client";

import { useState } from "react";
import { HiOutlineScale } from "react-icons/hi";
import PlayerCompareModal from "@/app/components/public/compare/PlayerCompareModal";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PlayerCompareButton({ players }: { players: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_-4px_rgba(110,231,183,0.15)] whitespace-nowrap"
      >
        <HiOutlineScale size={18} />
        შედარება
      </button>

      {open && (
        <PlayerCompareModal players={players} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
