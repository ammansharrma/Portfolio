import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const url=process.argv[2]||'http://127.0.0.1:4400/Portfolio/';
const out=process.argv[3]||'.shots/link-arrows';
fs.mkdirSync(out,{recursive:true});
const browser=await launch();
try {
 for(const [name,width,height] of [['desktop',1440,1000],['phone',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForTimeout(2600);
  await page.locator('.project-index summary').evaluate(e=>e.click());await page.waitForTimeout(850);
  const result=await page.evaluate(()=>({
   textArrows:[...document.querySelectorAll('a')].filter(a=>/[↗↘↑↓←→]/.test(a.textContent)).map(a=>a.textContent),
   projectIcons:document.querySelectorAll('.project-index a .direction-arrow').length,
   loadedImages:[...document.querySelectorAll('.direction-arrow')].every(e=>e.tagName==='IMG'&&e.complete&&e.naturalWidth>0&&e.getBoundingClientRect().width>=14),
   objectText:document.body.textContent.includes('[object Object]')
  }));
  assert.deepEqual(result.textArrows,[]);assert.equal(result.projectIcons,8);assert(result.loadedImages);assert.equal(result.objectText,false);
  for(const [part,selector] of [['projects','.project-index'],['contact','#contact']]){
   await page.locator(selector).evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-85));await page.waitForTimeout(850);
   await page.screenshot({path:`${out}/${name}-${part}.png`});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  assert.equal(await page.getByRole('link',{name:'Email me',exact:true}).getAttribute('href'),'mailto:aamaansharrma6@gmail.com');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({name,...result,errors}));await page.close();
 }
} finally {await browser.close();}
