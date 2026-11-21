# Vesper

**A daily check-in for cutting down on nicotine, where a hard day still counts.**

```bash
npm install && npm run dev
```

Opens at http://localhost:3000. Node 22 (`.nvmrc`). There is no API key or signup, and nothing to set up.

- **Figma** (design system, screens, usability flow, desktop): [Vesper App](https://www.figma.com/design/2HhtwMSgiPZOEticE1EUsi/Vesper-App?node-id=47-4&t=ahNXKzrU2pD1MwvC-1)
- **Original brief:** [`BRIEF.md`](./BRIEF.md)

---

## The goal I picked, and why

Cutting down on cigarettes. I picked it because the usual habit-app mechanic, the streak, breaks worst here.

Someone who is cutting down will have days above their limit. In a streak app, that day sets them back to zero. That is the exact moment the app stops feeling useful and starts feeling like a judge. People who already feel bad about a slip don't open the thing that confirms it. They quietly stop opening it, and that is the churn this business can't afford.

## Inspiration

Mostly the quit-tracking and habit apps whose screenshots I collected on the **References** page of the Figma file:

- **Quittercheck:** its calm green home card shaped the hero. The mood is a quiet landscape, not a dashboard.
- **The Navigate design system:** I took its color energy and generous rounded shapes and toned them down to feel calmer for a health context.
- **Streak apps (by contrast):** the reset-to-zero moment is what I designed against.

## The bet: a count that never resets

Vesper's hero number is **days logged**, not days clean. It only goes up. Logging 7 cigarettes on a day with a limit of 5 still moves it from 13 to 14.

What I think people get hooked on is **honesty without punishment**: knowing the app takes the bad day too. After a few weeks, "47 days logged" is something you'd genuinely miss if it disappeared, and no single bad day can take it away. That is the habit that has to survive to billing cycle 3.

Everything on the screen backs the bet:

- **The check-in takes about 15 seconds.** Count, an optional mood, then "Close the day". No journaling and no streak math.
- **"Within your limit 11 of 13"** sits next to the count. It is an honest second number that doesn't reset either.
- **A hard day changes the tone, not the score.** The sun nods instead of celebrating. The card says *"Logging a hard day still counts."* It offers one small next step: keep tomorrow's limit or try a softer one.
- **Milestones are about showing up** ("Two weeks of showing up"), not abstinence.
- **The week strip makes gaps editable.** A missed day can be filled in later ("Tap a day to add or edit"), and "I didn't track that day" is a valid answer.
- **Community is a small proof that others log hard days too.** On a hard day it switches to posts from people who did the same.

## Where the money goes

Plus ("A coach for the hard days") appears in two places:

1. **In context:** "Talk to a coach" with a Plus chip, inside the hard-day card. This is the moment someone actually wants help, so it's the most honest place to offer it.
2. **Ambient:** a Plus card in the column (mobile) or sidebar (desktop).

The trial button shows a toast saying it's a demo. There are no real payments.

## The daily moment, as built

The screen is Home plus its sheets: check-in, edit a past day, and Plus. The other tabs (Progress, Community, Plan) and onboarding are designed in Figma but not built, as the brief asks.

- **Mobile first:**
  - one column with a floating tab bar.
  - check-in in a bottom sheet (a native `<dialog>`).
- **Tablet (≥ 768 px):**
  - two columns, with the check-in inline next to the hero.
  - sheets become centered dialogs.
- **Desktop (≥ 1024 px):** a sidebar replaces the header and the tab bar.
- **State:** the person's own entries live in `localStorage` (`lib/store.ts`) on top of `data/sample.json`. "Reset demo" at the bottom clears them.
  - The sample is set up to tell the story: today is Fri Nov 20. There are 13 days logged with a couple above the limit, and Thursday is missing. One check-in reaches the two-week milestone.

### Motion

Small, and only where something changed:

- **On close:** the button confirms with a ~400 ms "✓ Day closed" beat before saving.
- **In the hero:**
  - the count rolls up and the arc grows.
  - within the limit, the sun bounces with a little confetti; above the limit, it only nods.
- **Picking:** the stepper and mood picker pop or wiggle and give haptic feedback where supported.
- **Cards and toasts:** cards rise in on load, and toasts slide in.
- **Reduced motion:** everything respects `prefers-reduced-motion`.

## External API: DummyJSON, with curated content

After a day is closed, "A line for tomorrow" shows one quote from [DummyJSON](https://dummyjson.com/docs/quotes). It needs no key.

I first tried random quotes with a keyword filter over the whole pool (~1,450 quotes). It let through religious, political and hustle lines that don't fit a health app's tone. So `lib/thought.ts` works differently:

- It fetches **one quote by ID from a list I read and picked**, split by tone:
  - `hard` lines for a day above the limit.
  - `steady` lines for any other day.
- A word guard rejects the quote if the API content ever changes, and it normalizes the pool's Title Case.
- **Fallback:** if the call fails or takes longer than 4 s, Vesper's own lines are shown instead, matching the same tone. A skeleton covers the wait.

The API is real, but the voice stays the product's.

## Design system

The code mirrors the Figma system 1:1, so the two can evolve together:

- **Tokens:** Figma variables map to Tailwind 4 `@theme` in `app/globals.css`.
  - primitives such as `lime-400` and `ink-900`.
  - semantic tokens such as `surface`, `fg-muted`, `logged` and `mood-*`.
  - `--color-*: initial` removes Tailwind's default palette, so only system colors exist.
- **Type:** Figma text styles map to `@utility type-*` (for example `type-title-l` and `type-overline`).
- **Components:** Button, Chip, Card, Sheet, Stepper and MoodPicker in `app/_components/ui.tsx`. The screen sections are in `sections.tsx`.
- **Illustrations** (the landscape, the sun, mood faces and the trophy) are inline SVG, so they can be animated.

```
app/
  page.tsx               server entry → <TodayScreen />
  globals.css            tokens, type utilities, keyframes
  _components/
    TodayScreen.tsx      layout + state (client)
    sections.tsx         hero, week, milestones, cards, nav
    sheets.tsx           check-in, edit day, Plus
    ui.tsx               primitives
    illustrations.tsx    SVG art
lib/
  vesper.ts              pure logic: stats, day states, milestones
  store.ts               localStorage overrides (useSyncExternalStore)
  thought.ts             DummyJSON + curation + fallback
  motion.ts              animated numbers, reduced motion, haptics
data/sample.json
```

## What I'd measure

The bet is that a hard day doesn't end the relationship. So the first metric is about what happens after one:

1. **Return after a hard day:** the share of users who check in the day after a day above their limit. This is the number the whole design is built to move. I'd compare it against a streak-reset variant.
2. **Hard days logged vs. skipped:** are above-limit days being logged, or showing up as gaps? Rising honesty is a leading indicator.
3. **Check-in rate by week** (D7, D30, D90). The business needs about 3 billing cycles, so the shape of the curve around weeks 4–12 matters more than D1.
4. **Trend toward the limit:** the weekly average vs. the baseline. Retention only matters if the product actually helps.
5. **Plus conversion by entry point:** the hard-day coach link vs. the ambient card. It tests whether help offered in the moment converts better than a banner.

## What I'd build next

- Day-1 state ("0 days logged") and onboarding in code. Both are designed in Figma, including the time-skip note.
- A gentle evening reminder that points to the check-in, never to the count.
- The Progress tab: a month view that shows the trend without a streak.
- Community posting, and the Plus coach flow.

## Process and tools

**Research and product thinking: me, on paper.** I did the research and product-design work in my notebook:

- choosing the goal.
- comparing concepts.
- deciding what people should get hooked on.
- weighing the options until I picked the best one.

**Design: me.** I created the screens and the visual style myself in **Figma** and reviewed every detail closely: layout, illustrations, color and copy.

**AI to move faster: Claude (Anthropic).** I used it as an accelerator, not as the designer:

- **Ideation:** bouncing ideas and building a first base to design from, plus a critical usability and information-architecture review that I then acted on.
- **Design system in Figma:** through the Figma MCP, it helped turn my screens into:
  - variables and tokens, text styles and components with variants.
  - the file organization (Foundations, Components, Screens, Usability flow, References).
  - the desktop adaptations.
  
  I reviewed every adjustment.
- **Development:** taking the design to code in this scaffold:
  - tokens mirrored from Figma into Tailwind.
  - responsive layout, microinteractions and the curated DummyJSON integration.
  - checking the result in the browser and running lint and build.

**Stack:** Next.js 16 (the scaffold), React 19, Tailwind CSS 4, TypeScript.
