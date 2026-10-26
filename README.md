# Aamaan Sharrma's portfolio

A conversational portfolio inspired by the supplied Framer reference, built with React 18, Vite, React Router and GSAP. Includes six case studies based on the supplied résumé, project notes and architecture diagrams, experience, skills, education, freelance services, contact links and click-driven streaming responses.

## Run locally

```sh
npm install
npm run dev
```

Open the URL Vite prints, with `/Portfolio/` appended. For the production version:

```sh
npm run build
npm run serve:production
```

Open `http://127.0.0.1:4400/Portfolio/`.

## Edit content

- `src/data/site.js`: biography metadata, projects, experience, skills and services. The supplied résumé is the source of truth; it supersedes older content still retained in the repository.
- `src/Portfolio.jsx`: active interface, routes and the Portfolio topic menu.
- `src/portfolio.css`: responsive layout and visual tokens.
- `public/Aamaan-Sharrma.pdf`: downloadable résumé.
- `DESIGN.md`: design rationale and content assumptions.

The Portfolio menu navigates curated content with a thinking state and streamed text. Existing project images reveal from blurred to sharp. There is no text input or live LLM call. Reduced motion shows content immediately; Show all skips the animation. Email buttons open the visitor's email app.

## Build and publish

The build prerenders 15 routes, an HTML 404 page and a sitemap. It retains the existing `/Portfolio/` GitHub Pages base. The URL in `src/data/site.js`, `index.html` and `public/robots.txt` comes from the résumé. Update these and `vite.config.js` if changing hosts.

`npm run deploy` publishes `dist` through the existing gh-pages configuration. Only run it when ready to publish. This implementation has not been deployed.

Before publishing, review current freelance availability and employer-work descriptions. No portrait was provided, so the interface uses an AS monogram. No testimonials, client logos, prices or additional project results were invented.

## Verification

With the production server running, `node scripts/verify.mjs .shots/review` checks each route at desktop, mobile and reduced-motion settings; runs axe; verifies menu focus, project filters, topic navigation and résumé availability. It uses the installed awwwards skill's browser launcher from `~/.codex/skills/awwwards/scripts/browser.mjs`, plus project-local Playwright and axe-core. Screenshots and reports are ignored by Git.

Architecture artwork is in `public/architecture/`, rebuilt with `python scripts/build-architecture.py`. It abstracts the supplied diagrams and excludes customer identities, account IDs and internal endpoints. The downloadable résumé copy also generalizes customer names; the original supplied file is unchanged.


## Reading-first interface
Only the short introduction streams (at most 2.15 seconds including the thinking pause). Case-study text, facts and actions are immediately available. Read instantly persists in localStorage; visited pages skip the introduction within the session. Reduced motion bypasses reveals. Images reveal independently when they enter the viewport.

The topic menu is in document flow. Mobile diagrams have expandable HTML component lists generated alongside SVGs by `scripts/build-architecture.py`. Production work leads the project index; project role/status/outcome data lives in `src/data/site.js`.

The local production server negotiates Brotli/gzip, uses immutable caching for fingerprinted assets, and revalidates HTML/PDF. Configure equivalent behavior on the chosen deployment host; the local server configuration does not change GitHub Pages.
