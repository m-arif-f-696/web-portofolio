import type { CSSProperties } from "react";
import type { GithubWeek } from "./github-types";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Labels need a few free columns, otherwise "Dec" and "Jan" collide when the
// calendar starts in the last days of a month.
const MIN_LABEL_GAP = 3;
const PLACEHOLDER_WEEKS = 53;

type MonthLabel = {
  weekIndex: number;
  label: string;
};

function getMonthLabels(weeks: GithubWeek[]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let previousMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.days[0];
    if (!firstDay) return;

    const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth();

    if (month !== previousMonth) {
      labels.push({ weekIndex, label: MONTH_LABELS[month] });
      previousMonth = month;
    }
  });

  return labels.filter((label, index) => {
    const next = labels[index + 1];
    return !next || next.weekIndex - label.weekIndex >= MIN_LABEL_GAP;
  });
}

type ContributionGraphProps = {
  weeks: GithubWeek[];
  total: number;
};

export function ContributionGraph({ weeks, total }: ContributionGraphProps) {
  if (weeks.length === 0) {
    return (
      <div className="contribution-scroll">
        <div className="contribution-grid" aria-hidden="true">
          {Array.from({ length: PLACEHOLDER_WEEKS * 7 }, (_, index) => (
            <i className="level-0" key={index} />
          ))}
        </div>
      </div>
    );
  }

  const columns = { "--weeks": weeks.length } as CSSProperties;

  return (
    <div className="contribution-scroll">
      <div className="months" style={columns} aria-hidden="true">
        {getMonthLabels(weeks).map(({ weekIndex, label }) => (
          <span key={`${label}-${weekIndex}`} style={{ gridColumn: weekIndex + 1 }}>
            {label}
          </span>
        ))}
      </div>
      <div
        className="contribution-grid"
        role="img"
        aria-label={`${total} contributions in the last year`}
      >
        {weeks.flatMap((week) =>
          week.days.map((day) => (
            <i
              className={`level-${day.level}`}
              key={day.date}
              title={`${day.count} contributions on ${day.date}`}
            />
          )),
        )}
      </div>
    </div>
  );
}
