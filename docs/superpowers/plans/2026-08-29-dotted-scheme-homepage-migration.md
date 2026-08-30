# Dotted-Scheme Homepage Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish migrating the homepage from the legacy "card-stack" visual system (hardcoded `#000316` backgrounds, an external egg-shell texture, `z-index`-layered `border-radius` peel-back sections) to the dotted-scheme design system already live in `Hero.jsx`/`NavRail.jsx` — and reconcile the site's display-name spelling to "Aamaan Ssanjay Sharrma".

**Architecture:** Five home-page sections (`About`, `ExperienceSection`, `Projects`, `SkillsMinimal`, `Contact`) currently share one legacy visual system that the new `Hero`/`App` shell has already abandoned. This plan retires that system section-by-section. `About`, `ExperienceSection`, `Projects`, and `Contact` are rebuilt to match `docs/DESIGN_SPEC.md`'s wireframes (plain index-row lists, hairline dividers, a Departure Mono link-row) — per the project owner's explicit choice to rebuild rather than reskin. `SkillsMinimal` is reskinned only (colors/fonts swapped to the new tokens) — it has no wireframe in the spec and the project owner chose to keep it as-is structurally. A new shared stylesheet (`src/styles/section-shell.css`) holds the index-row/link-row/chip primitives so the four rebuilt sections don't duplicate CSS.

**Tech Stack:** React 18 + Vite, plain CSS (no CSS-in-JS, no Tailwind), `motion/react` for animation, React Router DOM. **No automated test suite exists in this repo** (no Jest/Vitest/Playwright config, no `test` script in `package.json`) — verification in every task below is manual: run `npm run dev`, open the printed localhost URL, and check the page against the listed checklist, plus check the browser console for errors.

**Spec:** [docs/DESIGN_SPEC.md](../../DESIGN_SPEC.md) — tokens (§1), typography (§2), motif rules (§3), Home wireframe (§5), link-row pattern (About wireframe, §5).

## Global Constraints

- Colors: only `var(--ink)`, `var(--paper)`, `var(--meta)`, `var(--signal)` (defined in `src/index.css`) — no new hardcoded hex/rgba colors in any file touched by this plan.
- Fonts: headings/labels use `var(--font-display)` (Doto), meta/mono text uses `var(--font-mono)` (Departure Mono) or the `.font-mono` utility class, body copy stays plain Poppins (the browser default from `body`) — per spec §2–§3.
- No new `z-index` stacking, `border-radius` "peel" effects, `position: sticky`/`absolute` page wrappers, or external image URLs (e.g. `transparenttextures.com`) — these are exactly the legacy patterns being retired.
- Every rebuilt section keeps its existing `id="..."` attribute unchanged (`about`, `experience`, `projects`, `contact`) — `NavRail.jsx`'s `IntersectionObserver` targets these ids by string and must keep working without modification.
- Drop the `page-container` class from every section rewritten in this plan (About/Experience/Projects/Contact) — it forces `min-height: 100vh` (see `src/App.css:17`), which was needed for the old one-screen-per-section scroll-jack effect but fights the new flowing, hairline-divided layout. Do not remove `page-container` from any other file (e.g. `ProjectDetail`, `Mindstix`, `OmneVu`) — those are full standalone routed pages where the 100vh floor is still correct.
- Never fabricate metrics or timestamps. The old "building" state used a hardcoded fake `Currently arguing with the compiler...` subtext; the new status text uses only the literal string `active development` — do not invent a "last commit N days ago" figure since no real commit-timestamp data source exists in this codebase.

---

### Task 1: Name-spelling consistency pass

**Files:**
- Modify: `src/pages/Hero/Hero.jsx:5`
- Modify: `src/components/NavRail.jsx:106`
- Modify: `index.html:6,7`
- Modify: `src/pages/Contact/Contact.jsx:89` (footer copyright — added for consistency, same category of display text)

**Interfaces:** None — these are isolated string literal changes with no shared types or props.

- [ ] **Step 1: Update the Hero heading**

In `src/pages/Hero/Hero.jsx`, change line 5:

```jsx
const NAME = 'AMMAN SHARRMA';
```

to:

```jsx
const NAME = 'AAMAAN SSANJAY SHARRMA';
```

- [ ] **Step 2: Update the nav brand mark's accessible name**

In `src/components/NavRail.jsx`, change line 106:

```jsx
<Link to="/" className="rail-mark-brand font-display" aria-label="Amman Sharrma, home">
```

to:

```jsx
<Link to="/" className="rail-mark-brand font-display" aria-label="Aamaan Ssanjay Sharrma, home">
```

- [ ] **Step 3: Update the page title and meta description**

In `index.html`, change lines 6–7:

```html
  <meta name="description" content="Portfolio of Amman Sharrma, a Full-Stack Software Engineer specializing in intelligent, user-centric applications, AI pipelines, and scalable backend architectures.">
  <title>Portfolio - A Sharrma</title>
```

to:

```html
  <meta name="description" content="Portfolio of Aamaan Ssanjay Sharrma, a Full-Stack Software Engineer specializing in intelligent, user-centric applications, AI pipelines, and scalable backend architectures.">
  <title>Portfolio - Aamaan Sharrma</title>
```

- [ ] **Step 4: Update the footer copyright line**

In `src/pages/Contact/Contact.jsx`, change line 89:

```jsx
<p className="copyright">© 2026 A SHARRMA, ALL RIGHTS RESERVED.</p>
```

to:

```jsx
<p className="copyright">© 2026 AAMAAN SHARRMA, ALL RIGHTS RESERVED.</p>
```

(Task 7 rebuilds this footer entirely and will carry this string forward — don't skip this step just because Task 7 touches the same file later.)

- [ ] **Step 5: Verify**

Run `npm run dev`, open the printed URL. Confirm the Hero heading reads "AAMAAN SSANJAY SHARRMA", the browser tab title reads "Portfolio - Aamaan Sharrma", and (with dev tools) the meta description tag shows the new spelling. Do **not** change `src/data/projects.json`'s `github`/`demo` URLs, `Contact.jsx`'s `github.com/ammansharrma` or `linkedin.com/in/amman-sharrma` links, or the `Amman_Sharrma.pdf` resume filename — those are real external identifiers/filenames, not display text, and are out of scope.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Hero/Hero.jsx src/components/NavRail.jsx index.html src/pages/Contact/Contact.jsx
git commit -m "fix: use consistent 'Aamaan Ssanjay Sharrma' spelling in display text"
```

---

### Task 2: Shared section-shell stylesheet

**Files:**
- Create: `src/styles/section-shell.css`
- Modify: `src/main.jsx`

**Interfaces:**
- Produces (CSS classes consumed by Tasks 3, 4, 5, 7): `.section-shell`, `.section-shell-inner`, `.section-label`, `.index-list`, `.index-row`, `.index-row-title`, `.index-row-desc`, `.index-row-meta`, `.index-row-status`, `.status-cursor`, `.link-row`, `.link-row-item`.
- No `.chip`/`.chip-row` primitives are defined here — the spec's chip-row pattern (§Work detail) only appears on the per-project detail page, which is out of scope for this plan (it doesn't touch `ProjectDetail.jsx`). Adding unused CSS now would be dead code from day one.

- [ ] **Step 1: Create the shared stylesheet**

Create `src/styles/section-shell.css`:

```css
/* Shared primitives for the dotted-scheme home sections:
   About, ExperienceSection, Projects, Contact. */

.section-shell {
  padding: clamp(70px, 8vw, 120px) clamp(30px, 6vw, 90px);
  border-top: 1px solid rgba(247, 247, 242, 0.08);
  background-color: var(--ink);
  position: relative;
}

.section-shell-inner {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.section-label {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(13px, 1.1vw, 15px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--paper);
  margin-bottom: clamp(24px, 3vw, 40px);
}

.index-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(247, 247, 242, 0.12);
}

.index-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 3vw, 40px);
  padding: clamp(18px, 2.2vw, 26px) clamp(4px, 1vw, 12px) clamp(18px, 2.2vw, 26px) 20px;
  border-bottom: 1px solid rgba(247, 247, 242, 0.12);
  position: relative;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
  font: inherit;
  text-align: left;
  transition: background-color var(--duration-standard) var(--ease-standard);
}

.index-row::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 50%;
  width: 4px;
  height: 4px;
  transform: translateY(-50%);
  background: var(--signal);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-fast);
}

.index-row:hover,
.index-row:focus-visible {
  background-color: rgba(247, 247, 242, 0.03);
}

.index-row:hover::before,
.index-row:focus-visible::before {
  opacity: 1;
}

.index-row-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: clamp(16px, 1.4vw, 19px);
  color: var(--paper);
  position: relative;
  display: inline-block;
  width: fit-content;
  flex-shrink: 0;
}

.index-row-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 1px;
  background: var(--paper);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-standard) var(--ease-standard);
}

.index-row:hover .index-row-title::after,
.index-row:focus-visible .index-row-title::after {
  transform: scaleX(1);
}

.index-row-desc {
  font-size: clamp(13px, 1.1vw, 15px);
  color: var(--meta);
  flex: 1;
  min-width: 0;
}

.index-row-meta {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--meta);
  white-space: nowrap;
  flex-shrink: 0;
}

.index-row-status {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--signal);
  white-space: nowrap;
  flex-shrink: 0;
}

.status-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: statusCursorBlink 1s steps(2, jump-none) infinite;
}

@keyframes statusCursorBlink {
  50% {
    opacity: 0;
  }
}

.link-row {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(20px, 3vw, 40px);
}

.link-row-item {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--paper);
  text-decoration: none;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: inline-block;
  width: fit-content;
}

.link-row-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 1px;
  background: var(--signal);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-standard) var(--ease-standard);
}

.link-row-item:hover::after,
.link-row-item:focus-visible::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  .status-cursor {
    animation: none;
  }
}

@media (max-width: 720px) {
  .index-row {
    flex-wrap: wrap;
    padding-left: 16px;
  }

  .index-row-desc {
    width: 100%;
    order: 3;
  }
}
```

- [ ] **Step 2: Import it once, globally**

In `src/main.jsx`, add the import after the existing `index.css` import:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/section-shell.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 3: Verify**

Run `npm run dev`. The site should look and behave **exactly as it did before this task** — this file defines classes nothing references yet. Confirm the dev server starts without errors and the homepage renders unchanged. Check the browser console for CSS/import errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/section-shell.css src/main.jsx
git commit -m "feat: add shared section-shell stylesheet for dotted-scheme migration"
```

---

### Task 3: Rebuild ExperienceSection

**Files:**
- Modify: `src/pages/ExperienceSection/ExperienceSection.jsx`
- Delete: `src/pages/ExperienceSection/ExperienceSection.css`

**Interfaces:**
- Consumes: `.section-shell`, `.section-shell-inner`, `.section-label`, `.index-list`, `.index-row`, `.index-row-title`, `.index-row-desc` (holds the role, e.g. "Software Developer"), `.index-row-meta` (holds the period) from Task 2.
- No other file imports from `ExperienceSection.jsx` beyond the default export, and nothing imports `ExperienceSection.css` directly — safe to delete once the `import './ExperienceSection.css'` line is removed.

- [ ] **Step 1: Rewrite the component**

Replace the full contents of `src/pages/ExperienceSection/ExperienceSection.jsx`:

```jsx
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const EXPERIENCE = [
  { id: 'mindstix', company: 'Mindstix', role: 'Software Developer', period: 'Jun 2025 — now' },
  { id: 'omnevu', company: 'OmneVu', role: 'Intern', period: 'Dec 2024 — Jun 2025' },
];

function ExperienceSection() {
  const navigate = useNavigate();

  return (
    <section className="experience-section-page section-shell" id="experience">
      <div className="section-shell-inner">
        <h2 className="section-label">Where I Work</h2>
        <div className="index-list">
          {EXPERIENCE.map((job) => (
            <button
              key={job.id}
              type="button"
              className="index-row"
              onClick={() => navigate(`/experience/${job.id}`)}
            >
              <span className="index-row-title">{job.company}</span>
              <span className="index-row-desc">{job.role}</span>
              <span className="index-row-meta">{job.period}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ExperienceSection);
```

Note what changed: the `TopRightArrow` import and per-row SVG logo are dropped (the new index-row language carries no icons — just the hover underline + `--signal` marker from `.index-row`), and the row element changes from a non-interactive `<div onClick>` to a real `<button>` — this also fixes a pre-existing accessibility gap (the old rows weren't keyboard-operable).

- [ ] **Step 2: Delete the now-unused stylesheet**

```bash
rm src/pages/ExperienceSection/ExperienceSection.css
```

- [ ] **Step 3: Verify**

Run `npm run dev`, scroll to the "Where I Work" section (or click `02` in the nav rail). Confirm:
- Background is flat `var(--ink)` (no `#000316`, no visible texture pattern)
- Two rows: "Mindstix · Software Developer · Jun 2025 — now" and "OmneVu · Intern · Dec 2024 — Jun 2025"
- Hovering a row shows the title underline draw in and a small ochre (`--signal`) square fade in at the row's left edge
- Clicking a row navigates to `/experience/mindstix` or `/experience/omnevu`
- Tabbing to a row with the keyboard shows the same hover treatment (via `:focus-visible`) and pressing Enter navigates
- No console errors about the deleted CSS file or the removed `TopRightArrow` import

- [ ] **Step 4: Commit**

```bash
git add src/pages/ExperienceSection/ExperienceSection.jsx
git rm src/pages/ExperienceSection/ExperienceSection.css
git commit -m "refactor: rebuild ExperienceSection as a dotted-scheme index list"
```

---

### Task 4: Rebuild Projects, retire ProjectCard

**Files:**
- Modify: `src/pages/Projects/Projects.jsx`
- Modify: `src/pages/Projects/Projects.css` (reduce to one rule)
- Delete: `src/components/ProjectCard.jsx`
- Delete: `src/components/ProjectCard.css`

**Interfaces:**
- Consumes: `.section-shell`, `.section-shell-inner`, `.section-label`, `.index-list`, `.index-row`, `.index-row-title`, `.index-row-desc`, `.index-row-status`, `.status-cursor`, `.link-row-item` from Task 2.
- `ArchiveOverlay.jsx` (rendered by `Projects.jsx`) has its own scoped `archive-*` classes and does not import `ProjectCard` — confirmed via `grep -rln "ProjectCard" --include="*.jsx" .` returning only `ProjectCard.jsx` and `Projects.jsx`. Deleting `ProjectCard.jsx` does not affect `ArchiveOverlay`.

- [ ] **Step 1: Rewrite Projects.jsx**

Replace the full contents of `src/pages/Projects/Projects.jsx`:

```jsx
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';
import ArchiveOverlay from '../../components/ArchiveOverlay';
import projectsData from '../../data/projects.json';

function Projects() {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Show first 3 projects (VidhaanAI, Stock Predictor, Ideation)
  const displayedProjects = projectsData.projects.slice(0, 3);

  return (
    <>
      <section className="projects-page section-shell" id="projects">
        <div className="section-shell-inner">
          <h2 className="section-label">Case Studies</h2>

          <div className="index-list">
            {displayedProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="index-row">
                <span className="index-row-title">{project.title}</span>
                <span className="index-row-desc">{project.shortDescription}</span>
                {project.isBuilding && (
                  <span className="index-row-status">
                    active development<span className="status-cursor">▮</span>
                  </span>
                )}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="link-row-item projects-archive-link"
            onClick={() => setIsArchiveOpen(true)}
          >
            View full project archive
          </button>
        </div>
      </section>

      <ArchiveOverlay isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />
    </>
  );
}

export default memo(Projects);
```

- [ ] **Step 2: Reduce Projects.css to the one rule still needed**

Replace the full contents of `src/pages/Projects/Projects.css`:

```css
.projects-archive-link {
  margin-top: clamp(20px, 3vw, 32px);
}
```

- [ ] **Step 3: Delete ProjectCard**

```bash
rm src/components/ProjectCard.jsx src/components/ProjectCard.css
```

- [ ] **Step 4: Verify**

Run `npm run dev`, scroll to "Case Studies" (or click `03`/Work in the nav rail). Confirm:
- Three rows: VidhaanAI, Stock Predictor, Ideation — each showing title + one-line description
- The VidhaanAI row shows "active development ▮" with the cursor blinking (its `isBuilding: true` flag in `src/data/projects.json`); the other two rows show no status text
- Clicking a row navigates to `/projects/<id>` and the existing `ProjectDetail` page still renders correctly (this plan does not touch `ProjectDetail.jsx`)
- "View full project archive" still opens the `ArchiveOverlay` modal, and its grid of all projects (with thumbnails/videos) is unaffected
- No console errors about missing `ProjectCard` imports or missing image/video assets

- [ ] **Step 5: Commit**

```bash
git add src/pages/Projects/Projects.jsx src/pages/Projects/Projects.css
git rm src/components/ProjectCard.jsx src/components/ProjectCard.css
git commit -m "refactor: rebuild Projects as a dotted-scheme index list, retire ProjectCard"
```

---

### Task 5: Rebuild About

**Files:**
- Modify: `src/pages/About/About.jsx`
- Modify: `src/pages/About/About.css` (full rewrite)

**Interfaces:**
- Consumes: `.section-shell`, `.section-shell-inner`, `.section-label` from Task 2, `.font-mono` utility class from `src/index.css`.
- Nothing else imports from `About.jsx`/`About.css` beyond the default export and its own stylesheet import.

- [ ] **Step 1: Rewrite About.jsx**

Replace the full contents of `src/pages/About/About.jsx`:

```jsx
import { memo } from 'react';
import './About.css';

function About() {
  return (
    <section className="about-page section-shell" id="about">
      <div className="section-shell-inner about-layout">
        <h2 className="section-label">About</h2>

        <div className="about-content">
          <p className="about-text">
            I'm interested in building complete systems where backend architecture, AI intelligence, and interface design operate as one cohesive experience.
          </p>

          <p className="about-text">
            I'm drawn to problems that require both precision and intuition. The kind where scalable APIs, structured data models, and intelligent AI pipelines need to work quietly behind a clean, fast interface.
          </p>

          <h3 className="about-section-title font-mono">How I build</h3>
          <ul className="about-principles">
            <li>I think in systems, not isolated features.</li>
            <li>I care about performance as much as polish.</li>
            <li>I design AI integrations with safety, structure, and cost-awareness in mind.</li>
          </ul>

          <p className="about-text">
            Currently, I contribute to end-to-end product systems from API design to production-ready UI engineering while independently building AI-driven projects that explore retrieval pipelines, structured prompting, and controlled execution flows.
          </p>

          <p className="about-text">
            Previously, I worked on applied AI tooling and automation systems, where I learned that <span className="highlight">clarity often matters more than complexity.</span>
          </p>

          <p className="about-text">
            Outside of engineering, I study financial systems and product strategy because <span className="highlight">great software isn't just built, it's positioned.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
```

Note what changed: the `Hello` GIF greeting, the `TopRightArrow` bullet icons, and the unused `useNavigate` import/call (the original called `useNavigate()` but never used the returned `navigate` function) are all dropped. The giant "ABOUT ME" heading becomes the small Doto `section-label` ("About") to match the "CASE STUDIES"/"WHERE I WORK" label pattern used by its neighboring sections — since About lives as a scroll-section directly under the Hero (which already shows the full name), repeating a large name heading here would be redundant. All six paragraphs of real content are preserved verbatim.

- [ ] **Step 2: Rewrite About.css**

Replace the full contents of `src/pages/About/About.css`:

```css
.about-layout {
  max-width: 720px;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 2.5vw, 32px);
}

.about-text {
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.7;
  color: rgba(247, 247, 242, 0.75);
}

.about-text .highlight {
  color: var(--paper);
  font-weight: 500;
}

.about-section-title {
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--meta);
  margin-bottom: 12px;
}

.about-principles {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about-principles li {
  position: relative;
  padding-left: 16px;
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.6;
  color: rgba(247, 247, 242, 0.75);
}

.about-principles li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 4px;
  height: 4px;
  background: var(--signal);
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`, scroll to the About section (or click `01` in the nav rail). Confirm:
- Small "ABOUT" label in Doto above the paragraph copy, no giant "ABOUT ME" heading, no Hello GIF
- All six paragraphs and the three "How I build" bullets are present with the same wording as before
- Each "How I build" bullet has a small ochre square instead of an arrow icon
- Background is flat `var(--ink)`, no visible texture pattern
- No console errors about the removed `HelloGif`/`TopRightArrow` imports

- [ ] **Step 4: Commit**

```bash
git add src/pages/About/About.jsx src/pages/About/About.css
git commit -m "refactor: rebuild About with dotted-scheme tokens, drop legacy Hello-gif greeting"
```

---

### Task 6: Reskin SkillsMinimal

**Files:**
- Modify: `src/pages/SkillsMinimal/SkillsMinimal.jsx` (remove one element)
- Modify: `src/pages/SkillsMinimal/SkillsMinimal.css` (targeted edits, not a full rewrite)

**Interfaces:** None — this task only changes colors/fonts/removes dead layers inside the existing card-grid structure; no class names consumed from Task 2, and no other file depends on what changes here.

- [ ] **Step 1: Remove the decorative-gradient div**

In `src/pages/SkillsMinimal/SkillsMinimal.jsx`, remove this line near the end of the JSX (currently right before the closing `</div>` of the component):

```jsx
      <div className="decorative-gradient"></div>
```

- [ ] **Step 2: Add the section-shell class to the root element**

In the same file, change:

```jsx
    <div 
      ref={sectionRef}
      className={`skills-minimal-page page-container ${isVisible ? 'is-visible' : ''}`} 
      id="skills-minimal" 
    >
```

to:

```jsx
    <div 
      ref={sectionRef}
      className={`skills-minimal-page section-shell ${isVisible ? 'is-visible' : ''}`} 
      id="skills-minimal" 
    >
```

(This drops `page-container`'s forced `min-height: 100vh` per the Global Constraints, and adds `.section-shell`'s flat `--ink` background + hairline top border + standard padding — which is why the next step removes the page's own hardcoded padding/background/backdrop-filter rules.)

- [ ] **Step 3: Edit SkillsMinimal.css — root rule**

Replace:

```css
.skills-minimal-page {
  padding: 0 !important;
  min-height: auto !important;
  width: 100% !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important; /* No color */
  backdrop-filter: blur(20px); /* Reduced from multiple layers to one */
  -webkit-backdrop-filter: blur(20px);
  @media (max-width: 768px) {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  box-sizing: border-box !important;
  z-index: 120 !important; /* Above Projects (110) */
  overflow: hidden !important;
  contain: content; /* Layout optimization */
  opacity: 1;
  transform: translateY(0);
  margin-top: -80px !important;
  isolation: isolate;
}
```

with:

```css
.skills-minimal-page {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  contain: content;
}
```

- [ ] **Step 4: Remove the texture and gradient-mask layers**

Delete these two rules entirely:

```css
.skills-minimal-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("https://www.transparenttextures.com/patterns/egg-shell.png");
  background-repeat: repeat;
  background-size: 200px;
  opacity: 0.15; /* Reduced for readability */
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: -1;
}

/* Gradient Blur Overlay - Matching Contact */
.skills-minimal-page::after {
  content: "";
  position: absolute;
  inset: 0;
  /* background-blur removed - redundant with parent backdrop-filter */
  mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
  z-index: -1;
  pointer-events: none;
}

.decorative-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 40%, rgba(40, 60, 100, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(60, 40, 80, 0.15) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}
```

Also delete the now-orphaned responsive override right below them:

```css
@media (max-width: 1024px) {
  .skills-minimal-page {
    margin-top: 0 !important;
  }
}
```

- [ ] **Step 5: Remove the container's own padding (now provided by `.section-shell`)**

Replace:

```css
.skills-minimal-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: clamp(130px, 13vw, 170px) clamp(30px, 4vw, 60px) clamp(20px, 2vw, 30px);
  position: relative;
  z-index: 10;
}
```

with:

```css
.skills-minimal-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
```

And remove the now-unnecessary tablet padding override:

```css
@media (max-width: 1024px) {
  .skills-minimal-container {
    padding: clamp(60px, 8vw, 100px) clamp(25px, 4vw, 50px);
  }
```

— keep the rest of that media query block (the `.skill-card-minimal`, `.skill-item::before`, etc. rules inside it stay as-is), just delete the `.skills-minimal-container` rule from inside it. Do the same for the `@media (max-width: 768px)` block's:

```css
  .skills-minimal-container {
    padding: clamp(50px, 10vw, 80px) 20px;
  }
```

- [ ] **Step 6: Swap hardcoded colors and fonts to tokens**

Replace:

```css
.skills-minimal-title {
  font-size: clamp(24px, 2.12vw, 32px);
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.02em;
  margin-bottom: clamp(12px, 1.5vw, 20px);
  text-transform: uppercase;
}

.skills-minimal-subtitle {
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.01em;
}
```

with:

```css
.skills-minimal-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 2.12vw, 32px);
  font-weight: 700;
  color: var(--paper);
  letter-spacing: 0.02em;
  margin-bottom: clamp(12px, 1.5vw, 20px);
  text-transform: uppercase;
}

.skills-minimal-subtitle {
  font-family: var(--font-mono);
  font-size: clamp(14px, 1.4vw, 16px);
  font-weight: 400;
  color: var(--meta);
  letter-spacing: 0.01em;
}
```

Leave every other rule in the file (`.skill-card-minimal`, `.skill-item`, `.skill-badge`, `.skill-motion-track`, `.global-tech-*`, the `scrollLeft`/`scrollRight` keyframes, and all remaining media queries) untouched — those are the card-grid mechanics, not the legacy card-stack shell, and are not part of this task's scope.

- [ ] **Step 7: Verify**

Run `npm run dev`, scroll to the Skills section (or click `04` in the nav rail). Confirm:
- Background is flat `var(--ink)` with a hairline top border, no texture pattern, no backdrop-blur "glass" look
- "SKILLS" label renders in Doto, "What I can do" subtitle renders in Departure Mono and reads as muted gray (`--meta`)
- The four skill cards, their capability lists, and the hover-triggered horizontal badge marquees still work exactly as before (hover a card, confirm the badge strip scrolls)
- The bottom global-tech badge marquee still auto-scrolls
- No console errors

- [ ] **Step 8: Commit**

```bash
git add src/pages/SkillsMinimal/SkillsMinimal.jsx src/pages/SkillsMinimal/SkillsMinimal.css
git commit -m "style: reskin SkillsMinimal with dotted-scheme tokens, drop legacy texture/blur layers"
```

---

### Task 7: Rebuild Contact, retire Stage Wanders and MainLogo

**Files:**
- Modify: `src/pages/Contact/Contact.jsx`
- Modify: `src/pages/Contact/Contact.css` (full rewrite)
- Modify: `index.html` (drop the Stage Wanders font preload)
- Delete: `src/components/MainLogo.jsx`

**Interfaces:**
- Consumes: `.section-shell`, `.section-shell-inner`, `.section-label`, `.link-row`, `.link-row-item` from Task 2, `.font-mono` utility class from `src/index.css`.
- `grep -rln "MainLogo" --include="*.jsx" .` returns only `MainLogo.jsx` and `Contact.jsx` — once Contact stops rendering it, it has zero consumers and is safe to delete.
- `grep -rn "Stage Wanders" --include="*.css" --include="*.jsx" --include="*.html" .` returns only `Contact.css` (the `@font-face` declaration and the `.time` rule) — safe to retire everywhere.

- [ ] **Step 1: Rewrite Contact.jsx**

Replace the full contents of `src/pages/Contact/Contact.jsx`:

```jsx
import { useState, useEffect, memo } from 'react'
import './Contact.css'

function Contact() {
  const [currentTime, setCurrentTime] = useState('')
  const [copied, setCopied] = useState(false)

  const handleEmailClick = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText('aamaansharrma6@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    window.location.href = 'mailto:aamaansharrma6@gmail.com'
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="contact-page section-shell" id="contact">
      <div className="section-shell-inner">
        <h2 className="section-label">Contact</h2>

        <div className="link-row">
          <a href="mailto:aamaansharrma6@gmail.com" className="link-row-item" onClick={handleEmailClick}>
            {copied ? 'Email copied' : 'Email'}
          </a>
          <a
            href={`${import.meta.env.BASE_URL}Mockups/Resume/Amman_Sharrma.pdf`}
            className="link-row-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            href="https://github.com/ammansharrma"
            className="link-row-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/amman-sharrma/"
            className="link-row-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>

        <footer className="contact-footer">
          <p className="contact-copyright font-mono">© 2026 AAMAAN SHARRMA, ALL RIGHTS RESERVED.</p>
          <p className="contact-time font-mono">{currentTime}</p>
        </footer>
      </div>
    </section>
  )
}

export default memo(Contact)
```

Note what changed: the centered `MainLogo` mark, the "CONCEPT TO CREATION" pill CTA button, and the decorative radial-gradient blobs are all dropped in favor of the same `.link-row` pattern used in the spec's About wireframe. The email-copy-to-clipboard behavior and the live clock are preserved.

- [ ] **Step 2: Rewrite Contact.css**

Replace the full contents of `src/pages/Contact/Contact.css`:

```css
.contact-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: clamp(48px, 6vw, 80px);
  padding-top: clamp(20px, 2.5vw, 32px);
  border-top: 1px solid rgba(247, 247, 242, 0.08);
}

.contact-copyright {
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--meta);
}

.contact-time {
  font-size: 13px;
  color: var(--meta);
}

@media (max-width: 720px) {
  .contact-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
```

- [ ] **Step 3: Drop the Stage Wanders font preload**

In `index.html`, remove this line:

```html
  <link rel="preload" href="/fonts/Stage%20Wanders.ttf" as="font" type="font/ttf" crossorigin>
```

- [ ] **Step 4: Delete MainLogo**

```bash
rm src/components/MainLogo.jsx
```

(Leave the `Stage Wanders.otf`/`.ttf` files themselves in `public/fonts/` and `src/assets/fonts/` — deleting binary assets is out of scope for this plan; only the code that loads/references them is retired.)

- [ ] **Step 5: Verify**

Run `npm run dev`, scroll to the Contact section (or click `05` in the nav rail). Confirm:
- No `MainLogo` mark, no pill-shaped "Let's work together" button, no colored gradient blobs
- A plain "CONTACT" label followed by four link items: Email, Resume, GitHub, LinkedIn, each underlining in ochre on hover
- Clicking "Email" copies the address to the clipboard, the link text changes to "Email copied" for ~2 seconds, and the OS mail client attempts to open
- "Resume" opens the PDF in a new tab, "GitHub"/"LinkedIn" open their respective profiles in a new tab
- Footer shows "© 2026 AAMAAN SHARRMA, ALL RIGHTS RESERVED." and a live `HH:MM` clock that updates once a minute
- No console errors about the removed `MainLogo`/`TopRightArrow` imports or the dropped font preload

- [ ] **Step 6: Commit**

```bash
git add src/pages/Contact/Contact.jsx src/pages/Contact/Contact.css index.html
git rm src/components/MainLogo.jsx
git commit -m "refactor: rebuild Contact as a dotted-scheme link row, retire Stage Wanders and MainLogo"
```

---

## Final full-site check (after Task 7)

- [ ] Run `npm run build` to confirm the production build still succeeds (this catches any leftover reference to a deleted file that `npm run dev` might not).
- [ ] With `npm run dev` running, scroll the entire homepage top to bottom once, confirming: no section still shows the `#000316` background or the egg-shell texture, no layout jumps or overlapping content at the section boundaries, and every nav-rail dot (`00`–`05`) still highlights at the right scroll position.
- [ ] Toggle `prefers-reduced-motion` in devtools and confirm the status-line cursor blinks stop and hover transitions still work (just instantly).
