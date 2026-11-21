// Small building blocks that match the Figma components 1:1
// (Button, Chip, Card, Sheet, Stepper, Mood tile).

"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { Mood } from "@/lib/data";
import { haptic } from "@/lib/motion";
import { Icon, type IconName } from "./icons";
import { MoodFace, MOOD_LABEL } from "./illustrations";

// ---------------------------------------------------------------- Button
type ButtonKind = "primary" | "dark" | "soft" | "outline";
const BUTTON_KIND: Record<ButtonKind, string> = {
  primary: "bg-action text-fg border-2 border-line-strong",
  dark: "bg-inverse text-fg-inverse",
  soft: "bg-surface-muted text-fg",
  outline: "border-2 border-line-strong text-fg",
};

export function Button({
  kind = "primary",
  size = "l",
  icon,
  className = "",
  children,
  ...rest
}: {
  kind?: ButtonKind;
  size?: "l" | "m";
  icon?: IconName;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizing = size === "l" ? "h-[60px] px-7 type-button" : "h-12 px-[22px] type-body-strong";
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full transition-[transform,filter] duration-150 hover:brightness-95 active:scale-[0.97] disabled:opacity-40 ${sizing} ${BUTTON_KIND[kind]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}

export function TextLink({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="type-label py-3 text-fg underline underline-offset-4" {...rest}>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------- Chip
type ChipTone = "info" | "neutral" | "avatar";
const CHIP_TONE: Record<ChipTone, string> = {
  info: "bg-milestone text-fg",
  neutral: "bg-surface-muted text-fg border border-line",
  avatar: "bg-avatar text-fg",
};
export function Chip({ tone = "info", children }: { tone?: ChipTone; children: ReactNode }) {
  return <span className={`type-chip inline-flex h-6 items-center gap-1 rounded-full px-2.5 ${CHIP_TONE[tone]}`}>{children}</span>;
}

// ---------------------------------------------------------------- Card
export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <section className={`rounded-card bg-surface p-6 ${className}`}>{children}</section>;
}

// ---------------------------------------------------------------- Sheet
/** Bottom sheet built on <dialog>: focus trap, Esc to close and a backdrop come from the platform. */
export function Sheet({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet-panel flex flex-col items-center gap-4 rounded-t-card bg-surface px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-2.5 md:pt-6">
        <span className="h-[5px] w-10 rounded-full bg-line md:hidden" aria-hidden="true" />
        {children}
      </div>
    </dialog>
  );
}

export function SheetTop({ eyebrow, onClose }: { eyebrow: string; onClose: () => void }) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="type-overline text-fg-muted">{eyebrow}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid size-11 place-items-center rounded-full border border-line text-fg"
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- Stepper
export function Stepper({
  value,
  onChange,
  hint,
  label,
  max = 60,
  wide = false,
}: {
  value: number;
  onChange: (n: number) => void;
  hint: string;
  label: string;
  max?: number;
  wide?: boolean;
}) {
  const step = (d: number) => {
    haptic();
    onChange(Math.max(0, Math.min(max, value + d)));
  };
  return (
    <div className={`flex h-[76px] ${wide ? "w-[320px]" : "w-[260px]"} items-center justify-between rounded-full border border-line bg-surface p-3`}>
      <button type="button" aria-label="One less" onClick={() => step(-1)} disabled={value === 0} className="grid size-12 place-items-center rounded-full bg-inverse text-fg-inverse transition-transform active:scale-90 disabled:opacity-30">
        <Icon name="minus" size={22} />
      </button>
      <div className="text-center" role="status" aria-live="polite" aria-label={`${value} ${label}`}>
        <div key={value} className="type-title-l animate-pop tabular-nums">{value}</div>
        <div className="type-caption text-fg-muted">{hint}</div>
      </div>
      <button type="button" aria-label="One more" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full bg-inverse text-fg-inverse transition-transform active:scale-90">
        <Icon name="plus" size={22} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- Mood picker
const MOODS: Mood[] = ["calm", "tense", "tired", "proud"];
export function MoodPicker({ value, onChange, legend }: { value: Mood | null; onChange: (m: Mood | null) => void; legend: string }) {
  return (
    <fieldset className="w-full">
      <legend className="mb-3 flex w-full items-baseline gap-1.5">
        <span className="type-body-strong">{legend}</span>
        <span className="type-body-s text-fg-muted">Optional</span>
      </legend>
      <div className="flex justify-between">
        {MOODS.map((m) => {
          const selected = value === m;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                haptic();
                onChange(selected ? null : m);
              }}
              className="group flex w-[78px] flex-col items-center gap-2"
            >
              <span
                key={selected ? "on" : "off"}
                className={`grid size-[78px] place-items-center rounded-[29px] border-[3px] transition-[border-color,transform] duration-200 group-hover:-translate-y-0.5 ${selected ? "animate-pop border-line-strong" : "border-transparent"}`}
              >
                <span className={selected ? "animate-wiggle" : ""}>
                  <MoodFace mood={m} />
                </span>
              </span>
              <span className="type-label">{MOOD_LABEL[m]}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
