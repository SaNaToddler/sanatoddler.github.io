# SaNaToddler independent public Main v1.99

- Target repository: `SaNaToddler/sanatoddler.github.io`.
- Public and in-app share address: `https://sanatoddler.github.io/`.
- Approved source: `KidsMathsMatrixPuzzle/toddler-games-` commit `e2f6d634004f9a5ab8b17788a93a67b257e846ae`.
- Visible version: v1.99; release/cache key: `sana-toddler-public-v199-org-r1`.
- Manifest identity: `/`; scope: `./`; start URL: `./index.html`; name/short name: `SaNaToddler`.
- Artwork, icons and gameplay are retained from approved Main. Only site identity, share/preview URLs, release markers, recovery helpers and generated worker digests change.

## Verification

With the local Playwright installation available through `NODE_PATH` or `MM_PLAYWRIGHT`, run `node tools/check-public-site.cjs`, `node tools/check-public-site.cjs --webkit`, and `node tools/build-offline-integrity.mjs --check`. `tools/approved-main-source.json` records every source file hash and the exact publishing-file allowlist. Browser checks cover root identity, clipboard, WhatsApp and native-share payload construction, responsive welcome screenshots, complete offline caching, saved Picture Puzzle images, Machines artwork, Update and the recovery helper. Native Android installation and its share chooser require a physical-device check after publication.

Chromium checks use the browser's offline mode. Windows WebKit's offline emulation reports an internal navigation error on both this package and the unmodified approved source; its availability checks instead make the server unavailable so uncached HTTP requests fail while the real worker serves the cached app. This does not establish physical iPhone or Android behavior.

The legacy `tools/check-live-*.cjs` scripts document the previous project-path deployment; use the independent-site check above for this release. Historical release notes remain as source history and do not describe the new publication target.

## Existing installations

The new hostname is an independent installation with its own storage. Existing MathMatrix, toddler Main and toddler Beta websites and saved data are left in place. This release does not clear their data, unregister their workers, change their shared links or automatically transfer their saved pictures.
