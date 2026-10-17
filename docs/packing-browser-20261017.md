# PR7: reproducible browser acceptance

Issue: https://github.com/OleksandrKiris/przyjazd-do-pracy/issues/6

This continuation completes the existing feature, not a second feature. The first
real Chromium run on 795e672 failed at keyboard Space: the list existed in the DOM
but both legacy nth-of-type(n+3) CSS rules hid its entire panel. A packing-panel
class now exempts only this section from both hide rules. Other hidden panels stay
unchanged. Added structural regression and explicit browser visibility assertion.
Runtime version is v57-packing-visible; materials, routes, translations and the
confirmed Dmytro (Dima) +48511472583 contact are unchanged. No new runtime requests.
The visible top language select, not the intentionally hidden legacy language
buttons, is used for acceptance. Runtime byte delta is recorded in the PR.

`Packing browser acceptance` checks out the exact PR head, verifies base ancestry,
runs `npm test`, then pinned Playwright 1.56.1 Chromium. Test dependencies live only
in runner temp. No package/runtime dependency, backend or public preview is added.
The loopback server terminates after the run and serves only 14 approved static
files. External requests and non-GET/HEAD requests are blocked. No contact actions,
applications or bookings are executed; all injected values are synthetic.

The artifact records exact head/base, checkout, SHA-256 and size of each runtime
file, Chromium version, screenshot/trace, cache entries and bounded request counts.
Matrix: 1280/320px, Tab/Space/focus, all nine languages, explicit English helper
fallback, ka fallback, independent packing variants, city changes, reload and Back,
Chromium offline reload and edits, corrupt/future/denied storage, real v54/v55 worker
upgrade to v57 preserving marks and an unrelated cache. 320px is not a phone test.
Fault injection is distinct from actual offline networking in a fresh test context.

Run the workflow on the PR; inspect `acceptance.json`, screenshots, trace and job
logs before marking it ready. Adding the script alone is not a passing result.
Any changed main requires repeat acceptance on a reconciled branch. Browser UI
and offline acceptance are pending until a successful exact-head run is recorded.

Offline requires first successful online loading/worker installation. Never-opened
devices are not covered. External maps, services and contacts require connectivity.
For manual review, serve a checkout via `python3 -m http.server 8080 --bind 127.0.0.1`
and open `http://127.0.0.1:8080/?lang=en&location=ryczywol`; stop with Ctrl+C. There is
no service worker support claim for file://. Do not enter real candidate data.

Last production base: dfac43ca1f5d9f79eefecf5201896eca7ca9c0e8 / v54-housing-contact.
This test-only continuation can be reverted independently. Runtime rollback is
only a separate reviewed revert PR with a fresh cache version, current head/base
guards and preserved local marks. Do not reintroduce the old query-cache defect
without explicit review. Owner3 prepares; only release owner10 merges/publishes.
