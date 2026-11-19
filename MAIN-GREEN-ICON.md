# SaNaToddler Main: green puppy PWA icon

Current Android correction: **R2**, described below. The first edge-frame design can lose its green border when Android masks it.

The Main launcher icon now uses the approved puppy with a thick green border. Beta retains its gold puppy icon. The separate circular welcome illustration, SaNa branding, app name, manifest identity `/toddler-games-/`, launch paths, scope, gameplay and saved-data keys are unchanged.

Files: `sana-puppy-green-v199-192.png` and `sana-puppy-green-v199-512.png`. Main's manifest, favicon, Apple touch icon and preview metadata select the new filenames. Legacy `icon.svg`, `icon-192.png` and `icon-512.png` also use the green tile. The old versioned gold assets remain available for previously cached references. No Beta or MathMatrix repository files change.

Cache: `sana-little-hands-live-v199-green-puppy-icon`. Fresh update entry after publication: https://kidsmathsmatrixpuzzle.github.io/toddler-games-/install-live-v1.99-green.html . Existing recovery entries target the same cache. Visible app version stays v1.99.

Validation on Naren-PC: 17 Chromium web/install-cache checks and ten actual previous-v1.99 upgrade checks passed. The processed Main name and identity, new icon URL, saved settings/photo, open game, unrelated caches and offline play are retained. Both PNG sizes, four visible green frame samples, opacity and legacy aliases were checked. The welcome image and all manifest fields except icon URLs are byte-for-byte/structurally unchanged. Offline digests and worker syntax pass. These checks do not establish a physical Android launcher's icon refresh.

## Android mask correction R2

The first design put green at the outer edge. A regression check reproduced the problem: none of the sampled circular rings inside Android's guaranteed 40%-radius area remained green. The revised artwork uses an inset cream puppy portrait with a complete green ring inside that area and opaque green outside it. The same composition supplies fallback icons so shortcuts remain recognizable too.

Current files: `sana-puppy-green-r2-v199-192.png`, `sana-puppy-green-r2-v199-512.png`, and a dedicated `sana-puppy-green-r2-v199-maskable-512.png` with `purpose: maskable`. Ordinary icons use `purpose: any`. The old URLs remain available. Welcome artwork, SaNa - Toddler name, manifest ID, scope, data keys and games are preserved.

Cache: `sana-little-hands-live-v199-green-safe-r2`; 610 offline entries. Fresh entry after publication: https://kidsmathsmatrixpuzzle.github.io/toddler-games-/install-live-v1.99-green-r2.html . The visible app version remains v1.99.

Validation: the new `tools/check-maskable-icon.cjs` fails on the published first design and passes on R2, with 100% green coverage along a ring at radius 35.5% and fully opaque 512px artwork. Seventeen Chromium web/cache checks and ten actual upgrades from published green-icon Main passed, including app name/ID, new icon URL, saved data, unrelated caches and offline play. Deployment digest and worker syntax checks pass. A minimum-mask browser simulation was inspected at launcher size. It is not a physical phone launcher test. Set `MM_SHARP` to an installed Sharp package to run the pixel check.

Chrome manages installed launcher images separately from the page cache and can require an icon-change approval. The user reports that Review app update is not present on their phone; availability and timing are not assumed. The installed-app guide mentions the option only if offered. Do not force a replacement identity or clear shared-origin data to refresh an icon. References: [maskable safe area](https://web.dev/articles/maskable-icon), [Chrome app-icon updates](https://developer.chrome.com/blog/improvements-to-web-app-updates).

R2 uses built-in image generation, editing the approved green tile. The master is copied to ignored `artifacts/green-puppy-safe/source.png`; the project PNGs above are the final assets. Exact prompt:

> Use case: precise-object-edit. Create ONE dedicated Android MASKABLE PWA icon variant from this exact approved SaNa puppy. Preserve its recognizable face, expression, white/brown fur, glossy eyes, black nose, tiny tongue, pink-and-blue bow, both ears, hair tuft and all existing visible chest. Do not redesign the puppy. Output a square, fully opaque production icon with a solid rich EMERALD-GREEN background extending to every canvas edge. Replace the edge-hugging rounded-square frame with an INSET CIRCULAR emerald-green ring and soft cream circular centre. Critical geometry: centre everything at 50%,50%; the cream centre has radius about 29% of the whole canvas width; the bold green ring runs from radius 30% to 37% of the width. Keep the complete ring inside the centred circle of radius 40% of the canvas width, so Android cannot crop it away. Shrink the entire puppy portrait to fit fully within the cream circle, including bow, hair, both ears and the full source chest, with a little breathing room. Green must remain clearly visible all around the puppy even if all pixels outside the centre 80%-diameter circle are hidden. The entire area outside the cream centre is opaque emerald green; no white corners or transparency, no gold outer frame, no square frame. The green ring may have a subtle polished highlight but must stay strong green all around. No letters, words, numbers, labels, masks diagrams, checkerboard, duplicate images or mockup phone. One clean icon only.

## Android routing limitation remains

The user's screenshots show toddler content inside an Android task carrying the MathMatrix icon. The public MathMatrix manifest scope is `/`, enclosing Main's `/toddler-games-/` scope. Distinct manifest IDs and worker/cache scopes alone do not resolve Android link capture or nested-app installation promotion. The earlier web integration checks did not test installed Android WebAPK routing. This release changes the icon only; it does not claim to fix that routing issue.

[Google documents overlapping PWA scopes](https://web.dev/articles/building-multiple-pwas-on-the-same-domain), including manual browser-menu installation as a workaround and separate origins as the recommended architecture. Main's repository remains the canonical target. Do not move or narrow the publicly shared MathMatrix app as an incidental icon fix, or clear shared-origin user data.

## Artwork preparation

Mode: built-in image generation, editing the approved Main puppy tile. Master copied to ignored `artifacts/green-puppy/source.png`. Sharp prepares deployment dimensions and the legacy SVG wrapper. Final project assets are the versioned PNGs named above.

Exact generation prompt:

> Use case: precise-object-edit. Asset type: production PWA launcher icon for SaNa - Toddler MAIN only. Edit the attached approved puppy tile. Preserve the same puppy exactly: the white and brown silky fur, both full floppy ears, glossy eyes, black nose, tiny pink tongue, the pink-and-blue bow and hair tuft, and the full visible furry chest. Preserve the composition, expression, warm cream interior, square canvas, and recognizable artwork. Change only the existing thin GOLD OUTER FRAME into a clearly visible, thick EMERALD-GREEN rounded-square border, about 7 percent of the canvas width, smoothly following the existing rounded tile shape. Keep the entire puppy inside the border without cropping any hair, bow, ears, face or chest. Make the green strong and easy to distinguish at a tiny phone icon size, including when the launcher uses a circular mask. Keep the canvas fully opaque, with green reaching the outer edge and rounded corners blending into a pale green outer background. Do not change the puppy into a different animal or style. No words, letters, numbers, labels, watermarks, extra objects, duplicate tiles, size annotations, buttons, or mockup scene. Output one clean square app icon only.


## Compact installed-app name

Main manifest name and short name are now exactly `SaNaToddler`, without spaces or a hyphen. Apple/browser/share titles and installation guidance use the same spelling. The existing green icon files, dedicated maskable icon, circular welcome illustration, manifest ID, scope, games and saved data remain unchanged. Cache `sana-little-hands-live-v199-sanatoddler-name` refreshes naming metadata. Fresh entry after publication: https://kidsmathsmatrixpuzzle.github.io/toddler-games-/install-sanatoddler-v1.99.html . Native launcher name updates remain managed by Chrome. Seventeen web/cache integration checks and ten previous-release upgrade checks passed on Naren-PC.
