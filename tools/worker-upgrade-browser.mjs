// Bounded interruption fixture. Linux Actions origin only; never opens maps/contacts or sends forms.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {resolve,join,extname} from 'node:path';
assert.equal(process.env.GITHUB_ACTIONS,'true','Use the authorized Linux Actions origin');
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PACKAGE);
const out=resolve(process.env.BROWSER_REPORT),head=process.env.TESTED_HEAD;
const base='71c11205a60530a6619e4017cbd9382997df7c68',baseline=process.env.UPGRADE_EXPECTATION==='baseline';
assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),head);
await mkdir(out,{recursive:true});
const paths=['index.html','sw.js','styles.css','candidate-improvements.css','app.js','candidate-improvements.js','language-options.js','translations.js','data/config.js','data/overrides.js','manifest.webmanifest','assets/icon.svg','assets/primserv-logo.svg','assets/primserv-icon-192.png'];
const bytes=(ref,path)=>execFileSync('git',['show',`${ref}:${path}`]);
const old=Object.fromEntries(paths.map(p=>[p,bytes(base,p)])),current={};
for(const p of paths){current[p]=await readFile(p);assert(current[p].equals(bytes(head,p)),p);if(baseline)assert(current[p].equals(old[p]),'Baseline runtime must be exact published '+p);}
const cacheName=b=>b.toString().match(/const CACHE_NAME = "([^"]+)"/)[1],oldCache=cacheName(old['sw.js']);
const trial={...current};
if(baseline)trial['sw.js']=Buffer.from(old['sw.js'].toString().replace(oldCache,'arrival-guide-interruption-diagnostic-v64'));
const trialCache=cacheName(trial['sw.js']);assert.notEqual(trialCache,oldCache);
const report={head,base,baseline,oldCache,trialCache,files:Object.fromEntries(paths.map(p=>[p,{bytes:current[p].length,sha256:createHash('sha256').update(current[p]).digest('hex')}])),cases:[],captures:[],requests:[],limits:['320/1280 emulated Chromium, not a physical iPhone or screen-reader certificate.','Published old shell is installed normally; real app caches are never seeded.','Only anonymous native packing marks; GET/HEAD on owned origin, no delivery.']};
let serving=old,failedAsset=null,browser;
const server=createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost'),p=u.pathname.replace(/^\/przyjazd-do-pracy\//,'')||'index.html';
 const status=!['GET','HEAD'].includes(req.method)?405:!paths.includes(p)?404:p===failedAsset?503:200;
 report.requests.push({method:req.method,path:p,status});
 if(status!==200){res.writeHead(status,{'Cache-Control':'no-store'}).end();return;}
 res.writeHead(200,{'Cache-Control':'no-store','Content-Type':{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'}[extname(p)]});res.end(serving[p]);
});
async function bounded(p,label){let timer;try{return await Promise.race([p,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Timed out: '+label)),30000);})]);}finally{clearTimeout(timer);}}
async function start(){await bounded(new Promise((done,reject)=>{const fail=e=>reject(e);server.once('error',fail);server.listen(4174,'127.0.0.1',()=>{server.off('error',fail);done();});}),'start owned CI origin');}
async function stop(){if(!server.listening)return;await bounded(new Promise((done,reject)=>{server.close(e=>e?reject(e):done());server.closeAllConnections();}),'stop owned CI origin');assert.equal(server.listening,false);}
const url='http://127.0.0.1:4174/przyjazd-do-pracy/',key='primserv.arrival.packing.v1';
async function checkpoint(phase,details={}){report.phase={phase,...details};await writeFile(join(out,'worker-upgrade.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.phase));}
async function cacheRows(page,name){return page.evaluate(async name=>{
 if(!(await caches.keys()).includes(name))return null;
 const store=await caches.open(name),rows=[];
 for(const request of await store.keys()){const r=await store.match(request),b=await r.arrayBuffer();rows.push({url:request.url,bytes:b.byteLength,sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(n=>n.toString(16).padStart(2,'0')).join('')});}return rows;
},name);}
async function exactCache(page,name,files){const rows=await cacheRows(page,name);assert.equal(rows?.length,14);for(const r of rows){const u=new URL(r.url),p=u.pathname.replace(/^\/przyjazd-do-pracy\//,'')||'index.html';assert.equal(u.search,'');assert.equal(r.sha256,createHash('sha256').update(files[p]).digest('hex'),p);}return rows;}
async function ready(page){await page.locator('#packingChoice').waitFor();await page.locator('.packing-list input').first().waitFor();assert.equal(await page.locator('html').getAttribute('lang'),'en');}
async function snapshot(page){return page.evaluate(key=>({marks:localStorage.getItem(key),foreign:localStorage.getItem('interruption-unrelated'),inputs:document.querySelectorAll('.packing-list input').length,checked:[...document.querySelectorAll('.packing-list input')].filter(n=>n.checked).length,progress:document.getElementById('packingProgress')?.textContent||null,baseStylesLoaded:[...document.styleSheets].some(s=>s.href&&new URL(s.href).pathname.endsWith('/styles.css')&&s.cssRules.length>0),counterWeight:document.getElementById('packingProgress')?getComputedStyle(document.getElementById('packingProgress')).fontWeight:null,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1}),key);}
async function capture(page,width,asset,stage){await page.evaluate(()=>document.fonts.ready);const file=`worker-${width}-${asset.replace('.','-')}-${stage}.png`;const b=await page.screenshot({animations:'disabled'});await writeFile(join(out,file),b);report.captures.push({width,asset,stage,file,sha256:createHash('sha256').update(b).digest('hex'),originalViewport:true});}
async function update(page){await page.evaluate(async()=>{
 const reg=await navigator.serviceWorker.getRegistration();window.__priorController=navigator.serviceWorker.controller;window.__trialStates=[];
 const watch=()=>{const w=reg.installing;if(!w)return;window.__trialStates.push(w.state);w.addEventListener('statechange',()=>window.__trialStates.push(w.state));};reg.addEventListener('updatefound',watch,{once:true});await reg.update();watch();
});await page.waitForFunction(()=>window.__trialStates.some(s=>['activated','redundant'].includes(s)));return page.evaluate(()=>({states:window.__trialStates,controllerChanged:navigator.serviceWorker.controller!==window.__priorController}));}
try{
 await start();browser=await chromium.launch({headless:true});report.browser=browser.version();
 for(const width of [320,1280])for(const asset of ['app.js','styles.css']){
  serving=old;failedAsset=null;const context=await browser.newContext({viewport:{width,height:900},locale:'en-GB',reducedMotion:'reduce'}),page=await context.newPage(),errors=[],blocked=[];
  context.setDefaultTimeout(15000);context.setDefaultNavigationTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',r=>{const q=r.request();if(new URL(q.url()).origin===new URL(url).origin&&['GET','HEAD'].includes(q.method()))return r.continue();blocked.push({method:q.method(),url:q.url()});return r.abort();});
  await context.addInitScript(()=>{window.open=()=>{throw Error('Fixture must not open providers');};});
  try{
   await page.goto(url+'?lang=en&location=ryczywol&pack=ukraine');await ready(page);await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
   for(const pack of ['ukraine','poland','caucasus']){await page.locator('#packingChoice').selectOption(pack);const first=page.locator('.packing-list input').first();await first.focus();await page.keyboard.press('Space');assert(await first.isChecked());}
   await page.locator('#packingChoice').selectOption('ukraine');await page.evaluate(()=>localStorage.setItem('interruption-unrelated','KEEP'));
   const before=await snapshot(page),oldEntries=await exactCache(page,oldCache,old);assert(before.baseStylesLoaded&&before.inputs>0&&before.checked===1);await capture(page,width,asset,'before');
   serving=trial;failedAsset=asset;const requestStart=report.requests.length,updateState=await update(page);const failedTransfers=report.requests.slice(requestStart).filter(r=>r.path===asset&&r.status===503);assert(failedTransfers.length>0);
   const cachesAfter=await page.evaluate(()=>caches.keys()),trialEntries=await cacheRows(page,trialCache);await checkpoint('failed-transfer-observed',{width,asset,updateState,cachesAfter,trialEntries:trialEntries?.length});
   if(baseline){assert(updateState.states.includes('activated'));assert(updateState.controllerChanged);assert(!cachesAfter.includes(oldCache));assert.equal(trialEntries.length,13);assert(!trialEntries.some(r=>new URL(r.url).pathname.endsWith('/'+asset)));}
   else{assert(updateState.states.includes('redundant'));assert.equal(updateState.controllerChanged,false);assert(cachesAfter.includes(oldCache));await exactCache(page,oldCache,old);}
   await stop();await assert.rejects(fetch(url));await context.setOffline(true);await page.reload();
   if(!baseline)await ready(page);
   const after=await snapshot(page);assert.equal(after.marks,before.marks);assert.equal(after.foreign,'KEEP');await capture(page,width,asset,'interrupted-offline');
   if(baseline){if(asset==='app.js')assert.equal(after.inputs,0);else {assert.equal(after.baseStylesLoaded,false);assert.notEqual(after.counterWeight,before.counterWeight);}}
   else{
    assert(after.baseStylesLoaded&&after.inputs===before.inputs&&after.checked===1&&!after.horizontalOverflow);assert.equal(after.progress,before.progress);assert.deepEqual(errors,[]);
    const input=page.locator('.packing-list input').first();await input.focus();await page.keyboard.press('Space');assert.equal(await input.isChecked(),false);const offlineMarks=await page.evaluate(k=>localStorage.getItem(k),key);await page.reload();await ready(page);assert.equal(await input.isChecked(),false);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),offlineMarks);
    await context.setOffline(false);await start();failedAsset=null;const recovery=await update(page);assert(recovery.states.includes('activated'));assert(recovery.controllerChanged);const recovered=await exactCache(page,trialCache,trial);assert(!(await page.evaluate(()=>caches.keys())).includes(oldCache));
    await stop();await assert.rejects(fetch(url));await context.setOffline(true);await page.reload();await ready(page);assert.equal(await input.isChecked(),false);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),offlineMarks);assert((await snapshot(page)).baseStylesLoaded);await capture(page,width,asset,'recovered-offline');report.cases.push({width,asset,status:'passed',before,after,oldEntries,updateState,failedTransfers,cachesAfter,trialEntries,recovery,recovered,actualOriginStoppedTwice:true,offlineToggleReloadPreserved:true,noDelivery:true});
   }
   if(baseline)report.cases.push({width,asset,status:'baseline-defect-observed',before,after,oldEntries,updateState,failedTransfers,cachesAfter,trialEntries,errors,oldUsableCacheDeleted:true,actualOriginStopped:true,noDelivery:true});
   assert.deepEqual(blocked,[]);await checkpoint('case-completed',{width,asset});
  }finally{await context.setOffline(false);await context.close();if(!server.listening)await start();failedAsset=null;}
 }
 assert.equal(report.cases.length,4);report.status=baseline?'BASELINE_FOUR_INCOMPLETE_SHELLS_OBSERVED':'FOUR_INTERRUPTED_UPGRADES_RETAIN_OLD_SHELL_AND_RECOVER';
}catch(e){report.status='failed';report.error=e.stack;process.exitCode=1;}
finally{await browser?.close();await stop();await writeFile(join(out,'worker-upgrade.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
