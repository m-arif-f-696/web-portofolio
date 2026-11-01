import { cacheLife } from "next/cache";
import { env } from "@/lib/env";
import type {
  ContributionLevel,
  GithubDay,
  GithubLanguage,
  GithubStats,
  GithubWeek,
} from "./github-types";

const GITHUB_API = "https://api.github.com";
const FALLBACK_LANGUAGE_COLOR = "#8b8b8b";

const STATS_QUERY = `
  query PortfolioStats($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      repositories(
        first: 100
        ownerAffiliations: [OWNER]
        privacy: PUBLIC
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

type RestUserResponse = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

type GraphqlDay = {
  date: string;
  contributionCount: number;
};

type GraphqlWeek = {
  contributionDays: GraphqlDay[];
};

type GraphqlLanguageEdge = {
  size: number;
  node: {
    name: string;
    color: string | null;
  };
};

type GraphqlRepository = {
  languages: {
    edges: GraphqlLanguageEdge[];
  };
};

type GraphqlResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: GraphqlWeek[];
        };
      };
      repositories: {
        nodes: GraphqlRepository[];
      };
    } | null;
  };
  errors?: { message: string }[];
};

function requestHeaders(token: string, contentType?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

async function githubRequest<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

// GitHub colours the calendar by quartiles of the active days, so a single
// unusually busy day does not flatten the whole year into one shade.
function buildLevelScale(counts: number[]): (count: number) => ContributionLevel {
  const active = counts.filter((count) => count > 0).sort((a, b) => a - b);

  if (active.length === 0) {
    return () => 0;
  }

  const quantile = (ratio: number) =>
    active[Math.min(active.length - 1, Math.floor(active.length * ratio))];

  const [low, middle, high] = [quantile(0.25), quantile(0.5), quantile(0.75)];

  return (count) => {
    if (count <= 0) return 0;
    if (count <= low) return 1;
    if (count <= middle) return 2;
    if (count <= high) return 3;
    return 4;
  };
}

export function mapWeeks(rawWeeks: GraphqlWeek[]): GithubWeek[] {
  const levelFor = buildLevelScale(
    rawWeeks.flatMap((week) =>
      week.contributionDays.map((day) => day.contributionCount),
    ),
  );

  return rawWeeks.map((week) => ({
    days: week.contributionDays.map(
      (day): GithubDay => ({
        date: day.date,
        count: day.contributionCount,
        level: levelFor(day.contributionCount),
      }),
    ),
  }));
}

export function computeStreaks(weeks: GithubWeek[]): {
  current: number;
  longest: number;
} {
  const days = weeks.flatMap((week) => week.days);

  let longest = 0;
  let run = 0;

  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  // Today may simply not be over yet, so an empty last day does not break
  // the streak that ended yesterday.
  let index = days.length - 1;
  if (index >= 0 && days[index].count === 0) index -= 1;

  let current = 0;
  while (index >= 0 && days[index].count > 0) {
    current += 1;
    index -= 1;
  }

  return { current, longest };
}

// The card only has room for a few labels, so everything after the top three
// is folded into one "Others" share instead of being dropped.
export const TOP_LANGUAGES = 3;

export type LanguageBreakdown = {
  languages: GithubLanguage[];
  otherPercent: number;
};

export function aggregateLanguages(
  repositories: GraphqlRepository[],
): LanguageBreakdown {
  const totals = new Map<string, { size: number; color: string }>();

  for (const repository of repositories) {
    for (const edge of repository.languages.edges) {
      const existing = totals.get(edge.node.name);

      totals.set(edge.node.name, {
        size: (existing?.size ?? 0) + edge.size,
        color: existing?.color ?? edge.node.color ?? FALLBACK_LANGUAGE_COLOR,
      });
    }
  }

  const totalSize = [...totals.values()].reduce(
    (sum, language) => sum + language.size,
    0,
  );

  if (totalSize === 0) {
    return { languages: [], otherPercent: 0 };
  }

  const ranked = [...totals.entries()].sort((a, b) => b[1].size - a[1].size);

  const languages = ranked
    .slice(0, TOP_LANGUAGES)
    .map(([name, language]) => ({
      name,
      percent: Math.round((language.size / totalSize) * 100),
      color: language.color,
    }));

  const otherPercent =
    ranked.length > TOP_LANGUAGES
      ? Math.max(
          0,
          100 - languages.reduce((sum, language) => sum + language.percent, 0),
        )
      : 0;

  return { languages, otherPercent };
}

export async function getGithubStats(): Promise<GithubStats | null> {
  "use cache";
  cacheLife("hours");

  const { GITHUB_USERNAME: username, GITHUB_TOKEN: token } = env;

  if (!username || !token) {
    return null;
  }

  try {
    const [user, graph] = await Promise.all([
      githubRequest<RestUserResponse>(
        `${GITHUB_API}/users/${encodeURIComponent(username)}`,
        { headers: requestHeaders(token) },
      ),
      githubRequest<GraphqlResponse>(`${GITHUB_API}/graphql`, {
        method: "POST",
        headers: requestHeaders(token, "application/json"),
        body: JSON.stringify({
          query: STATS_QUERY,
          variables: { login: username },
        }),
      }),
    ]);

    if (graph.errors?.length) {
      throw new Error("GitHub GraphQL returned errors");
    }

    const data = graph.data?.user;

    if (!data) {
      return null;
    }

    const calendar = data.contributionsCollection.contributionCalendar;
    const weeks = mapWeeks(calendar.weeks);
    const streaks = computeStreaks(weeks);
    const languages = aggregateLanguages(data.repositories.nodes);

    return {
      username: user.login,
      name: user.name ?? user.login,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      repositories: user.public_repos,
      followers: user.followers,
      following: user.following,
      contributions: calendar.totalContributions,
      weeks,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      languages: languages.languages,
      otherLanguagesPercent: languages.otherPercent,
    };
  } catch {
    // The section still renders a neutral fallback when GitHub is unreachable.
    return null;
  }
}
