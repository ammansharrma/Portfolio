import { useEffect, useLayoutEffect, useState } from 'react';
import { CASES, DRAWN } from '../data/site';
import { TLink, Roll, Footer } from '../components/Layout';
import { gsap, ScrollTrigger, S, reduce, fine, $, $$, clamp, usePage, useGsap, setMeta } from '../motion/engine';

const RESUME = `${import.meta.env.BASE_URL}Aamaan-Sharrma.pdf`;
const EMAIL = 'aamaansharrma6@gmail.com';

const AGENTS = [
  ['Observer', 'Reads the CloudWatch logs and spots the spike.'],
  ['Analyzer', 'Finds the pattern behind it.'],
  ['Code agent', 'Checks recent changes in GitHub, over MCP.'],
  ['Web search', 'Looks for known fixes outside the building.'],
  ['Finalizer', 'Writes the root-cause document and files it to S3.']
];
const DOC = [
  ['Observed.', 'Response times stretch as load builds.'],
  ['Pattern.', 'Each tier waits on the next, tier after tier.'],
  ['Code.', 'A recent change touches the retry path.'],
  ['Context.', 'Buffered responses are a known cause.'],
  ['Root cause.', 'The tiers wait on each other. Stream the answer and every tier keeps moving.']
];
const ROWS = {
  'order-notes-summarizer': ['35 s to about 20 s', 'Production agent · Luxury furniture brand · 2025'],
  'presentation-agent': ['About 90% less time per deck', 'Agentic workflow · Luxury furniture brand · 2026'],
  'rca-multi-agent-system': ['5 agents, 1 document', 'Multi-agent system · Mindstix · 2025'],
  'csr-rep-copilot': ['Live, with cited evidence', 'Proof of concept · Insurance agency · 2025'],
  'promotions-sku-portal': ['Promotions and SKUs, in React 18', 'Full-stack features · FMCG client · 2025'],
  vidhaanai: ['40% to 26% hallucination', 'Orchestration platform · Personal · 2025'],
  'stock-predictor': ['12% better accuracy', 'Time-series model · Personal · 2024'],
  ratna: ['12 products, plain JavaScript', 'Front-end foundations · Personal · 2024']
};
const ABOUT = 'I build with language models for a living, and I ship what comes out of the experiments. At Mindstix I run agents in production on AWS Bedrock AgentCore; before that I built React and Node systems for retail. What I like most is the careful part: the timeouts, the retries, the evals and the on-call note that turns a demo into something a team can rely on.';

function Hero() {
  return (
    <section className="hero" id="hero" data-theme="ink" aria-labelledby="h1">
      <h1 id="h1"><span className="ln"><i>Agents that</i></span><span className="ln"><i>get things done<span className="dot-anchor" data-anchor /></i></span></h1>
      <div className="hero-foot">
        <p className="lead">I’m Aamaan Sharrma, an agentic AI engineer and forward deployed engineer in Pune. I design multi-agent systems on AWS Bedrock AgentCore and keep them running in production.</p>
        <div className="hero-cta rise">
          <a className="ulink" href={RESUME}>Résumé (PDF)</a>
          <p className="cue">Scroll, and follow the light.</p>
        </div>
        <ul className="facts rise" aria-label="Highlights">
          <li><div><b>43%</b><span>faster generation on a production agent, 35 s to about 20 s</span></div></li>
          <li><div><b>5</b><span>agents hand off in one root-cause system</span></div></li>
          <li><div><b>2</b><span>production regions on AWS Bedrock AgentCore</span></div></li>
        </ul>
      </div>
    </section>
  );
}

/* The pinned relay: scroll hands the dot through five agents while the document writes itself. */
function Relay() {
  useEffect(() => () => { S.stage = null; }, []);
  useGsap(() => {
    const stage = $('#stage'); if (!stage) return;
    const nodes = $$('.node'), lines = $$('.dl'), stamp = $('.stamp'), rail = $('#rail'), now = $('#now');
    const pts = nodes.map(n => $('.pt', n)), n = nodes.length;
    const set = k => {
      nodes.forEach((nd, i) => nd.classList.toggle('on', i <= k));
      lines.forEach((l, i) => l.classList.toggle('on', i <= k));
      now.innerHTML = k >= 0 ? `<b>${$('b', nodes[k]).textContent}</b><span>${$('.d', nodes[k]).textContent}</span>` : '';
    };
    if (reduce) { set(n - 1); stamp.classList.add('on'); rail.style.setProperty('--p', 1); return; }
    set(-1);
    const st = ScrollTrigger.create({ trigger: '#ensemble', start: 'top top', end: () => '+=' + Math.round(innerHeight * 3.4), pin: stage, pinSpacing: true, invalidateOnRefresh: true, anticipatePin: 1 });
    let last = -2;
    S.stage = {
      st, pts, n,
      update(u, p) {
        const k = Math.floor(u + .22);
        if (k !== last) { last = k; set(clamp(k, -1, n - 1)); }
        stamp.classList.toggle('on', p > .985);
        rail.style.setProperty('--p', clamp(u / (n - 1)).toFixed(4));
      }
    };
  });
  return (
    <section className="ens" id="ensemble" data-theme="ink" aria-labelledby="ens-h">
      <div className="ens-stage" id="stage">
        <div className="ens-head">
          <h2 id="ens-h">Five agents. One answer.</h2>
          <p className="lead">This is how my root-cause system handles a production issue, one hand-off at a time. Keep scrolling and the light carries the context from agent to agent.</p>
        </div>
        <div className="ens-doc" role="img" aria-label="An illustrative root-cause document, written line by line by the five agents">
          <p className="doc-title">Root cause analysis <span>illustrative</span></p>
          {DOC.map(([b, t], i) => <p key={b} className={'dl' + (i === 4 ? ' final' : '')} data-i={i}><b>{b}</b> {t}</p>)}
          <span className="stamp" aria-hidden="true">Saved to S3</span>
        </div>
        <p className="now" id="now" aria-live="polite" />
        <div className="ens-rail" id="rail">
          <span className="rl" aria-hidden="true" /><span className="rl" aria-hidden="true" />
          <ol className="nodes">
            {AGENTS.map(([name, d], i) => <li key={name} className="node" data-i={i}><span className="pt" /><b>{name}</b><span className="d">{d}</span></li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* Two dots race along their request lanes. */
function Proof() {
  useGsap(() => {
    const rb = $('#rd-b'), ra = $('#rd-a'), bb = $('#bar-b'), ba = $('#bar-a'), ob = $('#out-b'), oa = $('#out-a'), count = $('#count');
    if (!rb) return;
    const wB = () => rb.parentElement.clientWidth;
    if (reduce) { gsap.set(rb, { x: wB() }); gsap.set(ra, { x: wB() * .5714 }); gsap.set(bb, { scaleX: 1 }); gsap.set(ba, { scaleX: .5714 }); return; }
    gsap.set([rb, ra], { x: 0 }); gsap.set([bb, ba], { scaleX: 0 });
    let tl;
    const run = () => {
      tl && tl.kill();
      const cb = { v: 0 }, ca = { v: 0 }, cn = { v: 0 };
      gsap.set([rb, ra], { x: 0 }); gsap.set([bb, ba], { scaleX: 0 });
      ob.textContent = '0.0 s'; oa.textContent = '0.0 s'; count.textContent = '0';
      tl = gsap.timeline();
      for (let i = 0; i < 3; i++) {
        const at = i * 1.2;
        tl.to(rb, { x: () => wB() * (i + 1) / 3, duration: 1, ease: 'power2.inOut' }, at)
          .to(bb, { scaleX: (i + 1) / 3, duration: 1, ease: 'power2.inOut' }, at);
      }
      tl.to(cb, { v: 35, duration: 3.4, ease: 'none', onUpdate: () => { ob.textContent = cb.v.toFixed(1) + ' s'; }, onComplete: () => { ob.textContent = '35 s'; } }, 0)
        .to(ra, { x: () => wB() * .5714, duration: 1.95, ease: 'power3.out' }, 0)
        .to(ba, { scaleX: .5714, duration: 1.95, ease: 'power3.out' }, 0)
        .to(ca, { v: 20, duration: 1.95, ease: 'power3.out', onUpdate: () => { oa.textContent = ca.v.toFixed(1) + ' s'; }, onComplete: () => { oa.textContent = '~20 s'; } }, 0)
        .to(cn, { v: 43, duration: 1.6, ease: 'expo.out', onUpdate: () => { count.textContent = Math.round(cn.v); } }, .2);
    };
    ScrollTrigger.create({ trigger: '#race', start: 'top 78%', once: true, onEnter: run });
    const btn = $('#run'); btn.addEventListener('click', run);
    return () => btn.removeEventListener('click', run);
  });
  return (
    <section className="proof" id="proof" data-theme="amber" aria-labelledby="proof-h">
      <div className="proof-grid">
        <h2 id="proof-h" className="rise">Same agent, almost half the wait.</h2>
        <p className="fig" aria-label="43 percent"><span id="count">43</span><sup aria-hidden="true">%</sup></p>
        <div className="proof-r">
          <p className="lead rise">Faster average generation time for the order notes agent, from about 35 seconds to about 20. I rebuilt its request lifecycle around SSE streaming and replaced a three-tier timeout chain with one streamed response. It runs in two production regions on AWS Bedrock AgentCore.</p>
          <div className="race" id="race">
            <div className="lane"><h3>Before. Each tier waits for the next.</h3>
              <div className="track" aria-hidden="true"><i className="tier" style={{ left: 0 }} /><i className="tier" style={{ left: '33.33%' }} /><i className="tier" style={{ left: '66.66%' }} /><i className="bar2" id="bar-b" style={{ width: '100%' }} /><i className="rd" id="rd-b" /></div>
              <output className="num" id="out-b">35 s</output></div>
            <div className="lane"><h3>After. One streamed response.</h3>
              <div className="track" aria-hidden="true"><i className="bar2" id="bar-a" style={{ width: '100%' }} /><i className="rd" id="rd-a" /></div>
              <output className="num" id="out-a">~20 s</output></div>
          </div>
          <div className="race-foot"><button className="btn amber" type="button" id="run"><Roll>Run it again</Roll></button><p className="small" style={{ color: 'inherit', opacity: .75 }}>Schematic of the request path. The two totals are measured averages; the segments are drawn for illustration.</p></div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  useGsap(() => {
    const rows = $('#rows'), prev = $('#wprev'); if (!rows || !fine || reduce) return;
    const make = slug => {
      const c = CASES.find(x => x.slug === slug); if (!c) return null;
      const wrap = document.createElement('div');
      wrap.innerHTML = DRAWN[c.thumb] || '';
      return wrap.firstElementChild;
    };
    const qx = gsap.quickTo(prev, 'x', { duration: .6, ease: 'power3.out' }), qy = gsap.quickTo(prev, 'y', { duration: .6, ease: 'power3.out' });
    const cache = {}; let shown = false;
    const move = e => { const w = prev.offsetWidth, h = prev.offsetHeight; qx(clamp(e.clientX + 36, 8, innerWidth - w - 8)); qy(clamp(e.clientY - h / 2, 8, innerHeight - h - 8)); };
    const hide = () => { shown = false; gsap.to(prev, { clipPath: 'inset(50% 50% 50% 50% round 16px)', duration: .5, ease: 'expo.inOut', overwrite: 'auto' }); };
    rows.addEventListener('pointermove', move);
    rows.addEventListener('pointerleave', hide);
    $$('a', rows).forEach(a => a.addEventListener('pointerenter', e => {
      const slug = a.dataset.slug; cache[slug] = cache[slug] || make(slug); const el = cache[slug]; if (!el) return;
      prev.replaceChildren(el);
      if (!shown) gsap.set(prev, { x: clamp(e.clientX + 36, 8, innerWidth - 420), y: clamp(e.clientY - 130, 8, innerHeight - 280) });
      shown = true;
      gsap.to(prev, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: .7, ease: 'expo.out', overwrite: 'auto' });
      gsap.fromTo(el, { scale: 1.18 }, { scale: 1, duration: 1, ease: 'expo.out' });
    }));
  });
  return (
    <section className="work" id="work" data-theme="paper" aria-labelledby="work-h">
      <div className="work-head">
        <h2 id="work-h" className="rise">Systems I’ve built and run.</h2>
        <p className="lead rise">Each one started as a real human need. Same habit every time: measure it, then make it hold.</p>
      </div>
      <ul className="rows" id="rows">
        {CASES.map(c => (
          <li className="row" key={c.slug}>
            <TLink to={`/work/${c.slug}`} label={c.title} data-cursor="Open" data-slug={c.slug}>
              <h3>{c.title}</h3>
              <div className="meta"><b>{ROWS[c.slug][0]}</b><span>{ROWS[c.slug][1]}</span>
                <div className="thumb" dangerouslySetInnerHTML={{ __html: DRAWN[c.thumb] }} />
              </div>
            </TLink>
          </li>
        ))}
      </ul>
      <div className="wprev" id="wprev" aria-hidden="true" />
    </section>
  );
}

function Method() {
  useGsap(() => {
    const steps = $$('.step'), list = $('#steps'); if (!list) return;
    if (reduce) { steps.forEach(s => s.classList.add('on')); list.style.setProperty('--p', 1); return; }
    steps.forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 68%', onEnter: () => s.classList.add('on'), onLeaveBack: () => s.classList.remove('on') }));
    ScrollTrigger.create({ trigger: list, start: 'top 62%', end: 'bottom 62%', onUpdate: s => list.style.setProperty('--p', s.progress.toFixed(4)) });
  });
  return (
    <section className="method" id="method" data-theme="ink" aria-labelledby="method-h">
      <div className="method-grid">
        <div className="method-head"><h2 id="method-h" className="rise">How I work with a team.</h2><p className="lead rise">What you get when I join: four steps, each with its own proof.</p></div>
        <ol className="steps" id="steps">
          <li className="step"><span className="led" aria-hidden="true" /><h3>First, we pin down the requirement.</h3><p>I sit with the people who own the goal and turn what they want into something testable.</p></li>
          <li className="step"><span className="led" aria-hidden="true" /><h3>Then I design the agent system.</h3><p>Which agents, which tools, where state lives and what happens when a call times out, decided on paper first.</p></li>
          <li className="step"><span className="led" aria-hidden="true" /><h3>Then it ships, with evals attached.</h3><p>VidhaanAI’s hallucination rate fell from about 40% to 26% on a 50-query benchmark.</p></li>
          <li className="step"><span className="led" aria-hidden="true" /><h3>Then I stay for production.</h3><p>First response inside 24 hours, a habit that helped cut recurring issues by 50% at Mindstix.</p></li>
        </ol>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="exp" id="experience" data-theme="paper" aria-labelledby="exp-h">
      <div className="exp-grid">
        <div className="exp-head"><h2 id="exp-h" className="rise">Where I learned it.</h2><p className="edu rise">B.Tech, Information Technology, Vishwakarma Institute of Information Technology. CGPA 8.91 of 10, 2021 to 2025.</p></div>
        <div className="xs">
          <article className="xc rise"><p className="when">Jun 2025 to Nov 2026</p><h3>Mindstix Software Labs</h3><p className="role">Software Developer · AI agents on AWS</p>
            <ul><li>Architected and operated the order notes summarizer for a US luxury furniture brand across two production regions on shared Keycloak and OAuth.</li><li>Led the design spike and agent architecture for a presentation agent for the same brand, and am building it. It cuts a 14 to 16 hour deck to 1 to 2 hours.</li><li>Built GenAI solutions for contextual querying and document intelligence with LangChain, Flask and React, including a CSR copilot proof of concept for an insurance agency and a multi-agent RCA system.</li><li>Delivered full-stack features for an FMCG client’s promotions portal and SKU management system in React 18 and Node.js.</li><li>Took part in every SDLC phase, from requirement analysis to post-production support, inside Agile and Scrum teams.</li><li>Responded to production issues within 24 hours with SonarQube and Splunk, helping cut recurring issues by 50%.</li></ul></article>
          <article className="xc rise"><p className="when">Dec 2024 to Jun 2025</p><h3>OmneVu</h3><p className="role">Full Stack Developer Intern · React.js, Node.js, Express.js, MongoDB</p>
            <ul><li>Built and optimized full-stack web applications across several business domains.</li><li>Improved stock-tracking accuracy and reporting efficiency in an inventory management system.</li><li>Streamlined a warranty management system, reducing claim resolution time and improving the user experience.</li><li>Lifted product sales and customer engagement in a retail system through UI and UX improvements.</li></ul></article>
        </div>
      </div>
    </section>
  );
}

function About() {
  useLayoutEffect(() => {
    const sp = $$('#about-p span'); if (!sp.length) return undefined;
    if (reduce) { sp.forEach(s => s.classList.add('on')); return undefined; }
    const kills = [];
    kills.push(ScrollTrigger.create({ trigger: '#about-p', start: 'top 82%', end: 'bottom 52%', onUpdate: s => { const k = Math.round(s.progress * sp.length); sp.forEach((w, i) => w.classList.toggle('on', i < k)); } }));
    const rows = $$('.mq');
    rows.forEach(m => { m.half = m.scrollWidth / 2; m.pos = +m.dataset.dir > 0 ? -m.half : 0; });
    let active = false, lastY = scrollY;
    kills.push(ScrollTrigger.create({ trigger: '.talk', start: 'top bottom', end: 'bottom top', onToggle: s => { active = s.isActive; } }));
    const tick = (t, dt) => {
      const v = scrollY - lastY; lastY = scrollY;
      if (!active) return;
      rows.forEach(m => {
        const d = +m.dataset.dir;
        m.pos += d * (dt / 1000 * 70 + Math.abs(v) * .9);
        if (d < 0 && m.pos <= -m.half) m.pos += m.half;
        if (d > 0 && m.pos >= 0) m.pos -= m.half;
        gsap.set(m, { x: m.pos, skewX: clamp(-v * .12 * d, -7, 7) });
      });
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); kills.forEach(k => k.kill()); rows.forEach(m => gsap.set(m, { clearProps: 'all' })); };
  }, []);
  const A = ['Agent evaluation', 'Timeouts and retries', 'Streaming UX'], B = ['Hybrid retrieval', 'Multi-agent orchestration', 'Production triage'];
  return (
    <section className="about" id="about" data-theme="paper" aria-labelledby="about-h">
      <h2 id="about-h" className="vh">About</h2>
      <p className="about-p" id="about-p">{ABOUT.split(' ').map((w, i) => <span key={i}>{w + ' '}</span>)}</p>
      <div className="talk">
        <h3>Things I can talk about for hours</h3>
        <div className="mq-row"><div className="mq" data-dir="-1">{[...A, ...A].map((t, i) => <span key={i}>{t}</span>)}</div></div>
        <div className="mq-row"><div className="mq" data-dir="1">{[...B, ...B].map((t, i) => <span key={i}>{t}</span>)}</div></div>
      </div>
      <div className="tools rise">
        <div><h3>Agentic AI</h3><p>AWS Bedrock AgentCore, Amazon Bedrock, Strands Agents, LangChain, LangGraph, RAG, MCP, prompt engineering</p></div>
        <div><h3>Development</h3><p>React 18, TypeScript, JavaScript, Node.js, Express.js, NestJS, Flask, Material-UI, HTML, CSS, WebSockets</p></div>
        <div><h3>Data and cloud</h3><p>MongoDB, SQL, Pandas, NumPy, scikit-learn, Matplotlib, Seaborn, AWS (S3, Secrets Manager, CloudWatch), Firebase</p></div>
        <div><h3>Tools</h3><p>Git, Streamlit, Hugging Face, SonarQube, Splunk, Agile and Scrum</p></div>
        <div className="tools-wide"><h3>Certified and published</h3><p>Anthropic Academy: Claude 101, Claude Code 101, Claude Code in Action and Claude Platform 101. IBM Data Scientist Professional Certificate (Nov 2024). Microsoft AI Odyssey and AI Skills Challenge (Feb 2024). AWS Machine Learning Foundation and Cloud Foundation (Oct 2023). Research paper: Advancing AI in Law Governance (Feb 2024).</p></div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); } catch { /* clipboard blocked: the mailto link still works */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="contact" id="contact" data-theme="ink" aria-labelledby="contact-h">
      <h2 id="contact-h" className="rise">Let’s get yours working<span className="live" aria-hidden="true" style={{ width: '.13em', height: '.13em', marginLeft: '.035em' }} /></h2>
      <p className="lead rise">Bring me an agent that is ready to leave the demo, and let’s get it running in production.</p>
      <a className="mail rise" href={`mailto:${EMAIL}`} id="mail" aria-label={`Email ${EMAIL}`}>{[...EMAIL].map((c, i) => <span className="ch" aria-hidden="true" key={i} style={{ '--i': i }}>{c}</span>)}</a>
      <div className="contact-row rise">
        <button className="btn" type="button" onClick={copy}><Roll>{copied ? 'Copied' : 'Copy email'}</Roll></button>
        <a className="ulink" href={RESUME}>Résumé (PDF)</a>
        <a className="ulink" href="https://github.com/ammansharrma">GitHub</a>
        <p className="status"><span className="live" aria-hidden="true" />Open to agentic AI roles and freelance projects</p>
      </div>
      <p className="vh" role="status">{copied ? 'Email copied to clipboard' : ''}</p>
    </section>
  );
}

export default function Home() {
  usePage();
  useEffect(() => setMeta('Aamaan Sharrma · Agentic AI engineer and forward deployed engineer', 'Aamaan Sharrma designs multi-agent systems on AWS Bedrock AgentCore and keeps them running in production. Agentic AI engineer and forward deployed engineer in Pune.'), []);
  return (
    <>
      <Hero /><Relay /><Proof /><Work /><Method /><Experience /><About /><Contact />
      <Footer right="Run complete. All clear." />
    </>
  );
}
