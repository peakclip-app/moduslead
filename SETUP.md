# ModusLead — Setup

A drop-in Next.js 14 + Tailwind CSS + TypeScript project.

## Quickstart

1. Create a fresh Next.js project:
```bash
npx create-next-app@latest moduslead --typescript --tailwind --app --src-dir
```

## Drop-in instructions

1. **Copy the `src/` folder** from this scaffold into your project root, replacing the generated content.
2. **Copy `tailwind.config.ts`** — it extends fonts and adds brand color utilities.
3. **Install fonts** — they're loaded via `next/font/google` in `layout.tsx`. No extra install needed; they fetch from Google at build time. If you need offline support, use `@fontsource/dm-sans` and `@fontsource/jetbrains-mono`.

```bash
npm run dev
```

## File map

```
src/
  lib/
    types.ts          — TypeScript types (Style, Scenario, ScoreResult, etc.)
    scoring.ts        — computeScore(), seededShuffle(), encodeResult(), decodeResult()
    scenarios.ts      — 16 scenarios, 4 per readiness level (R1–R4)
    copy.ts           — STYLE_PROFILES, STYLE_COLORS, accuracyCopy(), developmentCopy()
  components/
    IntroScreen.tsx   — Landing page with mini quadrant
    QuizStep.tsx      — Single scenario + shuffled options + ruler progress
    QuadrantPlot.tsx  — SVG quadrant, animated dot (the signature element)
    StyleDistribution.tsx — 4 animated horizontal bars
    ResultsReport.tsx — Full results page, composes all components
    ShareCard.tsx     — Dark share card + copy-link button
  app/
    page.tsx          — State machine: intro → quiz → results
    layout.tsx        — Fonts (DM Sans + JetBrains Mono), metadata
    globals.css       — CSS custom properties, keyframe animations
```

## How the scoring works

Each scenario has a `readiness` tag (R1–R4) corresponding to the textbook-correct style:

| Readiness | Correct style | Meaning |
|-----------|--------------|---------|
| R1 | S1 Directing | Low skill — needs explicit structure |
| R2 | S2 Coaching | Developing — needs direction + dialogue |
| R3 | S3 Supporting | Has skill, lacks confidence |
| R4 | S4 Delegating | High skill + confidence — step back |

`computeScore()` tracks:
- Which styles the user chose (counts + percentages)
- Directive score (% of answers that were S1 or S2)
- Supportive score (% of answers that were S2 or S3)
- Situational accuracy (% of answers that matched the textbook-correct style for that scenario)

## Sharing

Results are encoded as `btoa(JSON.stringify(result))` and appended as `?r=` to the URL. Sharing a link loads the results directly, no backend required.

## Phase 2 checklist (post-weekend)
- [ ] Anonymous completion counter via Vercel KV (`/api/complete` route — no user data)
- [ ] PNG card download via `html-to-image` (`npm i html-to-image`, see comment in `ShareCard.tsx`)
- [ ] Dynamic OG image via `next/og` `ImageResponse`
- [ ] Second scoring layer (Transformational vs Transactional orientation)

## Customising the questions

Add scenarios to `src/lib/scenarios.ts`. Keep readiness levels balanced — aim for 4 per level. Pull from real situations where possible; personal authenticity is most of what makes this feel different from a generic quiz.

The options array per scenario must have exactly 4 items — one per style (S1–S4). They are shuffled at render time, so listing them in S1→S4 order in the data is fine.
