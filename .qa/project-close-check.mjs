import assert from 'node:assert/strict';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const browser=await launch();
try {
 for(const [name,width,height,reduced] of [['desktop',1440,1000,false],['phone',390,844,false],['reduced',390,844,true]]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4400/Portfolio/');await page.waitForTimeout(2600);
  const summary=page.locator('.project-index summary'), details=page.locator('.project-index');
  await summary.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-100));await page.waitForTimeout(700);
  await summary.click();await page.waitForTimeout(800);
  const closing=await page.evaluate(async()=>{
   document.querySelector('.project-index summary').click();await new Promise(r=>setTimeout(r,150));
   const d=document.querySelector('.project-index');
   return {open:d.open,closing:d.hasAttribute('data-closing'),opacity:[...d.querySelectorAll('.more-work a')].map(e=>Number(getComputedStyle(e).opacity))};
  });
  if(reduced) assert.equal(closing.open,false);
  else {assert(closing.open&&closing.closing);assert(closing.opacity.at(-1)<closing.opacity[0]);}
  await page.waitForTimeout(600);assert.equal(await details.evaluate(e=>e.open),false);
  // Reverse direction mid-close, without a stale completion collapsing the reopened list.
  await summary.click();await page.waitForTimeout(800);
  await summary.click();await page.waitForTimeout(100);await summary.click();await page.waitForTimeout(850);
  assert(await details.evaluate(e=>e.open&&!e.hasAttribute('data-closing')));
  assert(await details.locator('.more-work a').evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1')));
  await summary.focus();await page.keyboard.press('Enter');await page.waitForTimeout(650);
  assert.equal(await details.evaluate(e=>e.open),false);
  await page.keyboard.press('Enter');await page.waitForTimeout(800);
  assert(await details.evaluate(e=>e.open));
  // Switching preferences during exit must finish closing and restore readable styles.
  await summary.click();await page.waitForTimeout(100);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);
  assert.equal(await details.evaluate(e=>e.open),false);
  await summary.click();await page.waitForTimeout(100);
  assert(await details.locator('.more-work a').evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none')));
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({name,closing,reverseAndKeyboard:'passed',liveReducedMotion:'passed',errors}));
  await page.close();
 }
} finally {await browser.close();}
