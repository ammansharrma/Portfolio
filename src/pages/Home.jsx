import { useEffect, useRef, useState } from 'react';
import { CASES } from '../data/site';
import { AGENT_STORY, METHOD, TOOLS, CAREER, CREDENTIALS } from '../data/home';
import { TLink, Roll, Footer } from '../components/Layout';
import DirectionArrow from '../components/DirectionArrow';
import { gsap, ScrollTrigger, useGsap, usePage, setMeta } from '../motion/engine';

const RESUME = `${import.meta.env.BASE_URL}Aamaan-Sharrma.pdf`;
const EMAIL = 'aamaansharrma6@gmail.com';
const EMAIL_SUBJECT = "Let's connect";
const EMAIL_BODY = "Hi Aamaan,\r\n\r\nI'd like to discuss a project or opportunity with you. Are you available for a quick conversation?\r\n\r\nThanks!";
const EMAIL_DRAFT = `mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

function Dock({ size = 20, at = .58 }) {
  return <span className="story-dock" data-travel data-travel-size={size} data-travel-dock data-travel-mobile="dock" data-travel-at={at} aria-hidden="true" />;
}

function Hero() {
  return <section className="hero story-hero" id="hero" data-theme="ink" aria-labelledby="h1">
    <h1 id="h1"><span className="ln"><i>Agents that</i></span><span className="ln"><i>get things done<span className="dot-anchor" data-anchor /></i></span></h1>
    <div className="hero-foot">
      <p className="lead">I’m Aamaan Sharrma, an AI engineer based in Pune. I build agent systems and take them from prototype to production.</p>
      <div className="hero-cta rise"><TLink className="ulink" to="/" go="work" label="My work">View my work<DirectionArrow /></TLink><a className="ulink" href={RESUME}>Résumé<DirectionArrow /></a></div>
      <p className="cue">Scroll to follow the work.</p>
    </div>
  </section>;
}

function Proof() {
  return <section className="story-proof" id="work" data-theme="paper" aria-labelledby="proof-h">
    <div className="story-heading"><h2 id="proof-h">Less waiting.<br />Same job done.</h2><p className="lead">An order summary should help someone move forward. Waiting for it shouldn’t become another task.</p></div>
    <div className="result-scene" data-journey><Dock size={32} /><p className="result-number" aria-label="35 seconds to about 20 seconds"><span>35<span className="result-unit">s</span></span><span className="result-arrow" aria-hidden="true">→</span><span>~20<span className="result-unit">s</span></span></p></div>
    <div className="result-context"><p>I rebuilt the order notes agent’s request lifecycle around streaming, replacing a three-tier timeout chain with one streamed response.</p><div><p className="small">Measured average generation time. Running across two production regions on AWS Bedrock AgentCore.</p><TLink className="ulink" to="/work/order-notes-summarizer" label="Order notes summarizer">Explore the engineering decisions<DirectionArrow /></TLink></div></div>
  </section>;
}

function Relay() {
  return <section className="story-relay" id="ensemble" data-theme="ink" aria-labelledby="ens-h">
    <div className="story-heading"><h2 id="ens-h">Five agents.<br />One answer.</h2><div className="lead"><p>When a production issue appears, the evidence rarely lives in one place.</p><p>This root-cause system brings logs, code, and external context into one investigation.</p></div></div>
    <div className="agent-story" data-journey-group data-active="0">
      <ol className="agent-scenes">{AGENT_STORY.map((agent, i) => <li className="agent-scene" data-journey data-chapter={i} key={agent.name}><div className="scene-copy"><Dock size={i === 4 ? 30 : 14 + i * 2} /><p className="scene-label">{agent.name}</p><h3>{agent.title}</h3><p>{agent.text}</p>{i === 4 && <TLink className="ulink" to="/work/rca-multi-agent-system" label="Root-cause system">Explore the multi-agent system<DirectionArrow /></TLink>}</div></li>)}</ol>
      <figure className="evidence-stage" aria-label="Workflow illustration: logs, analysis, code changes and external context are assembled into a root-cause document saved to S3.">
        <figcaption><span>One investigation</span><span className="small">Workflow illustration</span></figcaption>
        <div className="evidence-sheet" aria-hidden="true"><p className="sheet-title">Evidence collected</p><ol>{AGENT_STORY.map(agent => <li className="evidence-row" key={agent.name}><span>{agent.evidence}</span><small>{agent.source}</small></li>)}</ol></div>
        <div className="evidence-progress" aria-hidden="true">{AGENT_STORY.map((agent, i) => <span key={agent.name}>{i + 1}</span>)}</div>
      </figure>
    </div>
  </section>;
}

function MoreWork() {
  const section = useRef(null);
  useGsap(() => {
    const details = section.current.querySelector('.project-index');
    const summary = details.querySelector('summary');
    const links = [...details.querySelectorAll('.more-work a')];
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let closing = false;
      const finishClose = () => {
        closing = false;
        details.removeAttribute('data-closing');
        details.open = false;
      };
      const reveal = gsap.timeline({ paused: true, onReverseComplete: finishClose })
        .set(links, { opacity: 0, y: 14, immediateRender: false })
        .to(links, { opacity: 1, y: 0, duration: .42, stagger: .045, ease: 'power2.out', clearProps: 'transform,opacity' });
      const toggle = () => {
        if (details.open) reveal.timeScale(1).restart();
        else { closing = false; details.removeAttribute('data-closing'); reveal.pause(0, true); }
      };
      const click = event => {
        if (!details.open) return;
        // Keep native details open until the text has finished leaving.
        event.preventDefault();
        if (closing) {
          closing = false;
          details.removeAttribute('data-closing');
          reveal.timeScale(1).play();
        } else {
          closing = true;
          details.setAttribute('data-closing', '');
          if (reveal.time() === 0) finishClose();
          else reveal.timeScale(1.5).reverse();
        }
      };
      // Keyboard users can reach every link immediately, including during the reveal.
      const focus = event => {
        if (event.target.closest('.more-work a')) {
          closing = false;
          details.removeAttribute('data-closing');
          reveal.progress(1).pause();
        }
      };
      summary.addEventListener('click', click);
      details.addEventListener('toggle', toggle);
      details.addEventListener('focusin', focus);
      return () => {
        summary.removeEventListener('click', click);
        details.removeEventListener('toggle', toggle);
        details.removeEventListener('focusin', focus);
        if (closing) finishClose();
      };
    });
    return () => media.revert();
  });
  return <section ref={section} className="story-work" id="more-work" data-theme="paper" aria-labelledby="more-h">
    <h2 id="more-h">Different workflows.<br />The same care.</h2>
    <article className="deck-preview" data-journey><div className="deck-copy"><Dock size={24} /><p className="small">In development</p><h3>Presentation agent</h3><p>From project data to a client deck. The model proposes a page plan; code handles layout rules, validation, and publishing.</p><TLink className="ulink" to="/work/presentation-agent" label="Presentation agent">Explore the project<DirectionArrow /></TLink></div><figure className="deck-flow"><ol><li>Project data</li><li>Plan &amp; validate</li><li>Client deck</li></ol><figcaption className="small">Simplified workflow</figcaption></figure></article>
    <details className="story-details project-index"><summary><span className="project-index-label"><span>View all projects</span><small>{CASES.length} projects, from AI agents to full-stack systems</small></span><span className="project-index-toggle" aria-hidden="true"><span className="project-index-arrow" /></span></summary><div className="detail-body"><ul className="more-work">{CASES.map(c => <li key={c.slug}><TLink to={`/work/${c.slug}`} label={c.title}><span>{c.title}</span><span>{c.kind}<DirectionArrow /></span></TLink></li>)}</ul></div></details>
  </section>;
}

function Method() {
  return <section className="story-method" id="method" data-theme="ink" aria-labelledby="method-h" data-journey><div className="method-intro"><Dock size={24} /><h2 id="method-h">From the first question<br />to production.</h2><p className="lead">How I work with a team.</p></div><ol className="method-scenes">{METHOD.map(([title, text]) => <li className="method-scene" key={title}><div className="scene-copy"><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>;
}

function Background() {
  return <div className="background-details">
    <details className="story-details"><summary><span>My background</span><span className="detail-icon" aria-hidden="true">+</span></summary><div className="detail-body"><p>At Mindstix, I build and operate AI agents on AWS Bedrock AgentCore. Before that, I worked on React and Node applications across retail and other business workflows.</p><p>Things I can talk about for hours: agent evaluation, hybrid retrieval, timeouts and retries, production triage, streaming UX, and multi-agent orchestration.</p></div></details>
    <details className="story-details"><summary><span>Tools I work with</span><span className="detail-icon" aria-hidden="true">+</span></summary><div className="detail-body"><p>AWS Bedrock AgentCore, Strands Agents, LangChain, LangGraph, RAG, and MCP. React, TypeScript, Node.js, and Flask across the application layer.</p><dl className="tool-inventory">{TOOLS.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl></div></details>
    <details className="story-details" id="experience"><summary><span>Experience and credentials</span><span className="detail-icon" aria-hidden="true">+</span></summary><div className="detail-body"><div className="career-history">{CAREER.map(job => <article key={job.company}><p className="small">{job.dates}</p><h3>{job.company}</h3><p>{job.role}</p><ul>{job.points.map(point => <li key={point}>{point}</li>)}</ul></article>)}</div><h3>Education</h3><p>B.Tech, Information Technology, Vishwakarma Institute of Information Technology. CGPA 8.91 of 10, 2021 to 2025.</p><h3>Certifications and publication</h3><ul className="credentials">{CREDENTIALS.map(item => <li key={item}>{item}</li>)}</ul><a className="ulink" href={RESUME}>Read the full résumé<DirectionArrow /></a></div></details>
  </div>;
}

function About() {
  return <section className="story-about" id="about" data-theme="paper" aria-labelledby="about-h"><div className="care-statement" data-journey><Dock size={34} /><h2 id="about-h">I like the<br /><em>careful part.</em></h2><p className="care-list">The timeouts. The retries. The evaluations.</p><p className="lead">The on-call note that helps the next person understand what happened.</p><p className="care-resolution">That’s the work that turns a demo into something a team can rely on.</p></div><Background /></section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(EMAIL); setCopied(true); } catch { setCopied(false); } };
  useEffect(() => { if (!copied) return; const id = setTimeout(() => setCopied(false), 1800); return () => clearTimeout(id); }, [copied]);
  return <section className="contact" id="contact" data-theme="ink" aria-labelledby="contact-h"><h2 id="contact-h">Let’s get yours working.</h2><p className="lead">Have an AI workflow that needs to survive production? Let’s talk about the system, the constraints, and what needs to work.</p><div className="contact-destination"><span className="contact-stop" data-travel-size="28" data-travel-dock data-travel-mobile="dock" data-travel aria-hidden="true" /><a className="mail" href={EMAIL_DRAFT} id="mail" aria-label={`Email ${EMAIL}`}>{[...EMAIL].map((c, i) => <span className="ch" aria-hidden="true" key={i} style={{ '--i': i }}>{c}</span>)}</a></div><div className="contact-row"><button className="btn" type="button" onClick={copy}><Roll>{copied ? 'Copied' : 'Copy email'}</Roll></button><a className="ulink" href={RESUME}>Résumé<DirectionArrow /></a><a className="ulink" href="https://github.com/ammansharrma">GitHub<DirectionArrow /></a><p className="status">Open to agentic AI roles and freelance projects</p></div><p className="vh" role="status">{copied ? 'Email copied to clipboard' : ''}</p></section>;
}

export default function Home() {
  usePage();
  useEffect(() => {
    setMeta('Aamaan Sharrma · Agentic AI engineer and forward deployed engineer', 'Aamaan Sharrma designs multi-agent systems on AWS Bedrock AgentCore and keeps them running in production. Agentic AI engineer and forward deployed engineer in Pune.');
    const refresh = () => ScrollTrigger.refresh();
    const details = [...document.querySelectorAll('#page details')];
    details.forEach(el => el.addEventListener('toggle', refresh));
    return () => details.forEach(el => el.removeEventListener('toggle', refresh));
  }, []);
  return <><Hero /><Proof /><Relay /><MoreWork /><Method /><About /><Contact /><Footer right="" /></>;
}
