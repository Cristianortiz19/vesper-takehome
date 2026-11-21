// The blocks of the Today screen. Each one maps to a Figma component
// (Header, Hero card, Week strip, Milestone card, Today card, Community card,
// Plus card, Navigation bar).

"use client";

import { useState, type CSSProperties } from "react";
import { useAnimatedNumber } from "@/lib/motion";
import type { CommunityPost, Mood } from "@/lib/data";
import {
  arcLabel,
  dayLetter,
  dayName,
  dayOfMonth,
  formatAverage,
  plural,
  type DayState,
  type Entry,
  type Stats,
} from "@/lib/vesper";
import { Icon, type IconName } from "./icons";
import { Landscape, LogoMark, MoodFace, Trophy } from "./illustrations";
import { Button, Card, Chip, TextLink } from "./ui";

// ---------------------------------------------------------------- Header
export function Header({ initial, onSupport }: { initial: string; onSupport: () => void }) {
  return (
    <header className="flex items-center justify-between px-5 pt-5 md:px-0 lg:hidden">
      <div className="flex items-center gap-2">
        <LogoMark />
        <span className="type-title-s">vesper</span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onSupport} className="type-label inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-4">
          <Icon name="heart" size={18} />
          Support
        </button>
        <span className="type-body-strong grid size-11 place-items-center rounded-full bg-avatar" aria-label="Your profile">
          {initial}
        </span>
      </div>
    </header>
  );
}

export function Greeting({ line, name, date }: { line: string; name: string; date: string }) {
  return (
    <div className="flex items-end justify-between px-5 pt-6 md:px-0 lg:pt-0">
      <div>
        <p className="type-body-l text-fg-muted">{line}</p>
        <h1 className="type-title-l">{name}!</h1>
      </div>
      <p className="type-overline hidden pb-2 text-fg-muted lg:block">{date}</p>
    </div>
  );
}

// ---------------------------------------------------------------- Hero
export type Celebration = { kind: "within" | "above" | "milestone"; id: number } | null;

export function HeroCard({
  stats,
  baseline,
  celebrate,
  onCheckIn,
}: {
  stats: Stats;
  baseline: number;
  celebrate: Celebration;
  onCheckIn: () => void;
}) {
  const logged = !!stats.todayEntry;
  // The count rolls up and the arc grows when a day is added.
  const count = Math.round(useAnimatedNumber(stats.daysLogged, 650));
  const shown = useAnimatedNumber(stats.progress, 900);
  const sunClass = !celebrate ? "" : celebrate.kind === "above" ? "animate-sun-nod" : "animate-sun-bounce";
  // Same curve as the Figma hero. The progress part is the exact sub-curve up to
  // `t` (de Casteljau), so it stays correct when the card stretches on desktop.
  const arc = "M24 118 Q175 78 326 118";
  const t = shown;
  const q1x = 24 + (175 - 24) * t, q1y = 118 + (78 - 118) * t;
  const p2x = 175 + (326 - 175) * t, p2y = 78 + (118 - 78) * t;
  const bx = q1x + (p2x - q1x) * t, by = q1y + (p2y - q1y) * t;
  const progressArc = `M24 118 Q${q1x.toFixed(1)} ${q1y.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  return (
    <section aria-label="Your progress" className="relative h-[300px] overflow-hidden rounded-card bg-hero md:h-[340px] lg:h-[400px]">
      <Landscape key={celebrate?.id ?? 0} className="absolute inset-0 size-full" sunClass={sunClass} />

      <svg viewBox="0 0 350 300" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <path d={arc} fill="none" stroke="var(--color-green-300)" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={progressArc} fill="none" stroke="var(--color-ink-900)" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="absolute inset-x-0 top-[18px] text-center md:top-6">
        <p className="type-stat-l">
          <span key={celebrate?.id ?? 0} className={`inline-block tabular-nums ${celebrate ? "animate-pop" : ""}`}>
            {count}
          </span>{" "}
          days
        </p>
        <p className="type-caption">logged · never resets</p>
        <p className="type-caption mt-0.5">{arcLabel(stats)}</p>
      </div>

      <dl className="absolute right-4 top-[134px] w-[150px] space-y-2 md:top-[150px] lg:right-7 lg:top-[176px]">
        <div>
          <dt className="type-body-s">Within your limit</dt>
          <dd className="type-stat-m tabular-nums">
            {stats.withinLimit} of {stats.daysLogged}
          </dd>
        </div>
        <div>
          <dt className="type-body-s">This week</dt>
          <dd className="type-stat-m tabular-nums">
            {formatAverage(stats.weekAverage)} <span className="type-caption font-bold">a day ↓ from {baseline}</span>
          </dd>
        </div>
      </dl>

      <div className={`absolute inset-x-0 bottom-5 justify-center md:bottom-6 ${logged ? "flex" : "flex md:hidden"}`}>
        {logged ? (
          <Button kind="soft" size="m" icon="check" onClick={onCheckIn}>
            Logged · Edit
          </Button>
        ) : (
          <Button kind="dark" size="m" icon="plus" onClick={onCheckIn}>
            Check in
          </Button>
        )}
      </div>
      {celebrate && celebrate.kind !== "above" && <Burst key={celebrate.id} big={celebrate.kind === "milestone"} />}
    </section>
  );
}

// Confetti-lite: a few brand-colored pieces from the count. Only for days within
// the limit and milestones; a day above the limit gets a calm nod from the sun.
const BURST_COLORS = ["bg-orange-500", "bg-cobalt-500", "bg-iris-500", "bg-yellow-500", "bg-ink-900"];
function Burst({ big }: { big: boolean }) {
  const n = big ? 22 : 14;
  return (
    <div className="pointer-events-none absolute left-1/2 top-[44px] md:top-[52px]" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2 + (i % 2) * 0.35;
        const dist = (big ? 110 : 80) + (i % 3) * 22;
        const style = {
          "--dx": `${Math.cos(angle) * dist}px`,
          "--dy": `${Math.sin(angle) * dist * 0.8}px`,
          "--rot": `${(i % 2 ? 1 : -1) * (90 + i * 20)}deg`,
          animationDelay: `${(i % 4) * 25}ms`,
        } as CSSProperties;
        const shape = i % 3 === 0 ? "h-2 w-3.5 rounded-sm" : "size-2.5 rounded-full";
        return <span key={i} className={`burst-particle absolute ${shape} ${BURST_COLORS[i % BURST_COLORS.length]}`} style={style} />;
      })}
    </div>
  );
}

// ---------------------------------------------------------------- Week strip
const PILL: Record<DayState, string> = {
  logged: "bg-logged text-fg",
  above: "bg-logged text-fg",
  today: "bg-inverse text-action",
  "today-logged": "bg-logged text-fg border-2 border-line-strong",
  "today-above": "bg-logged text-fg border-2 border-line-strong",
  missed: "border-2 border-dashed border-line-muted text-fg-muted",
  future: "border border-line text-fg-muted",
};
const MARKER: Record<DayState, string> = {
  logged: "size-2 rounded-full bg-fg",
  "today-logged": "size-2 rounded-full bg-fg",
  above: "size-2 rounded-full border-2 border-line-strong",
  "today-above": "size-2 rounded-full border-2 border-line-strong",
  today: "size-2 rounded-full border-2 border-action",
  missed: "h-[2.5px] w-2.5 rounded-full bg-fg-muted",
  future: "size-2",
};
const STATE_LABEL: Record<DayState, string> = {
  logged: "within your limit",
  above: "above your limit",
  today: "today, not logged yet",
  "today-logged": "today, within your limit",
  "today-above": "today, above your limit",
  missed: "not logged, tap to add",
  future: "upcoming",
};

export type WeekDay = { date: string; state: DayState; entry: Entry | null };

export function WeekStrip({ days, unit, onPick }: { days: WeekDay[]; unit: string; onPick: (date: string) => void }) {
  return (
    <section aria-labelledby="week-title" className="pt-2 md:rounded-card md:bg-surface md:p-6">
      <div className="flex items-baseline justify-between">
        <h2 id="week-title" className="type-section">This week</h2>
        <p className="type-caption text-fg-muted">Tap a day to add or edit</p>
      </div>
      <ol className="mt-4 flex justify-between">
        {days.map(({ date, state, entry }) => {
          const label = `${dayName(date)} ${dayOfMonth(date)}${entry ? `, ${entry.count} ${unit}` : ""}, ${STATE_LABEL[state]}`;
          const pill = (
            <>
              <span className="type-overline tracking-[0.08em]">{dayLetter(date)}</span>
              <span className="type-stat-m">{dayOfMonth(date)}</span>
              <span className={MARKER[state]} />
            </>
          );
          return (
            <li key={date} className="flex w-11 flex-col items-center gap-1.5">
              {state === "future" ? (
                <span aria-label={label} className={`flex h-[60px] w-11 flex-col items-center justify-center gap-0.5 rounded-full ${PILL[state]}`}>
                  {pill}
                </span>
              ) : (
                <button
                  type="button"
                  aria-label={label}
                  onClick={() => onPick(date)}
                  className={`flex h-[60px] w-11 flex-col items-center justify-center gap-0.5 rounded-full transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 active:scale-95 ${state.startsWith("today-") ? "animate-pop" : ""} ${PILL[state]}`}
                >
                  {pill}
                </button>
              )}
              {state === "today" ? (
                <span className="type-caption">Today</span>
              ) : entry?.mood ? (
                <span key={`${date}-${entry.mood}`} className="animate-pop">
                  <MoodFace mood={entry.mood} size="dot" />
                </span>
              ) : (
                <span className="size-[26px]" />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------- Milestones
export function NextMilestone({ stats }: { stats: Stats }) {
  if (!stats.next) return null;
  const pct = Math.round(stats.progress * 100);
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="grid size-16 shrink-0 place-items-center rounded-tile bg-milestone">
        <Trophy />
      </span>
      <div className="min-w-0 flex-1">
        <p className="type-overline text-fg-muted">Next milestone</p>
        <p className="type-body-strong mt-1">{stats.next.label}</p>
        <p className="type-body-s text-fg-muted">
          Day {stats.next.days} · {stats.toNext} {plural(stats.toNext, "check-in")} to go
        </p>
        <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next milestone">
          <div className="h-full origin-left animate-grow rounded-full bg-logged transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Card>
  );
}

export function MilestoneReached({ stats, hardDay }: { stats: Stats; hardDay: boolean }) {
  if (!stats.reachedToday) return null;
  const detail = hardDay
    ? "You got here by logging honestly, today included."
    : stats.next
      ? `Next: ${stats.next.label.replace(/ of showing up$/, "").toLowerCase()} · ${stats.toNext} to go`
      : "Every milestone reached.";
  return (
    <section className="animate-fade-in rounded-card bg-milestone p-6 text-fg">
      <div className="flex items-center justify-between">
        <p className="type-overline">Milestone reached · Day {stats.reachedToday.days}</p>
        <span className="animate-wiggle [animation-delay:400ms] [animation-iteration-count:2]">
          <Trophy size={36} />
        </span>
      </div>
      <h2 className="type-title-s mt-2">{stats.reachedToday.label}.</h2>
      <p className="type-body mt-2">{detail}</p>
    </section>
  );
}

// ---------------------------------------------------------------- Today card
export function TodayCard({
  entry,
  limit,
  unit,
  unitSingular,
  onCoach,
}: {
  entry: Entry;
  limit: number;
  unit: string;
  unitSingular: string;
  onCoach: () => void;
}) {
  const above = entry.count > limit;
  const [planOpen, setPlanOpen] = useState(false);
  const [tomorrow, setTomorrow] = useState<number | null>(null);
  const mood: Mood = entry.mood ?? (above ? "tense" : "calm");
  const feel = entry.mood ? `Felt ${entry.mood}` : "No mood logged";
  const vsLimit = above
    ? `${entry.count - limit} above your limit of ${limit}`
    : `within your limit of ${limit}`;

  return (
    <Card className="animate-fade-in">
      <h2 className="type-section">Today</h2>
      <div className="mt-4 flex items-center gap-3.5">
        {entry.mood ? <MoodFace mood={mood} size="badge" /> : <span className="grid size-[60px] place-items-center rounded-[22px] bg-surface-muted type-title-s">–</span>}
        <div>
          <p>
            <span className="type-title-l tabular-nums">{entry.count}</span>{" "}
            <span className="type-body-s text-fg-muted">{entry.count === 1 ? unitSingular : unit}</span>
          </p>
          <p className="type-body-s text-fg-muted">
            {feel} · {vsLimit}
          </p>
        </div>
      </div>

      {above && (
        <div className="mt-5 border-t border-track pt-5">
          <p className="type-title-s">Logging a hard day still counts.</p>
          <p className="type-body mt-2 text-fg-muted">Your total went up anyway. Nothing was reset, and tomorrow starts from here.</p>

          {!planOpen ? (
            <div className="mt-4 flex flex-col items-start gap-1">
              <Button kind="outline" size="m" onClick={() => setPlanOpen(true)}>
                Make tomorrow easier
              </Button>
              <TextLink onClick={onCoach}>
                <span className="inline-flex items-center gap-2">
                  Talk to a coach <Chip tone="avatar">Plus</Chip>
                </span>
              </TextLink>
            </div>
          ) : (
            <div className="mt-4 animate-fade-in rounded-[22px] bg-surface-muted p-4" role="group" aria-label="Tomorrow’s limit">
              <p className="type-body-strong">Tomorrow’s limit</p>
              <div className="mt-3 flex gap-2">
                {[limit, limit - 1].filter((n) => n >= 0).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={tomorrow === n}
                    onClick={() => setTomorrow(n)}
                    className={`type-label h-11 rounded-full px-4 ${tomorrow === n ? "bg-inverse text-fg-inverse" : "border border-line bg-surface"}`}
                  >
                    {n === limit ? `Keep ${n}` : `Try ${n}`}
                  </button>
                ))}
              </div>
              <p className="type-caption mt-3 text-fg-muted" role="status">
                {tomorrow === null ? "Small steps work better than big promises." : `Saved. Tomorrow’s limit is ${tomorrow}. You can change it in Plan.`}
              </p>
            </div>
          )}
          <p className="type-caption mt-3 text-fg-muted">Optional. You can also just close the app.</p>
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------- Community
export function CommunityCard({ post, onOpen }: { post: CommunityPost; onOpen: () => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="type-overline inline-flex items-center gap-2 text-fg-muted">
          <Icon name="community" size={20} className="text-fg" />
          From the community
        </p>
        <Chip tone="neutral">{post.topic}</Chip>
      </div>
      <blockquote className="type-body-strong mt-3">“{post.quote}”</blockquote>
      <p className="type-caption mt-1 text-fg-muted">{post.meta}</p>
      <div className="mt-3 flex items-center justify-between border-t border-track pt-3">
        <p className="type-caption inline-flex items-center gap-1.5 text-fg-muted">
          <Icon name="shield" size={16} className="text-fg" /> Moderated by coaches
        </p>
        <button type="button" onClick={onOpen} className="group type-label inline-flex items-center gap-0.5">
          Open Community <Icon name="chevron-right" size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- Thought (external API)
export function ThoughtCard({ thought }: { thought: { text: string; source: string } | null }) {
  return (
    <section className="rounded-card bg-surface-sunken p-5" aria-busy={!thought}>
      <p className="type-overline text-fg-muted">A line for tomorrow</p>
      {thought ? (
        <div className="animate-fade-in">
          <p className="type-body-strong mt-2">“{thought.text}”</p>
          <p className="type-caption mt-1 text-fg-muted">{thought.source}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2" aria-label="Loading">
          <div className="h-3 w-11/12 animate-pulse rounded-full bg-surface" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-surface" />
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- Plus (paid)
export function PlusCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group flex w-full items-center justify-between gap-3 rounded-card bg-avatar px-6 py-5 text-left transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99]">
      <span>
        <span className="type-overline block">Vesper Plus</span>
        <span className="type-body-strong mt-1 block">A coach for the hard days.</span>
        <span className="type-caption mt-0.5 block">Free for 7 days</span>
      </span>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-inverse text-avatar transition-transform duration-200 group-hover:translate-x-1">
        <Icon name="chevron-right" size={20} />
      </span>
    </button>
  );
}

// ---------------------------------------------------------------- Navigation
const TABS: { name: string; icon: IconName }[] = [
  { name: "Today", icon: "home" },
  { name: "Progress", icon: "progress" },
  { name: "Community", icon: "community" },
  { name: "Plan", icon: "plan" },
];
export function NavBar({ onTab }: { onTab: (name: string) => void }) {
  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center pb-[max(20px,env(safe-area-inset-bottom))] lg:hidden">
      <div className="pointer-events-auto flex h-16 items-center gap-1 rounded-full bg-inverse px-2">
        {TABS.map((t, i) =>
          i === 0 ? (
            <a key={t.name} href="#top" aria-current="page" className="type-label inline-flex h-12 items-center gap-2 rounded-full bg-action px-[18px] text-fg">
              <Icon name={t.icon} /> {t.name}
            </a>
          ) : (
            <button key={t.name} type="button" aria-label={t.name} onClick={() => onTab(t.name)} className="grid size-12 place-items-center rounded-full text-fg-inverse-muted">
              <Icon name={t.icon} size={22} />
            </button>
          ),
        )}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------- Sidebar (≥ 1024 px)
export function Sidebar({
  name,
  initial,
  subtitle,
  onTab,
  onPlus,
  onSupport,
}: {
  name: string;
  initial: string;
  subtitle: string;
  onTab: (name: string) => void;
  onPlus: () => void;
  onSupport: () => void;
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col gap-8 border-r border-line bg-surface px-5 py-7 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <LogoMark />
        <span className="type-title-s">vesper</span>
      </div>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {TABS.map((t, i) =>
          i === 0 ? (
            <a key={t.name} href="#top" aria-current="page" className="type-body-strong flex h-12 items-center gap-3 rounded-full bg-action px-4 text-fg">
              <Icon name={t.icon} /> {t.name}
            </a>
          ) : (
            <button key={t.name} type="button" onClick={() => onTab(t.name)} className="type-label flex h-12 items-center gap-3 rounded-full px-4 text-fg-muted transition-colors hover:bg-page">
              <Icon name={t.icon} className="text-fg" /> {t.name}
            </button>
          ),
        )}
      </nav>
      <div className="flex-1" />
      <button type="button" onClick={onPlus} className="rounded-[24px] bg-avatar p-5 text-left">
        <span className="type-overline block">Vesper Plus</span>
        <span className="type-body-strong mt-1 block">A coach for the hard days.</span>
        <span className="type-caption mt-1 block">Free for 7 days</span>
      </button>
      <button type="button" onClick={onSupport} className="type-label -mt-4 flex h-11 items-center gap-2 rounded-full border border-line px-4">
        <Icon name="heart" size={18} /> Support
      </button>
      <div className="-mt-2 flex items-center gap-3 px-2">
        <span className="type-body-strong grid size-10 place-items-center rounded-full bg-avatar">{initial}</span>
        <span>
          <span className="type-body-strong block">{name}</span>
          <span className="type-caption block text-fg-muted">{subtitle}</span>
        </span>
      </div>
    </aside>
  );
}
