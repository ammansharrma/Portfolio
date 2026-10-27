import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CASES, WHY, FIGURES } from '../data/site';
import { TLink, Roll, Footer } from '../components/Layout';
import { gsap, ScrollTrigger, S, reduce, $$, getLenis, usePage, useGsap, setMeta } from '../motion/engine';

/* A re-skinned architecture diagram. Hover or focus a component to trace what it talks to. */
function Arch({ d, svg: markup }) {
  const ref = useRef(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!full) return undefined;
    const l = getLenis(); l && l.stop();
    const k = e => { if (e.key === 'Escape') setFull(false); };
    addEventListener('keydown', k);
    return () => { l && l.start(); removeEventListener('keydown', k); };
  }, [full]);

  useGsap(() => {
    const fig = ref.current, svg = fig && fig.querySelector('svg'); if (!svg) return undefined;
    const nodes = $$('g[data-node-id]', svg), edges = $$('path[data-edge-id]', svg), labels = $$('text[class^="t-edge"]', svg);
    nodes.forEach(n => { if ((d.hero || []).includes(n.dataset.nodeLabel)) n.classList.add('is-hero'); });

    /* Edge labels carry no id: tie each to the nearest edge so a whole connection lights up together. */
    const segs = e => { const p = e.dataset.compositionPoints.split(';').map(q => q.split(',').map(Number)); return p.slice(1).map((b, i) => [p[i], b]); };
    const dist = (x, y, [[ax, ay], [bx, by]]) => {
      const dx = bx - ax, dy = by - ay, t = dx || dy ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))) : 0;
      return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
    };
    const owner = labels.map(l => {
      const x = +l.getAttribute('x'), y = +l.getAttribute('y'); let best = null, bd = Infinity;
      edges.forEach(e => segs(e).forEach(sg => { const v = dist(x, y, sg); if (v < bd) { bd = v; best = e; } }));
      return best;
    });
    const focus = id => {
      const linked = new Set([id]);
      edges.forEach(e => { const hit = e.dataset.edgeFrom === id || e.dataset.edgeTo === id; e.classList.toggle('is-on', hit); if (hit) { linked.add(e.dataset.edgeFrom); linked.add(e.dataset.edgeTo); } });
      nodes.forEach(n => n.classList.toggle('is-on', linked.has(n.dataset.nodeId)));
      labels.forEach((l, i) => l.classList.toggle('is-on', !!owner[i] && owner[i].classList.contains('is-on')));
      fig.classList.add('focus');
    };
    const clear = () => { fig.classList.remove('focus'); [...nodes, ...edges, ...labels].forEach(n => n.classList.remove('is-on')); };
    const offs = [];
    nodes.forEach(n => {
      const on = () => focus(n.dataset.nodeId);
      n.addEventListener('pointerenter', on); n.addEventListener('focus', on);
      n.addEventListener('pointerleave', clear); n.addEventListener('blur', clear);
      offs.push(() => { n.removeEventListener('pointerenter', on); n.removeEventListener('focus', on); n.removeEventListener('pointerleave', clear); n.removeEventListener('blur', clear); });
    });

    /* Draw-in: components appear in reading order, then the connections trace themselves. */
    if (!reduce) {
      const solid = edges.filter(e => !e.classList.contains('a-dashed')), dashed = edges.filter(e => e.classList.contains('a-dashed'));
      gsap.set([...nodes, ...labels, ...dashed], { opacity: 0 });
      solid.forEach(e => { e.setAttribute('pathLength', '1'); e.style.strokeDasharray = '1'; e.style.strokeDashoffset = '1'; });
      ScrollTrigger.create({
        trigger: fig, start: 'top 78%', once: true,
        onEnter: () => gsap.timeline({ onComplete: () => { gsap.set([...nodes, ...labels, ...dashed], { clearProps: 'opacity' }); solid.forEach(e => { e.style.strokeDasharray = ''; e.style.strokeDashoffset = ''; }); } })
          .to(nodes, { opacity: 1, duration: .6, stagger: .035, ease: 'power2.out' })
          .to(solid, { strokeDashoffset: 0, duration: .8, stagger: .04, ease: 'power2.out' }, .2)
          .to([...dashed, ...labels], { opacity: 1, duration: .5, stagger: .02 }, .5)
      });
    }
    ScrollTrigger.refresh();
    return () => offs.forEach(f => f());
  }, [d]);

  return (
    <figure className={'arch' + (full ? ' arch--full' : '')} ref={ref} data-lenis-prevent={full ? '' : undefined}>
      <figcaption><b>{d.title}</b><span>{d.caption}</span></figcaption>
      <button className="btn arch-btn" type="button" onClick={() => setFull(v => !v)} aria-pressed={full}><Roll>{full ? 'Close' : 'View full size'}</Roll></button>
      <div className="arch-scroll" dangerouslySetInnerHTML={{ __html: markup }} />
    </figure>
  );
}

/* Time to a client-ready deck: a small interactive comparison. Pick a scenario and the bars and the percentage follow. */
function TimeSaved({ t }) {
  const modes = [
    ['low', 'Smallest saving', t.handLow, t.agentHigh],
    ['mid', 'Typical', (t.handLow + t.handHigh) / 2, (t.agentLow + t.agentHigh) / 2],
    ['high', 'Largest saving', t.handHigh, t.agentLow]
  ];
  const [m, setM] = useState('mid');
  const ref = useRef(null);
  useGsap(() => {
    const el = ref.current; if (!el) return;
    if (reduce) { el.classList.add('in'); return; }
    ScrollTrigger.create({ trigger: el, start: 'top 70%', once: true, onEnter: () => el.classList.add('in') });
  });
  const [, , hand, agent] = modes.find(x => x[0] === m);
  const pct = x => Math.round((1 - x[0] / x[1]) * 100);
  const fmt = h => (Number.isInteger(h) ? h : h.toFixed(1)) + ' h';
  const lowPct = pct([t.agentHigh, t.handLow]), highPct = pct([t.agentLow, t.handHigh]), midPct = pct([(t.agentLow + t.agentHigh) / 2, (t.handLow + t.handHigh) / 2]);
  return (
    <section className="ts" data-theme="ink" aria-labelledby="ts-h" ref={ref}>
      <h2 id="ts-h" className="rise">Time to a client-ready deck</h2>
      <p className="lead rise">The agent builds the deck in about {t.buildMin} minutes. The rest is the designer reviewing and adjusting it. Pick a scenario to see how the saving moves.</p>
      <div className="ts-ctl" role="group" aria-label="Scenario">
        {modes.map(([k, label]) => <button key={k} type="button" aria-pressed={m === k} onClick={() => setM(k)}>{label}</button>)}
      </div>
      <div className="ts-grid">
        <div className="ts-rows">
          <div className="ts-row"><h3>By hand</h3><div className="ts-track" aria-hidden="true"><i className="ts-bar" style={{ width: (hand / t.handHigh * 100) + '%' }} /></div><output className="num">{fmt(hand)}</output></div>
          <div className="ts-row"><h3>With the agent</h3>
            <div className="ts-track" aria-hidden="true"><i className="ts-bar agent" style={{ width: (agent / t.handHigh * 100) + '%' }}><i className="ts-gen" style={{ width: Math.min(100, t.buildMin / 60 / agent * 100) + '%' }} /></i></div>
            <output className="num">{fmt(agent)}</output></div>
          <p className="ts-key"><span><i className="k gen" />The agent builds the deck, about {t.buildMin} min</span><span><i className="k rev" />The designer reviews and adjusts</span></p>
        </div>
        <p className="ts-big" aria-live="polite"><span className="num">{pct([agent, hand])}</span>%<small>less time, {fmt(hand)} down to {fmt(agent)}</small></p>
      </div>
      <p className="small ts-note">Across the range that is {lowPct}% to {highPct}% less time, and about {midPct}% overall at the midpoints.</p>
    </section>
  );
}

function CaseBody({ c, nx }) {
  usePage();
  const figN = useRef(null);
  useEffect(() => setMeta(`${c.title} · Aamaan Sharrma`, c.lede), [c]);

  useGsap(() => {
    const fn = figN.current;
    if (!reduce && fn && /^\d+$/.test(c.fig.n)) {
      const to = +c.fig.n, o = { v: 0 }; fn.textContent = '0';
      ScrollTrigger.create({ trigger: '.case-fig', start: 'top 70%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'expo.out', onUpdate: () => { fn.textContent = Math.round(o.v); } }) });
    }
  }, [c]);

  /* The next-case flood grows from wherever the pointer is. */
  const onMove = e => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  const [svgs, setSvgs] = useState(null);
  useEffect(() => { if (c.diagrams) import('../data/diagrams').then(m => setSvgs(m.SVGS)); }, [c]);
  const figure = FIGURES[c.slug];
  const hasMedia = !!figure;
  return (
    <>
      <section className="case-hero" data-theme="ink" aria-labelledby="c-title">
        <p className="crumb rise"><TLink className="ulink" to="/" go="work" label="Work">All work</TLink> / <span>{c.org}</span></p>
        <h1 id="c-title"><span className="ln"><i>{c.title}<span className="dot-anchor" data-anchor /></i></span></h1>
        <p className="lead rise">{c.lede}</p>
        <dl className="metas rise">
          <div><dt>Role</dt><dd>{c.role}</dd></div><div><dt>Where</dt><dd>{c.org}</dd></div>
          <div><dt>Year</dt><dd>{c.year}</dd></div><div><dt>Kind</dt><dd>{c.kind}</dd></div>
        </dl>
      </section>

      <section className="case-fig" data-theme="amber" aria-label="The number that matters">
        <p className="fig" aria-label={c.fig.n + (c.fig.u === '%' ? ' percent' : '')}><span ref={figN}>{c.fig.n}</span>{c.fig.u ? <sup aria-hidden="true">{c.fig.u}</sup> : null}</p>
        <p className="cap rise">{c.fig.cap}</p>
      </section>

      <div data-theme="paper">
        <section className="case-body" aria-labelledby="c-h-problem">
          <h2 id="c-h-problem" className="rise">The challenge</h2>
          <div className="txt rise"><p>{c.problem}</p></div>
          <h2 className="rise">What I did</h2>
          <div className="txt rise">
            <ol>{c.approach.map(a => <li key={a}>{a}</li>)}</ol>
            <ul className="stackrow" aria-label="Stack">{c.stack.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
          {c.decisions && (
            <>
              <h2 className="rise">{c.decisionsTitle || 'Decisions I made'}</h2>
              <div className="txt rise"><ol>{c.decisions.map(a => <li key={a}>{a}</li>)}</ol></div>
            </>
          )}
          <h2 className="rise">Why it works that way</h2>
          <div className="txt rise"><p>{WHY[c.slug]}</p></div>
        </section>
        <div className="outs rise">{c.out.map(o => <div key={o[1]}><b>{o[0]}</b><span>{o[1]}</span></div>)}</div>
        {hasMedia && (
          <div className="case-media rise">
            <figure dangerouslySetInnerHTML={{ __html: figure }} />
          </div>
        )}
      </div>

      {c.timeSaved && <TimeSaved t={c.timeSaved} />}

      {c.diagrams && (
        <section className="arch-sec" data-theme="ink" aria-labelledby="arch-h">
          <h2 id="arch-h" className="rise">{c.archTitle || 'Architecture'}</h2>
          <p className="lead rise">Hover or focus a component to trace everything it talks to.</p>
          {svgs && c.diagrams.map(d => <Arch key={d.key} d={d} svg={svgs[d.key]} />)}
        </section>
      )}

      <TLink className="next" to={`/work/${nx.slug}`} label={nx.title} data-cursor="Next" data-theme="ink" onPointerMove={onMove}>
        <small>Next case</small><h2>{nx.title}</h2>
      </TLink>

      <Footer right={<TLink className="ulink" to="/" go="contact" label="Contact">Let’s talk</TLink>} />
    </>
  );
}

export function NotFound() {
  usePage();
  useEffect(() => setMeta('A quick detour · Aamaan Sharrma', 'This page has moved on. The work is one click away.'), []);
  useEffect(() => {
    if (reduce) return undefined;
    S.offY = -innerHeight * .7;
    const t = gsap.to(S, { offY: 0, duration: 1.7, ease: 'bounce.out', delay: 1.5 });
    return () => { t.kill(); S.offY = 0; };
  }, []);
  return (
    <>
      <section className="e404" data-theme="ink" aria-labelledby="e-h">
        <h1 id="e-h"><span className="ln"><i>Let’s head back<span className="dot-anchor" data-anchor /></i></span></h1>
        <p className="lead rise">This address has moved on, and the work is one click away.</p>
        <p className="rise"><TLink className="btn" to="/" label="Home"><Roll>Take it from the top</Roll></TLink></p>
      </section>
      <Footer showName={false} right="Detour noted. The work is close by." />
    </>
  );
}

export default function Case() {
  const { slug } = useParams();
  const i = CASES.findIndex(c => c.slug === slug);
  if (i < 0) return <NotFound />;
  return <CaseBody c={CASES[i]} nx={CASES[(i + 1) % CASES.length]} />;
}
