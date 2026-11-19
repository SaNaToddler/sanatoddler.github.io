# SaNaToddler Live v1.99

Current promotion: see [LIVE-V199-RELEASE.md](LIVE-V199-RELEASE.md). Main keeps its explicit `/toddler-games-/` installation identity.

Main's subsequent green-border puppy icon revision and the remaining Android routing limitation are described in [MAIN-GREEN-ICON.md](MAIN-GREEN-ICON.md).

## Previous v1.98 release and identity repair


Prepared from the approved Beta source at `grajapm-hue/toddler-games-`, commit `5278cc75e8cec6903bc478512a898c9bb53c6af0`, using only its maintained `docs/beta/` application files. The user-created README is preserved.

Publish this repository's `main` branch from `/(root)`. The app entry is `index.html`; the public URL is `https://kidsmathsmatrixpuzzle.github.io/toddler-games-/`. The separate Beta remains at `https://grajapm-hue.github.io/toddler-games-/beta/index.html` for future corrections.

Live uses the name **SaNa Little Hands**, its own `sana-little-hands-live-v198-r2-distinct-app-id` cache, the explicit `/toddler-games-/` manifest identity and project-relative scope, and Live-only sharing and preview URLs. The existing short install/optional-scan instructions remain in the previews. The recovery entries and updater accept only SaNa's exact project registration, so an existing MathMatrix worker at the site's root is not reused as SaNa's updater.

All game engines and artwork are identical to the approved Beta. Changes are confined to Live identity, links and installation/update setup. This preserves the existing free-building Machines experience; it adds no guided assembly or new game rules. Beta installations and saved data remain in their original app; this publication creates a separate Live app.

Validation on Naren-PC: 15 actual Chromium integration checks cover all 606 precache assets, project-relative manifest identity, a first install after the real MathMatrix root worker, independent worker scopes and caches, Live-only sharing, manual update, importing and retaining a puzzle photo offline, Machines artwork offline, and MathMatrix still opening offline afterward. Browser checks do not establish a physical phone/tablet installation result.

Run the integration check with `MM_PLAYWRIGHT` pointing to an installed Playwright package. Set `MATHMATRIX_ROOT` to a local checkout of MathMatrix Main to exercise the real root-worker coexistence case:

```text
node tools/check-live-release.cjs
```

Future releases: correct and test in Beta, then promote the approved source deliberately into this Live repository. Keep the Live name, URL, cache namespace and scoped registration checks when promoting. Verify the published files, installation/update flow and offline play after every publication.

## Installation identity repair

The initial Live manifest retained `id: "./"`. Manifest IDs resolve against the start URL origin, not the manifest directory. That made Live resolve to the same app identity as MathMatrix at the origin root. The original worker/cache tests missed this installation identity collision.

Live now explicitly uses `/toddler-games-/` as its application identity. MathMatrix keeps its existing root identity and its repository is unchanged. The r2 cache and recovery targets refresh cached copies of the corrected manifest without deleting saved data. The browser regression obtains Chromium-processed IDs through `Page.getAppManifest` and requires distinct MathMatrix and SaNa identities, in addition to the existing service-worker, offline and preservation checks.

The r2 migration check adds seven checks against the actual published r1 source: it reproduces the root identity collision, applies the fresh `install-live-r2.html` entry, verifies the corrected Chromium identity and preserves settings, a saved photo, unrelated caches and MathMatrix storage. The new identity test fails against r1 before the repair and passes after it.
