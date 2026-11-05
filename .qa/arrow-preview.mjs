import fs from 'node:fs';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
fs.mkdirSync('.shots/original-arrow',{recursive:true});
const browser=await launch();
try {
 for(const [name,width,height] of [['desktop',1440,1000],['phone',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://127.0.0.1:4400/Portfolio/');await page.waitForTimeout(2600);
  const summary=page.locator('.project-index summary');
  await summary.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-120));await page.waitForTimeout(800);
  await summary.screenshot({path:`.shots/original-arrow/${name}-closed.png`});
  await summary.click();await page.waitForTimeout(850);
  await summary.screenshot({path:`.shots/original-arrow/${name}-open.png`});
  console.log(name,await page.locator('.project-index-arrow').evaluate(e=>({width:e.offsetWidth,height:e.offsetHeight,rotation:getComputedStyle(e).rotate,maskLoaded:getComputedStyle(e).maskImage!=='none'})));
  await page.close();
 }
} finally {await browser.close();}
