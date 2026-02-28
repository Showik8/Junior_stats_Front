"use client";

import { useEffect } from "react";
import { publicService } from "@/services/public.service";

interface PlayerViewTrackerProps {
  playerId: string;
}

export default function PlayerViewTracker({ playerId }: PlayerViewTrackerProps) {
  useEffect(() => {
    const storageKey = `viewed_player_${playerId}`;
    const hasViewed = localStorage.getItem(storageKey);

    if (!hasViewed) {
      // It's a new unique view from this device
      publicService
        .incrementPlayerView(playerId)
        .then(() => {
          localStorage.setItem(storageKey, "true");
        })
        .catch((err) => {
          console.error("View tracking error", err);
        });
    }
  }, [playerId]);

  return null; // Invisible component
}
