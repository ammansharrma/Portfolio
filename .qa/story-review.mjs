import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const req=createRequire(path.join(process.cwd(),'noop.js'));
const out=process.argv[2]; fs.mkdirSync(out,{recursive:true});
const browser=await launch(); const report=[];
for(const [name,width,height,reduced] of [['d',1440,1000,false],['m',390,844,false],['r',390,844,true]]) {
 const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4400/Portfolio/'); await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2400);
 const result={name,errors,frames:[],chapters:[]};
 const shots=reduced?['#hero','#ensemble','#about','#contact']:['#hero','#work','.agent-scene:nth-child(1)','.agent-scene:nth-child(3)','.agent-scene:nth-child(5)','#more-work','.method-scene:nth-child(2)','#about','#contact'];
 for(let i=0;i<shots.length;i++){
  const selector=shots[i];
  await page.evaluate(sel=>{const e=document.querySelector(sel);const d=e.matches('.agent-scene,.method-scene')?e.querySelector('[data-travel]'):null;const r=(d||e).getBoundingClientRect();window.scrollTo(0,d?r.top+scrollY+r.height/2-innerHeight*Number(d.dataset.travelAt):r.top+scrollY-85);},selector);
  await page.waitForTimeout(1000);
  result.frames.push(await page.evaluate(sel=>({selector:sel,overflow:document.documentElement.scrollWidth>innerWidth,active:document.querySelector('[data-journey-group]').dataset.active,dot:getComputedStyle(document.querySelector('#dot')).opacity}),selector));
  await page.screenshot({path:`${out}/${name}-${i}.png`});
 }
 if(!reduced){
  for(const i of [4,3,2,1,0]){
   await page.evaluate(index=>{const el=document.querySelectorAll('.agent-scene [data-travel]')[index],r=el.getBoundingClientRect();window.scrollTo(0,r.top+scrollY+r.height/2-innerHeight*Number(el.dataset.travelAt));},i);await page.waitForTimeout(650);
   result.chapters.push({expected:i,actual:await page.locator('[data-journey-group]').getAttribute('data-active')});
  }
 }
 // Native details must work via keyboard, preserve content, and remeasure the journey.
 await page.locator('#experience summary').focus();await page.keyboard.press('Enter');await page.waitForTimeout(500);
 result.detailsKeyboard=await page.locator('#experience').evaluate(e=>e.open);
 await page.locator('#experience').evaluate(e=>e.scrollIntoView());await page.waitForTimeout(650);
 await page.screenshot({path:`${out}/${name}-experience.png`});
 await page.evaluate(()=>document.querySelectorAll('details').forEach(e=>e.open=true));await page.waitForTimeout(450);
 await page.addScriptTag({path:req.resolve('axe-core/axe.min.js')});
 result.axe=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
 result.openOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 result.hiddenCopy=await page.evaluate(()=>[...document.querySelectorAll('.scene-copy h3,.scene-copy>p,.care-statement p')].filter(e=>getComputedStyle(e).opacity==='0'||getComputedStyle(e).visibility==='hidden').length);
 await page.evaluate(()=>document.querySelectorAll('details').forEach(e=>e.open=false));
 await page.locator('a[href$="/work/order-notes-summarizer"]').first().click();await page.waitForTimeout(2400);
 result.caseHeading=await page.locator('h1').innerText();
 if(name==='d')await page.screenshot({path:`${out}/case.png`});
 // Desktop navigation and phone menu both expose Experience.
 if(width<=820){await page.locator('.menu-btn').click();await page.waitForTimeout(900);await page.locator('#menu a').filter({hasText:'Experience'}).click();}
 else {await page.locator('.nav a').filter({hasText:'Experience'}).focus();await page.locator('.nav a').filter({hasText:'Experience'}).click();}
 await page.waitForTimeout(4500);
 result.experienceNav=await page.locator('#experience').evaluate(e=>({open:e.open,top:e.getBoundingClientRect().top}));
 if(name==='d'){
  await page.goto('http://127.0.0.1:4400/Portfolio/not-a-page');await page.waitForTimeout(2000);result.notFound=await page.locator('h1').innerText();await page.screenshot({path:`${out}/404.png`});
 }
 report.push(result);await page.close();
}
fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));
