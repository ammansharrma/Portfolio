import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { launch } = await import(pathToFileURL(path.join(os.homedir(), '.codex/skills/awwwards/scripts/browser.mjs')));
const b=await launch();const p=await b.newPage({viewport:{width:390,height:844}});const root='http://127.0.0.1:4400/Portfolio/';const errors=[];p.on('pageerror',e=>errors.push(e.message));
try {
 await p.goto(root+'projects/order-notes-agent');await p.locator('[data-phase=thinking]').waitFor();
 assert.ok(await p.locator('.result-block').isVisible());assert.ok(await p.locator('.case-facts').isVisible());assert.ok(await p.locator('.case-actions').isVisible());
 const copy=await p.locator('.stream-body').innerText();assert.ok(copy.includes('My contribution'));
 const start=Date.now();await p.locator('[data-phase=complete]').waitFor();assert.ok(Date.now()-start<2600);
 assert.equal(await p.locator('input,textarea').count(),0);
 assert.equal(await p.locator('.bottom-composer').evaluate(e=>getComputedStyle(e).position),'static');
 await p.locator('.architecture-mobile summary').first().click();assert.ok(await p.locator('.architecture-steps').first().isVisible());
 await p.getByRole('button',{name:'Read instantly',exact:true}).click();
 await p.goto(root+'projects/presentation-agent');await p.getByRole('button',{name:'Instant reading on',exact:true}).waitFor();assert.equal(await p.locator('.stream-response').getAttribute('data-phase'),'complete');
 await p.getByRole('button',{name:'Instant reading on',exact:true}).click();
 await p.getByRole('button',{name:'Explore portfolio',exact:true}).click();await p.locator('#portfolio-topics').getByRole('link',{name:'Experience',exact:true}).click();await p.locator('[data-phase=complete]').waitFor();
 await p.getByRole('button',{name:'Explore portfolio',exact:true}).click();await p.keyboard.press('Escape');assert.equal(await p.locator('#portfolio-topics').count(),0);
 await p.goto(root+'projects');assert.ok((await p.locator('.project-row').first().innerText()).includes('AI Order Notes Agent'));
 await p.emulateMedia({reducedMotion:'reduce'});await p.goto(root+'skills');await p.locator('[data-phase=complete]').waitFor();assert.ok(await p.locator('.skill-section').first().isVisible());
 const html=await p.request.get(root,{headers:{'Accept-Encoding':'br'}});assert.equal(html.headers()['content-encoding'],'br');
 const asset=(await html.text()).match(/src="([^\"]+\.js)"/)[1];const js=await p.request.get(new URL(asset,root).href);assert.ok(js.headers()['cache-control'].includes('immutable'));
 assert.deepEqual(errors,[]);console.log('PASS: immediate facts, short intro, persistent preference, no input, non-overlay navigation, mobile diagrams, production-first order, reduced motion, compression, caching, no exceptions');
} finally {await b.close();}
