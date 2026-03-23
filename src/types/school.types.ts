import type { AgeCategory } from './admin';

export interface FootballSchool {
  id: string;
  name: string;
  city?: string | null;
  logoUrl?: string | null;
  founded?: number | null;
  address?: string | null;
  website?: string | null;
  description?: string | null;
  teams?: SchoolTeam[];
  admins?: SchoolAdminEntry[];
  _count?: {
    teams: number;
    admins: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SchoolTeam {
  id: string;
  name: string;
  logo?: string | null;
  coach?: string | null;
  ageCategory: AgeCategory;
  _count?: {
    players: number;
  };
}

export interface SchoolAdminEntry {
  id: number;
  adminId: number;
  schoolId: string;
  role: string;
  admin: {
    id: number;
    email: string;
    role: string;
  };
  createdAt: string;
}

export interface PlayerTransfer {
  id: string;
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  schoolId: string;
  reason?: string | null;
  transferredAt: string;
  player: {
    id: string;
    name: string;
    position?: string | null;
  };
  fromTeam: {
    id: string;
    name: string;
    ageCategory: AgeCategory;
  };
  toTeam: {
    id: string;
    name: string;
    ageCategory: AgeCategory;
  };
}

export interface SchoolStats {
  schoolId: string;
  schoolName: string;
  totalTeams: number;
  totalPlayers: number;
  totalMatches: number;
  totalGoals: number;
  totalTransfers: number;
  teamBreakdown: {
    teamId: string;
    teamName: string;
    ageCategory: AgeCategory;
    playerCount: number;
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
  }[];
  topScorers: {
    playerId: string;
    playerName: string;
    teamName: string;
    ageCategory: AgeCategory;
    goals: number;
  }[];
}

export interface CreateSchoolPayload {
  name: string;
  city?: string;
  logoUrl?: string;
  founded?: number;
  address?: string;
  website?: string;
  description?: string;
  adminEmail?: string;
}

export interface UpdateSchoolPayload {
  name?: string;
  city?: string;
  logoUrl?: string;
  founded?: number;
  address?: string;
  website?: string;
  description?: string;
}

export interface TransferPlayerPayload {
  playerId: string;
  fromTeamId: string;
  toTeamId: string;
  reason?: string;
}

export interface SchoolListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
