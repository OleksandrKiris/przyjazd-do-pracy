import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// Regression read from actual CI accessibility snapshots, including language changes on the existing nav.
const root=new URL('../',import.meta.url);
const scripts=await Promise.all(['data/config.js','data/overrides.js','language-options.js','candidate-improvements.js'].map(p=>fs.readFile(new URL(p,root),'utf8')));
const expected={pl:'Szybkie akcje',ru:'Быстрые действия',uk:'Швидкі дії',en:'Quick actions',az:'Sürətli əməliyyatlar',es:'Acciones rápidas',fil:'Mga mabilisang aksyon',id:'Tindakan cepat',ne:'द्रुत कार्यहरू'};
function fixture(lang){
 const nodes=new Map(),document={documentElement:{lang,dataset:{arrivalLocation:'siechnice'}},getElementById:id=>nodes.get(id)||null,querySelector:()=>null,addEventListener(){},createElement(){return {attrs:{},dataset:{},setAttribute(k,v){this.attrs[k]=v;}};},body:{appendChild(e){nodes.set(e.id,e);}}};
 const window={},location={search:'?lang='+lang};
 const context=vm.createContext({window,document,location,URLSearchParams,URL});
 for(const code of scripts.slice(0,3))vm.runInContext(code,context);
 const instrumented=scripts[3].replace(/  refresh\(\);\r?\n\}\)\(\);\s*$/,'  window.stickyLabelFixture = ensureStickyActions;\n})();');
 assert.notEqual(instrumented,scripts[3]);vm.runInContext(instrumented,context);
 return {window,document,nodes,run:()=>window.stickyLabelFixture()};
}
for(const [lang,label] of Object.entries(expected)){
 test(`${lang}: actual sticky helper updates its existing accessible name after a language change`,()=>{
  const f=fixture(lang==='pl'?'en':'pl');f.run();const original=f.nodes.get('candidateStickyActions');assert(original);
  f.document.documentElement.lang=lang;f.run();const current=f.nodes.get('candidateStickyActions');assert.equal(current,original,'Keep the existing navigation and its action handlers');assert.equal(current.attrs['aria-label'],label);
  assert.equal((current.innerHTML.match(/data-help-action=/g)||[]).length,3);assert(current.dataset.phone);assert(current.dataset.whatsapp);
  const configBefore=JSON.stringify(f.window.ARRIVAL_DEFAULT_CONFIG);f.run();assert.equal(JSON.stringify(f.window.ARRIVAL_DEFAULT_CONFIG),configBefore,'Label refresh cannot rewrite business contacts or locations');
 });
}
