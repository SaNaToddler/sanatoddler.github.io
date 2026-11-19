# SaNaToddler Public Main Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish approved Main v1.99 with a nonpersonal, independent app address.

**Architecture:** Import the approved source into a separate repository/package whose sole publication target is `SaNaToddler/sanatoddler.github.io`. Retarget the manifest, sharing metadata and worker release while preserving game and artwork bytes.

**Tech Stack:** Existing static HTML/JavaScript PWA, Node, Playwright, GitHub Pages branch publication. Run checks locally on the already authorized Naren-PC; do not dispatch GitHub Actions tests.

**Spec:** `docs/superpowers/specs/2026-11-19-sanatoddler-public-site-design.md`

## Global Constraints

- Source commit: `e2f6d634004f9a5ab8b17788a93a67b257e846ae` in `KidsMathsMatrixPuzzle/toddler-games-`.
- New origin and share URL: `https://sanatoddler.github.io/`.
- Installed name and short name: `SaNaToddler`; visible version: v1.99.
- Worker release: `sana-toddler-public-v199-org-r1`; prefix: `sana-toddler-public-`.
- Preserve all gameplay and artwork; leave both old Main repositories and Beta unchanged.
- Existing local storage remains on its existing origin.

## Review Focus

- Fresh root navigation and deep game links load the same approved app offline.
- No share path or preview URL points to a personal or old Main hostname.
- Recovery helpers cannot loop waiting for the previous origin's release key.
- Actual game/artwork bytes remain unchanged; cache digests match changed entrypoints.
- Publication targets only the app-branded repository and matches the tested commit.

### Task 1: Build and verify the independent-origin package

**Files:** Modify `manifest.webmanifest`, `index.html`, `play.html`, `share.js`, `sw.js`, bundled recovery HTML and README. Create `tools/check-public-site.cjs`, `PUBLIC-SITE-RELEASE.md` and source snapshot metadata.

**Interfaces:** Consume the approved source archive and emit a deployable site with share URL `https://sanatoddler.github.io/`, root manifest identity and the specified worker release.

- [ ] Write and run a browser regression that fails because the imported app still shares the old Main URL.
- [ ] Retarget only publishing/identity files, regenerate offline digests and record the exact changed-file allowlist.
- [ ] Run the regression, source byte-preservation check, offline browser checks, recovery helper, responsive screenshots and syntax/integrity checks; require zero failures.
- [ ] Commit the tested package on an isolated publication branch with only the new repository as remote.
- [ ] Obtain one fresh whole-package review and resolve material findings with a failing regression first.

### Task 2: Publish and verify the new public site

**Files:** Only repository `SaNaToddler/sanatoddler.github.io` and its Pages configuration.

**Interfaces:** Consume the reviewed commit from Task 1; emit Pages at `https://sanatoddler.github.io/` serving that exact commit.

- [ ] Confirm connected organization access, create the public target repository if absent and verify its owner/name before pushing.
- [ ] Push the reviewed release, enable branch publication from `main` root and wait for Pages to complete.
- [ ] Compare served runtime files and release/manifest metadata with the tested source; run live browser share/welcome checks.
- [ ] Recheck old MathMatrix Main, old SaNa Main and Beta commit identities, then give the user the new sharing link and distinguish live browser proof from pending Android-device installation confirmation.

Expected: Task 1 can finish independently of access; Task 2 stays pending until organization permissions allow publication.
