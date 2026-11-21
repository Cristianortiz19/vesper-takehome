// Typed loader for the local demo data. The "no backend" rule lives here:
// we only import a JSON file from the repo.

import sample from "@/data/sample.json";

export type Mood = "calm" | "tense" | "tired" | "proud";

export type DayLog = {
  date: string; // YYYY-MM-DD
  count: number;
  mood: Mood | null;
};

export type Milestone = { days: number; label: string };

export type CommunityPost = { topic: string; quote: string; meta: string };

export type VesperData = {
  user: { name: string; initial: string };
  goal: {
    mode: "cut-down" | "quit";
    unit: string;
    unitSingular: string;
    dailyLimit: number;
    baselinePerDay: number;
    startedOn: string;
  };
  today: string;
  history: DayLog[];
  milestones: Milestone[];
  community: { everyday: CommunityPost; hardDay: CommunityPost };
  fallbackThoughts: string[];
};

export function getVesperData(): VesperData {
  // The JSON is the source of truth; the cast narrows string moods to the union.
  return sample as unknown as VesperData;
}
