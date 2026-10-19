export type MatchStatus = 'finished' | 'scheduled' | 'live' | 'postponed' | string;

export type Team = {
  id: string;
  name: string;
  city: string;
};

export type MatchScore = {
  home: number;
  away: number;
} | null;

export type Match = {
  id: string;
  startsAt: string | null;
  status: MatchStatus;
  minute?: number;
  home: Team;
  away: Team;
  score: MatchScore;
};

export type MatchesApiResponse = {
  round: number;
  matches: Match[];
};

export type MatchFilter = 'all' | 'upcoming' | 'finished';
