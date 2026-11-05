import fs from 'node:fs/promises';
import {launch} from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';
const b=await launch(); const page=await b.newPage({viewport:{width:390,height:844}});const results=[];
try {
for (const route of ['experience','projects/order-notes-agent','projects/presentation-agent','services']) {
 await page.goto('http://127.0.0.1:4400/Portfolio/'+route);const start=Date.now();
 await page.locator('.stream-response[data-phase=streaming]').waitFor();const first=Date.now()-start;
 await page.locator('.stream-response[data-phase=complete]').waitFor({timeout:60000});
 results.push({route,firstTextMs:first,completeMs:Date.now()-start,words:await page.locator('.stream-body').innerText().then(s=>s.split(/\s+/).length)});
}
await fs.writeFile('.jury/local/reading-times.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await b.close();}
