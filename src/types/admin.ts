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
 * Tournament format values from backend Prisma schema
 * Default: "LEAGUE"
 */
export type TournamentFormat = "LEAGUE" | "KNOCKOUT" | "GROUP_KNOCKOUT";

export const TOURNAMENT_FORMATS: { value: TournamentFormat; label: string }[] = [
  { value: "LEAGUE", label: "League" },
  { value: "KNOCKOUT", label: "Knockout" },
  { value: "GROUP_KNOCKOUT", label: "Group + Knockout" },
];

/**
 * Sponsor tier values from backend Prisma schema
 */
export type SponsorTier = "MAIN" | "GOLD" | "SILVER" | "BRONZE";

/**
 * Player position values from backend Prisma schema
 */
export type PlayerPosition =
  | "GK" | "CB" | "LB" | "RB" | "LWB" | "RWB"
  | "CDM" | "CM" | "CAM" | "RM" | "LM"
  | "RW" | "LW" | "ST" | "CF";

export const PLAYER_POSITIONS: { value: PlayerPosition; label: string }[] = [
  { value: "GK", label: "Goalkeeper" },
  { value: "CB", label: "Center Back" },
  { value: "LB", label: "Left Back" },
  { value: "RB", label: "Right Back" },
  { value: "LWB", label: "Left Wing Back" },
  { value: "RWB", label: "Right Wing Back" },
  { value: "CDM", label: "Defensive Midfielder" },
  { value: "CM", label: "Central Midfielder" },
  { value: "CAM", label: "Attacking Midfielder" },
  { value: "RM", label: "Right Midfielder" },
  { value: "LM", label: "Left Midfielder" },
  { value: "RW", label: "Right Winger" },
  { value: "LW", label: "Left Winger" },
  { value: "ST", label: "Striker" },
  { value: "CF", label: "Center Forward" },
];

// --- Match Report Types ---

export enum EventType {
  GOAL = "GOAL",
  YELLOW_CARD = "YELLOW_CARD",
  RED_CARD = "RED_CARD",
  SUBSTITUTION = "SUBSTITUTION",
  PENALTY = "PENALTY",
  OWN_GOAL = "OWN_GOAL"
}

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
  standings?: Standing[];
  
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
  photoUrl?: string | null;
  birthDate?: string | null;
  teamId: string;
  createdAt?: string;
  updatedAt?: string;
  team?: Team;
}

/**
 * Group interface matching backend Prisma Group model
 */
export interface Group {
  id: string;
  name: string;
  tournamentId: string;
  ageCategory: AgeCategory;
  
  // Relations
  tournament?: Tournament;
  matches?: Match[];
  standings?: Standing[];
  
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Standing interface matching backend Prisma Standing model
 */
export interface Standing {
  id: string;
  teamId: string;
  tournamentId: string;
  groupId?: string | null;
  ageCategory: AgeCategory;
  
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  
  // Relations
  team?: Team;
  tournament?: Tournament;
  group?: Group;
  
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sponsor interface matching backend Prisma Sponsor model
 */
export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website?: string | null;
  tournaments?: TournamentSponsor[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * TournamentSponsor join interface
 */
export interface TournamentSponsor {
  tournamentId: string;
  sponsorId: string;
  tier: SponsorTier;
  tournament?: Tournament;
  sponsor?: Sponsor;
  assignedAt?: string;
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
  
  // Score
  homeScore?: number | null;
  awayScore?: number | null;
  
  // Match details
  venue?: string | null;
  referee?: string | null;
  notes?: string | null;
  attendees?: number | null;
  weatherNotes?: string | null;
  finishedAt?: string | null;
  
  // Group relation
  groupId?: string | null;
  group?: Group | null;
  
  // Relations
  homeTeam?: Team;
  awayTeam?: Team;
  tournament?: Tournament;
  playerStats?: MatchPlayerStatistic[];
  events?: MatchEvent[];
  
  createdAt?: string;
  updatedAt?: string;
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
  
  // New fields from backend
  format: TournamentFormat;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  rules?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  
  // Relations
  ageCategories?: TournamentAgeCategory[];
  /** @deprecated Backend may still return this for legacy reasons */
  ageCategory?: string | null; 
  teams?: { teamId: string; tournamentId: string; status: string }[];
  matches?: Match[];
  admins?: { admin: Admin; role: Role; joinedAt: string }[];
  groups?: Group[];
  standings?: Standing[];
  sponsors?: TournamentSponsor[];
  
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
  photoUrl?: string | null;
  birthDate?: string | null;
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
  venue?: string;
  groupId?: string;
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
 * UpdateAdminPayload
 */
export interface UpdateAdminPayload {
  email?: string;
  password?: string;
  role?: Role;
}

/**
 * CreateTournamentPayload
 */
export interface CreateTournamentPayload {
  name: string;
  status?: TournamentStatus;
  adminEmail?: string;
  ageCategories: AgeCategory[];
  format?: TournamentFormat;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  rules?: string;
  logoUrl?: string;
  bannerUrl?: string;
  sponsors?: { sponsorId: string; tier?: SponsorTier }[];
}

/**
 * UpdateTournamentPayload
 */
export interface UpdateTournamentPayload {
  name?: string;
  status?: TournamentStatus;
  ageCategories?: AgeCategory[];
  format?: TournamentFormat;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  rules?: string;
  logoUrl?: string;
  bannerUrl?: string;
  adminEmail?: string;
  sponsors?: { sponsorId: string; tier?: SponsorTier }[];
}

/**
 * CreateGroupPayload
 */
export interface CreateGroupPayload {
  name: string;
  tournamentId: string;
  ageCategory: AgeCategory;
}

export interface MatchReportEvent {
  playerId?: string;
  eventType: EventType;
  minute: number;
  teamId: string;
  assistPlayerId?: string;
  description?: string;
}

export interface MatchReportPlayerStat {
  playerId: string;
  played: boolean;
  minutesPlayed?: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  shots?: number;
  shotsOnTarget?: number;
  fouls?: number;
  saves?: number;
}

export interface SubmitMatchReportPayload {
  matchId: string;
  homeScore: number;
  awayScore: number;
  referee?: string;
  venue?: string;
  attendees?: number;
  weatherNotes?: string;
  notes?: string;
  events: MatchReportEvent[];
  playerStats: MatchReportPlayerStat[];
}

/**
 * MatchPlayerStatistic interface
 */
export interface MatchPlayerStatistic {
  id: string;
  matchId: string;
  playerId: string;
  played: boolean;
  minutesPlayed?: number | null;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  shots?: number | null;
  shotsOnTarget?: number | null;
  fouls?: number | null;
  saves?: number | null;
  player?: Player;
}

/**
 * MatchEvent interface
 */
export interface MatchEvent {
  id: string;
  matchId: string;
  playerId?: string | null;
  eventType: EventType;
  minute: number;
  teamId: string;
  description?: string | null;
  assistPlayerId?: string | null;
}

/**
 * Tournament Statistics types (from /statistics/summary endpoint)
 */
export interface PlayerStatEntry {
  rank: number;
  player: Player;
  team: Team;
  statistics: {
    goals: number;
    assists: number;
    matchesPlayed: number;
    minutesPlayed: number;
    yellowCards: number;
    redCards: number;
    goalsPerMatch: number;
    assistsPerMatch: number;
  };
}

export interface TournamentStatsSummary {
  tournamentId: string;
  filters: {
    year?: number;
    ageCategory?: string;
  };
  topScorers: PlayerStatEntry[];
  topAssists: PlayerStatEntry[];
  mostMatchesPlayed: PlayerStatEntry[];
}

/**
 * Update Player payload (for PUT /api/players/:id)
 */
export interface UpdatePlayerPayload {
  name?: string;
  position?: string | null;
  shirtNumber?: number | null;
  photoUrl?: string | null;
  birthDate?: string | null;
  teamId?: string;
}

/**
 * Tournament Admin assignment (for /api/tournament-admins endpoints)
 */
export interface TournamentAdminAssignment {
  id: number;
  adminId: number;
  tournamentId: string;
  role: Role;
  admin?: Admin;
  tournament?: Tournament;
  createdAt?: string;
}

/**
 * Team Admin assignment (for /api/team-admins endpoints)
 */
export interface TeamAdminAssignment {
  id: number;
  adminId: number;
  teamId: string;
  role: Role;
  admin?: Admin;
  team?: Team;
  createdAt?: string;
}

/**
 * Tournament History (winner records)
 */
export interface TournamentHistory {
  id: string;
  tournamentId: string;
  ageCategory: AgeCategory;
  season?: string | null;
  winnerId: string;
  runnerUpId?: string | null;
  totalMatches: number;
  totalGoals: number;
  finishedAt: string;
  tournament?: Tournament;
  winner?: Team;
  runnerUp?: Team | null;
}

/**
 * Audit Log interface matching backend Prisma AuditLog model
 */
export interface AuditLog {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  adminId?: number | null;
  changes?: Record<string, unknown> | null;
  admin?: Admin | null;
  createdAt: string;
}

/**
 * Create Sponsor payload
 */
export interface CreateSponsorPayload {
  name: string;
  logoUrl: string;
  website?: string;
}

/**
 * Update Sponsor payload
 */
export interface UpdateSponsorPayload {
  name?: string;
  logoUrl?: string;
  website?: string;
}

/**
 * Knockout bracket match representation
 */
export interface KnockoutMatch {
  id: string;
  round?: string | null;
  bracket?: string | null;
  homeTeam?: Team;
  awayTeam?: Team;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  date: string;
  nextMatchId?: string | null;
}
