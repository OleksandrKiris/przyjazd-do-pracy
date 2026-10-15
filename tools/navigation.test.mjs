import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import crypto from "node:crypto";

const root = new URL("../", import.meta.url);
const paths = ["data/config.js", "data/overrides.js", "language-options.js", "app.js"];
const scripts = await Promise.all(paths.map(path => fs.readFile(new URL(path, root), "utf8")));
const locales = ["pl", "ru", "uk", "en", "az", "es", "fil", "id", "ne"];
const locations = ["siechnice", "ryczywol", "bogatynia", "zgorzelec"];

function boot(lang, place = "bogatynia", options = {}) {
  const url = new URL("https://oleksandrkiris.github.io/przyjazd-do-pracy/");
  url.search = new URLSearchParams({ lang, location: place, name: "Fixture", surname: "Example", date: "2026-11-02", department: "production", hotel: "yes", country: "poland" });
  url.hash = "#instructionStart";
  const location = { href: url.href, search: url.search, protocol: url.protocol };
  const nodes = new Map();
  function node(id) {
    if (!nodes.has(id)) {
      const handlers = {};
      nodes.set(id, { handlers, hidden: false, textContent: "", innerHTML: "", href: "",
        setAttribute(name, value) { this[name] = value; },
        addEventListener(name, callback) { handlers[name] = callback; },
        querySelector(selector) { return node(`${id}:${selector}`); },
        scrollIntoView() {},
        classList: { add() {}, remove() {} }
      });
    }
    return nodes.get(id);
  }
  const localStorage = {
    getItem() { if (options.blockedStorage) throw Error("Storage blocked"); return options.storedLang || null; },
    setItem() { if (options.blockedStorage) throw Error("Storage blocked"); }
  };
  const document = {
    getElementById: node,
    documentElement: { lang: "", style: { setProperty() {} } },
    addEventListener() {}, querySelectorAll: () => [],
    body: { insertAdjacentHTML() { throw new Error("Unexpected application error"); } }
  };
  const window = { localStorage, location };
  const context = vm.createContext({ window, document, location, localStorage,
    navigator: {}, URL, URLSearchParams, structuredClone, console,
    history: { replaceState(_state, _title, target) { location.href = target.href; location.search = target.search; } },
    open() { throw new Error("External actions are forbidden"); },
    fetch() { throw new Error("Network requests are forbidden"); },
    setTimeout() { throw new Error("No operational action may be triggered"); }
  });
  scripts.slice(0, 3).forEach((script, i) => vm.runInContext(script, context, { filename: paths[i] }));
  const originalConfig = JSON.stringify(window.ARRIVAL_DEFAULT_CONFIG);
  vm.runInContext(scripts[3], context, { filename: paths[3] });
  return { node, document, location, window, originalConfig,
    chooseLanguage(value) { node("languageGate").handlers.click({ target: { closest: () => ({ dataset: { lang: value } }) } }); },
    chooseLocation(value) { node("locationTiles").handlers.click({ target: { closest: () => ({ dataset: { location: value } }) } }); }
  };
}

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
