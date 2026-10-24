// Exact Actions-only screen acceptance; original providers and contacts are never opened.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import vm from 'node:vm';
assert.equal(process.env.GITHUB_ACTIONS,'true','Only the authorized Actions origin; no local server substitute');
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PACKAGE);
const out=resolve(process.env.BROWSER_REPORT);await mkdir(out,{recursive:true});
const git=(...a)=>execFileSync('git',a,{timeout:60000,maxBuffer:4*1024*1024}),hash=b=>createHash('sha256').update(b).digest('hex');
const head=process.env.TESTED_HEAD,base=process.env.TESTED_BASE;assert.equal(git('rev-parse','HEAD').toString().trim(),head);git('merge-base','--is-ancestor',base,head);
const files=['index.html','sw.js','styles.css','candidate-improvements.css','app.js','candidate-improvements.js','language-options.js','translations.js','data/config.js','data/overrides.js','manifest.webmanifest','assets/icon.svg','assets/primserv-logo.svg','assets/primserv-icon-192.png'];
const report={head,base,checkout:head,pass:false,cases:[],files:{},errors:[],blocked:[],ariaIssues:[],requests:[],limits:['Exact CI Chromium 320/1280 screens and intercepted original map invocation only; not physical iPhone Safari or provider success.','No tel/WhatsApp/header links activated; no messages, forms, accounts, audio or OS clipboard access.','Existing 212 native/16-group packing-copy-storage-worker proof remains independently required.','Text is personally reviewed separately; source-derived expectations are not native-speaker or business-source certification.']},current=new Map();
for(const p of files){const b=await readFile(p);assert(b.equals(git('show',head+':'+p)));current.set(p,b);report.files[p]={bytes:b.length,sha256:hash(b)};}
const sourceContext={window:{},document:{addEventListener(){}},location:{search:''},open(){throw Error('No source evaluation navigation');}};
for(const p of ['data/config.js','data/overrides.js','language-options.js'])vm.runInNewContext(current.get(p).toString(),sourceContext,{timeout:1000});
const cfg=sourceContext.window.ARRIVAL_DEFAULT_CONFIG,languages=Object.keys(cfg.languages),cities=['siechnice','ryczywol','bogatynia','zgorzelec'];assert.equal(languages.length,9);
const originalMaps={siechnice:'https://maps.app.goo.gl/GJc55GLUWFPa6MMcA',ryczywol:'https://www.google.com/maps/search/?api=1&query=Wilczkowice%20G%C3%B3rne%2040%2C%2026-900%20Kozienice%2C%20Polska',bogatynia:'https://www.google.com/maps/search/?api=1&query=Nied%C3%B3w%209%2C%2059-900%20Nied%C3%B3w%2C%20Polska',zgorzelec:'https://www.google.com/maps/search/?api=1&query=Citronex%20Sp.%20z%20o.o.%2C%20ul.%20Bohater%C3%B3w%20II%20Armii%20Wojska%20Polskiego%2064%2C%2059-900%20Zgorzelec%2C%20Polska'};
const quickActions={pl:'Szybkie akcje',ru:'Быстрые действия',uk:'Швидкі дії',en:'Quick actions',az:'Sürətli əməliyyatlar',es:'Acciones rápidas',fil:'Mga mabilisang aksyon',id:'Tindakan cepat',ne:'द्रुत कार्यहरू'};
assert.deepEqual([...languages].sort(),Object.keys(quickActions).sort());
const prefix='/przyjazd-do-pracy/',mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),p=u.pathname.startsWith(prefix)?u.pathname.slice(prefix.length)||'index.html':'';report.requests.push({path:p,method:req.method});if(!['GET','HEAD'].includes(req.method)||!current.has(p)){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:current.get(p));});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const origin='http://127.0.0.1:'+server.address().port,url=origin+prefix;
let browser,ctx,page,stem;
async function center(el){await el.evaluate(e=>e.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'}));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function geometry(el){return el.evaluate(e=>{const r=e.getBoundingClientRect(),root=document.documentElement,s=getComputedStyle(e),range=document.createRange();range.selectNodeContents(e);const lines=[...range.getClientRects()].filter(r=>r.width&&r.height);return {text:e.textContent.trim(),left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:root.clientWidth,rootScroll:root.scrollWidth,visible:s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0,allTextExposed:lines.length>0&&lines.every(l=>l.left>=-.5&&l.right<=root.clientWidth+.5&&[.1,.5,.9].every(t=>{const x=l.left+l.width*t,y=(l.top+l.bottom)/2;return y>=0&&y<innerHeight&&e.contains(document.elementFromPoint(x,y));}))};});}
async function capture(el,tag){await center(el);const g=await geometry(el);assert(g.visible&&g.allTextExposed&&g.left>=-.5&&g.right<=g.width+.5&&g.rootScroll<=g.width,'Actual text exposed: '+JSON.stringify(g));const screen=stem+'-'+tag+'.png';await el.screenshot({path:join(out,screen)});return {screen,geometry:g};}
async function keyboard(el){await el.focus();assert(await el.evaluate(e=>document.activeElement===e));await page.keyboard.press('Enter');}
try{
 browser=await chromium.launch({headless:true});report.browser=browser.version();
 for(const width of [320,1280])for(const lang of languages)for(const city of cities){
  stem=`${width}-${lang}-${city}`;ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});ctx.setDefaultTimeout(15000);await ctx.tracing.start({snapshots:true,screenshots:true});
  await ctx.route('**/*',r=>{const req=r.request();if(new URL(req.url()).origin!==origin||!['GET','HEAD'].includes(req.method())){report.blocked.push({url:req.url(),method:req.method()});return r.abort();}return r.continue();});
  await ctx.addInitScript(()=>{window.__mapOpens=[];window.open=(...args)=>{window.__mapOpens.push(args);return null;};Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText(){throw Error('No copy requested in the help fixture');}}});});
  page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(e.message));const initial=lang==='pl'?'en':'pl';
  await page.goto(url+`?lang=${initial}&location=${city==='siechnice'?'ryczywol':'siechnice'}&country=poland&private=fixture-secret#private`);await page.locator('#topLanguageSelect').waitFor();await page.evaluate(()=>document.fonts.ready);
  await page.locator('.packing-list input').first().check();const packingBefore=await page.evaluate(()=>localStorage.getItem('primserv.arrival.packing.v1'));assert(packingBefore);await page.evaluate(()=>localStorage.setItem('unrelated-help-fixture','keep'));
  await page.locator('#topLanguageSelect').selectOption(lang);await page.locator(`[data-location="${city}"]`).click();await page.waitForFunction(({lang,city})=>document.documentElement.lang===lang&&document.documentElement.dataset.arrivalLocation===city,{lang,city});
  const group=['bogatynia','zgorzelec'].includes(city)?'bogatynia_zgorzelec':city,people=cfg.contacts[group];
  await page.waitForFunction(names=>[...document.querySelectorAll('#contactsPage .contact-card h3')].map(e=>e.textContent.trim()).join('|')===names.join('|'),people.map(p=>p.name));
  const actions=[],surfaces=[],opensBefore=await page.evaluate(()=>window.__mapOpens.length);
  for(const [scope,kind] of [['#helpSection','help'],['#mobileCandidateHero','hero'],['#candidateStickyActions','sticky'],['#guide','legacy']]){
   const container=page.locator(scope),selector=kind==='legacy'?'data-action':'data-help-action',available=[];
   for(const action of ['maps','call','whatsapp']){const el=container.locator(`[${selector}="${action}"]`);if(await el.isVisible())available.push(action);}
   surfaces.push({kind,containerVisible:await container.isVisible(),visibleActions:available});if(available.length)assert.deepEqual(available,['maps','call','whatsapp'],'Every visible action surface retains all three actions');
   for(const action of available){const button=container.locator(`[${selector}="${action}"]`),screen=await capture(button,kind+'-'+action);const before=await page.evaluate(()=>window.__mapOpens.length);await keyboard(button);
    if(action==='maps'){const opens=await page.evaluate(()=>window.__mapOpens);assert.equal(opens.length,before+1);assert.deepEqual(opens.at(-1),[originalMaps[city],'_blank']);}
    else{await page.waitForFunction(()=>document.activeElement?.id==='contactsPage');assert.equal(await page.evaluate(()=>window.__mapOpens.length),before);const rect=await page.locator('#contactsPage').boundingBox();assert(rect.y<900&&rect.y>=-1,'Real contact scroll destination');}
    actions.push({kind,action,...screen,actualEnterActivation:true,localContactFocus:action!=='maps',expectedOriginalMap:action==='maps'?originalMaps[city]:null});
   }
  }
  for(const action of ['maps','call','whatsapp'])assert(actions.some(a=>a.action===action),'At least one actual visible action surface supplies '+action);
  const sticky=page.locator('#candidateStickyActions'),stickyVisible=await sticky.isVisible(),stickyAria=stickyVisible?await sticky.ariaSnapshot():null,stickyLabel=await sticky.getAttribute('aria-label');
  if(stickyVisible&&stickyLabel!==quickActions[lang])report.ariaIssues.push({lang,city,width,actual:stickyLabel,expected:quickActions[lang],actualAriaSnapshot:stickyAria});
  const contactTitle=await capture(page.locator('#contactsTitle'),'contact-title'),hint=page.locator('#contactsPage > p strong'),contactHint=await hint.isVisible()?{visible:true,...await capture(hint,'contact-hint')}:{visible:false,sourceOnlyText:await hint.textContent(),reason:'Existing CSS hides the optional contact footer; not accepted as a visible instruction'},cards=[];
  const nodes=page.locator('#contactsPage .contact-card');assert.equal(await nodes.count(),people.length);
  for(let i=0;i<people.length;i++){
   const el=nodes.nth(i),person=people[i],digits=String(person.phone).replace(/\D/g,''),wa=String(person.whatsapp||person.phone).replace(/\D/g,'');assert.equal(await el.locator('h3').innerText(),person.name);assert.equal(await el.locator('.contact-phone').getAttribute('href'),'tel:+'+digits);assert.equal(await el.locator('.contact-whatsapp').getAttribute('href'),'https://wa.me/'+wa);
   const parts=[];for(const [selector,tag] of [['h3','name'],['.contact-role','role'],['.contact-phone','phone'],['.contact-whatsapp','wa']])parts.push(await capture(el.locator(selector),'card-'+i+'-'+tag));
   await center(el);const screen=stem+'-card-'+i+'.png';await el.screenshot({path:join(out,screen)});cards.push({name:person.name,sourceRole:person.role,screen,parts,phoneHref:'tel:+'+digits,whatsappHref:'https://wa.me/'+wa});
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('primserv.arrival.packing.v1')),packingBefore);assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-help-fixture')),'keep');assert(await page.locator('.packing-list input').first().isChecked());
  const mapInvocations=(await page.evaluate(()=>window.__mapOpens.length))-opensBefore;let offlineAccessibility=null;
  if(city==='ryczywol'){
   await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await ctx.setOffline(true);await page.reload();
   await page.waitForFunction(({lang,city,label})=>document.documentElement.lang===lang&&document.documentElement.dataset.arrivalLocation===city&&document.querySelector('#candidateStickyActions')?.getAttribute('aria-label')===label,{lang,city,label:quickActions[lang]});
   assert.equal(await page.locator('#candidateStickyActions').getAttribute('aria-label'),quickActions[lang]);assert.equal(await page.evaluate(()=>localStorage.getItem('primserv.arrival.packing.v1')),packingBefore);assert(await page.locator('.packing-list input').first().isChecked());
   offlineAccessibility={actualLabel:await page.locator('#candidateStickyActions').getAttribute('aria-label'),actualAriaSnapshot:await page.locator('#candidateStickyActions').ariaSnapshot(),actualOfflineReload:true,packingBytesPreserved:true};
  }
  const row={lang,city,width,initialLanguage:initial,actualLanguageAndCityChange:true,surfaces,actions,contactTitle,contactHint,cards,stickyVisible,stickyLabel,stickyAria,expectedStickyLabel:quickActions[lang],mapInvocations,packingPreserved:true,contactLinksOnlyRead:true,offlineAccessibility};report.cases.push(row);await writeFile(join(out,'help-report.json'),JSON.stringify(report,null,2));
  if(width===320&&lang==='pl'&&city==='siechnice')await ctx.tracing.stop({path:join(out,'representative-trace.zip')});else await ctx.tracing.stop();await ctx.close();ctx=null;console.log(JSON.stringify({lang,city,width,actions:actions.length,pass:true}));
 }
 assert.equal(report.cases.length,72);assert.deepEqual(report.errors,[]);assert.deepEqual(report.blocked,[]);assert.deepEqual(report.ariaIssues,[],'Actual accessible sticky navigation name must follow the chosen language');report.pass=true;
}catch(e){report.failure=e.stack;process.exitCode=1;if(page&&!page.isClosed())await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});console.error(e.stack);}
finally{if(ctx){await ctx.tracing.stop({path:join(out,'failure-trace.zip')}).catch(()=>{});await ctx.close();}await browser?.close();server.closeAllConnections();await new Promise(done=>server.close(done));report.finished=new Date().toISOString();await writeFile(join(out,'help-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({head,base,pass:report.pass,cases:report.cases.length,ariaIssues:report.ariaIssues.length,failure:report.failure}));}
