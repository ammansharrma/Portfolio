# v2 Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Commit policy override:** this round stays fully uncommitted until the project owner explicitly says to commit. Implementers do **not** run `git commit` or `git add` — make the file edits and stop there. Task review diffs are generated with `git diff HEAD -- <task's files>` (HEAD does not move during this phase), not commit ranges.

**Goal:** Lay the two foundational pieces every other v2 phase visually sits on top of — the monochrome `--signal` token, and the Hero name's two-tier size stack.

**Architecture:** Two small, independent, disjoint-file changes. Task 1 touches only `src/index.css` (one token value). Task 2 touches only `src/pages/Hero/Hero.jsx` and `src/pages/Hero/Hero.css` (splits the existing single-line character animation into two visually distinct lines without changing its timing logic).

**Tech Stack:** Plain CSS custom properties, React 18, `motion/react` (already a dependency, no new usage patterns). No automated test suite exists in this repo — verification is manual: `npm run build` plus visual confirmation via `npm run dev` in a browser.

**Spec:** [docs/DESIGN_SPEC.md](../../DESIGN_SPEC.md) — §12 (monochrome theme), §13 (hyper-scale type / two-tier Hero stack), §21 (phase 1 scope).

## Global Constraints

- `--signal`'s new value is `var(--paper)` — a CSS custom property reference, not a new hardcoded color. Every file that already reads `var(--signal)` (Hero.css, NavRail.css, `section-shell.css`, About.css, Contact.css) needs zero further changes — this is the entire point of the token-based approach in §12.
- The Hero name's per-character entrance animation (delay, easing, opacity/scale values) must not change — only how the characters are grouped into visual lines and their font sizes. Confirmed in the spec (§13: "Both lines keep the per-character entrance animation already shipped").
- `NAME`'s `aria-label` must still announce the complete name as one string ("AAMAAN SSANJAY SHARRMA") — screen readers should hear the full name, the two-line visual split is a sighted-only affordance.
- Do not touch `Hero.jsx`'s typewriter/`FACTS` logic, `hero-live` markup, or `hero-cta` — out of scope for this task.

---

### Task 1: Monochrome signal token

**Files:**
- Modify: `src/index.css:99`

**Interfaces:** None — a single CSS custom property value change. Every consumer already reads `var(--signal)`.

- [ ] **Step 1: Change the token value**

In `src/index.css`, change line 99:

```css
  --signal: #e8b400;
```

to:

```css
  --signal: var(--paper);
```

- [ ] **Step 2: Verify**

Run `npm run build` — confirm it succeeds. Run `npm run dev`, open the site, and confirm every previously-ochre element now reads pure white-on-black: the Hero live-seam prefix/cursor (`hero-live-prefix`/`hero-live-cursor`), the Hero CTA link underline-on-hover, the nav rail's index-row hover markers and chip-hover borders, the focus-visible outline (`index.css`'s `:focus-visible` rule). No element should still show any ochre/yellow.

---

### Task 2: Hero name — two-tier stack

**Files:**
- Modify: `src/pages/Hero/Hero.jsx`
- Modify: `src/pages/Hero/Hero.css`

**Interfaces:** None — self-contained within `Hero`. No other file imports pieces of `Hero.jsx`/`Hero.css` beyond the default `Hero` export already used by `App.jsx`.

- [ ] **Step 1: Restructure the name rendering in Hero.jsx**

The current code (`Hero.jsx:64-89`) is:

```jsx
function Hero() {
  const reduceMotion = useReducedMotion();
  const liveText = useTypewriter(FACTS, reduceMotion);
  const nameChars = NAME.split('');

  return (
    <div className="hero-page" id="hero">
      <div className="hero-bg-layer" />

      <div className="hero-content">
        <p className="hero-kicker font-mono">Pune, India</p>

        <h1 className="hero-name" aria-label={NAME}>
          {nameChars.map((char, i) => (
            <motion.span
              key={i}
              className="hero-name-char"
              aria-hidden="true"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.035, ease: [0.4, 0, 0.2, 1] }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </h1>
```

`NAME` is `'AAMAAN SSANJAY SHARRMA'`. Its character indices 0–5 are `AAMAAN`; index 6 is the space; indices 7–21 are `SSANJAY SHARRMA`. Replace the `<h1>` block with a version that renders the exact same characters, at the exact same per-character delay (`i * 0.035`, `i` being the original full-string index — do not reset `i` to 0 for the second line, or the stagger will visibly jump), split into two lines by slicing `nameChars` at index 6:

```jsx
        <h1 className="hero-name" aria-label={NAME}>
          <span className="hero-name-line hero-name-line-1" aria-hidden="true">
            {nameChars.slice(0, 6).map((char, i) => (
              <motion.span
                key={i}
                className="hero-name-char"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.035, ease: [0.4, 0, 0.2, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="hero-name-line hero-name-line-2" aria-hidden="true">
            {nameChars.slice(6).map((char, i) => {
              const fullIndex = i + 6;
              return (
                <motion.span
                  key={fullIndex}
                  className="hero-name-char"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: reduceMotion ? 0 : fullIndex * 0.035, ease: [0.4, 0, 0.2, 1] }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </span>
        </h1>
```

Note what changed and what didn't: `aria-label={NAME}` stays on the outer `<h1>` (screen readers still get "AAMAAN SSANJAY SHARRMA" as one string); `aria-hidden="true"` moves from each individual character span to the two line-wrapping spans (equivalent coverage, fewer redundant attributes); the delay formula (`i * 0.035` / `fullIndex * 0.035`) and all other motion props are byte-identical to before, just fed a slice of the same array instead of the whole thing. The rest of `Hero.jsx` (the typewriter hook, `FACTS`, `hero-line`, `hero-live`, `hero-cta`) is untouched.

- [ ] **Step 2: Update Hero.css sizing**

In `src/pages/Hero/Hero.css`, change the `.hero-name` rule (lines 39–47):

```css
.hero-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 6.4vw, 4.6rem);
  line-height: 1.05;
  letter-spacing: 0.01em;
  color: var(--paper);
  margin: 4px 0 6px;
}
```

to:

```css
.hero-name {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.01em;
  color: var(--paper);
  margin: 4px 0 6px;
}

.hero-name-line {
  display: block;
}

.hero-name-line-1 {
  font-size: clamp(4rem, 16vw, 13rem);
}

.hero-name-line-2 {
  font-size: clamp(2rem, 8vw, 6rem);
}
```

(`font-size` moves off the shared `.hero-name` rule and onto the two line-specific classes per §13's table — `.hero-name` keeps the properties both lines share: font family, weight, line-height, letter-spacing, color, margin.)

- [ ] **Step 3: Verify**

Run `npm run build` — confirm it succeeds. Run `npm run dev`, open the site. Confirm:
- "AAMAAN" renders on its own line, very large (should visually dominate the viewport width on a typical desktop window)
- "SSANJAY SHARRMA" renders on the line below, noticeably smaller — roughly half the size of "AAMAAN"
- The per-character entrance animation still plays left-to-right across both lines with the same continuous stagger rhythm as before (no visible pause or jump between "AAMAAN" finishing and "SSANJAY SHARRMA" starting)
- With a screen reader (or by inspecting the accessibility tree), the `<h1>` announces "AAMAAN SSANJAY SHARRMA" as one string
- Toggling `prefers-reduced-motion` shows both lines at full opacity immediately, no stagger

---

## Final phase check

- [ ] Run `npm run build` once more from a clean state to confirm both tasks together still produce a successful build.
- [ ] Confirm `git status` shows only `src/index.css`, `src/pages/Hero/Hero.jsx`, and `src/pages/Hero/Hero.css` as newly modified beyond what was already uncommitted before this phase started (no stray file touched).
