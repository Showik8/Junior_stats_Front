/**
 * Age categories matching backend validation
 * Backend accepts any string for ageCategory, but frontend restricts to common values
 */
export type AgeCategory = "U-10" | "U-12" | "U-14" | "U-16" | "U-18" | "U-21";

/**
 * Match status values from backend Prisma schema
 * Default: "SCHEDULED"
 */
export type MatchStatus = "SCHEDULED" | "CANCELED" | "COMPLETED";

/**
 * Tournament status values from backend Prisma schema
 * Default: "ACTIVE"
 */
export type TournamentStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

/**
 * Team interface matching backend Prisma Team model
 * All fields match exactly with backend schema
 */
export interface Team {
  id: string; // UUID from backend
  name: string; // Required
  logo?: string | null; // Optional, nullable
  coach?: string | null; // Optional, nullable
  ageCategory: string; // Required - age category string
  tournamentId: string; // Required - UUID reference
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
  // Optional nested relations (when includePlayers=true)
  players?: Player[];
  // Optional nested tournament (when includeTournament=true)
  tournament?: Tournament;
}

/**
 * Player interface matching backend Prisma Player model
 */
export interface Player {
  id: string; // UUID from backend
  name: string; // Required
  position?: string | null; // Optional, nullable
  shirtNumber?: number | null; // Optional, nullable (Int in Prisma)
  teamId: string; // Required - UUID reference
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
  // Optional nested team (when includeTeam=true)
  team?: Team;
}

/**
 * Match interface matching backend Prisma Match model
 * Backend includes nested homeTeam and awayTeam when includeTeams=true
 */
export interface Match {
  id: string; // UUID from backend
  date: string; // ISO date string (DateTime in Prisma)
  status: MatchStatus; // Default: "SCHEDULED"
  homeTeamId: string; // Required - UUID reference
  awayTeamId: string; // Required - UUID reference
  tournamentId: string; // Required - UUID reference
  ageCategory: string; // Required - matches teams' age category
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
  // Nested relations (when includeTeams=true, which is default for matches)
  homeTeam?: Team;
  awayTeam?: Team;
  tournament?: Tournament;
}

/**
 * Tournament interface matching backend Prisma Tournament model
 */
export interface Tournament {
  id: string; // UUID from backend
  name: string; // Required
  status: TournamentStatus; // Default: "ACTIVE"
  createdAt?: string; // ISO date string from backend
  updatedAt?: string; // ISO date string from backend
  // Optional nested relations (when includeTeams/includeMatches/includeAdmins=true)
  teams?: Team[];
  matches?: Match[];
}

/**
 * CreatePlayerPayload - matches backend CreatePlayerData interface
 * Required: name, teamId
 * Optional: position, shirtNumber
 */
export interface CreatePlayerPayload {
  name: string; // Required - validated on backend
  teamId: string; // Required - UUID, validated on backend
  position?: string | null; // Optional
  shirtNumber?: number | null; // Optional - validated for uniqueness within team on backend
}

/**
 * CreateTeamPayload - matches backend CreateTeamData interface
 * Required: name, tournamentId, ageCategory
 * Optional: logo, coach
 */
export interface CreateTeamPayload {
  name: string; // Required - validated on backend
  tournamentId: string; // Required - UUID, validated on backend
  ageCategory: AgeCategory | string; // Required - validated on backend
  logo?: string | null; // Optional
  coach?: string | null; // Optional
}

/**
 * CreateMatchPayload - matches backend CreateMatchData interface
 * Required: homeTeamId, awayTeamId, date, tournamentId
 * Optional: status, ageCategory (auto-derived from teams)
 * Backend validates: teams exist, same tournament, same age category, not same team
 */
export interface CreateMatchPayload {
  homeTeamId: string; // Required - UUID, validated on backend
  awayTeamId: string; // Required - UUID, validated on backend
  date: string; // Required - ISO date string, converted to DateTime on backend
  tournamentId: string; // Required - UUID, validated on backend
  status?: MatchStatus; // Optional - defaults to "SCHEDULED" on backend
  ageCategory?: string; // Optional - auto-derived from teams on backend
}

/**
 * Backend API Response wrapper
 * All backend responses follow this format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    message: string;
    code?: string;
    details?: unknown; // Backend may return various error detail formats
  };
}
