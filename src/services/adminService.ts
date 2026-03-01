/**
 * Admin Service - Re-export hub for backwards compatibility
 *
 * All domain-specific logic has been split into separate service files.
 * This file re-exports everything so existing `import { adminService } from "@/services/adminService"`
 * imports continue to work without changes.
 *
 * For new code, prefer importing directly:
 *   import { tournamentService } from "@/services/tournament.service"
 *   import { teamService } from "@/services/team.service"
 *   etc.
 */

import { tournamentService } from "./tournament.service";
import { teamService } from "./team.service";
import { playerService } from "./player.service";
import { matchService } from "./match.service";
import { adminCrudService } from "./admin.service";
import { groupService } from "./group.service";
import { standingService } from "./standing.service";
import { statsService } from "./stats.service";
import { sponsorService } from "./sponsor.service";
import { auditService } from "./audit.service";

// Re-export individual services for direct imports
export { tournamentService } from "./tournament.service";
export { teamService } from "./team.service";
export { playerService } from "./player.service";
export { matchService } from "./match.service";
export { adminCrudService } from "./admin.service";
export { groupService } from "./group.service";
export { standingService } from "./standing.service";
export { statsService } from "./stats.service";
export { tournamentAdminService } from "./tournamentAdmin.service";
export { teamAdminService } from "./teamAdmin.service";
export { sponsorService } from "./sponsor.service";
export { auditService } from "./audit.service";

/**
 * Unified adminService object — backwards compatible
 * Maps all methods from individual services to the original flat API
 */
export const adminService = {
  // Tournament
  getTournamentInfo: tournamentService.getTournamentInfo,
  getMyManagedTournaments: tournamentService.getMyManagedTournaments,
  getAllTournaments: tournamentService.getAllTournaments,
  createTournament: tournamentService.createTournament,
  updateTournament: tournamentService.updateTournament,
  deleteTournament: tournamentService.deleteTournament,
  finalizeTournament: tournamentService.finalizeTournament,
  getTournamentHistory: tournamentService.getTournamentHistory,

  // Teams
  searchTeams: teamService.searchTeams,
  getTeams: teamService.getTeams,
  getAllClubs: teamService.getAllClubs,
  addTeam: teamService.addTeam,
  updateTeam: teamService.updateTeam,
  assignTeamToTournament: teamService.assignTeamToTournament,
  removeTeam: teamService.removeTeam,
  removeTeamFromTournament: teamService.removeTeamFromTournament,
  getMyTeamInfo: teamService.getMyTeamInfo,
  getTeamStats: teamService.getTeamStats,

  // Players
  getTeamPlayers: playerService.getTeamPlayers,
  getPlayer: playerService.getPlayer,
  addPlayer: playerService.addPlayer,
  updatePlayer: playerService.updatePlayer,
  removePlayer: playerService.removePlayer,
  getPlayerCount: playerService.getPlayerCount,

  // Matches
  getMatches: matchService.getMatches,
  getMatch: matchService.getMatch,
  createMatch: matchService.createMatch,
  cancelMatch: matchService.cancelMatch,
  getTeamMatches: matchService.getTeamMatches,
  updateMatch: matchService.updateMatch,
  deleteMatch: matchService.deleteMatch,
  submitMatchReport: matchService.submitMatchReport,
  getMatchStats: matchService.getMatchStats,
  getKnockoutBracket: matchService.getKnockoutBracket,

  // Admins
  getAdmins: adminCrudService.getAdmins,
  createAdmin: adminCrudService.createAdmin,
  updateAdmin: adminCrudService.updateAdmin,
  deleteAdmin: adminCrudService.deleteAdmin,
  logoutAdmin: adminCrudService.logoutAdmin,

  // Groups
  getGroups: groupService.getGroups,
  createGroup: groupService.createGroup,
  updateGroup: groupService.updateGroup,
  deleteGroup: groupService.deleteGroup,

  // Standings
  getStandings: standingService.getStandings,
  recalculateStandings: standingService.recalculateStandings,

  // Tournament Statistics
  getTournamentStatsSummary: statsService.getTournamentStatsSummary,
  getTopScorers: statsService.getTopScorers,
  getTopAssists: statsService.getTopAssists,
  getMostMatchesPlayed: statsService.getMostMatchesPlayed,

  // Sponsors
  getSponsors: sponsorService.getAll,
  getSponsor: sponsorService.getById,
  createSponsor: sponsorService.create,
  updateSponsor: sponsorService.update,
  deleteSponsor: sponsorService.delete,
  assignSponsorToTournament: sponsorService.assignToTournament,
  removeSponsorFromTournament: sponsorService.removeFromTournament,
  assignSponsorToTeam: sponsorService.assignToTeam,
  removeSponsorFromTeam: sponsorService.removeFromTeam,

  // Audit Logs
  getAuditLogs: auditService.getAuditLogs,
  getEntityAuditLogs: auditService.getEntityAuditLogs,
};
