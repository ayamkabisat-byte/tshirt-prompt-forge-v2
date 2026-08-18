# Phase D — Real-World Visual Benchmark

Phase D moves beyond compiler correctness and evaluates whether the generated images are actually useful as apparel artwork.

The repository now includes a dedicated **Visual Benchmark Lab** with 12 production-oriented recipes. Open the app and click **Phase D Benchmark Lab**, or add `?benchmark=1` to the deployed app URL.

## Benchmark matrix

| # | Benchmark | Main risk being tested |
|---|---|---|
| 01 | Clean Mascot — 6 Color Screen Print | spot-color discipline, vector-friendly closed shapes |
| 02 | Vintage Moto — Typography Screen Print | exact text, rocker layout, mechanical line-art |
| 03 | Storybook Painterly — Full Color DTF | painterly raster preservation, clean DTF perimeter |
| 04 | Surreal Dreamscape — Full Color DTG | continuous tone, depth, complex detail |
| 05 | JDM Graphic — DTF Streetwear | Graphic Override, decals, micro-tech detail |
| 06 | Strict Reference — Shonen Transformation | identity preservation under strong stylization |
| 07 | Blackwork Tattoo — Full Back | tattoo placement, blackwork hierarchy, flat-art output |
| 08 | Logo Transform — Luxury Badge Material | logo geometry and spelling preservation |
| 09 | Technical Typography — Limited DTF | exact text + micro-text + deliberate limited palette |
| 10 | Dual Style — Ukiyo-e × Mecha | coherent style fusion instead of visual collage noise |
| 11 | Bootleg Hip Hop — Full Color DTG | dense merch hierarchy, retro texture, large typography |
| 12 | Risograph — 3 Color DTF | limited-color print aesthetic reproduced through DTF |

## Test procedure

For each benchmark:

1. Select the benchmark in the Visual Benchmark Lab.
2. Copy the **Flow / Nano Banana 2** prompt and generate the image using the matching recipe settings.
3. Copy the **Midjourney** prompt and generate the comparison image.
4. For Reference and Logo benchmarks, use the same source image in both engines.
5. Do not change the creative recipe during the first comparison run.
6. Score each engine independently using the eight criteria below.
7. Record any visual failure in the notes box.
8. Repeat a benchmark only when generation randomness clearly caused an outlier; otherwise treat the first usable generation as the test result.

## Visual scoring rubric

Each criterion receives a score from **1 to 5**.

1. **Concept Fidelity** — requested subject and core idea are immediately recognizable.
2. **Style Fidelity** — selected primary/secondary style is visually convincing.
3. **Apparel Composition** — artwork has a strong standalone t-shirt hierarchy and reads from a distance.
4. **Production Suitability** — the image fits Screen Print, DTF, DTG, tattoo, or logo-production intent.
5. **Color & Contrast** — palette, garment interaction, separations, gradients, and contrast fit the recipe.
6. **Typography Accuracy** — exact readable text is correct and no unwanted readable wording is introduced.
7. **Isolation & Edges** — standalone artwork has usable outer edges without mockup/background contamination.
8. **Detail Balance** — enough detail to feel premium without destroying readability or print usefulness.

Maximum score per engine is **40**.

Suggested interpretation:

- **32–40:** pass / production-useful prompt
- **28–31:** review / small prompt tuning needed
- **below 28:** fail / meaningful compiler or preset tuning needed

The threshold is a practical QA gate, not a scientific image-quality metric.

## What to compare between Flow and Midjourney

Do not judge only which image looks prettier. Record which engine performs better on the intended production constraint.

Examples:

- A DTF painterly result may score higher because it preserves useful texture, even if the alternative is cleaner.
- A Screen Print result should lose points if it introduces impossible continuous-tone rendering when the recipe requested discrete separations.
- Strict Reference should lose points for identity drift even when the stylization itself is attractive.
- Typography-heavy benchmarks should lose points for spelling errors or unrequested words.
- Logo Transform should lose heavily for changing silhouette, spacing, or spelling.

## Automation coverage

The benchmark recipes also have automated non-visual tests. CI checks that:

- all 12 benchmark IDs are unique;
- every benchmark compiles in Flow and Midjourney;
- no benchmark ships with a hard compatibility error;
- Flow prompts contain no Midjourney parameter syntax;
- Midjourney prompts end with a supported model parameter;
- the matrix covers Screen Print, DTF, DTG, tattoo, reference, logo, dual-style, vector, raster, limited-color, and full-color workflows;
- typography-heavy benchmarks preserve exact requested wording.

Automated tests cannot judge the generated image itself. Final Phase D scoring therefore happens after real generation in Flow and Midjourney.
