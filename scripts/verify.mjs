// Production browser checks, using the installed awwwards skill's browser launcher.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import os from 'node:os';
import { projects } from '../src/data/site.js';
const req = createRequire(import.meta.url);
const { launch } = await import(pathToFileURL(path.join(os.homedir(), '.codex/skills/awwwards/scripts/browser.mjs')));
const out = process.argv[2] || '.shots/review1';
const browser = await launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const root = 'http://127.0.0.1:4400/Portfolio/';
const results = [];
const routes = ['', 'projects', 'experience', 'skills', 'education', 'about', 'services', ...projects.map(p => `projects/${p.id}`), 'not-found'];
try {
  for (const route of routes) {
    const dir = path.join(out, route.replaceAll('/', '-') || 'home'); await fs.mkdir(dir, { recursive: true });
    const errors = []; const listen = e => errors.push(e.message); page.on('pageerror', listen);
    const response = await page.goto(root + route); await page.waitForTimeout(350); if (await page.locator('.stream-response').count()) await page.locator('.stream-response[data-phase=complete]').waitFor();
    const report = { route, status: response.status(), errors, views: {} };
    for (const [prefix, width, height, reducedMotion] of [['d',1440,900,'no-preference'], ['m',390,844,'no-preference'], ['r',390,844,'reduce']]) {
      await page.setViewportSize({ width, height }); await page.emulateMedia({ reducedMotion }); await page.waitForTimeout(80);
      report.views[prefix] = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, h1: [...document.querySelectorAll('h1')].map(e=>e.textContent), brokenImages: [...document.images].filter(e=>e.complete && !e.naturalWidth).map(e=>e.src) }));
      await page.screenshot({ path:path.join(dir,`${prefix}-full.png`), fullPage:true });
    }
    await page.addScriptTag({ path:req.resolve('axe-core/axe.min.js') });
    report.a11y = await page.evaluate(async () => { const r = await axe.run(); return r.violations.map(v=>({ id:v.id, impact:v.impact, nodes:v.nodes.map(n=>({ target:n.target, summary:n.failureSummary })) })); });
    await fs.writeFile(path.join(dir,'report.json'),JSON.stringify(report,null,2));
    results.push(report); page.off('pageerror', listen); console.log(`${route||'home'}: ${report.status}, axe=${report.a11y.length}, overflow=${Object.values(report.views).some(v=>v.overflow)}`);
  }
  await page.setViewportSize({width:390,height:844}); await page.goto(root); await page.getByRole('button',{name:'Open navigation'}).click();
  await page.screenshot({path:path.join(out,'mobile-menu.png')});
  if (!(await page.getByRole('dialog').isVisible())) throw new Error('Mobile menu did not open');
  await page.keyboard.press('Escape');
  if (await page.getByRole('dialog').count()) throw new Error('Escape did not close menu');
  if (await page.getByRole('button',{name:'Open navigation'}).evaluate(e=>e!==document.activeElement)) throw new Error('Menu focus was not restored');
  if (await page.getByRole('textbox').count()) throw new Error('Unexpected chat input');
  await page.getByRole('button',{name:'Portfolio',exact:true}).click();
  await page.getByRole('navigation',{name:'Explore portfolio'}).getByRole('link',{name:'Experience',exact:true}).click();
  await page.locator('.stream-response[data-phase=complete]').waitFor();
  await page.goto(root+'projects'); await page.getByRole('button',{name:'Full-stack',exact:true}).click(); if (await page.locator('.project-row').count() !== 1) throw new Error('Project filter failed');
  await page.getByRole('button',{name:'All work',exact:true}).click(); if (await page.locator('.project-row').count() !== projects.length) throw new Error('Reset filter failed');
  await page.setViewportSize({width:1440,height:900}); await page.goto(root); await page.keyboard.press('Tab'); await page.screenshot({path:path.join(out,'keyboard-focus.png')});
  await page.getByRole('button',{name:'Collapse sidebar'}).click(); await page.getByRole('button',{name:'Expand sidebar'}).click();
  const pdf = await context.request.get(root+'Aamaan-Sharrma.pdf'); if (!pdf.ok() || !pdf.headers()['content-type'].includes('pdf')) throw new Error('Résumé download broken');
  const checks = { mobileMenu:true, focusRestoration:true, topicNavigation:true, noInput:true, projectFilters:true, sidebarToggle:true, resume:true };
  await fs.writeFile(path.join(out,'summary.json'), JSON.stringify({ results, checks },null,2));
  console.log('Functional checks passed.');
} finally { await browser.close(); }
