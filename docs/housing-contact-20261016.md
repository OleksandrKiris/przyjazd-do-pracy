# Ryczywół accommodation contact correction — 2026-10-16

Fresh main `6bdf562af004e2715d21e9aa6c5296820d4be3a4`; no open PRs;
latest Quality and Pages successful. All 24 local files match remote blobs.

The user's direct instruction **2026-10-16 08:04:10 UTC** (10:04:10 Warsaw)
confirms Dima for accommodation in Ryczywół: **+48 511 472 583**. This repeats
the 13 October correction. A narrow retrieval of the original instruction
found no later reversal and accessed no candidate records. Training-site PR13
has already published the same confirmed contact.

Old Ludmiła/phone references remained in core configuration, optional override,
the nine-language route/help notes and the contact-list initializer. Update all
active sources together so fallback/script order cannot restore the obsolete
contact. Change only the named housing contact and number; retain addresses,
route steps, other contacts, terms and application behavior. Keep existing
translations, adapting only the proper name and its grammatical forms.

Advance HTML/script/style cache references consistently to v54-housing-contact.
The existing runtime/validators exercise all nine languages and four locations.
An added rendering scenario checks the corrected phone in Ryczywół guide and
contacts, and confirms Bogatynia's contact stays unchanged. No real contact action
or form submission is performed. Test/publication/browser results are in the PR.

Rollback: revert through a reviewed PR and advance cache again. Before restoring
the obsolete number, verify whether the user's newer correction was revoked.
