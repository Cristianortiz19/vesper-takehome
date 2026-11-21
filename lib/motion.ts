// Tiny motion helpers. Everything respects "reduce motion": numbers jump
// straight to their value and haptics stay off.

import { useEffect, useRef, useState } from "react";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A light tap on phones that support it (Android). Silent everywhere else. */
export function haptic(ms = 8) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator && !reducedMotion()) navigator.vibrate(ms);
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates from the previous value to `target` whenever it changes (not on first render). */
export function useAnimatedNumber(target: number, duration = 700): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const start = from.current;
    if (start === target) return;
    if (reducedMotion()) {
      from.current = target;
      requestAnimationFrame(() => setValue(target));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(start + (target - start) * easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target, duration]);

  return value;
}
