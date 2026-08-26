# Design Spec — Dotted Scheme

Status: **approved plan, not yet implemented**. This documents the agreed direction for the visual/interaction redesign. No code should change based on this file until it's explicitly turned into build tickets.

## 0. Why this direction

Reference research (Russell Numo, Kento Kawazoe, and broader dot-matrix/blueprint developer-portfolio precedent) plus a full audit of the current codebase led here. Two prior findings that shaped this:

- The current live `Home.jsx` + `site.css` system (dark, warm-parchment text, one reserved accent) is already closer to "restrained editorial" than to anything generic — this redesign evolves it, it doesn't start over.
- The old `Hero.jsx` / `Hero.css` (typing-monitor GIFs, scramble-text joke, floating bubble, scroll-driven blur/parallax) is dead code — not routed in `App.jsx` — and contradicts every principle below. **Retire it.**
- No photo exists anywhere on the site, and 3 of 5 featured case studies are NDA'd enterprise agent work with no visual assets. The signature move has to be typographic/systemic, not photo- or screenshot-based.
- `projects.json` references media (`Mockups/vidhaanai/1-4.png`, `Mockups/Stock Predictor/StockPredictor.mp4`, etc.) that isn't actually present in `public/Mockups/` yet (only the résumé PDF is there). Flagged as an open asset gap, not a design decision.

## 1. Design tokens

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0A0A0B` | background, dark state |
| `--paper` | `#F7F7F2` | background, light state |
| `--meta` | `#8A8A85` | secondary text, kickers, dates (constant across both states) |
| `--signal` | `#E8B400` | the one accent — ochre/mustard yellow. Constant across both theme states. Reserved for: impact numbers, in-progress markers, index-row hover marker, focus ring, chip-hover border |

Theme invert ("black becomes white and white becomes black") is implemented by swapping `--ink`/`--paper` via a `data-theme` attribute on `<html>`, **not** a `filter: invert()` on the page — a literal pixel-invert would also invert real project screenshots into ugly negatives. `--signal` and all media (images/video) are explicitly excluded from the swap transition.

## 2. Typography

| Role | Face | Used for |
|---|---|---|
| Display / heading | **Doto** (variable dot-matrix Google Font) | Hero name, section labels (`CASE STUDIES`, `WHERE I WORK`), case-study/company H1s, the `AS` mark |
| Body | **Poppins** (unchanged, already loaded locally) | Paragraph copy everywhere |
| Meta / mono | **Departure Mono** | Kickers, dates, stack chips, nav coordinate labels, the live-seam status line, in-progress status |

`Stage Wanders` (the script signature face) is **retired** — a handwritten script contradicts a dot-grid/mathematical identity. The `AS` mark moves to Doto at small scale so there's one type language site-wide instead of two.

## 3. Where the dot/mathematical motif appears — and where it deliberately doesn't

**Shows up:**
- Navigation — the dots *are* the nav (see §4), not decoration bolted onto one
- Hero name dot-grid assemble on first load
- The live-seam status line + in-progress status (blinking block cursor `▮`)
- Hover states — a small square marker that **snaps** (spring physics) rather than smoothly follows

**Does not show up:**
- Section dividers stay plain hairlines (a dotted rule on every divider turns the motif into wallpaper)
- Body copy stays plain, unornamented Poppins

Rationale: spend the motif on interaction and structure, not on decorating everything — same "one signature, everything else quiet" principle both reference sites followed.

## 4. Navigation — the "plotter rail"

Replaces the current top navbar (`SiteNav.jsx`) entirely. A vertical rail of coordinate-labeled dots, fixed to the left edge, full viewport height, hairline border on the right edge.

- `▪` (filled square) = current route/section. `○` (hollow dot) = others.
- Four coordinates: `00` Home, `01` Work, `02` Experience, `03` About.
- On Home specifically, `01`/`02` are anchor sections (`/#work`, `/#experience`) on the same page, so they fill via **scroll position** (scroll-linked, not route-linked) — hollow→filled as each section crosses ~30% into view. `00` stays filled throughout; `03` stays hollow until you actually navigate to `/about`.
- Mobile (< 720px): rail collapses to a 2×2 dot glyph fixed bottom-right — doubles as the menu icon (no generic hamburger). Tapping it morphs the glyph into the full vertical list via a shared-layout animation.

### Navigation animation table

| Moment | Behavior | Motion primitive |
|---|---|---|
| Idle | Hollow dots (6px, `--meta` stroke) for inactive routes; current route is a filled square | static CSS |
| Hover a dot | Snaps to 1.4× scale via spring (stiffness ~400, damping ~25 — fast, slight overshoot, "plotter pen landing"); coordinate label crossfades to the route name in Departure Mono | `whileHover` + spring |
| Press/click | Scale-down to 0.85 on press, release triggers route change | `whileTap` |
| Route change | Previous filled square un-fills (150ms), new one fills 150ms later — sequential, not simultaneous | `animate` + stagger delay |
| Scroll-linked fill (Home only) | Work/Experience dots interpolate hollow→filled driven by scroll offset, not a scroll event listener | `scroll()` / `useScroll` + `useTransform` |
| Mobile glyph tap | 2×2 grid morphs into the full vertical list; each square animates into its list position individually | shared `layout` animation |
| Reduced motion | All of the above collapse to instant state changes, no spring/stagger/morph | `useReducedMotion()` gate |

Every dot is a real link/button with an `aria-label` (e.g. "02, Experience") — no accessibility regression from dropping a text navbar.

## 5. Wireframes

### Home — desktop

```
┌────┬───────────────────────────────────────────────────────────┐
│ 00 │                                                             │
│ ▪▪ │   AAMAAN SSANJAY SHARRMA        ← Doto, ~96px, dot-reveal   │
│    │   Pune                          ← Departure Mono, 13px     │
│ 01 │                                                             │
│ ○  │   Full-stack developer and agentic AI engineer. I build    │
│    │   systems where agents, APIs, and interfaces have to       │
│    │   behave as one product — not a model taped onto a UI.     │
│ 02 │                                                             │
│ ○  │   › agent: bedrock-agentcore · region: us-east-1 · 340ms ▮  │
│    │     (Departure Mono, cycles every ~4s, typewriter)          │
│ 03 │                                                             │
│ ○  │   Email    About                                            │
│    ├─────────────────────────────────────────────────────────── │
│    │   CASE STUDIES                        (Doto, small, caps)  │
│    │   ─────────────────────────────────────────────────────    │
│    │   Order Notes Agent          A production Bedrock agent…   │
│    │   CSR Copilot                In-call suggestions and…      │
│    │   Root Cause Analysis        Multi-agent RCA from logs…    │
│    │   VidhaanAI          active development · last commit 3d ago ▮│
│    │   Stock Predictor            Bidirectional LSTM with…      │
│    ├─────────────────────────────────────────────────────────── │
│    │   WHERE I WORK                                              │
│    │   ─────────────────────────────────────────────────────    │
│    │   Mindstix           Software Developer     Jun 2025 — now │
│    │   OmneVu             Intern                 Dec 2024 — Jun25│
└────┴───────────────────────────────────────────────────────────┘
```

### Work / case-study detail

```
┌────┬───────────────────────────────────────────────────────────┐
│ 00 │  ← Case studies                    (Departure Mono, 13)   │
│ ○  │                                                             │
│ 01 │  Mindstix · Amway · 2025           (Departure Mono)         │
│ ▪▪ │  ORDER NOTES AGENT                 (Doto, ~40px)            │
│    │  A production Bedrock agent that reads Amway order notes.  │
│ 02 │                                                             │
│ ○  │  [ MediaBlock — only rendered if work.video/stills exist ] │
│ 03 │                                                             │
│ ○  │  CONTEXT                                                    │
│    │  Order notes were reviewed by hand. An early agent path…   │
│    │                                                             │
│    │  APPROACH                                                   │
│    │  · contribution 1  · contribution 2  · …                   │
│    │                                                             │
│    │  OUTCOME                                                    │
│    │  · impact 1 (numbers in --signal ochre, tabular-nums)       │
│    │                                                             │
│    │  SYSTEM                                                     │
│    │  · AWS Bedrock AgentCore in two production regions          │
│    │                                                             │
│    │  NOTES                                                      │
│    │  "Production agents fail on timeouts and auth before…"     │
│    │                                                             │
│    │  [AWS Bedrock] [AgentCore] [SSE] [Keycloak] [Jenkins]       │
│    │   ← chip-row, Departure Mono, hairline border, no fill      │
└────┴───────────────────────────────────────────────────────────┘
```

### Experience — company page

```
┌────┬───────────────────────────────────────────────────────────┐
│ 00 │  ← Home                                                    │
│ ○  │                                                             │
│ 01 │  MINDSTIX                          (Doto, ~40px)            │
│ ○  │  Software Developer · Jun 2025 — now (Departure Mono)       │
│ 02 │  {job.summary}                                              │
│ ▪▪ │                                                             │
│ 03 │  {overview paragraphs — Poppins body}                       │
│ ○  │                                                             │
│    │  CASE STUDIES                                                │
│    │  Order Notes Agent          A production Bedrock agent…    │
│    │  CSR Copilot                In-call suggestions and…       │
│    │  Root Cause Analysis        Multi-agent RCA from logs…     │
└────┴───────────────────────────────────────────────────────────┘
```

### About

```
┌────┬───────────────────────────────────────────────────────────┐
│ 00 │  ← Home                                                    │
│ ○  │                                                             │
│ 01 │  AAMAAN SSANJAY SHARRMA            (Doto, ~48px)            │
│ ○  │                                                             │
│ 02 │  I am a full-stack developer and agentic AI engineer in    │
│ ○  │  Pune. The work I care about is the seam… (Poppins, 4 ¶)    │
│ 03 │                                                             │
│ ▪▪ │  Email   Resume   GitHub   LinkedIn   (Departure Mono)      │
└────┴───────────────────────────────────────────────────────────┘
```

### Mobile (< 720px) — rail collapse

```
Collapsed (default)              Expanded (tap the glyph)
┌─────────────────┐              ┌─────────────────┐
│                  │              │  ▪ 00  Home      │
│  page content    │              │  ○ 01  Work      │
│  full width      │      →       │  ○ 02  Experience│
│                  │              │  ○ 03  About     │
│           ┌──┐   │              │                  │
│           │▪○│   │              │  (tap outside or │
│           │○○│   │              │   Esc to close)  │
│           └──┘   │              │                  │
└─────────────────┘              └─────────────────┘
 fixed bottom-right,                full-width sheet
 2×2 dot glyph = both               slides up from the
 the icon AND live nav              glyph's position
 state preview (current
 route's dot always visible
 in top-left of the 2×2)
```

## 6. The signature move — live-seam status line

Monospace line beneath the hero copy, typewriter-cycling through short, real, project-true system facts:

```
› agent: bedrock-agentcore · region: us-east-1 · latency: 340ms ▮
```
cycling to:
```
› hallucination rate: 40% → 26% · benchmark: 50-query enterprise set ▮
```

Types at ~18ms/char, holds 3s, backspaces, cycles. The `▮` cursor blinks continuously via CSS `steps()`, independent of typing state — that persistent blink is the "alive" signal, and it's reused (not duplicated) for the in-progress indicator below.

## 7. "In progress" status (no spinner, no circle, no badge)

Reuses the live-seam component with one fact, for `VidhaanAI`:

```
active development · last commit 3d ago ▮
```

No percentage, no progress bar, no spinner — deliberately, because a fake completion percentage would be dishonest. The blinking cursor is the entire "still going" signal.

## 8. Microinteractions inventory

1. **Hero name dot-grid assemble** — once, on first load only. Doto glyphs fade+scale in per-character (~0.08s stagger, ~600ms total). Skipped if the loader was already dismissed this session (reuses the existing `sessionStorage` "seen" pattern in `Loader.jsx`) or if reduced-motion is set.
2. **Live-seam status line** — see §6.
3. **In-progress status** — see §7.
4. **Index-row hover** (case studies / experience lists) — background tints to a slightly offset surface color, the title's underline draws in from the left (already exists), and a small 4px filled square fades in at the row's left edge in `--signal` — echoing the nav rail's own filled-square language.
5. **Theme toggle** — `data-theme` swap; `--ink`/`--paper` crossfade over 200ms (`background-color`/`color` transition, not a snap). `--signal` and all media are explicitly excluded from the transition.
6. **Page transitions** — outgoing page fades + shifts 8px on Y over 120ms; incoming fades + shifts in from -8px over 150ms, via `AnimatePresence mode="wait"` — a tight crossfade pair instead of the current enter-only `fade-in` keyframe.
7. **Chip-row / work-links** — chips get a 1px `--signal` border-color sweep on hover (color only, no layout shift); work links underline-reveal identically to index rows.
8. **Focus-visible** — keyboard focus ring becomes a filled square outline in `--signal`, offset 2px, replacing the generic outline — ties the "square = position marker" language into accessibility state too.

## 9. Mockups — keep color or convert to grayscale?

**Decision: keep real color.** Site chrome (nav, type, structure) stays strictly monochrome + ochre; the actual project screenshots/video are allowed to show their real colors. Precedent: portfolios that let project imagery "take center stage" while the shell stays black-and-white read stronger than everything-grayscale, and a grayscale filter on a colorful dashboard screenshot loses real information (chart color-coding, real UI palette). If a unifying touch is wanted later, apply a monochrome treatment to the *frame* the mockup sits in, not the mockup itself.

## 10. Performance / React practice constraints

- **Motion** (motion.dev, formerly Framer Motion) is the animation library — hybrid JS + hardware-accelerated engine, real spring physics, native gestures, ~90% smaller than the GSAP equivalent for comparable APIs.
- Lazy-imported only on routes that need it — additive to the existing `React.lazy` route-splitting in `App.jsx`, not a rewrite.
- Every animation targets `transform`/`opacity` only (GPU-cheap) — never `width`/`top`/`left` directly.
- `useReducedMotion()` gates all JS-driven motion, mirroring the existing global `prefers-reduced-motion` CSS block in `index.css` — one philosophy enforced in both CSS and JS.
- Scroll-linked effects (nav-dot fill, hero fade) use Motion's `scroll()` (built on native `ScrollTimeline`) instead of a `scroll` event listener — a real upgrade over the pattern the now-retired `Hero.jsx` used.
- Validate with **MotionScore** (free audit, score.motion.dev, S–F grade) once built, before calling it done.

## 11. Open items / not yet decided

- Exact `public/Mockups/` asset gap (§0) — VidhaanAI and Stock Predictor reference image/video files that aren't in the repo yet. Needs real files or an explicit "stay text-only" call before those case studies render media.
- Whether the "frame monochrome / content color" treatment from §9 gets built now or deferred.
- This entire spec is **plan only** — nothing here should be implemented until explicitly turned into a build ticket.
