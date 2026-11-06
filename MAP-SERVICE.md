# Basemap service

The interactive map uses OpenStreetMap Standard raster tiles via HTTPS, with visible OpenStreetMap copyright attribution linking to its ODbL page. No account, API key, billing or new provider settings.

Policy checked 6 November 2026: https://operations.osmfoundation.org/policies/tiles/ and https://www.openstreetmap.org/copyright . Suitable for modest interactive browsing, not unrestricted or guaranteed free infrastructure. Community-funded, best effort, no SLA, may block usage without notice. Review usage before traffic grows.

Browser image requests use normal browser User-Agent, default origin Referer, and normal HTTP cache behavior. Do not suppress Referer, proxy anonymously, bypass caching, bulk fetch, prefetch offline areas or automate pan/zoom scans. No offline-download feature. Leaflet updateWhenIdle and one tile buffer limit unnecessary requests. Attribution is bottom-left to avoid the right-hand desktop trip panel. When an overlay covers the whole map, close it to see attribution.

Production UI has a visible tile-error status, no silent success claim. Itinerary browser recovery/private transfer is independent and unchanged. No tile API receives itinerary records.
