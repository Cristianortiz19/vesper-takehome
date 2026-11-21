// Pure helpers: dates, derived stats and milestones. No React here, so the
// rules of the product (what counts, what never resets) are easy to read and test.

import type { DayLog, Milestone, Mood, VesperData } from "@/lib/data";

export type Entry = { count: number; mood: Mood | null };
export type Overrides = Record<string, Entry>;

// ---- dates (UTC math on YYYY-MM-DD strings, so time zones never shift a day)
const toUTC = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
const toISO = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const DAY = 86_400_000;

export const addDays = (iso: string, n: number) => toISO(toUTC(iso) + n * DAY);
export const weekday = (iso: string) => new Date(toUTC(iso)).getUTCDay(); // 0 = Sun

const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const dayName = (iso: string) => WEEKDAY_LONG[weekday(iso)];
export const dayLetter = (iso: string) => WEEKDAY_SHORT[weekday(iso)];
export const dayOfMonth = (iso: string) => Number(iso.slice(8, 10));
export const longDate = (iso: string) =>
  `${dayName(iso)} · ${MONTHS[Number(iso.slice(5, 7)) - 1]} ${dayOfMonth(iso)}`;

/** Monday → Sunday of the week that contains `iso`. */
export function weekOf(iso: string): string[] {
  const offset = (weekday(iso) + 6) % 7; // days since Monday
  const monday = addDays(iso, -offset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

// ---- logs
export function mergeLogs(history: DayLog[], overrides: Overrides): Map<string, Entry> {
  const map = new Map<string, Entry>();
  for (const h of history) map.set(h.date, { count: h.count, mood: h.mood });
  for (const [date, e] of Object.entries(overrides)) map.set(date, e);
  return map;
}

export type DayState = "logged" | "above" | "today" | "today-logged" | "today-above" | "missed" | "future";

export function dayState(iso: string, today: string, logs: Map<string, Entry>, limit: number): DayState {
  const e = logs.get(iso);
  if (iso === today) return !e ? "today" : e.count > limit ? "today-above" : "today-logged";
  if (iso > today) return "future";
  if (!e) return "missed";
  return e.count > limit ? "above" : "logged";
}

export type Stats = {
  daysLogged: number; // the number that never resets
  withinLimit: number;
  weekAverage: number | null;
  todayEntry: Entry | null;
  next: Milestone | null;
  reachedToday: Milestone | null;
  toNext: number;
  progress: number; // 0..1 toward the next milestone, for the hero arc
};

export function computeStats(data: VesperData, logs: Map<string, Entry>): Stats {
  const { today, goal, milestones } = data;
  const entries = [...logs.entries()].filter(([d]) => d <= today);
  const daysLogged = entries.length;
  const withinLimit = entries.filter(([, e]) => e.count <= goal.dailyLimit).length;

  const thisWeek = weekOf(today).filter((d) => d <= today && logs.has(d));
  const weekAverage = thisWeek.length
    ? thisWeek.reduce((sum, d) => sum + (logs.get(d)?.count ?? 0), 0) / thisWeek.length
    : null;

  const todayEntry = logs.get(today) ?? null;
  const reachedToday = todayEntry ? milestones.find((m) => m.days === daysLogged) ?? null : null;
  const next = milestones.find((m) => m.days > daysLogged) ?? null;
  const toNext = next ? next.days - daysLogged : 0;
  const progress = next ? Math.min(1, daysLogged / next.days) : 1;

  return { daysLogged, withinLimit, weekAverage, todayEntry, next, reachedToday, toNext, progress };
}

export const formatAverage = (n: number | null) => (n === null ? "–" : n.toFixed(1));

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const plural = (n: number, one: string, many = `${one}s`) => (n === 1 ? one : many);

/** "1 day to two weeks", "7 days to three weeks" */
export function arcLabel(stats: Stats): string {
  if (!stats.next) return "Every milestone reached";
  const target = stats.next.label.replace(/ of showing up$/, "").toLowerCase();
  return `${stats.toNext} ${plural(stats.toNext, "day")} to ${target}`;
}

export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);
