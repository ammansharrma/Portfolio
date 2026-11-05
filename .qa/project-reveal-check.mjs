import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const browser=await launch();
fs.mkdirSync('.shots/project-reveal',{recursive:true});
try {
 for(const [name,width,height,reduced] of [['desktop',1440,1000,false],['phone',390,844,false],['reduced',390,844,true]]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4400/Portfolio/');await page.waitForTimeout(2600);
  await page.locator('.project-index').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-100));await page.waitForTimeout(700);
  const opening=await page.evaluate(async()=>{
   document.querySelector('.project-index summary').click();
   await new Promise(resolve=>setTimeout(resolve,100));
   return [...document.querySelectorAll('.project-index .more-work a')].map(e=>({opacity:Number(getComputedStyle(e).opacity),transform:getComputedStyle(e).transform}));
  });
  console.log(name,opening);
  if(reduced) assert(opening.every(e=>e.opacity===1&&e.transform==='none'));
  else {assert(opening[0].opacity>opening.at(-1).opacity);assert(opening[0].opacity<1);}
  await page.waitForTimeout(800);
  const settled=await page.locator('.project-index .more-work a').evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none'));
  assert(settled);
  await page.screenshot({path:`.shots/project-reveal/${name}.png`});
  await page.evaluate(async()=>{
   const summary=document.querySelector('.project-index summary');
   summary.click();await new Promise(r=>setTimeout(r,30));
   summary.click();await new Promise(r=>setTimeout(r,50));
   summary.click();await new Promise(r=>setTimeout(r,30));summary.click();
   await new Promise(r=>setTimeout(r,60));document.querySelector('.project-index .more-work a').focus();
  });
  assert(await page.locator('.project-index .more-work a').evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1')));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(100);
  assert(await page.locator('.project-index .more-work a').evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none')));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({name,opening,settled,rapidToggleAndFocus:'passed',liveReducedMotion:'passed',errors}));
  await page.close();
 }
} finally {await browser.close();}
