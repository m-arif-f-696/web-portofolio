import Image from "next/image";
import { env } from "@/lib/env";
import { ContributionGraph } from "./contribution-graph";
import { getGithubStats } from "./github-service";
import { ASSET_PATH, Arrow, SectionTitle } from "./shared";

const NUMBER_FORMAT = new Intl.NumberFormat("en-US");
const LEVELS = [0, 1, 2, 3, 4] as const;

const FALLBACK_BIO =
  "Full-stack developer who loves turning ideas into clean, fast interfaces. Currently exploring React, Next.js, and Laravel.";

function formatNumber(value: number): string {
  return NUMBER_FORMAT.format(value);
}

export async function GithubSection() {
  const stats = await getGithubStats();
  const username = stats?.username ?? env.GITHUB_USERNAME ?? null;
  const profileUrl =
    stats?.profileUrl ?? (username ? `https://github.com/${username}` : null);
  const languageLabels = stats
    ? [
        ...stats.languages.map(
          (language) => `${language.name} ${language.percent}%`,
        ),
        ...(stats.otherLanguagesPercent > 0
          ? [`Others ${stats.otherLanguagesPercent}%`]
          : []),
      ]
    : [];

  return (
    <section className="github-section" id="github">
      <SectionTitle eyebrow="/ GitHub Activity">Where I build</SectionTitle>
      <div className="github-layout">
        <article className="profile-card">
          <div className="identity">
            <div className="avatar">
              {stats?.avatarUrl ? (
                <Image
                  className="avatar-photo"
                  src={stats.avatarUrl}
                  alt=""
                  width={96}
                  height={96}
                />
              ) : (
                <img
                  className="avatar-icon"
                  src={`${ASSET_PATH}/4b771.svg`}
                  alt=""
                />
              )}
            </div>
            <div>
              <h3>{stats?.name ?? "Arif"}</h3>
              <p>
                <img src={`${ASSET_PATH}/df0d2.svg`} alt="" />
                {username ? (
                  profileUrl ? (
                    <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                      @{username}
                    </a>
                  ) : (
                    `@${username}`
                  )
                ) : (
                  "GitHub username — pending"
                )}
              </p>
            </div>
          </div>
          <p>{stats?.bio ?? FALLBACK_BIO}</p>
          <div className="profile-stats">
            <div>
              <b>{stats ? formatNumber(stats.repositories) : "—"}</b>
              <span>Repositories</span>
            </div>
            <div>
              <b>{stats ? formatNumber(stats.followers) : "—"}</b>
              <span>Followers</span>
            </div>
            <div>
              <b>{stats ? formatNumber(stats.following) : "—"}</b>
              <span>Following</span>
            </div>
          </div>
          <div className="languages">
            <strong>TOP LANGUAGES</strong>
            {stats && stats.languages.length > 0 ? (
              <>
                <div className="language-bar" aria-hidden="true">
                  {stats.languages.map((language) => (
                    <i
                      key={language.name}
                      style={{
                        width: `${language.percent}%`,
                        background: language.color,
                      }}
                    />
                  ))}
                  {stats.otherLanguagesPercent > 0 ? (
                    <i
                      className="language-other"
                      style={{ width: `${stats.otherLanguagesPercent}%` }}
                    />
                  ) : null}
                </div>
                <p>{languageLabels.join(" · ")}</p>
              </>
            ) : (
              <p>Language data unavailable</p>
            )}
          </div>
          {profileUrl ? (
            <a
              className="button primary full"
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub Profile <Arrow />
            </a>
          ) : (
            <span className="button primary full">
              View GitHub Profile <Arrow />
            </span>
          )}
        </article>
        <article className="contributions">
          <div className="graph-heading">
            <div>
              <h3>Contribution graph</h3>
              <p>
                {stats
                  ? `${formatNumber(stats.contributions)} contributions in the last year`
                  : "Contribution data unavailable"}
              </p>
            </div>
            <span className="graph-legend">
              Less
              {LEVELS.map((level) => (
                <i className={`level-${level}`} key={level} aria-hidden="true" />
              ))}
              More
            </span>
          </div>
          <ContributionGraph
            weeks={stats?.weeks ?? []}
            total={stats?.contributions ?? 0}
          />
          <div className="streaks">
            <div>
              <b>{stats ? formatNumber(stats.contributions) : "—"}</b>
              <span>Contributions this year</span>
            </div>
            <div>
              <b>{stats ? `${stats.currentStreak} days` : "—"}</b>
              <span>Current streak</span>
            </div>
            <div>
              <b>{stats ? `${stats.longestStreak} days` : "—"}</b>
              <span>Longest streak</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
