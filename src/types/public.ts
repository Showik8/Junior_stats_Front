/**
 * Public API response types — used by public.service.ts and public-facing components.
 * These represent the shape of data returned by /api/public/* endpoints.
 */

import type { AgeCategory, MatchStatus, TournamentStatus, TournamentFormat } from "./admin";

// ─── Tournament ───────────────────────────────────────────────────────────────

export interface PublicTournament {
  id: string;
  name: string;
  status: TournamentStatus;
  format: TournamentFormat;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  ageCategories?: string[];
  teamCount?: number;
  matchCount?: number;
}

export interface PublicTournamentsResponse {
  tournaments: PublicTournament[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface PublicTeam {
  id: string;
  name: string;
  logo?: string | null;
  coach?: string | null;
  ageCategory: AgeCategory;
  city?: string | null;
  playerCount?: number;
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface PublicPlayer {
  id: string;
  name: string;
  position?: string | null;
  shirtNumber?: number | null;
  photoUrl?: string | null;
  birthDate?: string | null;
  nationality?: string | null;
  height?: number | null;
  weight?: number | null;
  preferredFoot?: string | null;
  views?: number;
  teamId?: string;
  teamName?: string;
}

// ─── Match ────────────────────────────────────────────────────────────────────

export interface PublicMatchTeam {
  id: string;
  name: string;
  logo?: string | null;
}

export interface PublicMatch {
  id: string;
  date: string;
  status: MatchStatus;
  homeTeamId: string;
  awayTeamId: string;
  tournamentId: string;
  ageCategory?: AgeCategory;
  homeScore?: number | null;
  awayScore?: number | null;
  venue?: string | null;
  homeTeam?: PublicMatchTeam;
  awayTeam?: PublicMatchTeam;
  tournament?: { id: string; name: string };
}
