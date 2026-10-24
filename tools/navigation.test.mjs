import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import crypto from "node:crypto";

const root = new URL("../", import.meta.url);
const paths = ["data/config.js", "data/overrides.js", "language-options.js", "app.js"];
const scripts = await Promise.all(paths.map(path => fs.readFile(new URL(path, root), "utf8")));
const improvements = await fs.readFile(new URL("candidate-improvements.js", root), "utf8");
const translations = await fs.readFile(new URL("translations.js", root), "utf8");
const locales = ["pl", "ru", "uk", "en", "az", "es", "fil", "id", "ne"];
const locations = ["siechnice", "ryczywol", "bogatynia", "zgorzelec"];
const packingKey = "primserv.arrival.packing.v1";

test("packing panel remains outside the legacy hidden-panel selectors", async () => {
  const css = await fs.readFile(new URL("candidate-improvements.css", root), "utf8");
  assert.match(boot("en").node("guide").innerHTML, /<section class="panel packing-panel">/);
  const selectors = css.match(/\.guide-grid > \.panel[^\n]*:nth-of-type\(n\+3\)/g);
  assert.equal(selectors.length, 2);
  for (const selector of selectors) assert.ok(selector.includes(":not(.packing-panel)"));
});

for (const lang of locales) test(`${lang}: existing packing items become labelled local checkboxes`, () => {
  for(const [country,key] of [["poland","poland"],["ukraine","ukraine"],["georgia","caucasus"]]) {
    const c=boot(lang,"ryczywol",{country});
    const items=c.window.ARRIVAL_DEFAULT_CONFIG.packs[key][lang];
    assert.equal((c.node("guide").innerHTML.match(/type="checkbox"/g)||[]).length,items.length);
    for(const item of items) assert.ok(c.node("guide").innerHTML.includes(item));
    assert.match(c.node("guide").innerHTML, /<label>\s*<input type="checkbox"/);
    assert.match(c.node("guide").innerHTML, /id="packingStatus" role="status" aria-live="polite"/);
    c.mark(key,0);
    c.chooseLanguage("uk");c.chooseLocation("bogatynia");
    assert.match(c.node("guide").innerHTML,new RegExp(`data-pack="${key}" data-pack-index="0"[^>]*checked`));
    const reload=boot("en","siechnice",{country,saved:c.saved});
    assert.match(reload.node("guide").innerHTML,new RegExp(`data-pack="${key}" data-pack-index="0"[^>]*checked`));
    assert.equal(JSON.stringify(c.window.ARRIVAL_DEFAULT_CONFIG),c.originalConfig);
  }
});

test("packing writes only list identity and boolean marks, never arrival data",()=>{
  const c=boot("ru");c.saved.set("unrelated","retain");c.mark("poland",1);
  const raw=c.saved.get(packingKey);
  assert.deepEqual(Object.keys(JSON.parse(raw)).sort(),["lists","version"]);
  assert.doesNotMatch(raw,/Fixture|Example|2026-11-02|"(?:surname|department|location|lang|phone|name)":/);
  assert.equal(c.saved.get("unrelated"),"retain");
  assert.equal(c.writes.length,1);
  c.mark("poland",1,false);
  assert.equal(JSON.parse(c.saved.get(packingKey)).lists.poland.checked[1],false);
});

test("packing variants remain independent and marks survive navigation between them",()=>{
  const saved=new Map();const p=boot("en","siechnice",{saved});p.mark("poland",0);
  const u=boot("uk","ryczywol",{saved,country:"ukraine"});
  assert.doesNotMatch(u.node("guide").innerHTML,/data-pack="ukraine"[^>]* checked/);
  u.mark("ukraine",2);
  const data=JSON.parse(saved.get(packingKey));
  assert.equal(data.lists.poland.checked[0],true);assert.equal(data.lists.ukraine.checked[2],true);
  assert.ok(data.lists.caucasus.checked.every(value=>!value));
});

test("empty storage is not written merely by opening or rendering",()=>{
  const c=boot("en");assert.equal(c.saved.has(packingKey),false);
  c.chooseLocation("ryczywol");assert.equal(c.saved.has(packingKey),false);
});

for(const raw of ["{broken","null","[]",'{"version":2,"lists":{}}','{"version":1,"lists":{},"unknown":"retain"}'])test(`unknown packing storage stays untouched: ${raw}`,()=>{
  const saved=new Map([[packingKey,raw]]);const c=boot("en","siechnice",{saved});
  c.mark("poland",0);c.chooseLanguage("ru");
  assert.equal(saved.get(packingKey),raw);assert.equal(c.writes.filter(([k])=>k===packingKey).length,0);
  assert.match(c.node("guide").innerHTML,/data-pack="poland" data-pack-index="0"[^>]*checked/);
  assert.match(c.node("packingStatus").textContent,/Not saved/);
});

test("changed list identity and invalid saved mark are preserved rather than migrated destructively",()=>{
  for(const change of [d=>d.lists.poland.items.reverse(),d=>d.lists.poland.checked[0]="yes",d=>d.lists.poland.checked.pop()]){
    const c=boot("en");c.mark("poland",0);const data=JSON.parse(c.saved.get(packingKey));change(data);
    const raw=JSON.stringify(data);const saved=new Map([[packingKey,raw]]);
    const updated=boot("en","siechnice",{saved});updated.mark("poland",1);
    assert.equal(saved.get(packingKey),raw);
    assert.match(updated.node("packingStatus").textContent,/Not saved/);
  }
});

for(const option of ["blockedStorage","blockedWrite"])test(`${option}: packing works in memory with warning and does not corrupt prior data`,()=>{
  const saved=new Map([["unrelated","keep"]]);
  const c=boot("en","ryczywol",{saved,[option]:true});c.mark("poland",0);c.chooseLocation("bogatynia");
  assert.match(c.node("guide").innerHTML,/data-pack="poland" data-pack-index="0"[^>]*checked/);
  assert.match(c.node("packingStatus").textContent,/Not saved/);
  assert.equal(saved.get("unrelated"),"keep");assert.equal(saved.has(packingKey),false);
});

test("concurrent storage change is never overwritten",()=>{
  const c=boot("en");c.mark("poland",0);const newer='{"version":9}';c.saved.set(packingKey,newer);
  c.mark("poland",1);assert.equal(c.saved.get(packingKey),newer);
  assert.match(c.node("packingStatus").textContent,/Not saved/);
});

for(const lang of locales)test(`${lang}: packing hint, saved and memory-only status use the selected language`,()=>{
  const c=boot(lang);
  assert.match(c.node('guide').innerHTML,new RegExp(`id="packingHint" lang="${lang}">`));
  assert.doesNotMatch(c.node('guide').innerHTML,/English \(EN\):/);
  c.mark('poland',0);assert.equal(c.node('packingStatus').lang,lang);
  assert.ok(c.node('packingStatus').textContent.trim());
  if(lang!=='en')assert.doesNotMatch(c.node('packingStatus').textContent,/Saved on this device/);
  const saved=c.saved.get(packingKey),reload=boot(lang,'ryczywol',{saved:c.saved});
  assert.match(reload.node('guide').innerHTML,/data-pack="poland" data-pack-index="0"[^>]*checked/);
  assert.equal(c.saved.get(packingKey),saved,'Language-only render never rewrites prior marks');
  const blocked=boot(lang,'ryczywol',{blockedWrite:true});blocked.mark('poland',0);
  assert.equal(blocked.node('packingStatus').lang,lang);assert.ok(blocked.node('packingStatus').textContent.trim());
  if(lang!=='en')assert.doesNotMatch(blocked.node('packingStatus').textContent,/Not saved/);
});

for(const lang of locales)test(`${lang}: visible and accessible top language label use approved UI text`,()=>{
  const label={textContent:'Language'},select={innerHTML:'',value:'',setAttribute(k,v){this[k]=v;}},wrapper={querySelector(selector){return selector==='label'?label:select;}};
  const window={},document={documentElement:{lang,dataset:{arrivalLocation:'ryczywol'}},getElementById(id){return id==='topLanguageSwitcher'?wrapper:id==='topLanguageSelect'?select:null;},querySelector(selector){return selector==='.topbar'?{}:null;},addEventListener(){}};
  const context=vm.createContext({window,document,location:{search:'?lang='+lang},URLSearchParams,URL});
  scripts.slice(0,3).forEach(script=>vm.runInContext(script,context));
  const before=JSON.stringify(window.ARRIVAL_DEFAULT_CONFIG);
  const instrumented=improvements.replace(/  refresh\(\);\r?\n\}\)\(\);\s*$/,'  window.labelTest=ensureTopLanguageSwitcher;\n})();');
  assert.notEqual(instrumented,improvements);vm.runInContext(instrumented,context);window.labelTest();
  const expected=window.ARRIVAL_DEFAULT_CONFIG.ui[lang].chooseLanguage;
  assert.equal(label.textContent,expected);assert.equal(select['aria-label'],expected);assert.equal(select.value,lang);
  assert.equal(JSON.stringify(window.ARRIVAL_DEFAULT_CONFIG),before);
});

function boot(lang, place = "bogatynia", options = {}) {
  const url = new URL("https://oleksandrkiris.github.io/przyjazd-do-pracy/");
  url.search = new URLSearchParams({ lang, location: place, name: "Fixture", surname: "Example", date: "2026-11-02", department: "production", hotel: "yes", country: options.country || "poland" });
  if (Object.hasOwn(options, "pack")) url.searchParams.set("pack", options.pack);
  url.hash = "#instructionStart";
  const location = { href: url.href, search: url.search, protocol: url.protocol };
  const history = {
    state: { entry: "keep-existing-state" }, attempts: 0, blocked: !!options.blockedHistory,
    replaceState(state, _title, target) {
      this.attempts++;
      if (this.blocked) throw new DOMException("History unavailable", "SecurityError");
      this.state = state;
      location.href = target.href;
      location.search = target.search;
    },
    pushState() { throw Error("Navigation must not add Back entries"); }
  };
  const nodes = new Map();
  function node(id) {
    if (!nodes.has(id)) {
      const handlers = {};
      nodes.set(id, { handlers, children: [], dataset: {}, hidden: false, textContent: "", innerHTML: "", href: "", value: "", isConnected: true,
        setAttribute(name, value) { this[name] = value; },
        addEventListener(name, callback) { handlers[name] = callback; },
        querySelector(selector) { return node(`${id}:${selector}`); },
        scrollIntoView(options) { this.lastScroll = options; },
        focus(options) { document.activeElement = this; this.lastFocus = options; },
        classList: { values: new Set(), add(value) { this.values.add(value); }, remove(value) { this.values.delete(value); }, contains(value) { return this.values.has(value); } },
        select() { this.selected = true; },
        setSelectionRange(start, end) { this.selectionStart = start; this.selectionEnd = end; }
      });
    }
    return nodes.get(id);
  }
  const saved = options.saved || new Map();
  const writes = [];
  const localStorage = {
    getItem(key) { if (options.blockedStorage) throw Error("Storage blocked"); return saved.get(key) ?? (key === "arrival-guide-language" ? options.storedLang || null : null); },
    setItem(key, value) { if (options.blockedStorage || options.blockedWrite) throw Error("Storage blocked"); saved.set(key,value); writes.push([key,value]); }
  };
  let copyClock = 0;
  const copyAttempts = [], temporaryFields = [], timers = [];
  const document = {
    createElement(tag) {
      const field = { tag, value: "", style: {}, setAttribute() {}, select() { this.selected = true; }, remove() { this.removed = true; } };
      temporaryFields.push(field); return field;
    },
    execCommand(command) {
      copyAttempts.push([command, temporaryFields.at(-1).value]);
      if (options.execThrows) throw Error("Copy refused");
      return options.execResult ?? false;
    },
    getElementById: node,
    documentElement: { lang: "", dataset: {}, style: { setProperty() {} } },
    addEventListener() {}, querySelectorAll: () => [],
    querySelector: selector => selector === ".topbar" ? null : node(selector),
    body: { appendChild() {}, insertAdjacentHTML() { throw new Error("Unexpected application error"); } }
  };
  const window = { localStorage, location, isSecureContext: options.secure !== false };
  if (!options.noMatchMedia) window.matchMedia = () => ({ matches: !!options.reducedMotion });
  const context = vm.createContext({ window, document, location, localStorage,
    navigator: options.navigator || {}, URL, URLSearchParams, structuredClone, console,
    history, DOMException,
    open() { throw new Error("External actions are forbidden"); },
    fetch() { throw new Error("Network requests are forbidden"); },
    setTimeout(callback, delay) { if (!options.copyTest) throw new Error("No operational action may be triggered"); const id=timers.length; timers.push({callback,at:copyClock+delay,active:true}); return id; },
    clearTimeout(id) { if(timers[id])timers[id].active=false; }
  });
  scripts.slice(0, 3).forEach((script, i) => vm.runInContext(script, context, { filename: paths[i] }));
  const originalConfig = JSON.stringify(window.ARRIVAL_DEFAULT_CONFIG);
  vm.runInContext(scripts[3], context, { filename: paths[3] });
  return { node, document, location, window, history, originalConfig, saved, writes, copyAttempts, temporaryFields, timers,
    elapse(milliseconds) { copyClock+=milliseconds; for(const timer of timers)if(timer.active&&timer.at<=copyClock){timer.active=false;timer.callback();} },
    copy() { node("addressCopyValue").value = window.ARRIVAL_DEFAULT_CONFIG.locations[document.documentElement.dataset.arrivalLocation].address.join(", "); return node('guide:[data-action="copy-address"]').handlers.click(); },
    mark(key,index,checked=true) {
      const input={type:"checkbox",dataset:{pack:key,packIndex:String(index)},checked};
      document.activeElement=input;
      node("guide").handlers.change({target:input});
      assert.equal(document.activeElement,input,"Checkbox focus must survive changes");
    },
    refreshEnhancements() {
      vm.runInContext(improvements, context);
      vm.runInContext(translations, context);
    },
    chooseLanguage(value, origin = "button") {
      const button = { dataset: { lang: value } };
      document.activeElement = origin === "button" ? button : node("topLanguageSelect");
      node("languageGate").handlers.click({ target: { closest: () => button } });
    },
    choosePacking(value) { node("guide").handlers.change({ target: { id: "packingChoice", value } }); },
    chooseLocation(value) { node("locationTiles").handlers.click({ target: { closest: () => ({ dataset: { location: value } }) } }); }
  };
}

test("Ryczywół arrival and contact screens use today's confirmed accommodation number in every language", () => {
  for (const lang of locales) {
    const c = boot(lang, "ryczywol");
    const place = c.window.ARRIVAL_DEFAULT_CONFIG.locations.ryczywol;
    assert.equal(place.phone, "+48511472583");
    assert.equal(place.whatsapp, "+48511472583");
    c.refreshEnhancements();
    const rendered = c.node("guide").innerHTML + c.node("contactsPage").innerHTML;
    assert.match(rendered, /511 472 583/);
    assert.match(rendered, /tel:[+]?48511472583/);
    assert.ok(!/536.?110.?591|Ludmi|Людмил/i.test(rendered));
    assert.equal(c.window.ARRIVAL_DEFAULT_CONFIG.locations.bogatynia.phone, "+48609809601");
    assert.equal(JSON.stringify(c.window.ARRIVAL_DEFAULT_CONFIG), c.originalConfig);
  }
});

for (const lang of locales) for (const place of locations) {
  test(`${lang}/${place}: language-safe PrimServ links preserve arrival context`, () => {
    const c = boot(lang, place);
    const hydra = new URL(c.node("hydraLink").href);
    const jobs = new URL(c.node("jobsLink").href);
    assert.equal(hydra.pathname, "/citronex-hydra-project/");
    assert.equal(hydra.searchParams.get("lang"), lang === "uk" ? "ua" : lang);
    assert.equal(jobs.pathname, "/kiris-jobs/");
    assert.equal(jobs.searchParams.get("lang"), lang);
    for (const target of [hydra, jobs]) assert.deepEqual([...target.searchParams.keys()], ["lang"], "No arrival personal data may leak into service links");
    for (const id of ["companyLink", "jobsLink", "botLink"]) assert.ok(c.node(id).textContent.length > 2);
    const current = new URL(c.location.href);
    assert.equal(current.searchParams.get("location"), place);
    assert.equal(current.searchParams.get("name"), "Fixture");
    assert.equal(current.hash, "#instructionStart");
    assert.equal(c.document.documentElement.lang, lang);
    assert.ok(c.document.title.endsWith(" · PrimServ"));
    assert.equal(c.node("languageFallback").hidden, true);
    assert.equal(JSON.stringify(c.window.ARRIVAL_DEFAULT_CONFIG), c.originalConfig, "No original instructions, contacts or routes may change");
  });
}

for (const alias of ["ua", "ka", "hy"]) {
  test(`${alias}: denied history cannot block the initial instructions or fallback`, () => {
    const c = boot(alias, "ryczywol", { blockedHistory: true, blockedStorage: true });
    const expected = alias === "ua" ? "uk" : "en";
    assert.equal(c.document.documentElement.lang, expected);
    assert.equal(c.node("languageFallback").hidden, alias === "ua");
    assert.ok(c.node("guide").innerHTML.length > 100);
    assert.ok(c.node("contactsPage").innerHTML.length > 100);
    assert.equal(c.node("locationName").textContent, "Ryczywół");
    c.refreshEnhancements();
    assert.equal(c.node(".mobile-hero-label").textContent, c.window.CANDIDATE_LANGUAGE_LABELS[expected].travelTo);
    assert.ok(c.node("mobileCandidateHero").innerHTML.includes("<h2>Ryczywół</h2>"));
    assert.equal(JSON.stringify(c.window.ARRIVAL_DEFAULT_CONFIG), c.originalConfig);
  });
}

for (const lang of locales) {
  test(`${lang}: denied history/storage still permits language and city navigation`, () => {
    const c = boot("pl", "siechnice", { blockedHistory: true, blockedStorage: true });
    const originalUrl = c.location.href;
    c.chooseLanguage(lang);
    c.chooseLocation("zgorzelec");
    assert.equal(c.document.documentElement.lang, lang);
    assert.equal(c.node("locationName").textContent, "Zgorzelec");
    assert.equal(c.document.activeElement, c.node("instructionStart"));
    assert.match(c.node("locationTiles").innerHTML, /aria-pressed="true"[^>]*data-location="zgorzelec"/);
    assert.equal(c.location.href, originalUrl, "A blocked history write must not be reported as persisted");
    assert.equal(new URL(c.node("jobsLink").href).searchParams.get("lang"), lang);
    assert.equal(JSON.stringify(c.window.ARRIVAL_DEFAULT_CONFIG), c.originalConfig);
  });
}

test("a later successful history write includes the latest language and city", () => {
  const c = boot("pl", "siechnice", { blockedHistory: true });
  c.chooseLanguage("uk");
  c.chooseLocation("zgorzelec");
  c.history.blocked = false;
  c.chooseLocation("bogatynia");
  const current = new URL(c.location.href);
  assert.equal(current.searchParams.get("lang"), "uk");
  assert.equal(current.searchParams.get("location"), "bogatynia");
  assert.equal(current.searchParams.get("name"), "Fixture");
  assert.equal(current.hash, "#instructionStart");
  assert.deepEqual(c.history.state, { entry: "keep-existing-state" });
});

test("URL synchronization preserves existing history state and avoids redundant writes", () => {
  const c = boot("pl", "siechnice");
  c.chooseLanguage("pl");
  c.chooseLocation("siechnice");
  assert.equal(c.history.attempts, 0);
  c.chooseLanguage("uk");
  c.chooseLocation("bogatynia");
  assert.equal(c.history.attempts, 2);
  assert.deepEqual(c.history.state, { entry: "keep-existing-state" });
});

test("switching language and location preserves the existing arrival query and hash", () => {
  const c = boot("pl", "zgorzelec");
  c.chooseLanguage("uk");
  assert.equal(new URL(c.node("hydraLink").href).searchParams.get("lang"), "ua");
  c.chooseLocation("ryczywol");
  const current = new URL(c.location.href);
  assert.equal(current.searchParams.get("location"), "ryczywol");
  assert.equal(current.searchParams.get("lang"), "uk");
  for (const [key, value] of Object.entries({ name: "Fixture", surname: "Example", date: "2026-11-02", hotel: "yes", country: "poland" })) assert.equal(current.searchParams.get(key), value);
  assert.equal(current.hash, "#instructionStart");
});

test("explicit Georgian link overrides a saved Polish choice with honest English fallback", () => {
  const c = boot("ka", "siechnice", { storedLang: "pl" });
  assert.equal(c.document.documentElement.lang, "en");
  assert.equal(c.node("languageFallback").hidden, false);
  assert.equal(new URL(c.node("hydraLink").href).searchParams.get("lang"), "en");
});

test("blocked browser storage does not prevent selecting language or keeping location", () => {
  const c = boot("uk", "ryczywol", { blockedStorage: true });
  c.chooseLanguage("en");
  assert.equal(c.document.documentElement.lang, "en");
  assert.equal(new URL(c.location.href).searchParams.get("location"), "ryczywol");
  assert.equal(new URL(c.location.href).searchParams.get("lang"), "en");
});

for (const alias of ["ua", "ka", "hy"]) {
  test(`${alias}: Ukrainian alias or explicit English fallback is truthful`, () => {
    const c = boot(alias);
    const expected = alias === "ua" ? "uk" : "en";
    assert.equal(c.document.documentElement.lang, expected);
    assert.equal(c.node("languageFallback").hidden, alias === "ua");
    assert.equal(new URL(c.node("jobsLink").href).searchParams.get("lang"), expected);
    c.chooseLanguage("pl");
    assert.equal(c.node("languageFallback").hidden, true);
  });
}

test("official assets, accessible link defaults and coherent cache references", async () => {
  const html = await fs.readFile(new URL("index.html", root), "utf8");
  const sw = await fs.readFile(new URL("sw.js", root), "utf8");
  const css = await fs.readFile(new URL("candidate-improvements.css", root), "utf8");
  const logo = await fs.readFile(new URL("assets/primserv-logo.svg", root));
  assert.equal(crypto.createHash("sha256").update(logo).digest("hex"), "1a29802a4a0065ad84e8f8dbdd5bc46dcb9b67bbecb2190de6a99464feaf5157");
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.ok(/rel="[^"]*noopener[^\"]*noreferrer/.test(match[0]));
  const hydraLink = html.match(/<a\b[^>]*id="hydraLink"[^>]*>/)?.[0];
  assert.ok(hydraLink?.includes('rel="noopener noreferrer"'), "The return link must not disclose a personal arrival URL through Referer");
  assert.ok(html.includes('href="https://www.primserv.pl/"'));
  assert.ok(html.includes('href="https://t.me/KirisWorkPoland_bot"'));
  assert.ok(html.includes('id="languageFallback"'));
  assert.ok(html.includes('alt="PrimServ"'));
  assert.ok(css.includes("min-height: 44px"));
  assert.ok(css.includes(":focus-visible"));
  const version = html.match(/name="candidate-page-version" content="([^"]+)"/)[1];
  assert.ok(sw.includes(`arrival-guide-${version}`));
  for (const match of html.matchAll(/(?:src|href)="([^\"]+\.(?:js|css))\?v=([^\"]+)"/g)) assert.equal(match[2], version.slice(1));
  assert.ok(sw.includes("./assets/primserv-logo.svg"));
  assert.ok(sw.includes("./assets/primserv-icon-192.png"));
  assert.equal(sw.includes("./assets/citronex-hydra-logo.png"), false);
});

for (const lang of locales) {
  test(`${lang}: keyboard language selection restores focus to the new button`, () => {
    const c = boot("pl");
    c.chooseLanguage(lang);
    const button = c.node(`languageGate:[data-lang="${lang}"]`);
    assert.equal(c.document.activeElement, button);
    assert.equal(button.lastFocus.preventScroll, true);
    assert.match(c.node("languageGate").innerHTML, new RegExp(`aria-pressed="true"[^>]*data-lang="${lang}"`));
    assert.equal((c.node("languageGate").innerHTML.match(/aria-pressed="true"/g) || []).length, 1);
  });
}

test("top language select retains focus when it activates a language button programmatically", () => {
  const c = boot("pl");
  c.chooseLanguage("uk", "select");
  assert.equal(c.document.activeElement, c.node("topLanguageSelect"));
  assert.equal(c.document.documentElement.lang, "uk");
});

for (const place of locations) for (const reducedMotion of [false, true]) {
  test(`${place}, reduced motion ${reducedMotion}: location opens and focuses the named instruction`, () => {
    const c = boot("uk", "siechnice", { reducedMotion });
    c.chooseLocation(place);
    const target = c.node("instructionStart");
    assert.equal(c.document.activeElement, target);
    assert.equal(target.lastFocus.preventScroll, true);
    assert.equal(target.lastScroll.behavior, reducedMotion ? "auto" : "smooth");
    assert.equal((c.node("locationTiles").innerHTML.match(/aria-pressed="true"/g) || []).length, 1);
    assert.match(c.node("locationTiles").innerHTML, new RegExp(`aria-pressed="true"[^>]*data-location="${place}"`));
  });
}

test("location navigation still works without matchMedia", () => {
  const c = boot("en", "siechnice", { noMatchMedia: true });
  c.chooseLocation("bogatynia");
  assert.equal(c.document.activeElement, c.node("instructionStart"));
  assert.equal(c.node("instructionStart").lastScroll.behavior, "smooth");
});

test("initial rendering does not steal focus", () => {
  assert.equal(boot("en").document.activeElement, undefined);
});

test("instruction and contact destinations are named, programmatically focusable and visible on keyboard focus", async () => {
  const html = await fs.readFile(new URL("index.html", root), "utf8");
  const css = await fs.readFile(new URL("candidate-improvements.css", root), "utf8");
  for (const [id, label] of [["instructionStart", "locationName"], ["contactsPage", "contactsTitle"]]) {
    const tag = html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>`))?.[0];
    assert.ok(tag?.includes('tabindex="-1"'));
    assert.ok(tag?.includes(`aria-labelledby="${label}"`));
    assert.ok(css.includes(`#${id}:focus-visible`));
  }
  assert.ok(boot("en").node("contactsPage").innerHTML.includes('id="contactsTitle"'));
});

for (const lang of locales) for (const place of locations) {
  test(`${lang}/${place}: enhanced contacts and labels follow selection when the URL is blocked`, () => {
    const c = boot("pl", "siechnice", { blockedHistory: true, blockedStorage: true });
    c.chooseLanguage(lang);
    c.chooseLocation(place);
    c.refreshEnhancements();
    const config = c.window.ARRIVAL_DEFAULT_CONFIG;
    const group = ["zgorzelec", "bogatynia"].includes(place) ? "bogatynia_zgorzelec" : place;
    assert.ok(c.node("mobileCandidateHero").innerHTML.includes(`<h2>${config.locations[place].name}</h2>`));
    for (const person of config.contacts[group]) {
      assert.ok(c.node("contactsPage").innerHTML.includes(person.phone.replace(/\D/g, "")), person.name);
    }
    assert.equal(c.node(".mobile-hero-label").textContent, c.window.CANDIDATE_LANGUAGE_LABELS[lang].travelTo);
    assert.equal(c.node("#contactsPage h2").textContent, c.window.CANDIDATE_LANGUAGE_LABELS[lang].contactTitle);
    assert.equal(JSON.stringify(config), c.originalConfig);
  });
}

for (const lang of locales) {
  test(`${lang}: enhancement fallback retains URL choices before core state is available`, () => {
    const c = boot(lang, "ryczywol");
    delete c.document.documentElement.dataset.arrivalLocation;
    c.document.documentElement.lang = "pl";
    c.refreshEnhancements();
    assert.equal(c.node(".mobile-hero-label").textContent, c.window.CANDIDATE_LANGUAGE_LABELS[lang].travelTo);
    assert.ok(c.node("mobileCandidateHero").innerHTML.includes("<h2>Ryczywół</h2>"));
  });
}

function contactBoot(reducedMotion, noMatchMedia = false) {
  const handlers = [];
  const nodes = new Map();
  const document = {
    activeElement: null, documentElement: { lang: "uk" },
    getElementById: id => nodes.get(id) || null,
    querySelector: () => null, querySelectorAll: () => [],
    createElement: () => makeNode(),
    body: { appendChild(node) { nodes.set(node.id, node); } },
    addEventListener(type, callback, capture) { handlers.push({ callback, capture }); }
  };
  function makeNode() {
    return { children: [], dataset: {}, innerHTML: "",
      setAttribute() {},
      insertAdjacentElement(_where, node) { nodes.set(node.id, node); },
      focus(options) { document.activeElement = this; this.lastFocus = options; },
      scrollIntoView(options) { this.lastScroll = options; }
    };
  }
  for (const id of ["contactsPage", "instructionStart", "translatedCandidateCss"]) nodes.set(id, makeNode());
  const location = { search: "?lang=uk&location=bogatynia" };
  const window = {};
  if (!noMatchMedia) window.matchMedia = () => ({ matches: reducedMotion });
  const forbidden = () => { throw Error("No operational action is allowed"); };
  const context = vm.createContext({ window, document, location, URLSearchParams,
    open: forbidden, fetch: forbidden, setTimeout: forbidden, navigator: {} });
  vm.runInContext(scripts[0], context);
  vm.runInContext(improvements, context);
  return { document, nodes,
    activate(kind, action) {
      const button = { dataset: { helpAction: action } };
      let prevented = false, stopped = false;
      document.activeElement = button;
      const event = {
        target: { closest: selector => selector === (kind === "help" ? "[data-help-action]" : `[data-action="${action}"]`) ? button : null },
        preventDefault() { prevented = true; }, stopImmediatePropagation() { stopped = true; }
      };
      for (const h of [...handlers.filter(h => h.capture), ...handlers.filter(h => !h.capture)]) {
        h.callback(event);
        if (stopped) break;
      }
      return { prevented, stopped };
    }
  };
}
for (const reducedMotion of [false, true]) for (const kind of ["help", "direct"]) for (const action of ["call", "whatsapp"]) {
  test(`${kind}/${action}, reduced motion ${reducedMotion}: focus reaches contacts without sending`, () => {
    const c = contactBoot(reducedMotion);
    const result = c.activate(kind, action);
    const section = c.nodes.get("contactsPage");
    assert.equal(c.document.activeElement, section);
    assert.equal(section.lastFocus.preventScroll, true);
    assert.equal(section.lastScroll.behavior, reducedMotion ? "auto" : "smooth");
    assert.ok(section.innerHTML.includes('id="contactsTitle"'));
    if (kind === "direct") assert.deepEqual(result, { prevented: true, stopped: true });
  });
}

test("contact navigation tolerates browsers without matchMedia", () => {
  const c = contactBoot(false, true);
  c.activate("help", "call");
  assert.equal(c.document.activeElement, c.nodes.get("contactsPage"));
  assert.equal(c.nodes.get("contactsPage").lastScroll.behavior, "smooth");
});

for (const lang of locales) test(`${lang}: exactly one copy button belongs to the visible address panel for every city`, () => {
  for (const place of locations) {
    const c = boot(lang, place), html = c.node("guide").innerHTML;
    const firstPanel = html.slice(0, html.indexOf("</section>"));
    assert.equal((html.match(/data-action="copy-address"/g) || []).length, 1);
    assert.ok(firstPanel.includes(`>${c.window.ARRIVAL_DEFAULT_CONFIG.ui[lang].copyAddress}</button>`));
    assert.ok(firstPanel.includes('id="addressCopyFallback" class="address-copy-fallback" hidden'));
    assert.ok(firstPanel.includes('readonly aria-label='));
    assert.ok(firstPanel.includes(c.window.ARRIVAL_DEFAULT_CONFIG.locations[place].address.join(", ")));
    assert.equal(JSON.stringify(c.window.ARRIVAL_DEFAULT_CONFIG), c.originalConfig);
  }
});

test("modern clipboard success copies the exact address and never uses legacy copy", async () => {
  const copied = [], c = boot("en", "ryczywol", {copyTest:true,navigator:{clipboard:{async writeText(text){copied.push(text);}}}});
  await c.copy();
  assert.deepEqual(copied,[c.window.ARRIVAL_DEFAULT_CONFIG.locations.ryczywol.address.join(", ")]);
  assert.equal(c.node("toast").textContent,c.window.ARRIVAL_DEFAULT_CONFIG.ui.en.copied);
  assert.equal(c.node("toast").classList.contains("show"),true);
  assert.equal(c.copyAttempts.length,0);assert.equal(c.node("addressCopyFallback").hidden,true);
});

for (const mode of ["rejected", "synchronous", "missing", "insecure"]) test(`${mode} clipboard: actual legacy success is required before showing copied`, async () => {
  const clipboard={writeText(){if(mode==="synchronous")throw Error("Denied");return Promise.reject(Error("Denied"));}};
  const c=boot("ru","bogatynia",{copyTest:true,execResult:true,secure:mode!=="insecure",navigator:mode==="missing"?{}:{clipboard}});
  await c.copy();assert.equal(c.copyAttempts.length,1);
  assert.equal(c.copyAttempts[0][1],c.node("addressCopyValue").value);
  assert.equal(c.node("toast").classList.contains("show"),true);
  assert.equal(c.node("addressCopyFallback").hidden,true);
  assert.ok(c.temporaryFields.every(field=>field.removed));
});

for (const execThrows of [false,true]) test(`denied clipboard and legacy ${execThrows?"throw":"false"}: selected manual address without false success`, async()=>{
  const c=boot("uk","zgorzelec",{copyTest:true,execThrows,navigator:{clipboard:{async writeText(){throw Error("Denied");}}}});
  await c.copy();const field=c.node("addressCopyValue");
  assert.equal(c.node("addressCopyFallback").hidden,false);assert.equal(c.document.activeElement,field);
  assert.equal(field.selected,true);assert.equal(field.selectionStart,0);assert.equal(field.selectionEnd,field.value.length);
  assert.equal(c.node("toast").classList.contains("show"),false);assert.ok(c.temporaryFields.every(field=>field.removed));
  assert.equal(c.writes.length,0);
});

test("clipboard getter denial and prior success toast cannot produce a false copied result",async()=>{
  const navigator={};Object.defineProperty(navigator,"clipboard",{get(){throw Error("Denied");}});
  const c=boot("en","siechnice",{copyTest:true,navigator});c.node("toast").classList.add("show");
  await c.copy();assert.equal(c.node("addressCopyFallback").hidden,false);assert.equal(c.node("toast").classList.contains("show"),false);
});

test("a rejected pending copy cannot reveal a stale city's manual field after rendering",async()=>{
  let reject;const pending=new Promise((_,r)=>{reject=r;});
  const c=boot("en","siechnice",{copyTest:true,navigator:{clipboard:{writeText(){return pending;}}}});
  const action=c.copy();c.node("addressCopyFallback").isConnected=false;reject(Error("Denied"));await action;
  assert.equal(c.node("addressCopyFallback").hidden,true);
});

test("rapid copies keep the newest success visible for its full duration",async()=>{
  const c=boot("en","siechnice",{copyTest:true,navigator:{clipboard:{async writeText(){}}}});
  await c.copy();c.elapse(1000);await c.copy();c.elapse(900);
  assert.equal(c.node("toast").classList.contains("show"),true,"The previous copy's timer must not hide the new result");
  c.elapse(901);assert.equal(c.node("toast").classList.contains("show"),false);
});

test("explicit choose mode does not infer a packing list from the legacy country",()=>{
  const c=boot("en","ryczywol",{country:"poland",pack:"choose"});
  assert.match(c.node("guide").innerHTML,/id="packingChoice"/);
  assert.doesNotMatch(c.node("guide").innerHTML,/data-pack-index/);
  assert.equal(c.saved.get(packingKey),undefined);
  c.choosePacking("ukraine");assert.match(c.node("guide").innerHTML,/data-pack="ukraine"/);
  assert.equal(new URL(c.location.href).searchParams.get("pack"),"ukraine");
  assert.equal(new URL(c.location.href).searchParams.get("country"),"poland");
  assert.equal(c.document.activeElement,c.node("packingChoice"));
});
test("unknown packing choice becomes an explicit choice without reflected text or storage",()=>{
  const c=boot("en","siechnice",{pack:"<unknown>"});
  assert.doesNotMatch(c.node("guide").innerHTML,/<unknown>|data-pack-index/);
  assert.equal(new URL(c.location.href).searchParams.get("pack"),"choose");
  assert.equal(c.saved.get(packingKey),undefined);
});
test("visible packing choices preserve three independent lists and other adds no facts",()=>{
  const c=boot("ru","ryczywol",{pack:"choose"});
  for(const key of ["ukraine","poland","caucasus"]){c.choosePacking(key);c.mark(key,0);}
  const saved=c.saved.get(packingKey);c.choosePacking("other");
  assert.match(c.node("guide").innerHTML,/id="packingChoiceHelp" role="status"/);
  assert.doesNotMatch(c.node("guide").innerHTML,/data-pack-index/);assert.equal(c.saved.get(packingKey),saved);
  c.chooseLanguage("uk");c.chooseLocation("bogatynia");
  for(const key of ["ukraine","poland","caucasus"]){c.choosePacking(key);assert.match(c.node("guide").innerHTML,new RegExp(`data-pack="${key}" data-pack-index="0"[^>]*checked`));}
  assert.equal(c.saved.get(packingKey),saved);assert.equal(JSON.stringify(c.window.ARRIVAL_DEFAULT_CONFIG),c.originalConfig);
});
test("blocked URL and storage still permit in-memory list choice without overwriting",()=>{
  const c=boot("en","ryczywol",{pack:"choose",blockedHistory:true,blockedStorage:true}),before=c.location.href;
  c.choosePacking("caucasus");c.mark("caucasus",0);c.choosePacking("other");c.choosePacking("caucasus");
  assert.match(c.node("guide").innerHTML,/data-pack="caucasus" data-pack-index="0"[^>]*checked/);
  assert.equal(c.location.href,before);assert.equal(c.writes.length,0);
});
