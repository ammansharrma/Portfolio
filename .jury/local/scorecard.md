# Portfolio review
Reviewed 26 October 2026 using production-preview evidence collected 25 October 2026. Review only; no website changes.

## Verdict
Keep the conversational concept. It is relevant to AI engineering, visually orderly and technically fast. The next gains come from faster access to proof and clearer freelance offerings, rather than more effects.

Independent critic: 6.88/10 (rounded 6.9), using the Awwwards-weighted rubric. Not an official Awwwards assessment.

| Criterion | Score | Evidence |
|---|---:|---|
| Design (40%) | 7.0 | Coherent home spacing, palette and case-study panels; repetitive text-heavy composition and oversized persistent topic bar. |
| Usability (30%) | 6.8 | Clear navigation, clean reflow, keyboard support; 15–16 second full response reveals and fixed UI over reading space. |
| Creativity (20%) | 6.3 | Assistant metaphor fits the profession, but familiar assistant patterns dominate personal identity. |
| Content (10%) | 7.8 | Concrete production contribution, metrics and honest in-development scope; services lack specific engagements. |

The skill's optional calibration adds 1.1, yielding about 8.0. That adjustment comes from only two winner sites and should not be treated as an award prediction. The strict 6.9 score and specific findings are more useful for decisions.

## Audience fit
Recruiter: 8.0/10. Strong role, stack, contributions, production experience and technical decisions. Put the strongest shipped project first and make results immediately scannable. Add a compact role/status/result summary to each case study. Align the downloadable resume and case study descriptions: the resume attributes the CSR work to Bedrock while the supplied copilot diagram uses OpenAI/Milvus. Explain distinct components or versions if that is the reason.

Freelance client: 6.8/10. Strong technical credibility, particularly for technical buyers seeking AI integrations or automation. A nontechnical buyer must work harder to translate architecture into value. Describe concrete deliverables, how a project starts, what is handed over and how support works. Do not invent availability, prices, testimonials or turnaround promises.

Idea fit (reviewer's judgment): 8/10 for this AI engineering background. Originality is a different criterion: the assistant UI signals familiarity, while the project evidence proves ability. The site needs a little more Aamaan-specific identity, not a replacement concept.

## Lighthouse
Lighthouse 12.8.2. Local production server, synthetic runs, not deployed-site field data or an INP measurement.

| Page/profile | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home desktop | 100 | 100 | 100 | 100 | 0.49s | 0 | 0ms |
| Home mobile | 95 | 100 | 100 | 100 | 2.42s | 0 | 0ms |
| Presentation Agent mobile | 92 | 100 | 100 | 100 | 2.72s | 0.013 | 0ms |

Separate skill capture: home mobile LCP 1.00s and 60 FPS under its throttling methodology. Do not combine these different measurement methods into one score. Accessibility 100 means no failures in the automated checks, not complete accessibility certification.

Fourteen-page static audit: 0 failures, 1 editorial punctuation warning. Earlier responsive/axe coverage includes all 14 pages. Fresh interaction capture includes home, duplicate home URL, project index and 404; its route grouping did not independently sample every case study. No sampled browser errors, horizontal overflow, invisible keyboard focus or hidden reduced-motion text. One screenshot contrast item was flagged for manual review.

Lighthouse recommends compression, cache lifetimes and reducing unused JS/CSS. The local static server currently lacks production compression/caching, so retest on the intended host. The skill audit undercounts shared vendor assets: its ~86KB page estimate is not an authoritative transfer-size total. The production build reports about 92.5KB gzipped JavaScript across the app and React chunks, plus CSS and assets.

## Experience timing
| Page | First streamed text | Full response |
|---|---:|---:|
| Experience | 0.94s | 6.34s |
| Order Notes | 0.87s | 15.42s |
| Presentation Agent | 0.85s | 16.47s |
| Work with me | 0.83s | 4.70s |

These are deliberate reveal timings in an unthrottled browser at mobile width. Show all bypasses them. The reveal is interruptible, but requiring visitors to skip it adds friction. Lighthouse's LCP measures a large visible element, not when the whole story becomes available.

## Proposed changes in order
1. Preserve the slower chat feel for a short introduction only. Make role, status, impact, links and contact actions immediately available. Offer a conspicuous Read instantly control and remember it; avoid replaying a long reveal on return visits.
2. Collapse the bottom topic bar while reading, or put it in document flow. Full-page captures show it overlaying text/cards at the current viewport position. This does not prove content is permanently unreachable, but it reduces usable reading space.
3. Lead with Order Notes and its two-region / 35s-to-20s proof. Keep Presentation Agent prominent, clearly labeled in development. Add outcome previews to the project index.
4. Strengthen the opening statement: "I build production AI agents and full-stack systems." Keep the conversational invitation underneath. Provide two direct paths: View engineering work and Discuss a project, with the resume nearby.
5. Make service descriptions concrete: an AI integration prototype, an internal workflow automation, or a React/API application. Connect each to an actual case study. Explain discovery, implementation, handover and support using the owner's real process.
6. Give diagrams a readable mobile format: stacked steps or an accessible zoom view. Keep real technical text available as HTML alongside the SVG.
7. Add personal distinction and genuine proof: a real portrait if desired, one authentic demo/video, project-specific previews, and a consistent personal mark. Avoid generic decorative effects or fake testimonials.
8. Align resume and project descriptions, trim repeated copy, improve the name-link hover feedback and remove unused styles. Configure compression/caching on hosting, then rerun Lighthouse.

## Developer rubric estimates
Semantics/SEO 8; animation/transitions 6; accessibility 8; WPO 7; responsive 7; markup/meta 8 provisional. Evidence is bounded: transition stills do not establish motion feel, static screenshots are not a screen-reader test, and local runs are not real-user performance.

## Evidence
- Independent critic used `.shots/architecture-update/` and `.jury/local/` without source code, design intent or prior scores.
- Lighthouse HTML and JSON reports: `lighthouse-home-mobile.report.*`, `lighthouse-home-desktop.report.*`, `lighthouse-case-mobile.report.*`.
- `reading-times.json`, `audit.txt`, `shots/home/report.json` and `shots/summary.json`.
