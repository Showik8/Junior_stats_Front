export const MOCK_TOURNAMENTS = [
  {
    id: "t1",
    name: "Golden Cup 2024",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/1603/1603885.png",
    status: "ACTIVE",
    format: "LEAGUE",
    location: "Tbilisi, Georgia",
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-05-30T00:00:00Z",
    ageCategories: ["U-12", "U-14"],
    description: "The premier youth soccer tournament in Georgia, featuring the best academies.",
    sponsors: [
      { id: "s1", name: "Nike", website: "https://nike.com", logoUrl: "https://cdn-icons-png.flaticon.com/512/732/732229.png", tier: "MAIN" },
      { id: "s2", name: "Coca-Cola", website: "https://coca-cola.com", logoUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830303.png", tier: "GOLD" }
    ],
    teamCount: 8,
    matchCount: 24,
  },
  {
    id: "t2",
    name: "Summer Blast",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830234.png",
    status: "FINISHED",
    format: "KNOCKOUT",
    location: "Batumi, Georgia",
    startDate: "2023-06-15T00:00:00Z",
    endDate: "2023-06-20T00:00:00Z",
    ageCategories: ["U-10"],
    description: "A fun summer tournament by the sea for the youngest talents.",
    sponsors: [],
    teamCount: 16,
    matchCount: 15,
  }
];

export const MOCK_TEAMS = [
  {
    id: "tm1",
    name: "Dinamo Academy",
    logo: "https://cdn-icons-png.flaticon.com/512/824/824700.png",
    ageCategory: "U-12",
    coach: "Giorgi Kinkladze",
    stats: {
      winRate: 75,
      totalPlayers: 18,
      wins: 6,
      draws: 1,
      losses: 1,
      goalsFor: 24,
      goalsAgainst: 8,
      goalDifference: 16,
      points: 19
    }
  },
  {
    id: "tm2",
    name: "Saburtalo Youth",
    logo: "https://cdn-icons-png.flaticon.com/512/3336/3336125.png",
    ageCategory: "U-12",
    coach: "Levan Kobiashvili",
    stats: {
      winRate: 60,
      totalPlayers: 20,
      wins: 4,
      draws: 2,
      losses: 2,
      goalsFor: 15,
      goalsAgainst: 10,
      goalDifference: 5,
      points: 14
    }
  },
  {
    id: "tm3",
    name: "Locomotive Kids",
    logo: "https://cdn-icons-png.flaticon.com/512/1818/1818456.png",
    ageCategory: "U-12",
    coach: "David Siradze",
    stats: {
      winRate: 40,
      totalPlayers: 16,
      wins: 3,
      draws: 1,
      losses: 4,
      goalsFor: 10,
      goalsAgainst: 14,
      goalDifference: -4,
      points: 10
    }
  },
  {
    id: "tm4",
    name: "Gagra Juniors",
    logo: "https://cdn-icons-png.flaticon.com/512/1165/1165241.png",
    ageCategory: "U-12",
    coach: "Zaza Janashia",
    stats: {
      winRate: 20,
      totalPlayers: 15,
      wins: 1,
      draws: 0,
      losses: 7,
      goalsFor: 5,
      goalsAgainst: 22,
      goalDifference: -17,
      points: 3
    }
  }
];

export const MOCK_PLAYERS = [
  {
    id: "p1",
    name: "Luka Parkadze",
    teamId: "tm1",
    teamName: "Dinamo Academy", // In real DB this would be relational
    photoUrl: "/images/adamadam.png",
    position: "Forward",
    shirtNumber: 10,
    age: 12,
    height: 152,
    weight: 45,
    preferredFoot: "Right",
    nationality: "Georgian",
    bio: "Talented young striker with an eye for goal. Joined the academy in 2022.",
    stats: {
      matches: 8,
      minutes: 540,
      goals: 12,
      assists: 5,
      yellowCards: 0,
      redCards: 0,
      mom: 3 // Man of the Match awards
    },
    attributes: {
      pace: 85,
      shooting: 88,
      passing: 75,
      dribbling: 90,
      defense: 30,
      physical: 60
    }
  },
  {
    id: "p2",
    name: "Saba Khvadagiani",
    teamId: "tm1",
    teamName: "Dinamo Academy",
    photoUrl: "/images/mamardashvil.png",
    position: "Midfielder",
    shirtNumber: 8,
    age: 12,
    stats: { matches: 8, goals: 3, assists: 8 }
  },
  {
    id: "p3",
    name: "Giorgi Mamardashvili",
    teamId: "tm2",
    teamName: "Saburtalo Youth",
    photoUrl: "/images/mamardashvil.png",
    position: "Goalkeeper",
    shirtNumber: 1,
    age: 12,
    stats: { matches: 8, goals: 0, assists: 1, cleanSheets: 3 }
  },
   {
    id: "p4",
    name: "Khvicha Kvaratskhelia",
    teamId: "tm1",
    teamName: "Dinamo Academy",
    photoUrl: "/images/mamardashvil.png",
    position: "Winger",
    shirtNumber: 77,
    age: 12,
    stats: { matches: 8, goals: 5, assists: 7 }
  },
  {
    id: "p5",
    name: "Nika Gelashvili",
    teamId: "tm1",
    teamName: "Dinamo Academy",
    position: "Defender",
    shirtNumber: 4,
    age: 12,
    stats: { matches: 7, goals: 0, assists: 2 }
  },
  {
    id: "p6",
    name: "Davit Tskhadadze",
    teamId: "tm2",
    teamName: "Saburtalo Youth",
    position: "Defender",
    shirtNumber: 5,
    age: 11,
    stats: { matches: 8, goals: 1, assists: 0 }
  },
  {
    id: "p7",
    name: "Tornike Kipiani",
    teamId: "tm2",
    teamName: "Saburtalo Youth",
    position: "Forward",
    shirtNumber: 9,
    age: 12,
    stats: { matches: 8, goals: 6, assists: 3 }
  },
  {
    id: "p8",
    name: "Levan Mchedlishvili",
    teamId: "tm2",
    teamName: "Saburtalo Youth",
    position: "Midfielder",
    shirtNumber: 6,
    age: 11,
    stats: { matches: 7, goals: 2, assists: 4 }
  },
  {
    id: "p9",
    name: "Giga Arveladze",
    teamId: "tm3",
    teamName: "Rustavi FC Youth",
    position: "Forward",
    shirtNumber: 11,
    age: 10,
    stats: { matches: 8, goals: 4, assists: 2 }
  },
  {
    id: "p10",
    name: "Beka Chanturia",
    teamId: "tm3",
    teamName: "Rustavi FC Youth",
    position: "Goalkeeper",
    shirtNumber: 1,
    age: 10,
    stats: { matches: 8, goals: 0, assists: 0, cleanSheets: 1 }
  },
  {
    id: "p11",
    name: "Zurab Lomidze",
    teamId: "tm3",
    teamName: "Rustavi FC Youth",
    position: "Midfielder",
    shirtNumber: 7,
    age: 10,
    stats: { matches: 6, goals: 1, assists: 3 }
  },
  {
    id: "p12",
    name: "Irakli Janashia",
    teamId: "tm4",
    teamName: "Gagra Juniors",
    position: "Forward",
    shirtNumber: 9,
    age: 12,
    stats: { matches: 8, goals: 3, assists: 1 }
  },
  {
    id: "p13",
    name: "Gio Abashidze",
    teamId: "tm4",
    teamName: "Gagra Juniors",
    position: "Defender",
    shirtNumber: 3,
    age: 11,
    stats: { matches: 8, goals: 0, assists: 1 }
  },
  {
    id: "p14",
    name: "Mate Gogiashvili",
    teamId: "tm4",
    teamName: "Gagra Juniors",
    position: "Midfielder",
    shirtNumber: 8,
    age: 12,
    stats: { matches: 7, goals: 2, assists: 2 }
  },
  // ── More players for full squads ──
  {
    id: "p15",
    name: "Giorgi Beridze",
    teamId: "tm1",
    teamName: "Dinamo Academy",
    position: "Goalkeeper",
    shirtNumber: 1,
    age: 12,
    stats: { matches: 8, goals: 0, assists: 0, cleanSheets: 4 }
  },
  {
    id: "p16",
    name: "Dato Kakabadze",
    teamId: "tm1",
    teamName: "Dinamo Academy",
    position: "Defender",
    shirtNumber: 3,
    age: 12,
    stats: { matches: 8, goals: 1, assists: 0 }
  },
  {
    id: "p17",
    name: "Lasha Dvali",
    teamId: "tm1",
    teamName: "Dinamo Academy",
    position: "Defender",
    shirtNumber: 5,
    age: 11,
    stats: { matches: 7, goals: 0, assists: 1 }
  },
  {
    id: "p18",
    name: "Sandro Lobjanidze",
    teamId: "tm2",
    teamName: "Saburtalo Youth",
    position: "Defender",
    shirtNumber: 3,
    age: 12,
    stats: { matches: 8, goals: 0, assists: 2 }
  },
  {
    id: "p19",
    name: "Nika Kapanadze",
    teamId: "tm2",
    teamName: "Saburtalo Youth",
    position: "Midfielder",
    shirtNumber: 10,
    age: 12,
    stats: { matches: 8, goals: 3, assists: 5 }
  },
  {
    id: "p20",
    name: "Giorgi Tsiklauri",
    teamId: "tm2",
    teamName: "Saburtalo Youth",
    position: "Defender",
    shirtNumber: 4,
    age: 11,
    stats: { matches: 7, goals: 0, assists: 0 }
  },
  {
    id: "p21",
    name: "Luka Tabatadze",
    teamId: "tm3",
    teamName: "Rustavi FC Youth",
    position: "Defender",
    shirtNumber: 3,
    age: 10,
    stats: { matches: 8, goals: 0, assists: 1 }
  },
  {
    id: "p22",
    name: "Nika Jikia",
    teamId: "tm3",
    teamName: "Rustavi FC Youth",
    position: "Defender",
    shirtNumber: 4,
    age: 10,
    stats: { matches: 7, goals: 0, assists: 0 }
  },
  {
    id: "p23",
    name: "Saba Gvelesiani",
    teamId: "tm3",
    teamName: "Rustavi FC Youth",
    position: "Forward",
    shirtNumber: 9,
    age: 10,
    stats: { matches: 6, goals: 3, assists: 1 }
  },
  {
    id: "p24",
    name: "Tornike Khutsishvili",
    teamId: "tm4",
    teamName: "Gagra Juniors",
    position: "Goalkeeper",
    shirtNumber: 1,
    age: 12,
    stats: { matches: 8, goals: 0, assists: 0, cleanSheets: 1 }
  },
  {
    id: "p25",
    name: "Davit Chkheidze",
    teamId: "tm4",
    teamName: "Gagra Juniors",
    position: "Defender",
    shirtNumber: 4,
    age: 11,
    stats: { matches: 8, goals: 0, assists: 0 }
  },
  {
    id: "p26",
    name: "Levan Samkharadze",
    teamId: "tm4",
    teamName: "Gagra Juniors",
    position: "Midfielder",
    shirtNumber: 6,
    age: 12,
    stats: { matches: 7, goals: 1, assists: 3 }
  },
  {
    id: "p27",
    name: "Gio Tvalchrelidze",
    teamId: "tm4",
    teamName: "Gagra Juniors",
    position: "Forward",
    shirtNumber: 11,
    age: 11,
    stats: { matches: 6, goals: 2, assists: 0 }
  }
];

// Helper to generate schedule/results
const generateMatches = (tournamentId: string) => {
  return [
    {
      id: "m1",
      date: "2024-03-01T10:00:00Z",
      status: "FINISHED",
      tournament: { id: tournamentId, name: "Golden Cup 2024" },
      homeTeam: MOCK_TEAMS[0],
      awayTeam: MOCK_TEAMS[1],
      homeScore: 3,
      awayScore: 1,
    },
    {
      id: "m2",
      date: "2024-03-01T12:00:00Z",
      status: "FINISHED",
      tournament: { id: tournamentId, name: "Golden Cup 2024" },
      homeTeam: MOCK_TEAMS[2],
      awayTeam: MOCK_TEAMS[3],
      homeScore: 2,
      awayScore: 0,
    },
    {
      id: "m3",
      date: "2024-03-08T10:00:00Z",
      status: "SCHEDULED",
      tournament: { id: tournamentId, name: "Golden Cup 2024" },
      homeTeam: MOCK_TEAMS[0],
      awayTeam: MOCK_TEAMS[2],
      homeScore: null,
      awayScore: null,
    },
     {
      id: "m4",
      date: "2024-03-08T12:00:00Z",
      status: "SCHEDULED",
      tournament: { id: tournamentId, name: "Golden Cup 2024" },
      homeTeam: MOCK_TEAMS[1],
      awayTeam: MOCK_TEAMS[3],
      homeScore: null,
      awayScore: null,
    },
     {
      id: "m5",
      date: "2024-02-15T15:30:00Z", // Past match for team history
      status: "FINISHED",
      tournament: { id: "t_prev", name: "Winter League" },
      homeTeam: MOCK_TEAMS[3], // Gagra
      awayTeam: MOCK_TEAMS[0], // Dinamo
      homeScore: 0,
      awayScore: 5,
    }
  ];
};

export const MOCK_MATCHES = generateMatches("t1");

// Link players to teams
export const getTeamPlayers = (teamId: string) => MOCK_PLAYERS.filter(p => p.teamId === teamId);

// Get specific team with enriched data
export const getMockTeamDetail = (id: string) => {
  const team = MOCK_TEAMS.find(t => t.id === id);
  if (!team) return null;
  
  const teamMatches = MOCK_MATCHES.filter(m => m.homeTeam.id === id || m.awayTeam.id === id);
  const finished = teamMatches.filter(m => m.status === 'FINISHED').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const scheduled = teamMatches.filter(m => m.status !== 'FINISHED').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    ...team,
    players: getTeamPlayers(id),
    finishedMatches: finished,
    scheduledMatches: scheduled,
  };
};

export const getMockTournamentDetail = (id: string) => {
  const tournament = MOCK_TOURNAMENTS.find(t => t.id === id);
  if (!tournament) return null;

  // Generate standings dynamically for the mock
  const standings = MOCK_TEAMS.map((team, idx) => ({
    id: `st_${team.id}`,
    team: team,
    played: 8,
    wins: team.stats.wins,
    draws: team.stats.draws,
    losses: team.stats.losses,
    goalsFor: team.stats.goalsFor,
    goalsAgainst: team.stats.goalsAgainst,
    points: team.stats.points,
    rank: idx + 1
  })).sort((a, b) => b.points - a.points);

  const topScorers = MOCK_PLAYERS
    .filter(p => p.stats?.goals)
    .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
    .slice(0, 5)
    .map((p, idx) => ({
      rank: idx + 1,
      player: p,
      team: { name: p.teamName },
      goals: p.stats?.goals
    }));

  return {
    ...tournament,
    standings,
    finishedMatches: MOCK_MATCHES.filter(m => m.tournament.id === id && m.status === 'FINISHED'),
    scheduledMatches: MOCK_MATCHES.filter(m => m.tournament.id === id && m.status !== 'FINISHED'),
    teams: MOCK_TEAMS,
    topScorers
  };
};

export const getMockMatchDetail = (id: string) => {
  const match = MOCK_MATCHES.find(m => m.id === id);
  if (!match) return null;

  const homePlayers = getTeamPlayers(match.homeTeam.id);
  const awayPlayers = getTeamPlayers(match.awayTeam.id);

  // Build lineups from team players
  const homeLineup = homePlayers.map(p => ({
    id: p.id,
    playerId: p.id,
    playerName: p.name,
    name: p.name,
    shirtNumber: p.shirtNumber,
    position: p.position,
    photoUrl: (p as any).photoUrl,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCard: false,
  }));

  const awayLineup = awayPlayers.map(p => ({
    id: p.id,
    playerId: p.id,
    playerName: p.name,
    name: p.name,
    shirtNumber: p.shirtNumber,
    position: p.position,
    photoUrl: (p as any).photoUrl,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCard: false,
  }));

  // Generate mock events for finished matches
  const events: any[] = [];
  if (match.status === 'FINISHED' && match.homeScore !== null) {
    // Home goals
    for (let i = 0; i < (match.homeScore || 0); i++) {
      const scorer = homePlayers[i % homePlayers.length];
      events.push({
        type: 'GOAL',
        minute: 10 + i * 20 + Math.floor(Math.random() * 15),
        team: match.homeTeam,
        player: { id: scorer.id, name: scorer.name },
      });
      // Mark the goal in lineup
      const lineupPlayer = homeLineup.find(p => p.id === scorer.id);
      if (lineupPlayer) lineupPlayer.goals++;
    }
    // Away goals
    for (let i = 0; i < (match.awayScore || 0); i++) {
      const scorer = awayPlayers[i % awayPlayers.length];
      events.push({
        type: 'GOAL',
        minute: 15 + i * 25 + Math.floor(Math.random() * 10),
        team: match.awayTeam,
        player: { id: scorer.id, name: scorer.name },
      });
      const lineupPlayer = awayLineup.find(p => p.id === scorer.id);
      if (lineupPlayer) lineupPlayer.goals++;
    }
    // Add a yellow card
    if (homePlayers.length > 2) {
      events.push({
        type: 'YELLOW_CARD',
        minute: 35 + Math.floor(Math.random() * 20),
        team: match.homeTeam,
        player: { id: homePlayers[2].id, name: homePlayers[2].name },
      });
      const lp = homeLineup.find(p => p.id === homePlayers[2].id);
      if (lp) lp.yellowCards++;
    }
  }

  return {
    ...match,
    homeLineup,
    awayLineup,
    events: events.sort((a, b) => a.minute - b.minute),
  };
};
