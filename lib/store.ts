// What the person logs lives in localStorage, layered over data/sample.json.
// useSyncExternalStore keeps React in sync without effects, and the server
// snapshot is "nothing logged yet", so the first paint matches the server.

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Entry, Overrides } from "@/lib/vesper";

const KEY = "vesper:v1";
const listeners = new Set<() => void>();
const EMPTY = "{}";

function read(): string {
  try {
    return window.localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY; // private mode or storage blocked: fall back to the demo data
  }
}

function write(next: Overrides | null) {
  try {
    if (next) window.localStorage.setItem(KEY, JSON.stringify(next));
    else window.localStorage.removeItem(KEY);
  } catch {
    // ignore: the UI still works for this session through the listeners below
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useOverrides() {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  const overrides = useMemo<Overrides>(() => {
    try {
      return JSON.parse(raw) as Overrides;
    } catch {
      return {};
    }
  }, [raw]);

  const setEntry = useCallback((date: string, entry: Entry) => {
    write({ ...JSON.parse(read()), [date]: entry });
  }, []);

  const reset = useCallback(() => write(null), []);

  return { overrides, setEntry, reset };
}
