export type LineupStatus = 'PENDING' | 'SUBMITTED' | 'LOCKED';
export type LineupRole = 'STARTING' | 'SUBSTITUTE' | 'RESERVE';

export interface MatchLineupPlayer {
  id: string;
  playerId: string;
  role: LineupRole;
  startingOrder?: number;
  subOrder?: number;
  positionOverride?: string;
  shirtNumberOverride?: number;
  isCaptain: boolean;
  player: {
    id: string;
    name: string;
    position?: string;
    shirtNumber?: number;
    photoUrl?: string;
    teamId?: string;
  };
}

export interface MatchLineup {
  id: string;
  matchId: string;
  teamId: string;
  status: LineupStatus;
  submittedAt?: string;
  players: MatchLineupPlayer[];
  team: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface SubmitLineupDto {
  players: {
    playerId: string;
    role: LineupRole;
    startingOrder?: number;
    subOrder?: number;
    positionOverride?: string;
    shirtNumberOverride?: number;
    isCaptain?: boolean;
  }[];
}
