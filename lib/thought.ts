// "A line for tomorrow": one short quote from DummyJSON (free, no key).
//
// Why a curated list instead of /quotes/random:
// the DummyJSON pool has ~1,450 quotes and most of them don't fit Vesper's
// voice (religious or political lines, hustle talk, guilt about yesterday,
// lines about drinking or smoking). A keyword filter over random quotes kept
// letting the wrong ones through, so we pick from IDs we read and chose,
// fetch that one quote live, and still run it through a guard in case the
// API content changes. Anything that fails falls back to Vesper's own lines.

export type Thought = { text: string; source: string };
export type Tone = "hard" | "steady";

const API = "https://dummyjson.com/quotes";

// Read by hand on 2026-11-21. "hard" lines are for a day above the limit:
// no pep talk, just "it's fine, start again". "steady" lines are for normal days.
const CURATED: Record<Tone, number[]> = {
  hard: [195, 350, 371, 413, 435, 530, 691, 1015, 1270, 1224],
  steady: [77, 509, 511, 1070, 1253, 1387, 977, 1015, 1224],
};

// Safety net: if a curated ID ever starts returning something else, reject it.
const AVOID = [
  "death", "die", "dead", "kill", "war", "blood", "god", "allah", "lord", "heaven",
  "hell", "sin", "pray", "prophet", "holy", "jihad", "money", "rich", "sex", "hate",
  "drink", "drunk", "wine", "alcohol", "smoke", "smoking", "cigarette", "cigarettes",
  "weakness", "perfect", "shame",
];

export function fitsVesper(quote: string): boolean {
  if (quote.length < 20 || quote.length > 120) return false;
  const words = quote.toLowerCase().match(/[a-z']+/g) ?? [];
  return !words.some((w) => AVOID.includes(w));
}

// Half the pool is stored In Title Case With Broken "Don'T". Turn it into a sentence.
export function toSentenceCase(text: string): string {
  const words = text.trim().split(/\s+/);
  const title = words.filter((w) => /^[A-Z]/.test(w)).length / words.length > 0.6;
  if (!title) return text.trim();
  return words
    .map((w) => w.toLowerCase())
    .join(" ")
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, p, c: string) => p + c.toUpperCase())
    .replace(/\bi\b/g, "I");
}

function cleanAuthor(author: string | undefined): string {
  return (author ?? "Unknown").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
}

export async function fetchThought(
  fallback: Thought,
  signal: AbortSignal,
  tone: Tone = "steady",
): Promise<Thought> {
  const ids = CURATED[tone];
  const id = ids[Math.floor(Math.random() * ids.length)];
  try {
    const res = await fetch(`${API}/${id}`, { signal, cache: "no-store" });
    if (!res.ok) return fallback;
    const q = (await res.json()) as { quote?: string; author?: string };
    if (!q.quote || !fitsVesper(q.quote)) return fallback;
    return { text: toSentenceCase(q.quote), source: `${cleanAuthor(q.author)} · via DummyJSON` };
  } catch {
    return fallback;
  }
}
