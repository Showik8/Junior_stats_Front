/**
 * Base URL for backend API.
 * Set NEXT_PUBLIC_API_URL in .env for production/staging.
 * Falls back to localhost:8888 for local development.
 */
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";


/**
 * API paths matching backend routes exactly
 * All paths correspond to routes defined in backend/src/routes/
 */
export const API_PATHS = {
  ADMIN: {
    LOGIN: "/api/admin/login",
    REFRESH: "/api/admin/refresh",
    LOG_OUT: "/api/admin/logout",
    GET_ADMIN: "/api/admin",
    DASHBOARD: "/api/admin/dashboard",
    // Admin CRUD
    LIST: "/api/admin/list",
    CREATE: "/api/admin",
    UPDATE: (id: number) => `/api/admin/${id}`,
    DELETE: (id: number) => `/api/admin/${id}`,
  },

  TOURNAMENT: {
    // GET /api/tournaments - Get tournaments (returns active tournament if no query params)
    GET_TOURNAMENTS: "/api/tournaments",
    GET_MY_MANAGED_TOURNAMENTS: "/api/tournaments/me/managed",
    // POST /api/tournaments - Create tournament
    CREATE_TOURNAMENT: "/api/tournaments",
    // GET /api/tournaments/:id - Get tournament by ID
    GET_TOURNAMENT: (id: string) => `/api/tournaments/${id}`,
    // PUT /api/tournaments/:id - Update tournament
    UPDATE_TOURNAMENT: (id: string) => `/api/tournaments/${id}`,
    // DELETE /api/tournaments/:id - Delete tournament
    DELETE_TOURNAMENT: (id: string) => `/api/tournaments/${id}`,
    // GET /api/tournaments/:id/stats - Get tournament stats
    GET_TOURNAMENT_STATS: (id: string) => `/api/tournaments/${id}/stats`,
    // POST /api/tournaments/:id/finish - Finalize tournament (determine winners)
    FINALIZE_TOURNAMENT: (id: string) => `/api/tournaments/${id}/finish`,
    // GET /api/tournaments/:id/history - Get tournament history (winners)
    GET_HISTORY: (id: string) => `/api/tournaments/${id}/history`,
  },

  TOURNAMENT_STATS: {
    // GET /api/tournaments/:id/statistics/top-scorers
    TOP_SCORERS: (tournamentId: string) =>
      `/api/tournaments/${tournamentId}/statistics/top-scorers`,
    // GET /api/tournaments/:id/statistics/top-assists
    TOP_ASSISTS: (tournamentId: string) =>
      `/api/tournaments/${tournamentId}/statistics/top-assists`,
    // GET /api/tournaments/:id/statistics/most-matches
    MOST_MATCHES: (tournamentId: string) =>
      `/api/tournaments/${tournamentId}/statistics/most-matches`,
    // GET /api/tournaments/:id/statistics/summary
    SUMMARY: (tournamentId: string) =>
      `/api/tournaments/${tournamentId}/statistics/summary`,
  },

  TEAMS: {
    // Base teams path
    BASE: "/api/teams",
    // GET /api/teams - Get teams (with query params: tournamentId, ageCategory, etc.)
    GET_TEAMS: "/api/teams",
    // POST /api/teams - Create team
    ADD_TEAM: "/api/teams",
    // GET /api/teams/me - Get current user's team (requires auth)
    GET_TEAM_INFO: "/api/teams/me",
    // GET /api/teams/:id - Get team by ID
    GET_TEAM: (id: string) => `/api/teams/${id}`,
    // PUT /api/teams/:id - Update team
    UPDATE_TEAM: (id: string) => `/api/teams/${id}`,
    // DELETE /api/teams/:id - Delete team
    REMOVE_TEAM: (id: string) => `/api/teams/${id}`,
    // GET /api/teams/:id/stats - Get team stats
    GET_TEAM_STATS: (id: string) => `/api/teams/${id}/stats`,
  },

  PLAYERS: {
    // GET /api/players - Get players (with query param: teamId)
    GET_PLAYERS: "/api/players",
    // POST /api/players - Create player
    ADD_PLAYER: "/api/players",
    // GET /api/players/:id - Get player by ID
    GET_PLAYER: (id: string) => `/api/players/${id}`,
    // PUT /api/players/:id - Update player
    UPDATE_PLAYER: (id: string) => `/api/players/${id}`,
    // DELETE /api/players/:id - Delete player
    REMOVE_PLAYER: (id: string) => `/api/players/${id}`,
    // GET /api/players/team/:teamId/count - Get player count for team
    GET_PLAYER_COUNT: (teamId: string) => `/api/players/team/${teamId}/count`,
  },

  MATCH: {
    // GET /api/matches - Get matches (with query params: tournamentId, ageCategory, teamId)
    GET_MATCHES: "/api/matches",
    // POST /api/matches - Create match
    CREATE_MATCH: "/api/matches",
    // GET /api/matches/team - Get matches for team (with query param: teamId)
    GET_TEAM_MATCHES: "/api/matches/team",
    // GET /api/matches/:id - Get match by ID
    GET_MATCH: (id: string) => `/api/matches/${id}`,
    // PUT /api/matches/:id - Update match
    UPDATE_MATCH: (id: string) => `/api/matches/${id}`,
    // DELETE /api/matches/:id - Delete match
    DELETE_MATCH: (id: string) => `/api/matches/${id}`,
    // PATCH /api/matches/:id/cancel - Cancel match
    CANCEL_MATCH: (id: string) => `/api/matches/${id}/cancel`,
    // GET /api/matches/tournament/:tournamentId/stats - Get match stats for tournament
    GET_MATCH_STATS: (tournamentId: string) =>
      `/api/matches/tournament/${tournamentId}/stats`,
    // GET /api/matches/tournament/:tournamentId/knockout - Get knockout bracket
    GET_KNOCKOUT_BRACKET: (tournamentId: string) =>
      `/api/matches/tournament/${tournamentId}/knockout`,
  },

  GROUPS: {
    // GET /api/groups - Get groups (?tournamentId=X&ageCategory=Y)
    GET_GROUPS: "/api/groups",
    // POST /api/groups - Create group
    CREATE_GROUP: "/api/groups",
    // GET /api/groups/:id - Get group by ID
    GET_GROUP: (id: string) => `/api/groups/${id}`,
    // PUT /api/groups/:id - Update group
    UPDATE_GROUP: (id: string) => `/api/groups/${id}`,
    // DELETE /api/groups/:id - Delete group
    DELETE_GROUP: (id: string) => `/api/groups/${id}`,
  },

  STANDINGS: {
    // GET /api/standings - Get standings (?tournamentId=X&ageCategory=Y&groupId=Z)
    GET_STANDINGS: "/api/standings",
    // GET /api/standings/:id - Get standing by ID
    GET_STANDING: (id: string) => `/api/standings/${id}`,
    // POST /api/standings/recalculate
    RECALCULATE: "/api/standings/recalculate",
  },

  MATCH_REPORTS: {
    // POST /api/match-reports/:matchId/submit
    SUBMIT: (matchId: string) => `/api/match-reports/${matchId}/submit`,
  },

  TOURNAMENT_ADMINS: {
    // GET /api/tournament-admins - List all assignments
    BASE: "/api/tournament-admins",
    // GET /api/tournament-admins/:id - Get assignment by ID
    GET_BY_ID: (id: number) => `/api/tournament-admins/${id}`,
    // GET /api/tournament-admins/admin/:adminId - Get assignments by admin
    BY_ADMIN: (adminId: number) => `/api/tournament-admins/admin/${adminId}`,
    // GET /api/tournament-admins/tournament/:tournamentId - Get assignments by tournament
    BY_TOURNAMENT: (tournamentId: string) => `/api/tournament-admins/tournament/${tournamentId}`,
  },

  TEAM_ADMINS: {
    // GET /api/team-admins - List all assignments
    BASE: "/api/team-admins",
    // GET /api/team-admins/:id - Get assignment by ID
    GET_BY_ID: (id: number) => `/api/team-admins/${id}`,
    // GET /api/team-admins/admin/:adminId - Get assignments by admin
    BY_ADMIN: (adminId: number) => `/api/team-admins/admin/${adminId}`,
    // GET /api/team-admins/team/:teamId - Get assignments by team
    BY_TEAM: (teamId: string) => `/api/team-admins/team/${teamId}`,
  },

  PUBLIC: {
    TOURNAMENTS: "/api/public/tournaments",
    TOURNAMENT_DETAIL: (id: string) => `/api/public/tournaments/${id}`,
    TEAM_DETAIL: (id: string) => `/api/public/teams/${id}`,
    PLAYER_DETAIL: (id: string) => `/api/public/players/${id}`,
    MATCH_DETAIL: (id: string) => `/api/public/matches/${id}`,
  },

  SPONSORS: {
    BASE: "/api/sponsors",
    GET_BY_ID: (id: string) => `/api/sponsors/${id}`,
    ASSIGN_TOURNAMENT: (id: string) => `/api/sponsors/${id}/tournaments`,
    REMOVE_TOURNAMENT: (id: string, tournamentId: string) =>
      `/api/sponsors/${id}/tournaments/${tournamentId}`,
    ASSIGN_TEAM: (id: string) => `/api/sponsors/${id}/teams`,
    REMOVE_TEAM: (id: string, teamId: string) =>
      `/api/sponsors/${id}/teams/${teamId}`,
  },

  AUDIT_LOGS: {
    // GET /api/audit-logs - Get audit logs with pagination/filtering
    LIST: "/api/audit-logs",
    // GET /api/audit-logs/entity/:entity/:entityId - Get logs for specific entity
    ENTITY: (entity: string, entityId: string) =>
      `/api/audit-logs/entity/${entity}/${entityId}`,
  },

  REFEREES: {
    // GET /api/referees - List all referees
    LIST: "/api/referees",
    // POST /api/referees - Create referee
    CREATE: "/api/referees",
    // GET /api/referees/:id - Get referee by ID
    GET_BY_ID: (id: number) => `/api/referees/${id}`,
    // PUT /api/referees/:id - Update referee
    UPDATE: (id: number) => `/api/referees/${id}`,
    // DELETE /api/referees/:id - Delete referee
    DELETE: (id: number) => `/api/referees/${id}`,
    // POST /api/referees/assign - Assign referee to match
    ASSIGN: "/api/referees/assign",
    // DELETE /api/referees/assign/:matchId/:refereeId - Remove assignment
    REMOVE_ASSIGNMENT: (matchId: string, refereeId: number) =>
      `/api/referees/assign/${matchId}/${refereeId}`,
    // GET /api/referees/match/:matchId - Get referees for a match
    BY_MATCH: (matchId: string) => `/api/referees/match/${matchId}`,
    // GET /api/referees/my-matches - Get matches for logged-in referee
    MY_MATCHES: "/api/referees/my-matches",
  },
};
