/* A tiny diagram builder. It emits the same SVG structure as the imported architecture diagrams
   (g[data-node-id], path[data-edge-from/to], c-*, t-*, a-*, m-* classes), so the case page's hover trace,
   draw-in and full-size viewer work on every diagram without special cases. */

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const SIGILS = {
  frontend: '<rect x="2" y="3" width="12" height="10" rx="2"/><path d="M2 6.5h12"/>',
  backend: '<rect x="2.5" y="3" width="11" height="4" rx="1"/><rect x="2.5" y="9" width="11" height="4" rx="1"/><path d="M5 5h.01M5 11h.01"/>',
  database: '<ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2"/>',
  cloud: '<path d="M4.5 12.5h7a2.5 2.5 0 0 0 .3-5A3.5 3.5 0 0 0 5 7a3 3 0 0 0-.5 5.5z"/>',
  security: '<path d="M8 2l5 2v4c0 3-2.2 5-5 6-2.8-1-5-3-5-6V4z"/>',
  external: '<rect x="2.5" y="5" width="8.5" height="8" rx="1.5"/><path d="M8 2.5h5.5V8M13.5 2.5 7.5 8.5"/>'
};
const KIND_NAMES = { frontend: 'Frontend', backend: 'Backend', database: 'Database', cloud: 'Cloud', security: 'Security', external: 'External' };
const EDGE = {
  flow: { a: 'a-emphasis', m: 'arrowhead-emphasis', t: 't-edge-emphasis', w: 1.8 },
  default: { a: 'a-default', m: 'arrowhead', t: 't-edge-default', w: 1.5 },
  dashed: { a: 'a-dashed', m: 'arrowhead-dashed', t: 't-edge-dashed', w: 1.4 },
  security: { a: 'a-security', m: 'arrowhead-security', t: 't-edge-security', w: 1.5 }
};

export function buildDiagram({ key, title, desc, w, h, nodes, edges, regions = [] }) {
  const P = key;
  const N = Object.fromEntries(nodes.map(n => [n.id, { w: 180, h: 64, ...n }]));
  const side = (n, s, off = 0) => (s === 'r' ? [n.x + n.w, n.y + n.h / 2 + off] : s === 'l' ? [n.x, n.y + n.h / 2 + off] : s === 'b' ? [n.x + n.w / 2 + off, n.y + n.h] : [n.x + n.w / 2 + off, n.y]);

  const route = e => {
    const a = N[e.from], b = N[e.to];
    let fs = e.fs, ts = e.ts;
    if (!fs) {
      const dx = b.x + b.w / 2 - (a.x + a.w / 2), dy = b.y + b.h / 2 - (a.y + a.h / 2);
      if (Math.abs(dx) * .6 >= Math.abs(dy)) { fs = dx >= 0 ? 'r' : 'l'; ts = dx >= 0 ? 'l' : 'r'; } else { fs = dy >= 0 ? 'b' : 't'; ts = dy >= 0 ? 't' : 'b'; }
    }
    const p1 = side(a, fs, e.fo || 0), p2 = side(b, ts, e.to_ || 0);
    if (e.via) return [p1, ...e.via, p2];
    const [x1, y1] = p1, [x2, y2] = p2, hz = s => s === 'r' || s === 'l';
    if (hz(fs) && hz(ts)) { if (Math.abs(y1 - y2) < 1) return [p1, p2]; const mx = e.mx ?? (x1 + x2) / 2; return [p1, [mx, y1], [mx, y2], p2]; }
    if (!hz(fs) && !hz(ts)) { if (Math.abs(x1 - x2) < 1) return [p1, p2]; const my = e.my ?? (y1 + y2) / 2; return [p1, [x1, my], [x2, my], p2]; }
    return hz(fs) ? [p1, [x2, y1], p2] : [p1, [x1, y2], p2];
  };

  let out = `<svg viewBox="0 0 ${w} ${h}" role="img" lang="en" aria-labelledby="${P}-t ${P}-d"><title id="${P}-t">${esc(title)}</title><desc id="${P}-d">${esc(desc)}</desc>`;
  out += '<defs>';
  [['arrowhead', 'm-default'], ['arrowhead-emphasis', 'm-emphasis'], ['arrowhead-security', 'm-security'], ['arrowhead-dashed', 'm-dashed']]
    .forEach(([id, c]) => { out += `<marker id="${P}-${id}" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" class="${c}"/></marker>`; });
  out += `<pattern id="${P}-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" class="c-grid" stroke-width="0.5"/></pattern></defs>`;
  out += `<rect width="100%" height="100%" fill="url(#${P}-grid)"/>`;

  regions.forEach(r => {
    out += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="12" class="c-region" stroke-width="1"/><text x="${r.x + 14}" y="${r.y + 18}" class="t-muted" font-size="10" font-weight="500">${esc(r.label)}</text>`;
  });

  const labels = [];
  edges.forEach((e, i) => {
    const t = EDGE[e.type || 'flow'], pts = route(e);
    const d = pts.map((p, j) => `${j ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
    out += `<g style="--step:${i}"><path data-graph-role="automatic-crossover-underlay" d="${d}" fill="none" stroke="var(--mask)" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>`;
    out += `<path data-edge-from="${e.from}" data-edge-to="${e.to}" data-edge-label="${esc(e.label || '')}" data-edge-id="${e.from}-${e.to}-${i}" data-composition-points="${pts.map(p => p.join(',')).join(';')}" d="${d}" fill="none" class="${t.a}" stroke-width="${t.w}" marker-end="url(#${P}-${t.m})"/></g>`;
    if (e.label) {
      let best = [pts[0], pts[1]], bl = 0;
      for (let k = 1; k < pts.length; k++) { const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); if (l > bl) { bl = l; best = [pts[k - 1], pts[k]]; } }
      const mx = (best[0][0] + best[1][0]) / 2, my = (best[0][1] + best[1][1]) / 2;
      const horizontal = Math.abs(best[0][1] - best[1][1]) < 1;
      labels.push(horizontal
        ? `<text x="${mx}" y="${my - 7}" class="${t.t}" font-size="9" text-anchor="middle">${esc(e.label)}</text>`
        : `<text x="${mx + 7}" y="${my + 3}" class="${t.t}" font-size="9" text-anchor="start">${esc(e.label)}</text>`);
    }
  });

  nodes.forEach(n0 => {
    const n = N[n0.id], cx = n.x + n.w / 2, kind = n.kind || 'backend';
    out += `<g id="${P}-node-${n.id}" data-node-id="${n.id}" data-node-label="${esc(n.label)}" tabindex="0" role="button" aria-label="Focus ${esc(n.label)}, ${esc(n.sub || '')}" aria-pressed="false" data-node-kind="${kind}"><title>${esc(n.label)} · ${esc(n.sub || '')}</title>`;
    out += `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6" class="c-mask"/><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="6" class="c-${kind}" stroke-width="1.5"/>`;
    out += `<g aria-hidden="true" class="semantic-sigil s-${kind}" transform="translate(${n.x + 6} ${n.y + 6}) scale(0.6875)">${SIGILS[kind]}</g>`;
    out += `<text x="${cx}" y="${n.y + n.h / 2 - (n.sub ? 1 : -4)}" class="t-primary" font-size="12" font-weight="600" text-anchor="middle">${esc(n.label)}</text>`;
    if (n.sub) out += `<text x="${cx}" y="${n.y + n.h / 2 + 15}" class="t-muted" font-size="9.5" text-anchor="middle">${esc(n.sub)}</text>`;
    out += '</g>';
  });

  out += labels.join('');

  const kinds = [...new Set(nodes.map(n => n.kind || 'backend'))];
  const ly = h - 34;
  out += `<text x="40" y="${ly - 14}" class="t-primary" font-size="12" font-weight="650">Legend</text>`;
  let lx = 40;
  kinds.forEach(k => {
    out += `<g><rect x="${lx}" y="${ly - 3}" width="16" height="10" rx="2.5" class="c-${k}" stroke-width="1"/><text x="${lx + 22}" y="${ly + 6}" class="t-muted" font-size="10" font-weight="500">${KIND_NAMES[k]}</text></g>`;
    lx += 22 + KIND_NAMES[k].length * 6 + 24;
  });
  return out + '</svg>';
}
