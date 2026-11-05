import fs from 'node:fs';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
fs.mkdirSync('.shots/method-compact',{recursive:true});
const browser=await launch();
for(const [name,width,height] of [['phone',390,844]]){
 const page=await browser.newPage({viewport:{width,height}});
 await page.goto('http://127.0.0.1:4400/Portfolio/');await page.waitForTimeout(2400);
 await page.locator('#method').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY));await page.waitForTimeout(1200);
 console.log(name,await page.locator('#method').evaluate(e=>({height:e.offsetHeight,steps:e.querySelectorAll('.method-scene').length,dots:e.querySelectorAll('[data-travel]').length,overflow:document.documentElement.scrollWidth>innerWidth})));
 await page.screenshot({path:`.shots/method-compact/${name}.png`});await page.close();
}
await browser.close();

