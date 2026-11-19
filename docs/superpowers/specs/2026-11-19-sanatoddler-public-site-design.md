# SaNaToddler public Main website

## Intent and approved approach

Publish the approved SaNaToddler Main v1.99 app on `https://sanatoddler.github.io/`, using the new `SaNaToddler` GitHub organization and repository `SaNaToddler/sanatoddler.github.io`. The user created the organization for this approach after the alternatives were explained. Public share links must contain the app name and must not contain the user's personal GitHub name.

## Boundaries

- Import only `KidsMathsMatrixPuzzle/toddler-games-` commit `e2f6d634004f9a5ab8b17788a93a67b257e846ae`, the current approved Main v1.99.
- Keep `SaNaToddler` as both installed names, the green puppy PWA icons, the circular puppy welcome artwork, current games and saved-data behavior.
- Do not promote unconfirmed Beta v2.07 gameplay changes.
- Do not modify either old Main repository or `grajapm-hue/toddler-games-`.
- A new origin is a separate installation and storage area. Do not clear or migrate existing app storage automatically.

## Publishing design

Use root manifest identity `/`, relative start URL `./index.html` and scope `./` on the new hostname. Share, canonical and social-preview URLs use `https://sanatoddler.github.io/`. Preserve artwork bytes. Give the worker its own release/cache key `sana-toddler-public-v199-org-r1` and prefix `sana-toddler-public-`; rebuild asset digests. Update all bundled recovery helpers to the new release marker. Keep the visible game version v1.99.

## Alternatives considered

Moving to another folder on the old Main hostname would remain within MathMatrix Main's root scope. Publishing under the personal Beta hostname conflicts with public branding. A custom domain would preserve the old source repository, but no domain was supplied. The user chose the free app-branded organization by creating `SaNaToddler`.

## Verification and completion

Verify copied game/artwork bytes against the approved source. Exercise the real share dialog, clipboard and WhatsApp URL without sending messages; capture native-share payload only as an automation check. Check root manifest processing, complete service-worker installation, offline welcome and games, recovery helper, phone/tablet rendering and console errors. Compare public files with the final commit after Pages publishes. Android native install/link handling still requires confirmation on an affected physical phone.

Publishing requires organization access. None of the currently connected GitHub accounts is a member; a request to add the connected publishing account has been sent to the user. Prepare and review the package while that access is pending.
