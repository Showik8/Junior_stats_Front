"use client";

import { useEffect } from "react";
import { publicService } from "@/services/public.service";

interface PlayerViewTrackerProps {
  playerId: string;
}

export default function PlayerViewTracker({ playerId }: PlayerViewTrackerProps) {
  useEffect(() => {
    const storageKey = `viewed_player_${playerId}`;
    const lastViewed = localStorage.getItem(storageKey);
    const now = Date.now();
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

    if (!lastViewed || now - parseInt(lastViewed, 10) > TWELVE_HOURS_MS) {
      // It's a new view or 12 hours have passed
      publicService
        .incrementPlayerView(playerId)
        .then(() => {
          localStorage.setItem(storageKey, now.toString());
        })
        .catch((err) => {
          console.error("View tracking error", err);
        });
    }
  }, [playerId]);

  return null; // Invisible component
}
