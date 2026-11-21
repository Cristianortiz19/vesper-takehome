"use client";

// The daily moment. Everything the person does here is one of three things:
// check in today, fix a past day, or (optionally) ask for help.
//
// Layout (matches Figma "Screens"):
//   < 768 px   one column, floating tab bar, check-in in a bottom sheet
//   ≥ 768 px   two columns, check-in inline next to the hero
//   ≥ 1024 px  + sidebar (tab bar and header move into it)
// On phones the two columns use `display: contents`, so their children join a
// single flow and `order-*` sets the phone order without duplicating markup.

import { useEffect, useMemo, useRef, useState } from "react";
import type { VesperData } from "@/lib/data";
import { useOverrides } from "@/lib/store";
import { computeStats, dayState, longDate, mergeLogs, weekOf, type Entry } from "@/lib/vesper";
import {
  type Celebration,
  CommunityCard,
  Greeting,
  Header,
  HeroCard,
  MilestoneReached,
  NavBar,
  NextMilestone,
  PlusCard,
  Sidebar,
  ThoughtCard,
  TodayCard,
  WeekStrip,
} from "./sections";
import { CheckInCard, CheckInSheet, PlusSheet } from "./sheets";
import { fetchThought, type Thought } from "@/lib/thought";

type Open = { kind: "day"; date: string } | { kind: "plus" } | null;

const COLUMN = "contents md:flex md:min-w-0 md:flex-1 md:flex-col md:gap-6";

export function TodayScreen({ data }: { data: VesperData }) {
  const { overrides, setEntry, reset } = useOverrides();
  const logs = useMemo(() => mergeLogs(data.history, overrides), [data.history, overrides]);
  const stats = useMemo(() => computeStats(data, logs), [data, logs]);
  const limit = data.goal.dailyLimit;
  const todayEntry = stats.todayEntry;
  const hardDay = !!todayEntry && todayEntry.count > limit;

  const week = weekOf(data.today).map((date) => ({
    date,
    state: dayState(date, data.today, logs, limit),
    entry: logs.get(date) ?? null,
  }));

  const [open, setOpen] = useState<Open>(null);
  const [celebrate, setCelebrate] = useState<Celebration>(null);
  const [announce, setAnnounce] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  // A line for tomorrow: a curated DummyJSON quote picked for the kind of day it was
  // (see lib/thought.ts), with Vesper's own lines as the fallback. Only after the day is closed.
  const [thought, setThought] = useState<Thought | null>(null);
  const loggedToday = !!todayEntry;
  useEffect(() => {
    if (!loggedToday) return;
    const lines = data.fallbackThoughts;
    const fallback = { text: lines[stats.daysLogged % lines.length], source: "Vesper" };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    fetchThought(fallback, ctrl.signal, hardDay ? "hard" : "steady").then((t) => {
      clearTimeout(timer);
      setThought(t);
    });
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
    // Fetch once per closed day, not on every edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedToday]);

  const save = (date: string, entry: Entry) => {
    const wasNew = !logs.has(date);
    setEntry(date, entry);
    setOpen(null);
    if (date === data.today) {
      const total = stats.daysLogged + (wasNew ? 1 : 0);
      const milestone = wasNew && data.milestones.some((m) => m.days === total);
      setCelebrate({ kind: entry.count > limit ? "above" : milestone ? "milestone" : "within", id: Date.now() });
      setTimeout(() => setCelebrate(null), 1400);
      setAnnounce(`Day closed. ${total} days logged. Nothing resets.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showToast(wasNew ? "Added. Your total went up." : "Saved.");
    }
  };

  const greeting = !todayEntry ? "Good evening," : hardDay ? "Thanks for being honest," : "Well done,";
  const comingSoon = (what: string) => showToast(`${what} opens in the full app.`);
  const openPlus = () => setOpen({ kind: "plus" });
  const pickDay = (date: string) => setOpen({ kind: "day", date });
  const goal = data.goal;

  return (
    <div className="lg:flex">
      <Sidebar
        name={data.user.name}
        initial={data.user.initial}
        subtitle={`Cutting down · limit ${limit}`}
        onTab={comingSoon}
        onPlus={openPlus}
        onSupport={() => comingSoon("Support")}
      />

      <main id="top" className="mx-auto min-h-dvh w-full max-w-[430px] pb-36 md:max-w-[1096px] md:px-8 lg:max-w-[1160px] lg:py-10 lg:pb-16">
        <Header initial={data.user.initial} onSupport={() => comingSoon("Support")} />
        <Greeting line={greeting} name={data.user.name} date={longDate(data.today)} />

        <div className="mt-5 flex flex-col gap-5 px-5 md:mt-7 md:flex-row md:items-start md:gap-6 md:px-0">
          {/* Left: progress */}
          <div className={COLUMN}>
            <div className="animate-rise order-1 md:order-none" style={{ animationDelay: "0ms" }}>
              <HeroCard stats={stats} baseline={goal.baselinePerDay} celebrate={celebrate} onCheckIn={() => pickDay(data.today)} />
            </div>
            <div className={"animate-rise " + (todayEntry ? "order-7 md:order-none" : "order-3 md:order-none")} style={{ animationDelay: "140ms" }}>
              <WeekStrip days={week} unit={goal.unit} onPick={pickDay} />
            </div>
            <div className={"animate-rise " + (todayEntry ? "order-5 md:order-none" : "order-4 md:order-none")} style={{ animationDelay: "210ms" }}>
              {todayEntry && stats.reachedToday ? <MilestoneReached stats={stats} hardDay={hardDay} /> : <NextMilestone stats={stats} />}
            </div>
          </div>

          {/* Right: today */}
          <div className={COLUMN}>
            {todayEntry ? (
              <div className="animate-rise order-2 md:order-none" style={{ animationDelay: "70ms" }}>
                <TodayCard entry={todayEntry} limit={limit} unit={goal.unit} unitSingular={goal.unitSingular} onCoach={openPlus} />
              </div>
            ) : (
              <div className="animate-rise order-2 hidden md:order-none md:block" style={{ animationDelay: "70ms" }}>
                <CheckInCard
                  date={data.today}
                  today={data.today}
                  entry={null}
                  limit={limit}
                  unit={goal.unit}
                  onSave={(entry) => save(data.today, entry)}
                />
              </div>
            )}
            {(!todayEntry || hardDay) && (
              <div className={"animate-rise " + (todayEntry ? "order-3 md:order-none" : "order-5 md:order-none")} style={{ animationDelay: "280ms" }}>
                <CommunityCard post={hardDay ? data.community.hardDay : data.community.everyday} onOpen={() => comingSoon("Community")} />
              </div>
            )}
            {todayEntry && (
              <div className="animate-rise order-6 md:order-none" style={{ animationDelay: "350ms" }}>
                <ThoughtCard thought={thought} />
              </div>
            )}
            <div className="animate-rise order-8 md:order-none lg:hidden" style={{ animationDelay: "420ms" }}>
              <PlusCard onOpen={openPlus} />
            </div>
          </div>
        </div>

        <p className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              reset();
              setThought(null);
              showToast("Demo reset to day 13.");
            }}
            className="type-caption text-fg-muted underline underline-offset-4"
          >
            Reset demo
          </button>
        </p>
      </main>

      <NavBar onTab={comingSoon} />

      {open?.kind === "day" && (
        <CheckInSheet
          date={open.date}
          today={data.today}
          entry={logs.get(open.date) ?? null}
          limit={limit}
          unit={goal.unit}
          onSave={(entry) => save(open.date, entry)}
          onClose={() => setOpen(null)}
        />
      )}
      {open?.kind === "plus" && (
        <PlusSheet
          onClose={() => setOpen(null)}
          onStart={() => {
            setOpen(null);
            showToast("Demo only. No payment here.");
          }}
        />
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
      {toast && (
        <div role="status" className="type-label fixed inset-x-0 bottom-28 z-20 mx-auto w-fit animate-toast rounded-full bg-inverse px-5 py-3 text-fg-inverse lg:bottom-8">
          {toast}
        </div>
      )}
    </div>
  );
}
