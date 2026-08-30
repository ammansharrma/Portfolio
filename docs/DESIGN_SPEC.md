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
| Display / heading | **Doto** (variable dot-matrix Google Font) | Hero name, section labels (`CASE STUDIES`, `WHERE I WORK`), case-study/company H1s, the `A` mark |
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

---

# Part 2 — v2: Monochrome Cinematic Redesign

Status: **design in progress — wireframes for review, not yet a build ticket.** Covers the pieces v1 never reached: Full Archive, Project Details, Skills, the Loader, and a real page-to-page transition system. Supersedes v1 only where explicitly noted below (the accent color, mainly) — v1's tokens, type faces, nav rail, and Home/About/Experience/Case-Studies structure all stand.

**Why this round:** v1 shipped the dotted-scheme shell (Hero, nav rail, Home sections) but three surfaces were left on the old visual system entirely — the Full Archive overlay (glassmorphism, gradient nebula blobs, `rgba(255,255,255,*)`), the Project Details page (ad hoc styling, a fragile JS wheel-hijack scroll pattern), and the Skills section (reskinned colors only, structure untouched). None of the three read as the same site as Hero. Separately: the interaction language itself — page transitions, the loader, how a project reveals itself — was judged too plain for the level being aimed for (reference points: dionpieters.dev's full WebGL scene, pratibhajoshi.com's restrained warmth, spencergabor.work's curated-shortlist-vs-full-wall split, connecttshivam.com's numbered-sections/live-status/status-tagged-lab pattern — the last of these validates several ideas already in Part 1, §6–§7). This part picks **Approach B — cinematic choreography inside the existing stack**: shared-element transitions, a real loader sequence, a pointer-reactive dot field, and a richer status vocabulary — no new rendering engine, no fight with the "one signature, everything else quiet" rule from §3. Approach C (a WebGL/canvas reset, dionpieters-style) was considered and set aside: it would change what this site *is*, not just how it looks, so it stays a separate future decision, not folded in here.

## 12. Theme: pure black and white

The one deliberate change to Part 1's token table: **`--signal` stops being a color and becomes an inversion mark.**

| Token | v1 value | v2 value | Why |
|---|---|---|---|
| `--ink` | `#0A0A0B` | *(unchanged)* | |
| `--paper` | `#F7F7F2` | *(unchanged)* | |
| `--meta` | `#8A8A85` | *(unchanged)* | secondary text stays a neutral gray — that's not "color," it's tone |
| `--signal` | `#E8B400` (ochre) | `var(--paper)` | the accent role — impact numbers, hover markers, focus rings, the live-seam cursor — is now carried by **maximum contrast**, not hue |

Because every place that needed an accent already reads `var(--signal)` rather than a hardcoded hex (Hero.css, NavRail.css, `section-shell.css`, About.css, Contact.css — everything built in the Part 1 migration), **this is a one-line token change**. Nothing that already shipped needs to be touched again. The mark now reads as a bright-white square/underline/cursor against ink — sharper, not muted, since it's no longer competing with a hue.

No light/dark toggle exists yet (§9's theme-invert idea is still open); when one ships, `--signal` inverts too: `var(--ink)` on a paper background.

**Where color is still allowed:** real project screenshots/video, per §9 — untouched by this rule. The site chrome goes monochrome; the work you shipped doesn't get filtered.

## 13. Typography: hyper-scale display type

Billboard-scale type is the other half of "the one signature move" — go big enough that the headline becomes a graphic element, not just large text. This is a live trend (maximalist/oversized type), not a permanent identity shift on its own — it pairs with, not replaces, the restrained-everywhere-else rule.

| Context | v1 | v2 |
|---|---|---|
| Hero name | `clamp(2rem, 6.4vw, 4.6rem)` | two-tier stack — see below |
| Details page project title | (no equivalent — was a modest `detail-title`) | `clamp(3rem, 9vw, 7rem)` |
| Section labels (`CASE STUDIES`, etc.) | `clamp(13px, 1.1vw, 15px)` | *(unchanged — the small-caps kicker stays small; the contrast between tiny label and huge headline is the point)* |

Only headline-tier text goes hyper-scale. Body copy, meta text, and section labels stay exactly where Part 1 put them — maximalist type next to maximalist type is just noise.

### Hero name — two-tier stack

The Hero name breaks across two lines, each its own size tier, instead of the single-size run in Part 1:

```
AAMAAN
SSANJAY SHARRMA
```

- Line 1, "AAMAAN" — `clamp(4rem, 16vw, 13rem)`. Tuned so a `vw`-based clamp reads as close to full-measure width for this fixed 6-letter word across common viewport sizes. Guaranteeing literal edge-to-edge fill at every width would need a JS text-fit measurement pass — a small future enhancement, not required for this to look right.
- Line 2, "SSANJAY SHARRMA" — `clamp(2rem, 8vw, 6rem)`, roughly half of Line 1's scale. Keeps the given name as the visual anchor, the full legal name still present (not dropped — consistent with the name-spelling fix already shipped) just de-emphasized.
- Both lines keep the per-character entrance animation already shipped in `Hero.jsx` (the open item in §20 about text-scramble vs. this entrance is unaffected — this is a line-break/sizing change only).

## 14. Named transitions & techniques

The specific, googleable mechanisms this design leans on — so you can see live examples before any of this gets built. All of these are achievable with `motion/react` (already a dependency) plus native browser APIs; **no new npm package required**.

| # | Name (search this) | What it is | Where it's used here |
|---|---|---|---|
| 1 | **Shared layout animation** (Motion calls this "layout animations" / `layoutId`; historically "FLIP transitions" or Framer's "Magic Motion") | An element on screen A and an element on screen B share an id; the library animates the one shape morphing between both positions/sizes instead of a hard cut | A Case Study row's identity glyph (see §16) morphs into the Details page's media frame; an Archive row does the same |
| 2 | **Pixel-grid dissolve / mosaic reveal** | A grid of squares fades in/out with staggered, slightly randomized per-tile delay instead of one uniform fade | Loader entrance; the curtain between route changes (replacing `PageTransition`'s current plain opacity+y fade) |
| 3 | **View Transitions API** | Native browser API (`document.startViewTransition`) that cross-fades/morphs the whole document between two DOM states | Progressive-enhancement layer under route changes — browsers that support it get an extra-smooth native cross-fade for free; falls back cleanly to Motion's `AnimatePresence` where unsupported |
| 4 | **Pointer-reactive dot grid** | A grid of dots/squares whose size or opacity responds to cursor proximity (`useMotionValue` + `useTransform` tracking `mousemove`, or a lightweight canvas) | Replaces Hero's static `radial-gradient` dot background (`Hero.css:17`) and the Loader background with a version that's alive |
| 5 | **Magnetic cursor / magnetic buttons** | An interactive element pulls slightly toward the cursor as it approaches, snapping back on leave | Nav rail dots (extends the existing hover-spring in `NavRail.jsx`), Case Study/Archive rows, Hero CTA links |
| 6 | **Text scramble reveal** | Characters cycle through random glyphs before settling on the real text, on scroll-into-view or on load | Section labels and hyper-scale headlines — a louder alternative to the current fade+scale-per-character in `Hero.jsx` |
| 7 | **SVG turbulence / grain overlay** | A subtle animated noise texture (`feTurbulence` SVG filter) over flat color, so pure black/white doesn't read as sterile | Global, very low opacity, applied once at the app-shell level |
| 8 | **Scroll-linked animation** (Motion's own term; sometimes "scrollytelling") | Animation progress is driven by scroll position via `useScroll`/`useTransform`, not by a scroll event listener | Already planned in Part 1 §10 for the nav-dot fill; extended here to the hyper-scale headline "assembling" as it scrolls into view |
| 9 | **Scroll-scrubbed pixel-resolve text** — a combination of #2 and #8, seen live at pamidordesign.com (its homepage intro paragraph fades word-by-word from gray to black as you scroll past it) | Each word/line's *resolution* (not just opacity) is a direct function of scroll position — starts as scattered/blurred pixel-noise, resolves crisp as it crosses a scroll threshold. Reserved for **paragraph-length copy**; #6 (text scramble) stays reserved for short headline-tier text so the two don't compete on the same content | About's body paragraphs (`About.jsx`, already-shipped content — this only changes the *entrance*, not the text); Project Details' body sections |

Not chosen, and why: GSAP's `SplitText` (paid plugin — Motion can do manual per-character spans, which `Hero.jsx` already does, for free) and a full WebGL/canvas layer (that's Approach C, set aside above).

**Reference added:** [pamidordesign.com](https://pamidordesign.com) (an actual awwwards-recognized site — linked from its own footer) — its scroll-scrubbed intro paragraph is technique #9 above; its Figcoms case study (`pamidordesign.com/figcoms`) validates and extends the Details-page layout in §18 below.

## 15. Loader — redesign

```
┌───────────────────────────────────────────────────────────┐
│                                                             │
│         · · · · · · · · · · · · · · · · · · · ·           │
│         · · · · · · · · · · · · · · · · · · · ·           │ ← pointer-reactive
│         · · · ·   ▪▪▪▪▪▪   · · · · · · · · · · ·           │   dot grid (#14.4),
│         · · · ·  ▪▪   ▪▪   · · · · · · · · · · ·           │   dots near the "A"
│         · · · · · · · · · · · · · · · · · · · ·           │   mark assemble INTO
│         · · · · · · · · · · · · · · · · · · · ·           │   it (pixel dissolve,
│                                                             │   #14.2), rest stay
│                                                             │   loose and drift
│     › agent: bedrock-agentcore · region: us-east-1 ▮       │ ← live-seam line
│                                                             │   starts here, not
│                                                             │   just on Home (§6)
│                                                    skip ▮  │
└───────────────────────────────────────────────────────────┘
```

Sequence: dot grid fades in (uniform) → the dots inside the "A" mark's silhouette snap into filled squares via staggered mosaic-dissolve (#14.2) while the rest keep a slow idle drift (#14.4-style, low amplitude) → live-seam line types its first fact → whole loader dissolves (same mosaic technique, reversed) into Hero. Total budget: keep it under ~1.4s before skip is viable (v1's 900ms floor stays as the *minimum*; this can run a bit longer since it's now doing real work, not just a delay). `prefers-reduced-motion` and the existing `sessionStorage` "seen" skip (`Loader.jsx:4-13`) both still apply — reduced motion gets the dots appearing at final state immediately, no drift, no dissolve.

## 16. Case Studies → Details: the shared-transition storyline

Today's Case Studies rows (Part 1, Task 4) are pure text — no image — which is deliberate per the Home wireframe in §5, but it leaves nothing for a shared-layout transition to morph *from*. Rather than reintroduce photography into the list (contradicts §5's plain-list intent), each row gets a small **identity glyph**: a unique, procedurally simple monochrome dot/square pattern per project (not a screenshot — a generated mark, cheap to produce, reinforces the dot motif, gives each case study a visual signature before you ever click in).

```
Frame 1 — Home, hovering a row              Frame 2 — mid-navigation            Frame 3 — Details, landed
┌────┬──────────────────────────┐          ┌──────────────────────────┐        ┌────┬──────────────────────┐
│ 00 │ CASE STUDIES              │          │                          │        │ 00 │ ← Case studies        │
│ ○  │ ▫▫▪ Order Notes Agent  ▮  │  ──────▶ │      ▪▪▪▪▪▪▪▪▪▪▪▪        │  ────▶ │ ▪▪ │                        │
│    │      A production...      │          │      ▪▪▪▪▪▪▪▪▪▪▪▪        │        │    │  ORDER NOTES AGENT    │
│ 01 │ CSR Copilot                │          │      ▪▪▪▪▪▪▪▪▪▪▪▪        │        │    │  (hyper-scale, §13)   │
│    │ ...                        │          │        ↑ glyph scales    │        │    │  [glyph → real media  │
└────┴──────────────────────────┘          │   & moves toward media   │        │    │   crossfade here]     │
      ▫▫▪ = this row's identity glyph       │   frame position (#14.1) │        └────┴──────────────────────┘
```

Frame 2 is the shared-layout animation (#14.1): the glyph is the single `layoutId`-tagged element, animating position/scale from its 24–32px row slot to the Details page's full media-frame size in one continuous motion — the title text cross-fades independently (not shared-layout; text reflow across wildly different font sizes doesn't FLIP cleanly) using the text-scramble technique (#14.6) timed to land as the glyph arrives. Once settled, the real screenshot/video (where one exists) crossfades over the glyph. Projects with no media yet (the `public/Mockups/` gap from §11) simply keep the glyph as the permanent media-frame content — it was designed to hold that role, not just to transition through it.

## 17. Full Archive — redesign

Recommendation: **retire the bottom-sheet modal, make it a real route (`/archive`).** A popup-over-a-popup (Archive is currently a modal you open from a section that's itself mid-page) fights the "smooth, cinematic" goal — modals interrupt; routes can transition. `ArchiveOverlay`'s open/close logic (`Projects.jsx:9,39-42`) becomes a `navigate('/archive')` call using the same shared-layout technique as §16 when launched from a Case Study row's "View full project archive" link.

```
┌────┬───────────────────────────────────────────────────────────┐
│ 00 │  ← Home                                    (Departure Mono)│
│ ○  │                                                             │
│    │  FULL ARCHIVE                    (hyper-scale-adjacent —    │
│    │                                    smaller than Hero, still │
│    │                                    much bigger than v1's    │
│    │                                    32px .archive-title)     │
│    ├─────────────────────────────────────────────────────────── │
│    │  FEATURED SYSTEMS                        (section-label)   │
│    │  ▫▫▪ VidhaanAI              active development ▮           │
│    │  ▫▪▫ Personal Portfolio v1                                 │
│    │  ─────────────────────────────────────────────────────    │
│    │  CORE EXPLORATION                                           │
│    │  ▪▫▫ Stock Predictor                                        │
│    │  ─────────────────────────────────────────────────────    │
│    │  FRONTEND ENGINEERING                                       │
│    │  ▫▪▪ Ideation            ▪▫▪ Ratna                          │
│    │                                                             │
│    │  hover a row → its glyph enlarges into a filmstrip preview  │
│    │  in a fixed right-hand rail (pointer-reactive, #14.4-style) │
└────┴───────────────────────────────────────────────────────────┘
```

Every category becomes an `.index-list` (Part 1's shared primitive, `section-shell.css`) instead of the current `.archive-grid` card wall — this alone unifies Archive with Case Studies/Experience/Contact for free. The nebula gradient blobs, backdrop blur, and `rgba(255,255,255,*)` glassmorphism (`ArchiveOverlay.css:24-78`) are retired entirely under the black-and-white rule. The one new piece of chrome: a right-hand preview rail that enlarges the hovered row's identity glyph — cheap, monochrome, and it's what makes a text-only index feel alive instead of bare.

## 18. Project Details — redesign

Two changes, one visual (unify with the rest of the site) and one structural (remove a fragile pattern):

**Visual:** `.detail-section`/`.detail-stack-tag`/`.detail-link-btn` (`ProjectDetail.css`, unseen by Part 1 entirely) get rebuilt on Part 1's shared language — `section-label` for "Problem"/"Solution"/"Architecture"/etc., `.chip`-style tags for the stack list (this is the one place the chip-row primitive that got deliberately *left out* of `section-shell.css` in Part 1, Task 2, actually earns its keep — add it back here, scoped to this page). Title goes hyper-scale per §13.

**Structural:** `ProjectDetail.jsx:19-46` locks `html`/`body` overflow and manually redirects `wheel` events to the right panel with `preventDefault()` — a brittle scroll-jack that breaks trackpad momentum and any browser's native scroll-restoration. Replace with plain CSS: the left media panel gets `position: sticky; top: 0; height: 100vh`, the right panel is a normal in-flow column. Two-column sticky-vs-flow is the standard pattern for this exact layout and needs zero JS — confirmed live at `pamidordesign.com/figcoms`, which uses the same shape (its case-study info column pinned, media scrolling — mirrored left/right from the wireframe below, functionally identical).

**New from the Pamidor reference — floating annotated callouts over the media:** Figcoms' mockup panel carries small floating badges ("In Review", "Designer", "Working") layered over the screenshot itself, turning a flat image into a little annotated scene. Pixelated/monochrome translation: square-bracket mono tags (`[ role: designer ]`, `[ status: in review ]`) in Departure Mono, `--paper` on a translucent `--ink` chip, connected to their point of interest on the screenshot by a thin hairline leader — no color-coding, the bracket + a filled `▪`/hollow `○` (matching §3's motif) carries the same distinction Pamidor's color pills do. Each tag drifts very slightly with the pointer-reactive technique (#14.4) rather than sitting static.

```
┌──┬──────────────────────┬───────────────────────────────────┐
│× │  ▪ [ status: prod ]  │  ORDER NOTES AGENT   (hyper-scale) │
│  │   ⌐ leader to        │  Mindstix · Amway · 2025           │
│  │   [media frame,      │ ──────────────────────────────────│
│  │    sticky, glyph→    │  TECH STACK                        │
│  │    real media per    │  [AWS Bedrock][AgentCore][SSE]     │
│  │    §16]              │ ──────────────────────────────────│
│  │        ○ [ role:     │  PROBLEM                           │
│  │          reviewer ]  │  Order notes were reviewed by...   │
│  │                      │  (scroll-scrubbed pixel-resolve,   │
│  │   toggle: Video /    │   technique #9 — entrance only)    │
│  │   Mockups            │ ──────────────────────────────────│
│  │                      │  SOLUTION / ARCHITECTURE / ...     │
│  │                      │  (right column scrolls natively,   │
│  │                      │   no wheel-event interception)     │
└──┴──────────────────────┴───────────────────────────────────┘
```

## 19. Skills — redesign

Part 1 reskinned colors only and left the badge-grid-with-hover-marquee structure untouched (a deliberate, scoped decision at the time). This round folds it into the same `.index-list` family as Experience/Case Studies, trading the static 2×2 card grid for a filterable index:

```
┌────┬───────────────────────────────────────────────────────────┐
│ 04 │  SKILLS                                                    │
│ ○  │  ─────────────────────────────────────────────────────    │
│    │  Frontend          ← index-row, click to expand            │
│    │  Backend                                                   │
│    │  UI / UX                                                   │
│    │  Tools & Workflow                                          │
│    │                                                             │
│    │  [selected category expands below, glyph-grid of badges,   │
│    │   each badge magnetic on hover (#14.5), stagger-in on      │
│    │   expand rather than the current always-scrolling marquee] │
└────┴───────────────────────────────────────────────────────────┘
```

The always-running horizontal marquee (`SkillsMinimal.css`'s `.skill-motion-track`/`.global-tech-track`, `scrollLeft`/`scrollRight` keyframes) is a v1-era pattern that reads busier than confident — replacing continuous motion with an intentional stagger-on-expand is more in keeping with "one signature move, everything else quiet" (§3) than four cards animating at once, always.

## 20. Decisions — resolved

Ready for planning. Each call below is a judgment call made to unblock implementation, not a locked-in irreversible choice — catch anything wrong during plan review.

- **Archive: a route, not a modal** (§17). `App.jsx` gets one new `/archive` route and a top-level page component; `ArchiveOverlay.jsx`'s open/close modal logic is retired.
- **Identity glyphs, generation method** (§16): a small deterministic algorithm seeded by `project.id` — hash the id string to a number, use it to fill a 5×5 grid of cells (each cell filled/hollow based on one bit of the hash). No image assets, no new dependency, same glyph every render for a given project, trivial to implement as a plain component (`<IdentityGlyph projectId="..." />`) rendering a CSS grid of `<span>`s — not SVG, to stay consistent with how the rest of the dot motif is already built (plain elements + CSS, e.g. `NavRail`'s `rail-mark`).
- **View Transitions API**: ship it as the progressive enhancement it already was speced to be — no further decision needed.
- **Text scramble vs. Hero's shipped entrance**: resolved by §13's two-tier stack — Hero keeps its shipped per-character entrance untouched; text-scramble (#14.6) is reserved for Details' title and other headline-tier text that doesn't already have an approved entrance.
- **Floating annotation callouts, scope** (§18): per-project opt-in, not a blanket rule. New optional `annotations` array on a project's `projects.json` entry. **Correction:** the real case studies displayed today (`vidhaan-ai`, `stock-predictor`, `portfolio-template`) aren't team-built products with genuine role/status content the way the Pamidor reference case study was — none currently qualify. This ships as a dormant capability (the code renders `annotations` if present) with zero projects populating it, rather than inventing fake annotation text. Populate it later if a case study is added that actually has that kind of content.
- **Media panel side** (§18): keep media-left/content-right, matching the existing `ProjectDetail.jsx` structure — lowest-risk, no layout flip needed.
- **This section (Part 2) is design only** — same rule as Part 1: nothing here gets implemented until it's turned into a plan (via the writing-plans skill) and that plan is approved.

## 21. Implementation phasing

Part 2 is too large for one plan — six largely independent pieces, similar to how Part 1 was one plan because its pieces shared a stylesheet; these don't share nearly as much. Proposed order, each phase shippable and reviewable on its own:

| Phase | Scope | Depends on |
|---|---|---|
| 1 — Foundation | `--signal` token → `var(--paper)`; Hero two-tier name stack (§13) | nothing — do this first, everything else visually sits on top of it |
| 2 — Loader | Pixel-dissolve mosaic loader, pointer-reactive dot grid (§15) | Phase 1 (monochrome signal) |
| 3 — Shared transition system | `IdentityGlyph` component, `layoutId` wiring Case Studies → Details, Details page restructure (sticky media, no wheel-hijack, floating annotations, chip-row), text-scramble + scroll-scrubbed pixel-resolve text (§16, §18) | Phase 1 |
| 4 — Full Archive | `/archive` route, index-list layout, preview rail, retire `ArchiveOverlay` modal (§17) | Phase 3 (reuses `IdentityGlyph`) |
| 5 — Skills | Filterable category index replacing badge grid + marquee (§19) | Phase 1 |
| 6 — Global polish | Page-transition curtain (pixel-grid dissolve replacing `PageTransition`'s fade), View Transitions API layer, magnetic cursor/buttons site-wide, SVG grain overlay (§14 remainder) | Phases 1–5 (touches every route) |

Note the logo mark ("A", not "AS") is already done directly in code (`NavRail.jsx`, `Loader.jsx`) — no phase needed for it.

**Status: all 6 phases implemented and reviewed (2026-08-30).** Two items from Phase 6's original scope were deferred during implementation, not silently dropped:

- **Full page-transition curtain (pixel-grid dissolve replacing `PageTransition`'s fade)** — not built as a full opaque wipe. Phase 3's Home→Details `IdentityGlyph` morph needs the page content visible and animating *throughout* the route transition; a full-coverage curtain would hide exactly the moment that transition needs to be seen. Shipped instead: a brief, low-opacity (max 15%) mosaic flicker that adds texture without ever obscuring the page underneath (`TransitionFlicker` in `App.jsx`).
- **View Transitions API layer** — not added. It would run a second, independent animation system (the browser's own DOM-snapshot crossfade) alongside Motion's `AnimatePresence`/`layoutId` machinery from Phase 3, and the two would very likely double-animate the same DOM change. Coordinating them correctly is a real, separate design/engineering task, not a polish-phase bullet point. Revisit as its own decision if wanted later — it is not a blocker for anything currently shipped.
