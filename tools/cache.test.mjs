import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('../sw.js', import.meta.url), 'utf8');
const scope = 'https://example.test/przyjazd-do-pracy/';
const current = source.match(/const CACHE_NAME = "([^"]+)"/)[1];
function boot({ offline = false, failedWrite = false, failedAsset = null } = {}) {
  const listeners = {}, stores = new Map(), requests = [], writes = [];
  let skips = 0;
  const key = value => new URL(typeof value === 'string' ? value : value.url, scope).href;
  const open = async name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const data = stores.get(name);
    return {
      match: async request => data.get(key(request)),
      put: async (request, response) => { if (failedWrite) throw Error('quota'); writes.push(key(request)); data.set(key(request), response); },
      add: async request => { requests.push(key(request)); if (failedAsset && key(request).endsWith('/' + failedAsset)) throw Error('asset transfer failed'); data.set(key(request), new Response('static shell')); },
      addAll: async batch => {
        const urls = batch.map(key); requests.push(...urls);
        if (failedAsset && urls.some(url => url.endsWith('/' + failedAsset))) throw Error('asset transfer failed');
        for (const url of urls) data.set(url, new Response('static shell'));
      }
    };
  };
  const caches = { open, keys: async () => [...stores.keys()], delete: async name => stores.delete(name),
    match: async (request, options) => {
      for (const data of stores.values()) for (const [url, response] of data) {
        if (options?.ignoreSearch ? url.split('?')[0] === key(request).split('?')[0] : url === key(request)) return response;
      }
    }
  };
  class ScopedRequest extends Request { constructor(input, options) { super(typeof input === 'string' ? new URL(input, scope) : input, options); } }
  const context = vm.createContext({ URL, Request: ScopedRequest, Response, caches,
    self: { location: new URL('sw.js', scope), registration: { scope }, clients: { claim: async () => {} }, skipWaiting: async () => { skips++; }, addEventListener: (name, fn) => { listeners[name] = fn; } },
    fetch: async request => { requests.push(key(request)); if (offline) throw Error('offline'); return new Response('static shell'); },
    setTimeout: (fn, delay) => { const timer = setTimeout(fn, delay); timer.unref(); return timer; }, clearTimeout
  });
  vm.runInContext(source, context);
  return { stores, requests, writes, open, get skips() { return skips; }, allowAllAssets() { failedAsset = null; },
    async send(relative, { mode = 'navigate', method = 'GET', headers = {} } = {}) {
      let response; const work = [];
      listeners.fetch({ request: { url: new URL(relative, scope).href, mode, method, headers: new Headers(headers) },
        respondWith: promise => { response = promise; }, waitUntil: promise => work.push(promise) });
      const result = await response;
      await Promise.all(work);
      // Allow the original worker's detached promise chains to settle as well.
      await new Promise(resolve => setImmediate(resolve));
      return result;
    },
    async activate() { let work; listeners.activate({ waitUntil: promise => { work = promise; } }); await work; },
    async install() { let work; listeners.install({ waitUntil: promise => { work = promise; } }); await work; }
  };
}
test('navigation caches/fetches only static shell, never fictitious arrival query data', async () => {
  const b = boot();
  await b.send('./?lang=uk&location=ryczywol&name=Fixture&surname=Example&date=2099-01-01');
  assert(b.writes.length > 0);
  assert(b.writes.every(url => !url.includes('?')), 'Query data reached CacheStorage key');
  assert(b.requests.every(url => !url.includes('?')), 'Query data reached cached response request');
});
test('repeated navigation/asset query variants have bounded canonical cache keys', async () => {
  const b = boot();
  for (let i = 0; i < 4; i++) {
    await b.send(`./?lang=en&fixture=${i}`);
    await b.send(`app.js?v=${i}`, { mode: 'cors' });
  }
  assert.equal(b.stores.get(current).size, 2);
  assert(b.writes.every(url => !url.includes('?')));
});
test('unknown paths, other projects and external URLs are not intercepted', async () => {
  const b = boot();
  for (const url of ['private.json', '../other-project/', 'tools/test.js', 'assets/unlisted.png', 'https://elsewhere.test/']) assert.equal(await b.send(url), undefined);
  assert.equal(b.requests.length, 0);
  assert.equal(b.writes.length, 0);
});
test('POST, authorized and ranged requests bypass the static cache', async () => {
  const b = boot();
  for (const options of [{ method: 'POST' }, { headers: { Authorization: 'Bearer fictitious' } }, { headers: { Range: 'bytes=0-9' } }]) assert.equal(await b.send('app.js', options), undefined);
  assert.equal(b.writes.length, 0);
});
test('lookup cannot return a response from an unrelated origin-wide cache', async () => {
  const b = boot();
  await (await b.open('unrelated-cache')).put(new Request(new URL('app.js', scope)), new Response('foreign stale'));
  b.writes.length = 0;
  const response = await b.send('app.js', { mode: 'cors' });
  assert.equal(await response.text(), 'static shell');
});
test('offline navigation returns current shell without query persistence', async () => {
  const b = boot({ offline: true });
  await (await b.open(current)).put(new Request(new URL('index.html', scope)), new Response('current shell'));
  b.writes.length = 0;
  const response = await b.send('./?lang=uk&location=bogatynia');
  assert.equal(await response.text(), 'current shell');
  assert.deepEqual(b.writes, []);
});
test('cache quota failure does not turn a successful network response into a page error', async () => {
  const b = boot({ failedWrite: true });
  assert.equal(await (await b.send('./')).text(), 'static shell');
});
test('activation removes only old arrival caches, retains current and unrelated caches', async () => {
  const b = boot();
  await b.open('arrival-guide-v54-housing-contact'); await b.open(current); await b.open('other-app');
  await b.activate();
  assert.deepEqual([...b.stores.keys()].sort(), [current, 'other-app'].sort());
});

for (const failedAsset of ['app.js', 'styles.css']) test(`failed ${failedAsset} install rejects before replacing the usable shell`, async () => {
  const b = boot({ failedAsset });
  const old = await b.open('arrival-guide-previous'); await old.put(new URL('index.html', scope), new Response('usable previous shell'));
  await b.open('unrelated-cache');
  await assert.rejects(b.install(), /asset transfer failed/);
  assert.equal(b.skips, 0);
  assert.equal(await (await old.match(new URL('index.html', scope))).text(), 'usable previous shell');
  assert(b.stores.has('unrelated-cache'));
});

test('complete install caches all14 approved requests before skipWaiting and activation', async () => {
  const b = boot(); await b.open('arrival-guide-previous'); await b.open('unrelated-cache');
  await b.install(); assert.equal(b.stores.get(current).size, 14); assert.equal(b.skips, 1);
  assert(b.stores.has('arrival-guide-previous'));
  assert(b.requests.every(url => !new URL(url).search));
  await b.activate(); assert(!b.stores.has('arrival-guide-previous')); assert(b.stores.has('unrelated-cache'));
});

test('retry after an interrupted transfer fills the complete shell without discarding the previous one early', async () => {
  const b = boot({ failedAsset: 'app.js' }); await b.open('arrival-guide-previous');
  await assert.rejects(b.install(), /asset transfer failed/); assert.equal(b.skips, 0); assert(b.stores.has('arrival-guide-previous'));
  b.allowAllAssets(); await b.install(); assert.equal(b.skips, 1); assert.equal(b.stores.get(current).size, 14); assert(b.stores.has('arrival-guide-previous'));
  await b.activate(); assert(!b.stores.has('arrival-guide-previous'));
});
