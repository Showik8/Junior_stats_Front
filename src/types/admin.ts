/**
 * Age categories matching backend validation
 * Backend expects values like U_10, U_12 etc.
 */
export type AgeCategory = 
  | "U_10" 
  | "U_11" 
  | "U_12" 
  | "U_13" 
  | "U_14" 
  | "U_15" 
  | "U_16" 
  | "U_17" 
  | "U_18" 
  | "U_19" 
  | "U_20" 
  | "U_21";

export const AGE_CATEGORIES: AgeCategory[] = [
  "U_10", "U_11", "U_12", "U_13", "U_14", "U_15", 
  "U_16", "U_17", "U_18", "U_19", "U_20", "U_21"
];

/**
 * Roles matching backend Enum
 */
export type Role = "SUPER_ADMIN" | "CLUB_ADMIN" | "TOURNAMENT_ADMIN";

/**
 * Match status values from backend Prisma schema
 * Default: "SCHEDULED"
 */
export type MatchStatus = "SCHEDULED" | "CANCELLED" | "FINISHED";

/**
 * Tournament status values from backend Prisma schema
 * Default: "ACTIVE"
 */
export type TournamentStatus = "ACTIVE" | "INACTIVE" | "FINISHED";

/**
 * Team interface matching backend Prisma Team model
 */
export interface Team {
  id: string; // UUID
  name: string;
  logo?: string | null;
  coach?: string | null;
  ageCategory: AgeCategory; // Single age category per team
  tournamentId?: string; // Optional - only if strictly tied to one tournament context
  createdAt?: string;
  updatedAt?: string;
  
  // Relations
  players?: Player[];
  // M:N relation structure from Prisma
  tournaments?: { tournament: Tournament; status: string; joinedAt: string }[];
  
  scheduledMatches?: Match[];
  finishedMatches?: Match[];
}

/**
 * Player interface matching backend Prisma Player model
 */
export interface Player {
  id: string;
  name: string;
  position?: string | null;
  shirtNumber?: number | null;
  teamId: string;
  createdAt?: string;
  updatedAt?: string;
  team?: Team;
}

/**
 * Match interface matching backend Prisma Match model
 */
export interface Match {
  id: string;
  date: string;
  status: MatchStatus;
  homeTeamId: string;
  awayTeamId: string;
  tournamentId: string;
  ageCategory: AgeCategory;
  createdAt?: string;
  updatedAt?: string;
  
  homeTeam?: Team;
  awayTeam?: Team;
  tournament?: Tournament;
}

/**
 * TournamentAgeCategory Join Model
 */
export interface TournamentAgeCategory {
  tournamentId: string;
  ageCategory: AgeCategory;
}

/**
 * Tournament interface matching backend Prisma Tournament model
 */
export interface Tournament {
  id: string;
  name: string;
  status: TournamentStatus;
  
  // Relations
  ageCategories?: TournamentAgeCategory[]; // Changed to match Prisma output
  /** @deprecated Backend may still return this for legacy reasons */
  ageCategory?: string | null; 
  teams?: { teamId: string; tournamentId: string; status: string }[]; // Simplified for type
  matches?: Match[];
  admins?: { admin: Admin; role: Role; joinedAt: string }[];
  
  createdAt?: string;
  updatedAt?: string;
}

/**
 * CreatePlayerPayload
 */
export interface CreatePlayerPayload {
  name: string;
  teamId: string;
  position?: string | null;
  shirtNumber?: number | null;
}

/**
 * CreateTeamPayload
 */
export interface CreateTeamPayload {
  name: string;
  tournamentId?: string;
  ageCategory: AgeCategory;
  logo?: string | null;
  coach?: string | null;
  adminEmail?: string;
}

/**
 * CreateMatchPayload
 */
export interface CreateMatchPayload {
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  tournamentId: string;
  status?: MatchStatus;
  ageCategory?: AgeCategory;
}

/**
 * Backend API Response wrapper
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
    details?: unknown;
  };
}

/**
 * Admin interface
 */
export interface Admin {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

/**
 * CreateAdminPayload
 */
export interface CreateAdminPayload {
  email: string;
  password: string;
  role: Role;
}

/**
 * CreateTournamentPayload
 */
export interface CreateTournamentPayload {
  name: string;
  status?: TournamentStatus;
  adminEmail?: string;
  ageCategories: AgeCategory[]; // Must be array now
}
