import fs from 'node:fs';
import { launch } from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const browser = await launch();
const report = [];
for (const [name, width, height, reduced] of [['d',1440,1000,false],['m',390,844,false],['r',390,844,true]]) {
  const page = await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:4400/Portfolio/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2300);
  const stops = [];
  const selectors = reduced ? ['#about .journey-dock','.contact-stop'] : ['.project-stop','#about .journey-dock','.tool-row .journey-dock','.contact-stop'];
  for (let i = 0; i < selectors.length; i++) {
    await page.evaluate(sel => {
      const el = document.querySelector(sel), r = el.getBoundingClientRect();
      window.scrollTo(0,r.top+scrollY+r.height/2-innerHeight*Number(el.dataset.travelAt||.52));
    }, selectors[i]);
    await page.waitForTimeout(1200);
    stops.push(await page.evaluate(sel => {
      const dot = document.querySelector('#dot'), r = dot.getBoundingClientRect();
      const dock = document.querySelector(sel).getBoundingClientRect();
      return {selector:sel,size:r.width,visible:getComputedStyle(dot).display!=='none'&&getComputedStyle(dot).opacity!=='0',left:r.left,right:r.right,distance:Math.hypot(r.x+r.width/2-dock.x-dock.width/2,r.y+r.height/2-dock.y-dock.height/2),overflow:document.documentElement.scrollWidth>innerWidth};
    }, selectors[i]));
    await page.screenshot({path:`${out}/${name}-${i}.png`});
  }
  report.push({name,errors,stops});
  await page.close();
}
await browser.close();
fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
