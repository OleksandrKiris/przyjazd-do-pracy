// First-install boundary, with no installed predecessor. Owned Linux CI origin only.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {resolve,join,extname} from 'node:path';
assert.equal(process.env.GITHUB_ACTIONS,'true','Use the authorized Linux CI origin');
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PACKAGE);
const out=resolve(process.env.BROWSER_REPORT),head=process.env.TESTED_HEAD,published='23ec410c7e8c3004a4356ebac3ccf8d804d89cde';
const files=['index.html','sw.js','styles.css','candidate-improvements.css','app.js','candidate-improvements.js','language-options.js','translations.js','data/config.js','data/overrides.js','manifest.webmanifest','assets/icon.svg','assets/primserv-logo.svg','assets/primserv-icon-192.png'];
assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),head);await mkdir(out,{recursive:true});
const current={},report={head,base:process.env.TESTED_BASE,publishedBase:published,publishedRuntimeRequired:process.env.FIRST_INSTALL_PUBLISHED==='true',files:{},cases:[],captures:[],requests:[],limits:['Fresh isolated context, no installed predecessor or seeded application cache.','English320/1280 Chromium viewports, not a physical iPhone or nine-language certificate.','Only anonymous packing marks and owned-origin GET/HEAD; no provider/contact actions or forms.','An in-memory guide is not a complete offline shell. First offline reload requires a successful install.']};
for(const p of files){const b=await readFile(p);assert(b.equals(execFileSync('git',['show',`${head}:${p}`])),p);if(report.publishedRuntimeRequired)assert(b.equals(execFileSync('git',['show',`${published}:${p}`])),'Published runtime changed: '+p);current[p]=b;report.files[p]={bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')};}
const cache=current['sw.js'].toString().match(/const CACHE_NAME = "([^"]+)"/)[1],key='primserv.arrival.packing.v1';
const url='http://127.0.0.1:4175/przyjazd-do-pracy/';let failedAsset=null,browser;
const server=createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost'),p=u.pathname.replace(/^\/przyjazd-do-pracy\//,'')||'index.html',dest=req.headers['sec-fetch-dest']||'';
 // Browser page scripts/styles remain online; only the worker's empty-destination cache transfer fails.
 const status=!['GET','HEAD'].includes(req.method)?405:!files.includes(p)?404:p===failedAsset&&dest==='empty'?503:200;
 report.requests.push({method:req.method,path:p,dest,status});
 if(status!==200){res.writeHead(status,{'Cache-Control':'no-store'}).end();return;}
 res.writeHead(200,{'Cache-Control':'no-store','Content-Type':{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'}[extname(p)]});res.end(current[p]);
});
async function bounded(p,label){let timer;try{return await Promise.race([p,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Timed out: '+label)),30000);})]);}finally{clearTimeout(timer);}}
async function start(){await bounded(new Promise((done,reject)=>{const fail=e=>reject(e);server.once('error',fail);server.listen(4175,'127.0.0.1',()=>{server.off('error',fail);done();});}),'start owned CI origin');}
async function stop(){if(!server.listening)return;await bounded(new Promise((done,reject)=>{server.close(e=>e?reject(e):done());server.closeAllConnections();}),'stop owned CI origin');assert.equal(server.listening,false);}
async function checkpoint(phase,details={}){report.phase={phase,...details};await writeFile(join(out,'first-install.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.phase));}
async function ready(page){await page.locator('#packingChoice').waitFor();await page.locator('.packing-list input').first().waitFor();assert.equal(await page.locator('html').getAttribute('lang'),'en');}
async function snapshot(page){return page.evaluate(key=>({marks:localStorage.getItem(key),foreign:localStorage.getItem('first-install-unrelated'),inputs:document.querySelectorAll('.packing-list input').length,checked:[...document.querySelectorAll('.packing-list input')].filter(n=>n.checked).length,progress:document.getElementById('packingProgress')?.textContent||null,counterWeight:document.getElementById('packingProgress')?getComputedStyle(document.getElementById('packingProgress')).fontWeight:null,controlled:Boolean(navigator.serviceWorker.controller),horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1}),key);}
async function cacheRows(page){return page.evaluate(async name=>{
 if(!(await caches.keys()).includes(name))return null;
 const store=await caches.open(name),rows=[];for(const request of await store.keys()){const r=await store.match(request),b=await r.arrayBuffer();rows.push({url:request.url,bytes:b.byteLength,sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(n=>n.toString(16).padStart(2,'0')).join('')});}return rows;
},cache);}
async function capture(page,width,asset,stage){await page.evaluate(()=>document.fonts.ready);const file=`first-${width}-${asset.replace('.','-')}-${stage}.png`,b=await page.screenshot({animations:'disabled'});await writeFile(join(out,file),b);report.captures.push({width,asset,stage,file,sha256:createHash('sha256').update(b).digest('hex'),originalViewport:true});}
try{
 await start();browser=await chromium.launch({headless:true});report.browser=browser.version();
 for(const width of [320,1280])for(const asset of ['app.js','styles.css']){
  failedAsset=asset;const context=await browser.newContext({viewport:{width,height:900},locale:'en-GB',reducedMotion:'reduce'});assert.equal(context.serviceWorkers().length,0);const page=await context.newPage(),errors=[],blocked=[],requestStart=report.requests.length;
  context.setDefaultTimeout(15000);context.setDefaultNavigationTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',r=>{const q=r.request();if(new URL(q.url()).origin===new URL(url).origin&&['GET','HEAD'].includes(q.method()))return r.continue();blocked.push({method:q.method(),url:q.url()});return r.abort();});
  await context.addInitScript(()=>{window.open=()=>{throw Error('Fixture must not open providers');};});
  try{
   await page.goto(url+'?lang=en&location=ryczywol&pack=ukraine');await ready(page);
   await bounded((async()=>{while(!report.requests.slice(requestStart).some(r=>r.path===asset&&r.dest==='empty'&&r.status===503))await new Promise(done=>setTimeout(done,20));})(),'observe actual failed worker transfer');
   await page.waitForFunction(async()=>{const reg=await navigator.serviceWorker.getRegistration();return !navigator.serviceWorker.controller&&!reg?.installing&&!reg?.active;});
   const incomplete=await cacheRows(page);assert(!incomplete||incomplete.length===0,'Failed first install must not create a partial usable shell');
   for(const pack of ['ukraine','poland','caucasus']){await page.locator('#packingChoice').selectOption(pack);const first=page.locator('.packing-list input').first();await first.focus();await page.keyboard.press('Space');assert(await first.isChecked());}
   await page.locator('#packingChoice').selectOption('ukraine');await page.evaluate(()=>localStorage.setItem('first-install-unrelated','KEEP'));const before=await snapshot(page);assert(before.inputs===5&&before.checked===1&&before.counterWeight==='700'&&!before.controlled&&!before.horizontalOverflow);await capture(page,width,asset,'online-uninstalled');
   await checkpoint('first-install-failed-online-guide-usable',{width,asset,incompleteEntries:incomplete?.length??0});
   await stop();await assert.rejects(fetch(url));await context.setOffline(true);const input=page.locator('.packing-list input').first();await input.focus();await page.keyboard.press('Space');assert.equal(await input.isChecked(),false);const memory=await snapshot(page);assert.equal(memory.checked,0);assert.equal(memory.foreign,'KEEP');assert.equal(memory.controlled,false);await capture(page,width,asset,'offline-memory-only');
   let reloadFailure=null;try{await page.reload();}catch(e){reloadFailure=e.message;}assert(reloadFailure&&/ERR_INTERNET_DISCONNECTED|ERR_CONNECTION_REFUSED|ERR_FAILED/.test(reloadFailure),'No installed shell: offline reload must fail rather than imply offline readiness');
   await context.setOffline(false);await start();failedAsset=null;await page.goto(url+'?lang=en&location=ryczywol&pack=ukraine');await ready(page);await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));const installed=await cacheRows(page);assert.equal(installed?.length,14);
   for(const r of installed){const u=new URL(r.url),p=u.pathname.replace(/^\/przyjazd-do-pracy\//,'')||'index.html';assert.equal(u.search,'');assert.equal(r.sha256,report.files[p].sha256);assert.equal(r.bytes,report.files[p].bytes);}
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),memory.marks);for(const pack of ['poland','caucasus']){await page.locator('#packingChoice').selectOption(pack);assert(await input.isChecked());}await page.locator('#packingChoice').selectOption('ukraine');assert.equal(await input.isChecked(),false);
   await stop();await assert.rejects(fetch(url));await context.setOffline(true);await page.reload();await ready(page);const after=await snapshot(page);assert(after.controlled&&after.counterWeight==='700'&&after.inputs===5&&after.checked===0&&!after.horizontalOverflow);assert.equal(after.marks,memory.marks);assert.equal(after.foreign,'KEEP');await capture(page,width,asset,'installed-offline-reload');assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);
   const requests=report.requests.slice(requestStart);assert(requests.some(r=>r.path===asset&&r.dest==='empty'&&r.status===503));assert(requests.some(r=>r.path===asset&&['script','style'].includes(r.dest)&&r.status===200));report.cases.push({width,asset,status:'passed',freshContextNoPredecessor:true,incomplete,before,memory,expectedOfflineReloadFailure:reloadFailure,installed,after,actualOriginStoppedTwice:true,allThreeListsPreserved:true,foreignStoragePreserved:true,nativeOfflineSpace:true,normalOnlineRegistrationRecovery:true,requests,noDelivery:true});await checkpoint('case-completed',{width,asset});
  }finally{await context.setOffline(false);await context.close();if(!server.listening)await start();failedAsset=null;}
 }
 assert.equal(report.cases.length,4);assert.equal(report.captures.length,12);report.status='FOUR_FIRST_INSTALL_FAILURE_BOUNDARIES_AND_RECOVERIES_OBSERVED';
}catch(e){report.status='failed';report.error=e.stack;process.exitCode=1;}
finally{await browser?.close();await stop();await writeFile(join(out,'first-install.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
