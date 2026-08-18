# Phase C — Prompt Engine QA

This phase validates the v2 prompt engine against realistic and intentionally conflicting apparel-production recipes.

## Automated coverage

The Node test suite in `tests/promptEngine.test.js` currently covers 20 QA cases, including:

1. 65/65 v1 canonical style IDs are present and unique.
2. Every migrated style compiles in both Reference and Graphic modes for Flow and Midjourney.
3. Flow output does not leak Midjourney parameter syntax.
4. Midjourney parameters stay at the end of the prompt.
5. Exact typography uses double quotes while concept text is not quoted.
6. Wanted Poster does not force readable bounty wording when typography is empty.
7. Screen Print uses limited spot-color production language.
8. DTF supports rich full-color raster output when Vector Ready is off.
9. DTG supports full-color raster output and smooth shading.
10. DTF can still intentionally use a limited palette.
11. Screen Print + Full Color is warned and auto-optimized to Limited.
12. Screen Print optimizer never expands back above eight inks because of a long manual palette.
13. Vector Ready + Soft Fade is detected and repaired.
14. Omni Reference requires V7 and a non-empty Omni URL.
15. Strict reference fidelity warns when either primary or secondary style is highly abstract.
16. Manual palette validation catches empty and over-limit palettes.
17. Biker Patch and Logo Image integrations warn when required inputs are missing.
18. Vector-style artwork remains valid for DTF.
19. Graphic mode uses a graphic-specific style override when available.
20. Dual-style fusion applies the secondary style using the selected fusion method.

## Bugs found and fixed during Phase C

### 1. Wanted Poster readable-text conflict
The migrated base style still mentioned literal `WANTED` text even when generic typography rules prohibited readable wording. The preset now describes reserved headline/status/bounty zones and only permits readable bounty wording when typography explicitly requests it.

### 2. Screen Print + Full Color mismatch
`Full Color` can now be detected as incompatible with spot-color Screen Print. Auto Optimize switches the recipe to Limited Palette rather than silently generating an internally inconsistent prompt.

### 3. Screen Print palette optimizer regression
A long manual palette could previously lower `maxColors` to eight and then raise it again. The optimizer now applies an eight-ink production cap after palette reconciliation.

### 4. Strict abstract secondary style was not detected
Strict reference fidelity previously checked only the primary style. The validator now checks both primary and secondary styles.

### 5. Missing reference inputs
Prompt Health now warns when Omni Reference is enabled without an Omni URL and when Logo Image integration is enabled without a logo reference URL.

## CI gate

The repository workflow `.github/workflows/ci.yml` runs:

- `npm ci`
- `npm test`
- `npm run lint`
- `npm run build`

The Phase C verification PR is used to confirm the complete gate on GitHub Actions.
