import fs from 'node:fs';
import {createRequire} from 'node:module';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const req=createRequire(import.meta.url), out=process.argv[2];
fs.mkdirSync(out,{recursive:true});
const browser=await launch(), report=[];
try {
 for(const [name,width,height,reduced] of [['d',1440,1000,false],['m',390,844,false],['r',390,844,true]]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4400/Portfolio/');await page.waitForTimeout(2600);
  const summary=page.locator('.project-index summary');
  const place=async()=>{await summary.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-180));await page.waitForTimeout(800);};
  await place();await page.screenshot({path:`${out}/${name}-closed.png`});
  if(name==='d'){await summary.hover();await page.waitForTimeout(550);await page.screenshot({path:`${out}/d-hover.png`});}
  await summary.click();await page.mouse.move(0,0);await place();
  await page.screenshot({path:`${out}/${name}-open.png`});
  if(name==='d'){
   const row=page.locator('.project-index .more-work a').first();
   await row.hover();await page.waitForTimeout(500);await page.screenshot({path:`${out}/d-row-hover.png`});
   await row.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.mouse.move(0,0);await page.waitForTimeout(500);await page.screenshot({path:`${out}/d-row-focus.png`});
  }
  await page.locator('.project-index .more-work li:last-child').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().bottom+scrollY-innerHeight+100));await page.waitForTimeout(800);
  await page.screenshot({path:`${out}/${name}-end.png`});await place();
  await page.addScriptTag({path:req.resolve('axe-core/axe.min.js')});
  const axe=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector('.project-index'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
  const links=await page.locator('.project-index .more-work a').count();
  const opened=await page.locator('.project-index').evaluate(e=>e.open);
  await summary.focus();await page.keyboard.press('Enter');await place();
  const closed=await page.locator('.project-index').evaluate(e=>!e.open);
  if(name==='d'){await page.screenshot({path:`${out}/d-keyboard.png`});}
  report.push({name,width,errors,axe,links,opened,keyboardClosed:closed,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  await page.close();
 }
} finally {await browser.close();}
fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
