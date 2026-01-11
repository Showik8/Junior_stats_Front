/**
 * Base URL for backend API
 * Matches backend server configuration (default port 8888)
 */
export const BASE_URL = "http://localhost:8888";

/**
 * API paths matching backend routes exactly
 * All paths correspond to routes defined in backend/src/routes/
 */
export const API_PATHS = {
  ADMIN: {
    LOGIN: "/api/admin/login",
    LOG_OUT: "/api/admin/logout",
    GET_ADMIN: "/api/admin",
    DASHBOARD: "/api/admin/dashboard",
  },

  TOURNAMENT: {
    // GET /api/tournaments - Get tournaments (returns active tournament if no query params)
    GET_TOURNAMENTS: "/api/tournaments",
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
  },
  
  TEAMS: {
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
    GET_MATCH_STATS: (tournamentId: string) => `/api/matches/tournament/${tournamentId}/stats`,
  },
};
