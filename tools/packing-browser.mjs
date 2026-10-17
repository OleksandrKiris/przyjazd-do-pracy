// CI acceptance on a loopback-only static server. Never sends forms or opens contacts.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, join, extname } from 'node:path';
assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Run through the authorized CI workflow');
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PACKAGE);
const output = resolve(process.env.BROWSER_REPORT), root = process.cwd();
await mkdir(output, { recursive: true });
const files = ['index.html','sw.js','styles.css','candidate-improvements.css','app.js',
  'candidate-improvements.js','language-options.js','translations.js','data/config.js',
  'data/overrides.js','manifest.webmanifest','assets/icon.svg','assets/primserv-logo.svg','assets/primserv-icon-192.png'];
const head = process.env.TESTED_HEAD, base = process.env.TESTED_BASE;
const gitFile = (ref, file) => execFileSync('git', ['show', `${ref}:${file}`]);
const report = {head,base,checkout:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
  files:{},results:[],limits:['320px is an emulated viewport, not a physical phone.',
    'First successful shell installation is required for offline use. External maps/contacts need a connection.',
    'Storage failures are injected; no real personal data, contact actions or submissions.']};
assert.equal(report.checkout,head);
const current = {};
for (const file of files) {
  const bytes = await readFile(join(root,file));
  assert.ok(bytes.equals(gitFile(head,file)),file);
  current[file]=bytes;
  report.files[file]={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};
}
let serving = current;
const requests=[];
const server=createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  requests.push({method:req.method,path:url.pathname});
  const path=url.pathname.replace(/^\/przyjazd-do-pracy\//,'')||'index.html';
  if(!['GET','HEAD'].includes(req.method)) {res.writeHead(405).end();return;}
  if(!files.includes(path)) {res.writeHead(404).end();return;}
  const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'}[extname(path)];
  res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(serving[path]);
});
await new Promise(done=>server.listen(4173,'127.0.0.1',done));
const url='http://127.0.0.1:4173/przyjazd-do-pracy/';
const key='primserv.arrival.packing.v1', cache='arrival-guide-v57-packing-visible';
let browser;
const checks=async(page,lang,location='ryczywol')=>{
  await page.waitForFunction(({lang,location})=>document.documentElement.lang===lang&&document.documentElement.dataset.arrivalLocation===location,{lang,location});
  assert.ok(await page.locator('.packing-list input').count());
  assert.equal(await page.locator('.packing-list input').first().isVisible(),true,'packing list must be visible, not merely in DOM');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
  if(location==='ryczywol')assert.ok(await page.locator('a[href="tel:+48511472583"]').count(),'confirmed housing contact');
};
const installed=page=>page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
const cacheReport=page=>page.evaluate(async name=>{
  const store=await caches.open(name), keys=await store.keys(), entries=[];
  for(const request of keys){const response=await store.match(request);entries.push({key:request.url,response:response.url,bytes:(await response.clone().arrayBuffer()).byteLength});}
  return entries;
},cache);
try {
  browser=await chromium.launch({headless:true});report.browser=browser.version();
  const context=async(width,mode='normal')=>{
    const ctx=await browser.newContext({viewport:{width,height:900},locale:'en-GB',reducedMotion:'reduce'});
    const blocked=[];
    await ctx.route('**/*',route=>{
      const req=route.request();
      if(new URL(req.url()).origin===new URL(url).origin&&['GET','HEAD'].includes(req.method()))return route.continue();
      blocked.push({method:req.method(),url:req.url()});return route.abort();
    });
    await ctx.addInitScript(({mode,key})=>{
      if(mode==='denied')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Test denial','SecurityError');}});
      if(mode==='corrupt'&&!sessionStorage.getItem('seeded')){localStorage.setItem(key,'{broken');sessionStorage.setItem('seeded','1');}
      if(mode==='future'&&!sessionStorage.getItem('seeded')){localStorage.setItem(key,'{"version":999}');sessionStorage.setItem('seeded','1');}
    },{mode,key});
    return {ctx,blocked};
  };
  for(const width of [1280,320]) {
    const {ctx,blocked}=await context(width), page=await ctx.newPage(), errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await ctx.tracing.start({screenshots:true,snapshots:true});
    try {
      await page.goto(url+'?lang=ka&location=ryczywol');await checks(page,'en');
      assert.equal(await page.locator('#languageFallback').isVisible(),true);
      assert.match(await page.locator('#languageFallback').innerText(),/English/);
      const first=page.locator('.packing-list input').nth(0),second=page.locator('.packing-list input').nth(1);
      assert.equal(await first.isChecked(),false);
      await first.focus();await page.keyboard.press('Space');assert.equal(await first.isChecked(),true);
      assert.equal(await first.evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Tab');assert.equal(await second.evaluate(el=>el===document.activeElement),true);
      for(const lang of ['pl','uk','ru','en','az','es','fil','id','ne']) {
        const select=page.locator('#topLanguageSelect');
        await select.focus();await select.selectOption(lang);await checks(page,lang);
        assert.equal(await first.isChecked(),true);
        assert.equal(await select.evaluate(el=>el===document.activeElement),true);
        if(!['pl','uk','ru','en'].includes(lang))assert.match(await page.locator('#packingHint').innerText(),/^English \(EN\):/);
      }
      await page.locator('#topLanguageSelect').focus();await page.keyboard.press('Home');
      await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');await checks(page,'uk');
      await page.locator('[data-location="bogatynia"]').click();await checks(page,'uk','bogatynia');
      assert.equal(await first.isChecked(),true);
      await installed(page);await page.reload();await checks(page,'uk','bogatynia');assert.equal(await first.isChecked(),true);
      await page.goto(url+'?lang=en&location=ryczywol&country=poland');await checks(page,'en');
      assert.equal(await first.getAttribute('data-pack'),'poland');assert.equal(await first.isChecked(),false);await first.check();
      await page.goto(url+'?lang=en&location=ryczywol&country=georgia');await checks(page,'en');
      assert.equal(await first.getAttribute('data-pack'),'caucasus');assert.equal(await first.isChecked(),false);await second.check();
      await page.goBack();await checks(page,'en');assert.equal(await first.isChecked(),true);
      await page.goBack();await checks(page,'uk','bogatynia');assert.equal(await first.isChecked(),true);
      await ctx.setOffline(true);await page.reload();await checks(page,'uk','bogatynia');
      assert.equal(await page.evaluate(()=>navigator.onLine),false);assert.equal(await first.isChecked(),true);
      await second.check();await page.reload();assert.equal(await second.isChecked(),true);
      await first.scrollIntoViewIfNeeded();await page.screenshot({path:join(output,`${width}-offline-checklist.png`)});
      await ctx.setOffline(false);
      // Synthetic public query verifies cache identity without processing personal data.
      await page.evaluate(async()=>{await fetch('./app.js?fixture=one');await fetch('./app.js?fixture=two');await fetch('./not-a-public-resource?fixture=one');});
      const entries=await cacheReport(page);
      assert.ok(entries.length<=14);assert.ok(entries.length>=13);
      for(const entry of entries){assert.equal(new URL(entry.key).search,'');if(entry.response)assert.equal(new URL(entry.response).search,'');assert.ok(!entry.key.includes('not-a-public-resource'));}
      assert.deepEqual(blocked,[]);assert.deepEqual(errors,[]);
      report.results.push({width,status:'passed',steps:['keyboard/Tab/Space/focus','9 languages/EN fallback','ka fallback','3 independent lists','city/reload/Back','offline marks/reload','query-free bounded cache'],cache:entries});
    } finally {
      await page.screenshot({path:join(output,`${width}-last.png`)}).catch(()=>{});
      await ctx.tracing.stop({path:join(output,`${width}-trace.zip`)});await ctx.close();
    }
  }
  for(const mode of ['corrupt','future','denied']) {
    const {ctx,blocked}=await context(320,mode),page=await ctx.newPage();
    try {
      await page.goto(url+'?lang=en&location=ryczywol');await checks(page,'en');
      const first=page.locator('.packing-list input').first();await first.check();
      assert.equal(await first.isChecked(),true);assert.match(await page.locator('#packingStatus').innerText(),/Not saved/);
      await page.locator('[data-location="bogatynia"]').click();assert.equal(await first.isChecked(),true);
      await installed(page);await ctx.setOffline(true);await page.reload();await checks(page,'en','bogatynia');
      assert.equal(await first.isChecked(),false);assert.match(await page.locator('#packingStatus').innerText(),/Not saved/);
      if(mode!=='denied')assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),mode==='corrupt'?'{broken':'{"version":999}');
      assert.deepEqual(blocked,[]);await page.screenshot({path:join(output,`${mode}.png`)});
      report.results.push({mode,width:320,status:'passed',steps:['in-memory marks','honest warning','offline reload','old bytes preserved']});
    } finally {await ctx.close();}
  }
  for(const oldRef of [base,'5d08e94c2ebacbe6ebb3e207da4bee25dd585ed1']) {
    serving=Object.fromEntries(files.map(file=>[file,gitFile(oldRef,file)]));
    const {ctx,blocked}=await context(320),page=await ctx.newPage();
    try {
      await page.goto(url+'?lang=en&location=ryczywol');await installed(page);
      const oldCache=await page.evaluate(()=>caches.keys());assert.ok(oldCache.some(name=>/^arrival-guide-v5[45]/.test(name)));
      // v54 has no checklist; seed only the exact public boolean schema used by v55 onward.
      await page.evaluate(async key=>{
        const lists={};for(const [name,pack] of Object.entries(window.ARRIVAL_DEFAULT_CONFIG.packs))lists[name]={items:[...pack.en],checked:pack.en.map((_,i)=>i===0)};
        localStorage.setItem(key,JSON.stringify({version:1,lists}));localStorage.setItem('unrelated-fixture','preserve');
        await (await caches.open('foreign-fixture')).put('./foreign-fixture',new Response('preserve'));
      },key);
      const before=await page.evaluate(key=>localStorage.getItem(key),key);
      serving=current;await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
      await page.waitForFunction(async name=>{const keys=await caches.keys();return keys.includes(name)&&!keys.some(key=>key.startsWith('arrival-guide-')&&key!==name);},cache);
      await page.reload();await checks(page,'en');await ctx.setOffline(true);await page.reload();await checks(page,'en');
      assert.equal(await page.locator('.packing-list input').first().isChecked(),true);
      assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),before);
      assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-fixture')),'preserve');
      assert.equal(await page.evaluate(async()=>await (await caches.open('foreign-fixture')).match('./foreign-fixture').then(r=>r.text())),'preserve');
      assert.deepEqual(blocked,[]);await page.screenshot({path:join(output,`upgrade-${oldRef.slice(0,7)}.png`)});
      report.results.push({oldRef,status:'passed',steps:['actual old worker','new worker activation','foreign cache/marks preserved','offline reload']});
    } finally {serving=current;await ctx.close();}
  }
  assert.ok(requests.every(r=>['GET','HEAD'].includes(r.method)));
  report.requests={count:requests.length,uniquePaths:[...new Set(requests.map(r=>r.path))],nonGet:0};
  report.status='passed';
} catch(error){report.status='failed';report.error=error.stack;process.exitCode=1;}
finally{await browser?.close();await new Promise(done=>server.close(done));await writeFile(join(output,'acceptance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
