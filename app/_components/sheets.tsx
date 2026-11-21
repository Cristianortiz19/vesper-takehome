// Check-in (bottom sheet on phones, inline card from 768 px), edit-a-day,
// and the Vesper Plus sheet (where the paid feature lives).

"use client";

import { useState } from "react";
import type { Mood } from "@/lib/data";
import { haptic } from "@/lib/motion";
import { dayName, longDate, type Entry } from "@/lib/vesper";
import { Icon } from "./icons";
import { Button, Card, Sheet, SheetTop, Stepper, MoodPicker, TextLink } from "./ui";

function limitNote(count: number, limit: number, inline: boolean) {
  if (inline && count === 0) return "Log it whenever you’re ready. About 15 seconds.";
  if (count > limit) return `${count - limit} above your limit. Log it anyway, it still counts.`;
  if (count === limit) return "Right at your limit.";
  if (count === 0) return "Zero today. That counts too.";
  return `${limit - count} under your limit.`;
}

type FormProps = {
  date: string;
  today: string;
  entry: Entry | null;
  limit: number;
  unit: string;
  titleId: string;
  inline?: boolean;
  onSave: (entry: Entry) => void;
};

/** The check-in itself: one number, an optional mood, one button. */
function CheckInForm({ date, today, entry, limit, unit, titleId, inline = false, onSave }: FormProps) {
  const isToday = date === today;
  const day = dayName(date);
  const [count, setCount] = useState(entry?.count ?? 0);
  const [mood, setMood] = useState<Mood | null>(entry?.mood ?? null);
  const [done, setDone] = useState(false);

  const title = isToday ? `How many ${unit} today?` : entry ? `Edit ${day}` : `Add ${day}`;
  const cta = isToday ? (entry ? "Save today" : "Close the day") : `Save ${day}`;

  return (
    <>
      <h2 id={titleId} className="type-title-m w-full">
        {title}
      </h2>
      {!isToday && !entry && (
        <p className="type-body -mt-2 w-full text-fg-muted">Missed days can be filled in anytime. Your total updates as soon as you save.</p>
      )}
      <Stepper value={count} onChange={setCount} hint={`your limit is ${limit}`} label={unit} wide={inline} />
      <p className="type-body-s -mt-1 text-center text-fg-muted" aria-live="polite">
        {limitNote(count, limit, inline)}
      </p>
      <MoodPicker value={mood} onChange={setMood} legend={isToday ? "How did today feel?" : `How did ${day} feel?`} />
      {/* A short "done" beat before the sheet closes, so the action feels finished. */}
      <Button
        className="mt-2 w-full"
        icon={done ? "check" : undefined}
        aria-disabled={done}
        onClick={() => {
          if (done) return;
          setDone(true);
          haptic(14);
          setTimeout(() => onSave({ count, mood }), 420);
        }}
      >
        <span key={done ? "done" : "idle"} className={done ? "animate-pop" : ""}>
          {done ? (isToday ? "Day closed" : "Saved") : cta}
        </span>
      </Button>
    </>
  );
}

/** Phones: bottom sheet. Also used everywhere for past days and for editing today. */
export function CheckInSheet(props: Omit<FormProps, "titleId" | "inline"> & { onClose: () => void }) {
  const { date, today, entry, onClose } = props;
  return (
    <Sheet open onClose={onClose} labelledBy="checkin-title">
      <SheetTop eyebrow={longDate(date)} onClose={onClose} />
      <CheckInForm {...props} titleId="checkin-title" />
      {date !== today && !entry && <TextLink onClick={onClose}>I didn’t track that day</TextLink>}
    </Sheet>
  );
}

/** Tablet and desktop: the check-in sits on the page, next to the hero. */
export function CheckInCard(props: Omit<FormProps, "titleId" | "inline">) {
  return (
    <Card className="hidden flex-col items-center gap-4 md:flex">
      <p className="type-overline w-full text-fg-muted">Today’s check-in</p>
      <CheckInForm {...props} titleId="checkin-inline-title" inline />
    </Card>
  );
}

const PERKS = [
  "Chat with a Choose Your Horizon coach when a day gets hard",
  "A plan that lowers your limit at your own pace",
  "Weekly insights: what makes your hard days harder",
];

export function PlusSheet({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  return (
    <Sheet open onClose={onClose} labelledBy="plus-title">
      <SheetTop eyebrow="Vesper Plus" onClose={onClose} />
      <div className="w-full rounded-card bg-avatar p-6">
        <h2 id="plus-title" className="type-title-m">A coach for the hard days.</h2>
        <ul className="mt-4 space-y-3">
          {PERKS.map((p) => (
            <li key={p} className="type-body flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-inverse text-fg-inverse">
                <Icon name="check" size={14} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <p className="type-body-s w-full text-center text-fg-muted">Your daily check-in and your count stay free, always.</p>
      <Button className="w-full" onClick={onStart}>
        Start 7-day free trial
      </Button>
      <TextLink onClick={onClose}>Not now</TextLink>
    </Sheet>
  );
}
