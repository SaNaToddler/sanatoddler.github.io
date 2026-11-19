# SaNaToddler large puppy sharing link

The user reported that WhatsApp showed the newly published root URL as a compact thumbnail. The old and new sites already served the same 512px puppy artwork and short installation text. On 2026-11-19 the user tested `https://sanatoddler.github.io/index.html` in a WhatsApp draft and confirmed the large puppy picture appeared.

Copy link, WhatsApp and More apps now share that exact tested address. The preview artwork and text, installed name, manifest identity/scope, PWA icons and gameplay are unchanged. A new worker release `sana-toddler-public-v199-share-r2` refreshes the cached sharing script transactionally while retaining saved pictures and settings. The visible game version stays v1.99.

Validation covers the real browser clipboard, WhatsApp URL and native-share payload construction, worker digests, offline play, saved photos, recovery and upgrade from the previous publication. The WhatsApp card layout is chosen by WhatsApp; the physical-device evidence for this address comes from the user's draft test. Existing messages are not rewritten by this patch.

Windows WebKit recovery is checked before the test refuses server connections. Its worker registration can time out after that artificial outage, as also recorded during the unmodified org-r1 publication. Chromium checks recovery after actual browser-offline navigation. No production recovery logic was changed.
