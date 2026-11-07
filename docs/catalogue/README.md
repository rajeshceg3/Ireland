# Source-backed Ireland catalogue draft, November 7, 2026

Runtime PR24 merged as3664c8e after signed-in preview qualification. Public production qualified17:30 November7; parent acceptance pending. Existing todo: catalogue and attraction layout follow-through. No real user data inspected or modified.

## Decision

The original catalogue contains15records but only3underlying destinations. IDs4–15are numbered replicas of IDs1–3 with displaced coordinates, the same descriptions/ratings/hours and placeholder photos. Do not relabel these as new destinations or silently substitute their saved IDs.

Draft browsing catalogue offers only canonical IDs1/2/3, source-checked coordinates and licensed local photography. The15original records are retained byte-for-byte in legacy-attractions.v1.json. Existing itinerary storage embeds complete objects and this draft neither migrates nor rewrites them. Numbered legacy stops remain visible with original names/coordinates and a warning to review before travel. Recovery import/export retains its existing manual semantics.

Invented ratings and single fixed daily hours are removed from new records. Each detail links directly to official opening information. This matters because Guinness's own getting-here and contact pages disagree on some indicative times; no guessed schedule is chosen. No prices, tickets or bookings are offered.

## Sources fetched/read

1. https://www.cliffsofmoher.ie/en/your-visit/visiting-the-cliffs/location-and-directions/ (operator): visitor centre52.97201,-9.42592; pin explicitly labels visitor centre, not a walking-route entrance.
2. https://www.cliffsofmoher.ie/en/contact/ (operator): seasonal opening times and December closures; linked rather than hardcoded.
3. https://www.guinness-storehouse.com/en/getting-here (operator): St James's Gate address; official page's directions link embeds53.3418088,-6.2867155 (raw page inspected). Indicative hours differ from contact page, so link out.
4. https://www.guinness-storehouse.com/en/contact-us (operator): same address, conflicting indicative schedule noted above.
5. https://www.guinness-storehouse.com/en/visit (operator): visitor exhibitions/history and Gravity Bar description.
6. https://blarneycastle.ie/plan-your-visit/ (operator): castle/gardens near Blarney, Stone at top of tower, seasonal hours. Ordinary page fetch worked; direct raw request403, not assumed availability blocker.
7. https://www.discoverireland.ie/cork/blarney-castle-and-gardens (tourism body): castle, gardens, Cork identity corroborated.
8. https://www.ucc.ie/en/fossil-heritage/fossil-map/blarneycastle/ (university, updated9Oct2025): site location51.929110,-8.5707075; exact pin labels castle, not guaranteed accessible entrance.

## Photography and rights

Exact downloaded files inspected directly; no AI substitute or unrelated landscape. Public local files avoid unreliable placeholder/external-photo dependencies. Files are unedited source renditions; detail card CSS crops the display and discloses that crop. Credit/title/source/license links appear under each image; no endorsement implied. Preserve license conditions on the photo, not claim the app itself is under that photo's license.

- cliffs.jpg: Barney Murphy, Cliffs of Moher County Clare Ireland,2018, CC BY-SA4.0. Source https://commons.wikimedia.org/wiki/File:Cliffs_of_Moher%2C_County_Clare%2C_Ireland.jpg . License https://creativecommons.org/licenses/by-sa/4.0/ . Downloaded960x720source thumbnail, SHAea62c9886b1e746510b01172474355efebbd688a68a8fc3c7fea4fef5b3ec2e8.
- guinness.jpg: Spudgun67, Guinness Storehouse St James's Gate Ushers Dublin8Ireland,2018, CC BY-SA4.0. Source https://commons.wikimedia.org/wiki/File:Guinness_Storehouse_St_James%27s_Gate_Ushers_Dublin_8_Ireland.jpg . Same license. This is the St James's Gate exterior, not the Storehouse facade; caption says so. Downloaded500x667source thumbnail, SHAec10b726132a33d5c56ccfb738b7c25e843ea82bdf9109c79bbd6fee102e885b.
- blarney.jpg: Leo McKEEFRY, Blarney Castle,2002, CC BY-SA2.0. Source https://www.geograph.ie/photo/950398 . Exactsourcephoto https://s0.geograph.org.uk/photos/95/03/950398_5d818092.jpg . License https://creativecommons.org/licenses/by-sa/2.0/ . Downloaded640x452, SHA090d28f9dfc5365a7765c39cb49155a35b63dfca77a048de472347ac985b0cc2.

A different Blarney Commons candidate had conflicting author/license fields in its metadata and was not used.

## Local qualification and remaining gates

First draft7existing tests/build pass. Local320/390/844/1320three-pin/image/source/no-unproven-hours-rating test passes, but initial screenshots were before header animation/tiles finished. Readiness tightened. That exposed real844pin interception by header/categories; MapUpdater now reserves top190/bottom105px for pins and all4widths pass. Detail close previously scrolled away; draft now has sticky44px opaque closebar, opaque panel and hidden/inert background. Final390/844pixels inspected. Zoom control was still hidden beneath phone header;150pxtop correction added, final rerun still required. No whole-app-layout/physical-device claim.

Remaining before release: rerun tests/build/pixels after final zoom correction; all3destinations across4widths, keyboard/close/bottomscroll, search/category/singlepin fitting, map pan/zoom/resize, darkmode/reducedmotion, legacy saved-object/recovery exact preservation/import rejection, source/license audit. Then normal draft PR and preview/live hash/actual browser/photo/map/private restore regression, synthetic cleanup, parent acceptance. No provider/account/key/payment/settings change or paid hosting. OSM modest-viewport browsing terms unchanged, no bulk/offline tile request.

17:06 local follow-through: zoom correction built;8tests pass including exact legacy id10/name/coordinates/full-object retention across remount. Fourwidth basic checks pass. Expanded all3photo/search/singlepin/keyboardEnter/Escape/close/inert checks pass on retry; initial expanded run timed out awaiting a condition (not yet isolated, do not call repeat-stable). Fresh logs retained in task history. Before preview, make close/open transition readiness explicit and run repeated matrices, inspect all3photos at phone/landscape and exercise import/private compatibility. LOCAL ONLY, no release claim. Latest source/pixels retained as local commit and bundle for continuation.


17:23 local qualification supersedes the pending notes above: two consecutive320/390/844/1320 matrices passed all3photos, search/category, exact marker keyboard activation/Escape, hidden/inert background,44px close viewport bounds, pan/zoom/resize, darkmode, mixed reducedmotion, reload, raw export, private envelope model compatibility, wrong-app rejection without data change, exact legacy id10+id1 restore and explicit empty cleanup. Tiles stubbed only in repeated matrices. A previous real-network fourwidth run loaded OSM tiles; new resize code still needs its real-network recheck. Test targeting/readiness errors were corrected, not counted as product defects. Actual resize pin/notice overlap corrected with bottom140px fitting reserve; ongoing zoom completion defers a resize refit. Itinerary surface/header made opaque after actual pixels showed the map bleeding through. No live private Blob mutation needed for this catalogue compatibility check.

Qualification script currently references the sibling saved-apps model checkout and local Playwright package; it is a retained reproducible local harness, not portable CI. Source runtime/automated tests/build remain local pending preview qualification and production release. Hosted proof/cleanup and parent acceptance remain open.


## Preview qualification,17:27

PR https://github.com/rajeshceg3/Ireland/pull/24 merged normally after preview passed. Preview https://ireland-a1gol6qpf-rajeshceg3s-projects.vercel.app/ was Ready for6d182bb, dashboard https://vercel.com/rajeshceg3s-projects/ireland/2ZVmsPJ1KmszJDZdGtwc9H1gqpi5 . Browser fetched and SHA256-compared all7catalogue/photo/JS/CSS assets against the local build: exact.24OSM tiles loaded at390px. All3actual detail dialogs opened, Escape closed and390/844resize exercised. Original legacy id10+id1 restore through file/preview/confirm preserved every old field, showed the warning and retained a before-restore copy; explicit empty restore left[]. Preview state was synthetic only; no private cloud write or real-user itinerary read.

Safe preview captures are under preview/. The preview toolbar is Vercel-only and not part of public production. One landscape photo capture was taken during an entrance transition and is not accepted as final-layout evidence; use the later production image.

### Re-running the harness

Install Playwright in the test environment (not a runtime dependency) or set PLAYWRIGHT_MODULE to its ESM entry. CHROME_PATH optionally selects Chrome. `node docs/catalogue/check-local.mjs` serves the current build at4192 and checks320/390/844/1320. Set ORIGINAL_URL for a public hosted target, REPEATS=2 for repeat matrices, STUB_TILES=1 for repeat lifecycle checks without requesting map tiles. For the optional private-companion envelope model check, set COMPANION_MODEL to that project's lib/state.js; absence is an explicit skip, never private cloud verification. The normal runtime unit suite runs separately with `CI=true npm test -- --watchAll=false`; production build with `npm run build`.


## Public production qualification,17:30

Live https://ireland-nine.vercel.app/ . Runtime commit3664c8ea3ac1cfa5186003ce748e1f278ab4b5c9 . Production deployment https://ireland-dudy8h3ee-rajeshceg3s-projects.vercel.app/ , Ready25s; dashboard https://vercel.com/rajeshceg3s-projects/ireland/7TgVuE6Tdi62MGtXfu6xgQPJkaXn . All7JS/CSS/catalogue/photo assets compare byte-exact against the qualified local build, hashes retained in production/asset-hashes.json.

One full public production320/390/844/1320 matrix passed with real OSM tiles. A second complete production lifecycle matrix passed with tiles stubbed, not counted as another real-basemap check. Every matrix opens all3actual photos/details, hits visible pins, exercises keyboard Enter/Escape,44px sticky close bounds, hidden/inert detail background, source/credit/officialhours links and absence of invented ratings, search/category, darkmode, mixed reducedmotion, pan/zoom/resize, reload, exact raw recovery export, rejected wrong-app retention, optional companion model compatibility, exact legacy id10+id1 restore and explicit empty cleanup.8unit tests pass; existing testing-library act deprecation warnings remain, no runtime assertion failures. Build passes.

Inspected actual production pixels include390phone map and all3photos,320scrolled detail/source/actions,844landscape Blarney/photo,844legacy warning and1320map. Retained in production/. Legacy warning is fully readable below the fixed heading in the final landscape capture. Portrait source/credit links wrap; no overlap. Map pin size/fit leaves controls and bottom notice reachable. This is a browser viewport test, not a claim of physical-device coverage.

All hosted test contexts were isolated synthetic sessions and restored to an explicitly empty itinerary before closing. Signed-in preview synthetic session also ended with[]and its prior copy retained. No real-user itinerary data read, rewritten, migrated or deleted. Private companion checks used its model only, not live cloud writes. Original15-record archive unchanged; local/preview/production evidence clearly separated. Parent owns acceptance and delivery; this is a bounded catalogue/detail repair, not fleet or preservation completeness.

### Catalogue/detail state invariants

| State/event | Result | Must remain true | Evidence |
|---|---|---|---|
| Browse and filter | Canonical IDs1/2/3 only; empty category remains empty | Saved embedded objects never replaced from catalogue | Fourwidth filter/recovery matrices |
| Open marker | One opaque detail dialog; background inert and hidden | Pin title matches dialog/photo; close44px and reachable after scroll | All3destinations, phone/landscape pixels |
| Close/Escape | Dialog detaches; background interactive | No second Leaflet popup under header | Fourwidth keyboard/reopen checks |
| Resize during zoom | Refit after zoom completes | Pins clear header and notice | Pan/zoom/resize regression |
| Restore wrong app | Reject and disable confirm | Current ordered itinerary exact unchanged | Fourwidth wrong-app rejection |
| Restore earlier numbered records | Explicit preview/confirm keeps full objects and warns | Old id/name/coordinates never recast as verified place | id10+id1 full-object comparison and warning pixels |
| Confirm empty version | Current itinerary[]; prior copy retained | No implicit union, migration or cloud sync | Local/preview/production cleanup |


17:34 acceptance correction: parent found the itinerary's global browsing header still competed with scrolled file controls in844pixels. Catalogue correctness remains qualified; prior itinerary acceptance was held. The next increment hides/inerts the complete browsing chrome while the itinerary is open, uses a top-flush opaque sticky title, a44px close at every width, scroll padding on file controls and removes the nonfunctional eyebrow. Fourwidth checks now individually scroll/hit-test file input, Preview, Confirm and Download controls, verify background hidden/inert and close-to-browse recovery. Fresh local pixels inspected, production acceptance pending this correction.


## Current blocker and continuation,17:37 November7

PR25 https://github.com/rajeshceg3/Ireland/pull/25 head864519d92c4531542c8e6805efa91e21e03ec993 contains the itinerary acceptance correction. It is not merged or deployed. GitHub Vercel commit status at2026-11-07T12:04:26Z says deployment rate limited, retry in24hours, target https://vercel.com/rajeshceg3s-projects?upgradeToPro=build-rate-limit . Official https://vercel.com/docs/limits confirms100deployments per86400seconds on Hobby and owner scope, shared across projects of that owner. No account-specific reset epoch was provided. Conservative24hour checkpoint is SundayNovember8 17:34:26IST, not a guaranteed availability promise. No retry, upgrade, provider/account/settings change made. Existing public production remains3664c8e, with catalogue correction live and the old itinerary overlap not accepted. Earlier production evidence is intentionally retained and must not be mistaken for corrected itinerary proof.

Final local correction build and8unit tests pass. Two consecutive full4width matrices pass including individually scrolling file/Preview/Confirm/Download controls, bounds and centre-hit tests, hidden/inert browsing background, no eyebrow and close-to-browse recovery. Pixels in local-correction/are local-only evidence. The final correction suppresses all browsing descendants through parent opacity as well as visibility, preventing animated search descendants from overriding hidden visibility. Pending hosted preview/hash/pixels, production requalification and parent acceptance. Further source/evidence revisions retained locally without another deploy-triggering push during the cooldown. Main coordinates shared deployment capacity and owns the next release slot.
