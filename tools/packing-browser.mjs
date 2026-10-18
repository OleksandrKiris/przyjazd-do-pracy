// CI acceptance on a loopback-only static server. Never sends forms or opens contacts.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, join, extname } from 'node:path';
import vm from 'node:vm';
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
const key='primserv.arrival.packing.v1', cache='arrival-guide-v58-status-languages';
const languages=['pl','uk','ru','en','az','es','fil','id','ne'];
const labels={
  pl:['Zaznacz spakowane rzeczy. Zapis tylko na tym urządzeniu; bez wysyłania.','Zapisano na tym urządzeniu.','Nie zapisano. Zaznaczenia działają tylko w tej sesji; poprzednie dane pozostają bez zmian.'],
  uk:['Позначайте зібрані речі. Збереження лише на цьому пристрої; без надсилання.','Збережено на цьому пристрої.','Не збережено. Позначки діють лише в цьому сеансі; попередні дані не змінено.'],
  ru:['Отмечайте собранные вещи. Сохранение только на этом устройстве; без отправки.','Сохранено на этом устройстве.','Не сохранено. Отметки действуют только в этом сеансе; предыдущие данные не изменены.'],
  en:['Mark packed items. Saved only on this device; nothing is sent.','Saved on this device.','Not saved. Marks work only in this session; previous data is unchanged.'],
  az:['Yığdığınız əşyaları işarələyin. Yalnız bu cihazda saxlanılır; heç nə göndərilmir.','Bu cihazda yadda saxlanıldı.','Saxlanılmadı. İşarələr yalnız bu sessiyada işləyir; əvvəlki məlumatlar dəyişməyib.'],
  es:['Marca lo que ya has preparado. Se guarda solo en este dispositivo; no se envía nada.','Guardado en este dispositivo.','No se ha guardado. Las marcas solo se mantienen durante esta sesión; los datos anteriores no han cambiado.'],
  fil:['Markahan ang mga naimpakeng gamit. Sa device na ito lang ise-save; walang ipapadala.','Na-save sa device na ito.','Hindi na-save. Sa session na ito lang mananatili ang mga marka; hindi nabago ang dating data.'],
  id:['Tandai barang yang sudah dikemas. Disimpan hanya di perangkat ini; tidak ada yang dikirim.','Tersimpan di perangkat ini.','Tidak tersimpan. Tanda hanya berlaku selama sesi ini; data sebelumnya tidak berubah.'],
  ne:['तयार पारेका सामानमा चिन्ह लगाउनुहोस्। यस उपकरणमा मात्र सुरक्षित हुन्छ; केही पठाइँदैन।','यस उपकरणमा सुरक्षित भयो।','सुरक्षित भएन। चिन्हहरू यस सत्रमा मात्र रहन्छन्; पहिलेका डेटा परिवर्तन भएका छैनन्।']
};
const configContext={window:{}};vm.runInNewContext(current['data/config.js'].toString(),configContext);
const languageLabel=lang=>configContext.window.ARRIVAL_DEFAULT_CONFIG.ui[lang].chooseLanguage;
const localized=async(page,lang,status)=>{
  assert.equal(await page.locator('#packingHint').innerText(),labels[lang][0]);
  assert.equal(await page.locator('#packingHint').getAttribute('lang'),lang);
  assert.equal(await page.locator('#topLanguageSwitcher label').innerText(),languageLabel(lang));
  assert.equal(await page.locator('#topLanguageSelect').getAttribute('aria-label'),languageLabel(lang));
  assert.equal(await page.locator('#topLanguageSelect').inputValue(),lang);
  if(status!==undefined){assert.equal(await page.locator('#packingStatus').innerText(),labels[lang][status]);assert.equal(await page.locator('#packingStatus').getAttribute('lang'),lang);}
};
const exactCache=async page=>{
  const entries=await page.evaluate(async name=>{
    const store=await caches.open(name),rows=[];
    for(const request of await store.keys()){
      const response=await store.match(request),bytes=await response.arrayBuffer();
      rows.push({key:request.url,response:response.url,bytes:bytes.byteLength,sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('')});
    }return rows;
  },cache);
  assert.equal(entries.length,14);
  for(const row of entries){
    const resource=new URL(row.key);assert.equal(resource.search,'');
    const path=resource.pathname.replace(/^\/przyjazd-do-pracy\//,'')||'index.html';
    assert.ok(report.files[path],path);assert.equal(row.sha256,report.files[path].sha256,path);
    if(row.response)assert.equal(new URL(row.response).search,'');
  }
  return entries;
};
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
      if(mode==='quota'){const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Test quota','QuotaExceededError');return set.call(this,k,v);};}
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
      for(const lang of languages) {
        const select=page.locator('#topLanguageSelect');
        await select.focus();await select.selectOption(lang);await checks(page,lang);
        assert.equal(await first.isChecked(),true);
        assert.equal(await select.evaluate(el=>el===document.activeElement),true);
        await first.uncheck();await first.check();await localized(page,lang,1);
        await first.scrollIntoViewIfNeeded();await page.screenshot({path:join(output,`${width}-${lang}-saved.png`)});
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
      report.results.push({width,status:'passed',steps:['keyboard/Tab/Space/focus','9 translated hints/saved statuses/visible and aria language labels','ka fallback','3 independent lists','city/reload/Back','offline marks/reload','query-free bounded cache'],cache:entries});
    } finally {
      await page.screenshot({path:join(output,`${width}-last.png`)}).catch(()=>{});
      await ctx.tracing.stop({path:join(output,`${width}-trace.zip`)});await ctx.close();
    }
  }
  for(const mode of ['corrupt','future','denied','quota']) {
    const {ctx,blocked}=await context(320,mode),page=await ctx.newPage();
    try {
      await page.goto(url+'?lang=en&location=ryczywol');await checks(page,'en');
      const first=page.locator('.packing-list input').first();await first.check();
      for(const lang of languages){
        await page.locator('#topLanguageSelect').selectOption(lang);await checks(page,lang);
        await first.uncheck();await first.check();assert.equal(await first.isChecked(),true);
        await localized(page,lang,2);await first.scrollIntoViewIfNeeded();
        await page.screenshot({path:join(output,`${mode}-${lang}-warning.png`)});
      }
      await page.locator('#topLanguageSelect').selectOption('en');await checks(page,'en');
      await page.locator('[data-location="bogatynia"]').click();assert.equal(await first.isChecked(),true);
      await installed(page);await ctx.setOffline(true);await page.reload();await checks(page,'en','bogatynia');
      assert.equal(await first.isChecked(),false);if(mode==='quota')await first.check();
      assert.match(await page.locator('#packingStatus').innerText(),/Not saved/);
      if(mode!=='denied')assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),mode==='corrupt'?'{broken':mode==='future'?'{"version":999}':null);
      assert.deepEqual(blocked,[]);await page.screenshot({path:join(output,`${mode}.png`)});
      report.results.push({mode,width:320,status:'passed',steps:['in-memory marks','honest warning','offline reload','old bytes preserved']});
    } finally {await ctx.close();}
  }
  // An actual second tab must not be overwritten after this page read its marks.
  {
    const {ctx,blocked}=await context(320),page=await ctx.newPage();
    try{
      await page.goto(url+'?lang=es&location=ryczywol');await checks(page,'es');
      await page.locator('.packing-list input').first().check();
      const other=await ctx.newPage();await other.goto(url+'?lang=en&location=ryczywol');await checks(other,'en');
      await other.locator('.packing-list input').nth(2).check();
      const newer=await other.evaluate(key=>localStorage.getItem(key),key);
      await page.locator('.packing-list input').nth(1).check();await localized(page,'es',2);
      assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),newer);
      assert.deepEqual(blocked,[]);await page.screenshot({path:join(output,'concurrent-tab-warning.png')});
      report.results.push({mode:'concurrent-tab',status:'passed',newerBytesPreserved:true});
    }finally{await ctx.close();}
  }
  for(const [oldRef,width] of [[base,320],[base,1280],['5d08e94c2ebacbe6ebb3e207da4bee25dd585ed1',320]]) {
    serving=Object.fromEntries(files.map(file=>[file,gitFile(oldRef,file)]));
    const {ctx,blocked}=await context(width),page=await ctx.newPage();
    await ctx.tracing.start({screenshots:true,snapshots:true});
    try {
      await page.goto(url+'?lang=ne&location=ryczywol');await installed(page);
      const oldCache=await page.evaluate(()=>caches.keys());
      assert.ok(oldCache.some(name=>name.startsWith('arrival-guide-')&&name!==cache));
      // The current base already has the checklist: produce all three lists through real controls.
      const oldRows=[];
      for(const [country,pack,index] of (oldRef===base?[['ukraine','ukraine',0],['poland','poland',1],['georgia','caucasus',2]]:[])){
        await page.goto(url+'?lang=ne&location=ryczywol&country='+country);await checks(page,'ne');
        const input=page.locator('.packing-list input').nth(index);assert.equal(await input.getAttribute('data-pack'),pack);
        await input.check();assert.equal(await input.isChecked(),true);
        oldRows.push({country,pack,index});
      }
      if(oldRef!==base){
        // The historical v55 panel was hidden. Retain its prior schema-only compatibility check.
        await page.evaluate(key=>{const lists={};for(const [name,pack] of Object.entries(window.ARRIVAL_DEFAULT_CONFIG.packs))lists[name]={items:[...pack.en],checked:pack.en.map((_,i)=>i===(name==='ukraine'?0:name==='poland'?1:2))};localStorage.setItem(key,JSON.stringify({version:1,lists}));},key);
        oldRows.push({country:'ukraine',pack:'ukraine',index:0},{country:'poland',pack:'poland',index:1},{country:'georgia',pack:'caucasus',index:2});
      }
      if(oldRef===base){
        assert.match(await page.locator('#packingHint').innerText(),/^English \(EN\):/);
        assert.equal(await page.locator('#topLanguageSwitcher label').innerText(),'Language');
      }
      await page.evaluate(async()=>{
        localStorage.setItem('unrelated-fixture','preserve');
        await (await caches.open('foreign-fixture')).put('./foreign-fixture',new Response('preserve'));
      });
      const before=await page.evaluate(key=>localStorage.getItem(key),key);
      assert.equal(JSON.parse(before).version,1);
      await page.screenshot({path:join(output,`upgrade-${oldRef.slice(0,7)}-${width}-before.png`)});
      serving=current;await page.evaluate(async()=>{
        window.previousTestController=navigator.serviceWorker.controller;
        await (await navigator.serviceWorker.getRegistration()).update();
      });
      await page.waitForFunction(()=>navigator.serviceWorker.controller &&
        navigator.serviceWorker.controller!==window.previousTestController &&
        navigator.serviceWorker.controller.state==='activated');
      await page.waitForFunction(async name=>(await caches.keys()).includes(name),cache);
      const installedCache=await exactCache(page);
      const cacheNamesAfterActivation=await page.evaluate(()=>caches.keys());
      // Stop the origin, rather than only asking Chromium to simulate offline.
      await new Promise(done=>server.close(done));
      await ctx.setOffline(true);await page.reload();await checks(page,'ne');await localized(page,'ne',1);
      for(const {country,pack,index} of oldRows){
        await page.goto(url+'?lang=ne&location=ryczywol&country='+country);await checks(page,'ne');
        assert.equal(await page.locator(`input[data-pack="${pack}"][data-pack-index="${index}"]`).isChecked(),true);
      }
      const translatedRows=[];
      for(const lang of languages){
        await page.locator('#topLanguageSelect').selectOption(lang);await checks(page,lang);await localized(page,lang,1);
        assert.equal(await page.locator('input[data-pack-index="2"]').isChecked(),true);
        translatedRows.push({lang,hint:await page.locator('#packingHint').innerText(),status:await page.locator('#packingStatus').innerText(),label:await page.locator('#topLanguageSwitcher label').innerText()});
        await page.locator('.packing-panel').scrollIntoViewIfNeeded();
        await page.screenshot({path:join(output,`upgrade-${oldRef.slice(0,7)}-${width}-${lang}.png`)});
      }
      assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),before);
      assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-fixture')),'preserve');
      assert.equal(await page.evaluate(async()=>await (await caches.open('foreign-fixture')).match('./foreign-fixture').then(r=>r.text())),'preserve');
      assert.deepEqual(blocked,[]);
      report.results.push({oldRef,width,status:'passed',oldCache,cacheNamesAfterActivation,installedCache,translatedRows,oldMarksBefore:before,
        steps:[oldRef===base?'actual base worker and UI-produced marks for all three origins':'historical v55 worker with schema-only seeded marks','new controller activation','all 14 cached entries exact SHA256','origin stopped/offline reload','9 translated screens','v1 marks byte-preserved','foreign storage/cache retained']});
    } finally {
      serving=current;
      await page.screenshot({path:join(output,`upgrade-${oldRef.slice(0,7)}-${width}-last.png`)}).catch(()=>{});
      await ctx.tracing.stop({path:join(output,`upgrade-${oldRef.slice(0,7)}-${width}-trace.zip`)});await ctx.close();
      if(!server.listening)await new Promise(done=>server.listen(4173,'127.0.0.1',done));
    }
  }
  assert.ok(requests.every(r=>['GET','HEAD'].includes(r.method)));
  report.requests={count:requests.length,uniquePaths:[...new Set(requests.map(r=>r.path))],nonGet:0};
  report.status='passed';
} catch(error){report.status='failed';report.error=error.stack;process.exitCode=1;}
finally{await browser?.close();await new Promise(done=>server.close(done));await writeFile(join(output,'acceptance.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
