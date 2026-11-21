// Vectors exported from the Figma file (Illustration/* and Mood face components).
// Colors use the same tokens as Figma through CSS variables.

import type { ReactNode } from "react";
import type { Mood } from "@/lib/data";

const SUN = "var(--color-orange-500)";
const INK = "var(--color-ink-900)";
const CLOUD = "var(--color-cobalt-500)";

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 63" fill="none" aria-hidden="true">
      <circle cx="31.39" cy="31.39" r="20.81" fill={SUN} />
      <g fill={SUN} stroke={SUN} strokeWidth="2.35" strokeLinejoin="round">
        <path d="M31.39 1.18L27.7 7.57H35.08Z" />
        <path d="M1.18 31.05L7.57 34.75V27.36Z" />
        <path d="M61.96 31.05L55.56 27.36V34.75Z" />
        <path d="M52.62 52.62L50.71 45.49L45.49 50.71Z" />
        <path d="M9.83 9.83L11.74 16.96L16.97 11.74Z" />
        <path d="M9.83 52.62L16.96 50.71L11.74 45.49Z" />
        <path d="M52.62 9.83L45.49 11.74L50.71 16.97Z" />
        <path d="M31.73 61.29L35.42 54.89H28.03Z" />
      </g>
    </svg>
  );
}

/** Hero landscape (Illustration/Landscape · Type=Hero). Sits under the hero numbers. */
export function Landscape({ className, sunClass = "" }: { className?: string; sunClass?: string }) {
  return (
    <svg viewBox="0 0 350 308" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M306.7 244.7L301 254L325 256L318.9 244.7H321.7L316.9 233.9L319.3 235.1L314.4 223C312 226.6 309.1 231.9 307.5 235.1C307 236.1 308.7 234.8 309.9 234.3L303.8 244.7Z" fill="var(--color-green-700)" stroke="var(--color-green-700)" strokeWidth="1.5" />
        <path d="M331.6 250.8L328 256.7L343 258L339.2 250.8H341L337.9 243.9L339.4 244.7L336.4 237C334.9 239.3 333.1 242.6 332.1 244.7C331.7 245.3 332.8 244.5 333.6 244.2L329.8 250.8Z" fill="var(--color-green-700)" stroke="var(--color-green-700)" strokeWidth="1.5" />
        <path d="M111.3 202.1C108.6 202.3 104.2 201.7 102 206H134C130.7 201.9 127.6 203.6 125.4 203C123.2 202.3 121.9 198 118.1 198C114.4 198 113.9 201.9 111.3 202.1Z" fill={CLOUD} stroke={CLOUD} strokeWidth="1.5" />
        <path d="M-29.9 248C139.6 250 108.1 286 189.1 286L202.6 295.5C208.4 315.5 219.3 359.4 216.1 375C212.1 394.5 129.6 417.5 84.6 420.5C48.6 422.9 -77.4 413.9 -135.9 409C-157.1 354.7 -165.5 246.4 -29.9 248Z" fill="var(--color-green-500)" stroke="var(--color-green-500)" strokeWidth="11" />
        <path d="M131.5 291C85.5 292.5 22 331.5 -37 345C-41.7 353 -51.2 369.9 -52 373.5C-53 378 347.5 372.5 374 369C400.5 365.5 377.5 311.5 374 291C370.5 270.5 321 250.5 268.5 254.5C216 258.5 177.5 289.5 131.5 291Z" fill="var(--color-green-300)" stroke="var(--color-green-300)" strokeWidth="11" />
        <g className={`sun ${sunClass}`}>
          <circle cx="61.3" cy="179.3" r="24.3" fill={SUN} />
          <g fill={SUN} stroke={SUN} strokeWidth="1.18">
            <path d="M61.3 144L57 151.5H65.6Z" />
            <path d="M26 178.9L33.5 183.2V174.6Z" />
            <path d="M97 178.9L89.5 174.6V183.2Z" />
            <path d="M86.1 204.1L83.9 195.8L77.8 201.9Z" />
            <path d="M36.1 154.1L38.3 162.4L44.4 156.3Z" />
            <path d="M36.1 204.1L44.4 201.9L38.3 195.8Z" />
            <path d="M86.1 154.1L77.8 156.3L83.9 162.4Z" />
            <path d="M61.7 214.2L66 206.7H57.4Z" />
          </g>
          <path d="M57.4 180.9C60.2 184 63.1 184 66 180.9" fill="none" stroke={INK} strokeWidth="1.96" />
          <path d="M57.4 177.3C58.2 177.3 59 176.6 58.7 175.8C58.5 174.8 57.9 173.9 57.2 173.2C56.1 172.1 54.6 171.5 53.1 171.5C51.5 171.5 50 172.1 48.9 173.2C48.2 173.9 47.7 174.8 47.4 175.8C47.2 176.6 47.9 177.3 48.7 177.3Z" fill="white" />
          <path d="M73.8 177.3C74.7 177.3 75.4 176.6 75.2 175.8C74.9 174.8 74.4 173.9 73.7 173.2C72.6 172.1 71.1 171.5 69.5 171.5C68 171.5 66.5 172.1 65.4 173.2C64.6 173.9 64.1 174.8 63.9 175.8C63.6 176.6 64.3 177.3 65.2 177.3Z" fill="white" />
          <path d="M56.6 177.3C56.6 176.4 56.2 175.5 55.6 174.8C54.9 174.2 54 173.8 53.1 173.8C52.1 173.8 51.2 174.2 50.6 174.8C49.9 175.5 49.5 176.4 49.5 177.3Z" fill={INK} />
          <path d="M73.1 177.3C73.1 176.4 72.7 175.5 72 174.8C71.4 174.2 70.5 173.8 69.5 173.8C68.6 173.8 67.7 174.2 67 174.8C66.4 175.5 66 176.4 66 177.3Z" fill={INK} />
        </g>
        <path d="M5.1 142.2C2.5 140.3 -2.8 139.6 -5 145H20C19.3 143.1 17.2 139.3 14 139C9.9 138.7 7.7 144.1 5.1 142.2Z" fill={CLOUD} stroke={CLOUD} strokeWidth="1.5" />
        <path d="M14.2 284L0 307L60 312L44.7 284H51.9L39.7 257L45.8 260L33.6 230C27.5 239 20.3 252 16.3 260C15 262.6 19.3 259.3 22.4 258L7.1 284Z" fill="var(--color-green-900)" stroke="var(--color-green-900)" strokeWidth="1.5" />
        <path d="M61.8 297.6L53 311.9L90 315L80.6 297.6H85L77.5 280.8L81.2 282.7L73.7 264C69.9 269.6 65.5 277.7 63 282.7C62.2 284.3 64.9 282.2 66.8 281.4L57.4 297.6Z" fill="var(--color-green-900)" stroke="var(--color-green-900)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function Trophy({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 26.7C10.4 26.7 8.7 17.1 8.4 9.5C8.3 7.4 8.3 6.3 9.1 5.4C9.9 4.4 10.8 4.2 12.7 3.9C15.1 3.5 17.6 3.3 20 3.3C23 3.3 25.4 3.6 27.3 3.9C29.2 4.2 30.1 4.4 30.9 5.4C31.7 6.3 31.7 7.4 31.6 9.5C31.3 17.1 29.6 26.7 20 26.7" fill="var(--color-yellow-300)" />
      <path d="M29.4 20.7L34.1 18.1C35.3 17.4 36 17 36.3 16.5C36.7 15.9 36.7 15.2 36.7 13.7V13.6C36.7 11.9 36.7 11 36.2 10.3C35.7 9.7 34.9 9.4 33.2 8.9L31.7 8.3L31.6 8.5C31.6 8.8 31.6 9.1 31.6 9.5C31.5 13.2 31 17.4 29.4 20.7M8.4 9.5C8.5 13.2 9 17.4 10.6 20.7L5.9 18.1C4.7 17.4 4 17 3.7 16.5C3.3 15.9 3.3 15.2 3.3 13.7V13.6C3.3 11.9 3.3 11 3.8 10.3C4.3 9.7 5.1 9.4 6.8 8.9L8.3 8.3L8.4 8.5C8.4 8.8 8.4 9.1 8.4 9.5" fill="var(--color-yellow-500)" />
      <path d="M8.8 36.7C8.8 36 9.3 35.4 10 35.4H30C30.7 35.4 31.3 36 31.3 36.7C31.3 37.4 30.7 37.9 30 37.9H10C9.3 37.9 8.8 37.4 8.8 36.7Z" fill="var(--color-yellow-500)" />
      <path d="M25.8 35.4H14.2L14.7 32.5C14.9 31.7 15.6 31.2 16.4 31.2H23.6C24.4 31.2 25.1 31.7 25.3 32.5Z" fill="var(--color-yellow-300)" />
      <path d="M20 26.7C19.6 26.7 19.2 26.6 18.8 26.6V31.2H21.3V26.6C20.8 26.6 20.4 26.7 20 26.7Z" fill="var(--color-yellow-500)" />
    </svg>
  );
}

const FACES: Record<Mood, ReactNode> = {
  calm: (
    <g fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round">
      <path d="M13.8 27.1C18.9 31.6 23.9 31.6 29 27.1" />
      <path d="M41 27.1C46.1 31.6 51.1 31.6 56.2 27.1" />
      <path d="M29.5 39.7C33.3 43.9 37.2 43.9 41 39.7" />
    </g>
  ),
  tense: (
    <g fill="none" stroke={INK} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26.1 44L30.5 41.1L34.9 44L39.3 41.1L43.7 44" />
      <path d="M54.7 26L43.3 32.5L54.7 37.3" />
      <path d="M15.3 26L26.7 32.5L15.3 37.3" />
    </g>
  ),
  tired: (
    <g stroke={INK} strokeWidth="2.7" strokeLinecap="round">
      <circle cx="35.3" cy="38" r="3.2" fill={INK} />
      <path d="M12.1 28.8H27.2M42.8 28.8H57.9" />
    </g>
  ),
  proud: (
    <g>
      <path d="M30.1 31.8C31.2 31.8 32.1 31 31.8 29.9C31.5 28.7 30.9 27.6 29.9 26.7C28.6 25.3 26.7 24.5 24.8 24.5C22.9 24.5 21 25.3 19.6 26.7C18.7 27.6 18.1 28.7 17.8 29.9C17.5 31 18.4 31.8 19.4 31.8Z" fill="white" />
      <path d="M50.6 31.8C51.6 31.8 52.5 31 52.2 29.9C51.9 28.7 51.3 27.6 50.4 26.7C49 25.3 47.1 24.5 45.2 24.5C43.3 24.5 41.4 25.3 40.1 26.7C39.1 27.6 38.5 28.7 38.2 29.9C37.9 31 38.8 31.8 39.9 31.8Z" fill="white" />
      <path d="M29.2 31.8C29.2 30.7 28.7 29.6 27.9 28.7C27.1 27.9 26 27.5 24.8 27.5C23.6 27.5 22.5 27.9 21.7 28.7C20.9 29.6 20.4 30.7 20.4 31.8Z" fill={INK} />
      <path d="M49.6 31.8C49.6 30.7 49.1 29.6 48.3 28.7C47.5 27.9 46.4 27.5 45.2 27.5C44 27.5 42.9 27.9 42.1 28.7C41.3 29.6 40.8 30.7 40.8 31.8Z" fill={INK} />
      <path d="M27.2 37.7H43.3C43.3 40.3 41.3 45.5 35.5 45.5C29.3 45.5 27.4 40.3 27.2 37.7Z" fill={INK} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
    </g>
  ),
};

export const MOOD_LABEL: Record<Mood, string> = { calm: "Calm", tense: "Tense", tired: "Tired", proud: "Proud" };
const MOOD_BG: Record<Mood, string> = {
  calm: "bg-mood-calm",
  tense: "bg-mood-tense",
  tired: "bg-mood-tired",
  proud: "bg-mood-proud",
};

/** Mood face. "tile" (70) for choosing, "badge" (60) for summaries, "dot" (26) for the week strip. */
export function MoodFace({ mood, size = "tile" }: { mood: Mood; size?: "tile" | "badge" | "dot" }) {
  const box = { tile: "size-[70px] rounded-tile", badge: "size-[60px] rounded-[22px]", dot: "size-[26px] rounded-full" }[size];
  return (
    <span className={`${box} ${MOOD_BG[mood]} grid shrink-0 place-items-center overflow-hidden`} aria-hidden="true">
      <svg viewBox="0 0 70 70" className="size-full">
        {FACES[mood]}
      </svg>
    </span>
  );
}
