# Source-backed Ireland catalogue draft, November 7, 2026

LOCAL DRAFT ONLY. Not pushed, deployed or accepted. Original public main175341e remains unchanged. Existing todo: catalogue and attraction layout follow-through. No real user data inspected or modified.

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
