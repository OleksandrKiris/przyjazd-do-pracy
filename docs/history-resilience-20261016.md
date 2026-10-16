# Arrival navigation under restricted History API — 2026-10-16

Pinned source: `06dc1a216864fcd040eb882bf6f317f83f6644ab`.
No open PRs; previous main Quality/Pages successful. All 23 locally used
source/assets match remote blob hashes. The old public PNG is omitted from the
local snapshot only and is retained unchanged in the remote tree.

## Confirmed failures and bounded fix

`history.replaceState` could throw during initial URL normalization or language /
city selection and prevent rendering. Three call sites now share the guarded URL
synchronizer. It retains the existing history state, avoids redundant writes and
never adds Back entries. A later successful write includes both current choices.

The enhancement and translation scripts previously preferred stale URL values,
so simply catching the error left their contact/location/language blocks out of
sync. They now read the rendered language and normalized location; the URL remains
the fallback when the core app has not supplied a location.

No claim of persistence is made when the browser rejects a URL update. The current
page remains usable; a reload or copying the unchanged browser URL can still use
the old choice. No redirect or storage workaround is introduced.

## Verification

- Baseline npm test: 73 navigation + 12 public-check tests passed.
- 14 new core regression scenarios failed before the core fix.
- With only the core fix, 35 of 36 new enhancement matrix cases still failed;
  these passed after making all three scripts agree on the rendered selection.
- Final npm test: 132 navigation + 12 public-check tests, plus existing validation
  of 9 languages, 4 locations, 36 matrix checks and 17 route links.
- Tests execute the actual scripts in a VM/DOM fixture. They cover rejected
  history and storage, ua/ka/hy normalization, nine languages/four cities,
  current contacts and labels, focus, history-state retention, recovery, query
  and hash preservation. Nine additional cases retain URL-based enhancement
  fallback before the core state is available. Test data is synthetic. External
  actions are forbidden.
- Original configuration remains byte-for-byte unchanged during interactions.
  No contacts, names, routes, instruction wording, translations or media edited.
- HTML references and worker cache advance together to v53-history-resilience.
  No dependencies, integrations, network requests or backend changes added.
- Browser extension returned an unavailable-origin error; cloud browser timed
  out. These are source/VM/HTTP checks, not visual, mobile or real-browser tests.

Before merge: full diff, syntax, whitespace, npm test, exact-head CI, fresh main
and PR head guards. After merge: successful Quality/Pages and exact live bytes.
Release evidence belongs in the PR description.

Rollback: revert the PR, advance the cache namespace again, run npm test and
repeat the normal guarded publication workflow. No external data migration.
