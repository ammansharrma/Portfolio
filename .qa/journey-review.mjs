import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const req=createRequire(path.join(process.cwd(),'noop.js'));
const out=process.argv[2]||'.shots/journey-pass1';fs.mkdirSync(out,{recursive:true});
const browser=await launch();const report={pages:[],scope:'Production review of method through contact; existing hero and case page navigation smoke checked.'};
for(const [name,width,height,reduced] of [['d',1440,1000,false],['m',390,844,false],['r',390,844,true]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4400/Portfolio/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2300);
 const results={name,errors,stops:[],overflow:false};
 const selectors=['#about .journey-item:first-child','#about .about-statement:last-child','.topic-list li:first-child','.tool-row:first-child','.xs .xc:first-child','.xs .xc:last-child','.contact-stop'];
 for(let i=0;i<selectors.length;i++){
  const selector=selectors[i];
  await page.evaluate(sel=>{const el=document.querySelector(sel);const dock=el.matches('[data-travel]')?el:el.querySelector('[data-travel]');const r=dock.getBoundingClientRect();window.scrollTo(0,r.top+scrollY+r.height/2-innerHeight*Number(dock.dataset.travelAt||.52)+25);},selector);
  await page.waitForTimeout(850);
  const state=await page.evaluate(sel=>{const el=document.querySelector(sel),dock=el.matches('[data-travel]')?el:el.querySelector('[data-travel]'),d=dock.getBoundingClientRect(),r=document.querySelector('#dot').getBoundingClientRect();return {selector:sel,dockDistance:Math.hypot(d.x+d.width/2-r.x-r.width/2,d.y+d.height/2-r.y-r.height/2),overflow:document.documentElement.scrollWidth>innerWidth,active:el.classList.contains('is-current'),dotVisible:getComputedStyle(document.querySelector('#dot')).display!=='none'};},selector);
  results.stops.push(state);results.overflow ||=state.overflow;
  if(!reduced||i===0||i===5||i===6)await page.screenshot({path:path.join(out,`${name}-${i}.png`)});
 }
 await page.addScriptTag({path:req.resolve('axe-core/axe.min.js')});
 results.axe=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
 results.hiddenText=await page.evaluate(()=>[...document.querySelectorAll('#about p,#about dt,#about dd,#experience h3,#experience li,#contact p')].filter(e=>getComputedStyle(e).visibility==='hidden'||getComputedStyle(e).opacity==='0').length);
 // Reverse-scroll through the handoff, then verify inner-page and return navigation.
 await page.evaluate(()=>document.querySelector('#method').scrollIntoView());await page.waitForTimeout(600);
 await page.locator('.featured-project h3 a').first().click();await page.waitForTimeout(2300);
 results.caseHeading=await page.locator('h1').innerText();
 await page.locator('footer a').click();await page.waitForTimeout(4500);
 results.returnToContact=await page.evaluate(()=>document.querySelector('#contact').getBoundingClientRect().top<innerHeight);
 report.pages.push(results);await page.close();
}
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));
