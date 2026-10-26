# Aamaan Sharrma portfolio

## Brief
Build a personal portfolio for recruiters and freelance clients, explicitly inspired by the supplied ChatGPT-like Framer reference. Preserve its quiet conversational interface, persistent sidebar and suggested questions. Use the existing React 18 / Vite / React Router stack. Source of truth: the supplied Aamaan-Sharrma.pdf, which supersedes old project dates and metrics in this repository.

## Concept exploration
Scores: originality / fit / feasibility / portability (lower portability is better).
- Conversation as portfolio: Aamaan's work in agents becomes a guided conversation, with project answers and a persistent composer. 3 / 5 / 5 / 3. Selected because the user explicitly requested this familiar interface.
- Engineering notebook: project decisions become entries in a technical notebook. 4 / 4 / 5 / 3. Useful for case-study structure, but not the requested interface.
- Production console: deployments and outcomes become an operations dashboard. 4 / 4 / 4 / 3. Too technical for prospective clients.

## Concept card
Idea: Get to know the engineer through a conversation with his work.
Metaphor: A calm AI workspace, owned by Aamaan rather than branded as ChatGPT.
Signature: Suggested questions turn into readable answers with direct project and contact links.
Emotion: Familiar, capable, approachable.
Motion verb: Settle. Short upward settling on route entry, quiet arrow travel on hover.
Screenshot: Centered greeting and composer, suggested topics, pale sidebar, small personal monogram.

## System
Ground #ffffff; sidebar #f7f7f8; ink #202123; muted #62666b; line #e7e7e9; accent #176b50.
System sans-serif (Segoe UI / Arial) intentionally follows the familiar application interface, needs no font downloads and has no font layout shift. Headings 28–38px; body 16px / 1.65; UI 13–14px. Main reading measure 760px. Sidebar 260px. Gutter 24px mobile / 48px desktop. Radius 10px UI / 24px composer.
Home: [sidebar] [top tabs / availability] [centered monogram + greeting / composer / suggested topic grid] [footer].
Projects: [sidebar] [heading / category tabs / numbered rows with summaries] [composer].
Case: [sidebar] [question bubble / author / title / result / narrative / media / next project] [composer].
Contact: [sidebar] [question / contact invitation / services / email action] [composer].
Mobile: top menu button, modal drawer, single reading column, wrapped bubbles, fixed topic bar with reserved reading space. No nested scrolling for project lists.

## Decisions and assumptions
- Preserve the user's requested reference rather than forcing a different award-site concept. No WebGL, loader or decorative idle movement. Native scrolling is appropriate to this application-like reading experience; Lenis is installed but deliberately not activated.
- GSAP handles route entry via a scoped cleanup hook. Reduced-motion preferences disable motion. Native pointer and keyboard focus remain visible.
- The static topic bar offers a Portfolio menu, with no text input. Chat pages show a prompt, thinking state, word-streamed content, and a blurred-to-sharp reveal for existing project images. GSAP owns the sequence and cleans it up on navigation. Show all and reduced motion reveal everything immediately.
- Short display name is Aamaan Sharrma; full résumé name is Aamaan Ssanjay Sharrma. New résumé dates and metrics replace older repository claims.
- Service descriptions are inferred from demonstrated skills and the user's stated freelance intent. No price, availability hours, client testimonials or turnaround promises invented.
- No portrait provided: use AS monogram. Project visuals are existing repository assets where relevant. Employer projects use text case studies and employer attribution, not invented screenshots.
- GitHub Pages URL is taken from the résumé. Static route output will support direct navigation on that host. Publishing is separate from local implementation.

## Release review
Owner should confirm employer project descriptions are suitable for public sharing, current availability and the résumé contact details before publishing. This is a local implementation, not a deployment.


## Reading-first refinement, 26 October 2026
Preserve the assistant metaphor while making evidence immediately readable. Stream only a short reserved-space introduction; keep all substantive content and contact actions available from first render. Remember instant-reading preference and avoid repeated in-session introductions. Reveal genuine images on viewport entry independently of text.
The hero uses an AS monogram and an explicit production AI/full-stack positioning statement. Recruiters and prospective clients receive direct work/contact routes. The bottom topic menu is now in document flow; mobile top navigation remains accessible while scrolling. Mobile system summaries are compact, optional technical sections expand natively, and architecture components are readable HTML. No fictional portrait, demo, testimonials, prices or time commitments were added. Service scope/handover language is proposed engagement copy based on demonstrated work, not a claim of prior freelance contracts.
