export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type GithubDay = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type GithubWeek = {
  days: GithubDay[];
};

export type GithubLanguage = {
  name: string;
  percent: number;
  color: string;
};

export type GithubStats = {
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  profileUrl: string;
  repositories: number;
  followers: number;
  following: number;
  contributions: number;
  weeks: GithubWeek[];
  currentStreak: number;
  longestStreak: number;
  languages: GithubLanguage[];
  otherLanguagesPercent: number;
};
