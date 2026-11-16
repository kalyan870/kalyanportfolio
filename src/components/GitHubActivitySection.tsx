import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Flame, RefreshCw } from "lucide-react";
import { PROFILE } from "../data/kalyanData";

interface ContributionDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
}

interface ContributionResponse {
  username: string;
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: { date: string; count: number } | null;
  days: ContributionDay[];
  fetchedAt: string;
  error?: string;
}

type RangeFilter = "year" | "6m" | "90d";

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "#ece7eb",
  1: "#d4ceff",
  2: "#9084ff",
  3: "#de4ba4",
  4: "#000000",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatHumanDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GitHubActivitySection() {
  const [data, setData] = useState<ContributionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [range, setRange] = useState<RangeFilter>("year");
  const [inspectedDay, setInspectedDay] = useState<ContributionDay | null>(null);

  const loadContributions = async (forceRefresh = false) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const url = forceRefresh
        ? "/api/github-contributions?refresh=1"
        : "/api/github-contributions";
      const response = await fetch(url);
      const payload = (await response.json()) as ContributionResponse;

      if (!response.ok || !Array.isArray(payload.days) || payload.days.length === 0) {
        setErrorMsg(payload.error || "Unable to fetch live GitHub contributions right now.");
      } else {
        setData(payload);
        // Default inspector to most recent active day or last day
        const latestActive =
          [...payload.days].reverse().find((d) => d.count > 0) ??
          payload.days[payload.days.length - 1];
        setInspectedDay(latestActive ?? null);
      }
    } catch {
      setErrorMsg("Unable to fetch live GitHub contributions right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions(false);
  }, []);

  const visibleDays = useMemo(() => {
    if (!data?.days?.length) return [];
    if (range === "90d") return data.days.slice(-91);
    if (range === "6m") return data.days.slice(-182);
    return data.days;
  }, [data, range]);

  const { weeks, monthLabels } = useMemo(() => {
    if (visibleDays.length === 0) return { weeks: [], monthLabels: [] as string[] };

    const firstDate = new Date(`${visibleDays[0].date}T00:00:00`);
    const leadingEmpty = Number.isNaN(firstDate.getTime()) ? 0 : firstDate.getDay();

    const padded: Array<ContributionDay | null> = [
      ...Array.from({ length: leadingEmpty }, () => null),
      ...visibleDays,
    ];

    const weekCols: Array<Array<ContributionDay | null>> = [];
    for (let i = 0; i < padded.length; i += 7) {
      const col = padded.slice(i, i + 7);
      while (col.length < 7) col.push(null);
      weekCols.push(col);
    }

    const labels: string[] = [];
    let lastMonth = "";
    for (const col of weekCols) {
      const firstReal = col.find((c): c is ContributionDay => c !== null);
      if (!firstReal) {
        labels.push("");
        continue;
      }
      const d = new Date(`${firstReal.date}T00:00:00`);
      const mLabel = Number.isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString("en-US", { month: "short" });
      if (mLabel && mLabel !== lastMonth) {
        labels.push(mLabel);
        lastMonth = mLabel;
      } else {
        labels.push("");
      }
    }

    return { weeks: weekCols, monthLabels: labels };
  }, [visibleDays]);

  const rangeContributionSum = useMemo(
    () => visibleDays.reduce((acc, day) => acc + day.count, 0),
    [visibleDays]
  );

  return (
    <section
      id="coding-activity"
      aria-labelledby="coding-activity-heading"
      className="bg-[#f4eff2] border-b border-black/15 py-20 md:py-24"
    >
      <div className="editorial-wrap">
        {/* Heading Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-mono-code text-[11px] tracking-[0.08em] text-black/75 mb-3">
              GITHUB CONTRIBUTION HEATMAP · @KALYAN870
            </p>
            <h2
              id="coding-activity-heading"
              className="text-[clamp(2.1rem,4.3vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-black"
              style={{ textWrap: "balance" }}
            >
              Consistent daily <span className="bg-[#dff247] px-2 inline-block">commits.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => loadContributions(true)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 font-mono-code text-xs font-semibold text-black border border-black/30 bg-white px-3.5 py-2 hover:border-black transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span>{loading ? "Loading..." : "Refresh Heatmap"}</span>
            </button>

            <a
              href={PROFILE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-black border-b border-black pb-0.5 hover:text-[#4d3fab] hover:border-[#4d3fab] whitespace-nowrap"
            >
              <span>Inspect on GitHub</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-black p-5 shadow-[4px_4px_0_#000]">
            <span className="block font-mono-code text-[10px] tracking-[0.08em] text-black/65 mb-2">
              LAST 12 MONTHS
            </span>
            <strong className="block font-mono-code text-3xl md:text-4xl font-bold tabular-nums text-black leading-none">
              {loading && !data ? "—" : (data?.totalContributions ?? 0).toLocaleString()}
            </strong>
            <span className="text-xs text-black/70 mt-1.5 block">Total contributions</span>
          </div>

          <div className="bg-white border border-black p-5 shadow-[4px_4px_0_#000]">
            <span className="block font-mono-code text-[10px] tracking-[0.08em] text-black/65 mb-2">
              CONSISTENCY
            </span>
            <strong className="block font-mono-code text-3xl md:text-4xl font-bold tabular-nums text-black leading-none">
              {loading && !data ? "—" : data?.activeDays ?? 0}
            </strong>
            <span className="text-xs text-black/70 mt-1.5 block">Active coding days</span>
          </div>

          <div className="bg-white border border-black p-5 shadow-[4px_4px_0_#000]">
            <span className="block font-mono-code text-[10px] tracking-[0.08em] text-black/65 mb-2">
              LONGEST STREAK
            </span>
            <strong className="block font-mono-code text-3xl md:text-4xl font-bold tabular-nums text-black leading-none">
              {loading && !data ? "—" : `${data?.longestStreak ?? 0}d`}
            </strong>
            <span className="text-xs text-black/70 mt-1.5 block">Consecutive active days</span>
          </div>

          <div className="bg-white border border-black p-5 shadow-[4px_4px_0_#000]">
            <span className="block font-mono-code text-[10px] tracking-[0.08em] text-black/65 mb-2">
              PEAK DAY
            </span>
            <strong className="block font-mono-code text-3xl md:text-4xl font-bold tabular-nums text-[#de4ba4] leading-none">
              {loading && !data ? "—" : data?.bestDay?.count ?? 0}
            </strong>
            <span className="text-xs text-black/70 mt-1.5 block">
              {data?.bestDay ? formatHumanDate(data.bestDay.date) : "Highest single-day output"}
            </span>
          </div>
        </div>

        {/* Interactive Heatmap Card */}
        <div className="bg-white border border-black p-5 md:p-8 shadow-[6px_6px_0_#000]">
          {/* Controls & Live Day Readout */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/15 pb-4 mb-6">
            <div
              role="tablist"
              aria-label="Contribution heatmap timeframe"
              className="flex flex-wrap items-center gap-2"
            >
              {(
                [
                  { id: "year", label: "Full Year" },
                  { id: "6m", label: "Last 6 Months" },
                  { id: "90d", label: "Last 90 Days" },
                ] as const
              ).map((tab) => {
                const active = range === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setRange(tab.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-black text-[#f4eff2] border-black"
                        : "bg-[#f4eff2] text-black border-black/25 hover:border-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="font-mono-code text-xs text-black/80 flex items-center gap-2 tabular-nums">
              <Flame className="w-4 h-4 text-[#de4ba4] shrink-0" aria-hidden="true" />
              {inspectedDay ? (
                <span>
                  <strong>{inspectedDay.count}</strong>{" "}
                  {inspectedDay.count === 1 ? "contribution" : "contributions"} on{" "}
                  {formatHumanDate(inspectedDay.date)}
                </span>
              ) : (
                <span>{rangeContributionSum} contributions in selected range</span>
              )}
            </div>
          </div>

          {/* Heatmap Grid or Loading / Error State */}
          {loading && !data ? (
            <div className="py-12 text-center font-mono-code text-xs text-black/65">
              Fetching live GitHub contribution calendar for @kalyan870...
            </div>
          ) : errorMsg && weeks.length === 0 ? (
            <div className="py-10 text-center border border-black/15 bg-[#f4eff2] p-6">
              <p className="text-sm font-semibold text-black mb-2">{errorMsg}</p>
              <a
                href={PROFILE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4d3fab] underline underline-offset-4"
              >
                <span>Open @kalyan870 on GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-full">
                {/* Month Labels Row */}
                <div className="flex items-center gap-[4px] pl-9 mb-2 font-mono-code text-[10px] text-black/60">
                  {weeks.map((_, colIndex) => (
                    <div key={colIndex} className="w-[13px] shrink-0 overflow-visible whitespace-nowrap">
                      {monthLabels[colIndex] || ""}
                    </div>
                  ))}
                </div>

                {/* Weekday Rows + Grid Columns */}
                <div className="flex items-start gap-2">
                  {/* Weekday Labels */}
                  <div className="grid grid-rows-7 gap-[4px] font-mono-code text-[10px] text-black/55 w-7 shrink-0 pt-[1px]">
                    {DAY_LABELS.map((label, idx) => (
                      <span key={label} className="h-[13px] leading-[13px]">
                        {idx % 2 === 1 ? label : ""}
                      </span>
                    ))}
                  </div>

                  {/* 53-Week Grid */}
                  <div
                    role="grid"
                    aria-label="GitHub daily contributions heatmap"
                    className="flex gap-[4px]"
                  >
                    {weeks.map((week, wIdx) => (
                      <div key={wIdx} className="grid grid-rows-7 gap-[4px]">
                        {week.map((day, dIdx) => {
                          if (!day) {
                            return <span key={`empty-${wIdx}-${dIdx}`} className="w-[13px] h-[13px]" />;
                          }
                          const isSelected = inspectedDay?.date === day.date;
                          return (
                            <button
                              key={day.date}
                              type="button"
                              onMouseEnter={() => setInspectedDay(day)}
                              onFocus={() => setInspectedDay(day)}
                              onClick={() => setInspectedDay(day)}
                              aria-label={`${day.count} contributions on ${formatHumanDate(day.date)}`}
                              title={`${day.count} contributions on ${formatHumanDate(day.date)}`}
                              style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                              className={`w-[13px] h-[13px] border transition-transform duration-100 ${
                                isSelected
                                  ? "border-black scale-125 ring-2 ring-[#dff247]"
                                  : "border-black/15 hover:border-black"
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legend & Footer Info */}
          <div className="mt-5 pt-4 border-t border-black/15 flex flex-wrap items-center justify-between gap-4 font-mono-code text-[11px] text-black/65">
            <span className="tabular-nums">
              {rangeContributionSum.toLocaleString()} contributions shown ·{" "}
              {visibleDays.length} days
            </span>

            <div className="flex items-center gap-1.5">
              <span>Less</span>
              {([0, 1, 2, 3, 4] as const).map((lvl) => (
                <span
                  key={lvl}
                  aria-hidden="true"
                  style={{ backgroundColor: LEVEL_COLORS[lvl] }}
                  className="inline-block w-[13px] h-[13px] border border-black/20"
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
