"use client";

import React, { useState, useEffect } from "react";
import { Tournament, Sponsor, SponsorTier, TournamentSponsor } from "@/types/admin";
import { adminService } from "@/services/adminService";

interface TournamentSponsorsModuleProps {
  tournament: Tournament;
  onRefresh?: () => void;
}

export default function TournamentSponsorsModule({ tournament, onRefresh }: TournamentSponsorsModuleProps) {
  const [sponsors, setSponsors] = useState<TournamentSponsor[]>([]);
  const [availableSponsors, setAvailableSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedSponsorId, setSelectedSponsorId] = useState("");
  const [selectedTier, setSelectedTier] = useState<SponsorTier>("BRONZE");
  const [isAssigning, setIsAssigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Update local state if tournament prop changes
    setSponsors(tournament.sponsors || []);
  }, [tournament]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await adminService.getSponsors();
        setAvailableSponsors(data.sponsors);
      } catch (err) {
        console.error("Failed to fetch sponsors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  // Filter available sponsors that are not already assigned to this tournament
  const unassignedSponsors = availableSponsors.filter(
    (sponsor) => !sponsors.some((ts) => ts.sponsorId === sponsor.id)
  );

  const handleAssignSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!selectedSponsorId) return;

    setIsAssigning(true);
    setError(null);

    try {
      await adminService.assignSponsorToTournament(
        selectedSponsorId,
        tournament.id,
        selectedTier
      );
      
      setSuccessMsg("Sponsor assigned successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      
      // Update local state instead of requiring a full refresh
      const assignedSponsor = availableSponsors.find((s) => s.id === selectedSponsorId);
      if (assignedSponsor) {
        setSponsors(prev => [...prev, { sponsorId: selectedSponsorId, tournamentId: tournament.id, tier: selectedTier, sponsor: assignedSponsor }]);
      }
      
      // Reset form
      setSelectedSponsorId("");
      setSelectedTier("BRONZE");
      
      // Trigger optional refresh in parent component
      if (onRefresh) onRefresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || "Failed to assign sponsor");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemove = async (sponsorId: string) => {
    if (!confirm("Are you sure you want to remove this sponsor from the tournament?")) return;

    setLoading(true);
    setError(null);
    
    try {
      await adminService.removeSponsorFromTournament(sponsorId, tournament.id);
      
      setSuccessMsg("Sponsor removed successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
      // Update local state
      setSponsors(prev => prev.filter(ts => ts.sponsorId !== sponsorId));
      
      if (onRefresh) onRefresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || "Failed to remove sponsor");
    } finally {
      setLoading(false);
    }
  };

  const formatTier = (tier: string) => {
    return tier.charAt(0) + tier.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative mb-6">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-emerald-50 to-white flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
             <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             Tournament Sponsors
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage sponsors distinctively linked to <span className="font-semibold text-gray-700">{tournament.name}</span>
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 space-x-1 font-bold px-4 py-1.5 rounded-full shadow-inner text-sm border border-emerald-100">
          <span>{sponsors.length}</span> 
          <span className="font-medium">Sponsor{sponsors.length !== 1 && 's'}</span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm shadow-sm animate-in fade-in">
            <p className="font-semibold flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
               Error
            </p>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg text-sm shadow-sm animate-in fade-in">
            <p className="font-semibold flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               Success
            </p>
            {successMsg}
          </div>
        )}

        {/* Assigned Sponsors List */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Current Sponsors
          </h4>

          {sponsors.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 transition-colors hover:border-emerald-300 hover:bg-gray-50">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                 <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                 </svg>
              </div>
              <p className="text-gray-600 font-medium">No sponsors yet</p>
              <p className="text-gray-400 text-sm mt-1">Assign a sponsor below to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sponsors.map((ts) => (
                <div key={ts.sponsorId} className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center">
                  <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner">
                    {ts.sponsor?.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ts.sponsor.logoUrl} alt={ts.sponsor.name} className="max-h-full max-w-full object-contain drop-shadow-sm" />
                    ) : (
                      <span className="text-gray-400 font-bold text-xl">{ts.sponsor?.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-800 truncate">{ts.sponsor?.name}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border bg-gray-50 text-gray-600 border-gray-200">
                        {formatTier(ts.tier)} Tier
                      </span>
                    </div>
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleRemove(ts.sponsorId)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full bg-white shadow-sm border border-gray-100 transition-all"
                      title="Remove from tournament"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assign New Sponsor Form */}
        <div className="bg-linear-to-b from-emerald-50/50 to-white rounded-xl p-6 border border-emerald-100 shadow-sm">
          <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-600">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            Assign New Sponsor
          </h4>
          
          <div className="flex flex-col md:flex-row gap-5 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Select Sponsor</label>
              <div className="relative">
                 <select
                   className="w-full text-sm rounded-xl border border-gray-300 p-3 text-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-white appearance-none transition-all shadow-xs"
                   value={selectedSponsorId}
                   onChange={(e) => setSelectedSponsorId(e.target.value)}
                 >
                   <option value="" disabled>-- Select a Sponsor --</option>
                   {unassignedSponsors.map((s) => (
                     <option key={s.id} value={s.id}>{s.name}</option>
                   ))}
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </div>
              </div>
            </div>
            
            <div className="w-full md:w-48 shrink-0">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Sponsorship Tier</label>
              <div className="relative">
                 <select
                   className="w-full text-sm rounded-xl border border-gray-300 p-3 text-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-white appearance-none transition-all shadow-xs"
                   value={selectedTier}
                   onChange={(e) => setSelectedTier(e.target.value as SponsorTier)}
                 >
                   <option value="MAIN">Main</option>
                   <option value="GOLD">Gold</option>
                   <option value="SILVER">Silver</option>
                   <option value="BRONZE">Bronze</option>
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleAssignSubmit}
              disabled={isAssigning || unassignedSponsors.length === 0 || !selectedSponsorId}
              className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 focus:ring-4 focus:ring-emerald-200 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isAssigning ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Assigning...
                 </>
              ) : (
                "Assign Sponsor"
              )}
            </button>
          </div>
          
          {unassignedSponsors.length === 0 && availableSponsors.length > 0 && (
            <p className="text-xs text-orange-600 mt-3">All existing sponsors are already assigned to this tournament.</p>
          )}
          {availableSponsors.length === 0 && (
            <p className="text-xs text-gray-500 mt-3">No sponsors exist in the system. Create one from the <a href="/admin/sponsors" className="text-blue-600 underline">Sponsors directory</a> first.</p>
          )}
        </div>
      </div>
    </div>
  );
}
