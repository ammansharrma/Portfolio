import fs from 'node:fs';
import assert from 'node:assert/strict';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const out='.shots/readability';fs.mkdirSync(out,{recursive:true});
const browser=await launch(),report=[];
try {
 for(const [name,width,height] of [['desktop',1440,1000],['tablet',900,1000],['phone',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4400/Portfolio/');await page.waitForTimeout(2600);
  const sizes=await page.evaluate(()=>Object.fromEntries(['body','.lead','.small','.project-index-label small','.scene-label','h1','h2'].map(s=>[s,getComputedStyle(document.querySelector(s)).fontSize])));
  for(const [part,selector] of [['hero','#hero'],['relay','.agent-scene:nth-child(3)'],['projects','.project-index'],['method','#method'],['contact','#contact']]) {
   if(part==='projects'){await page.locator('.project-index summary').evaluate(e=>e.click());await page.waitForTimeout(850);}
   await page.locator(selector).evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-85));await page.waitForTimeout(850);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name} ${part} overflow`);
   if(name!=='tablet')await page.screenshot({path:`${out}/${name}-${part}.png`});
  }
  await page.locator('.project-index .more-work a').first().click();await page.waitForTimeout(1800);
  for(const [part,selector] of [['case-hero','.case-hero'],['case-copy','.case-body']]) {
   await page.locator(selector).evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-85));await page.waitForTimeout(850);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name} ${part} overflow`);
   if(name!=='tablet')await page.screenshot({path:`${out}/${name}-${part}.png`});
  }
  assert.deepEqual(errors,[]);report.push({name,sizes,errors,overflow:false});await page.close();
 }
} finally {await browser.close();}
fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
