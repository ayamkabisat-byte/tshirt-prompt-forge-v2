# T-Shirt Prompt Forge v2

A clean rebuild of **T-Shirt Prompt Forge** focused on two image-generation workflows:

- **Midjourney** — compact visual prompts plus supported Midjourney parameters.
- **Google Flow / Nano Banana 2** — structured natural-language art direction for generation and reference-based editing.

The original `tshirtprompt` repository is intentionally left untouched.

## Why v2 exists

v2 replaces the old single-string prompt builder with a shared **Design Recipe** and two separate prompt compilers. The same design intent is translated differently for each image model instead of reusing one generic prompt.

## Current feature set

- Subject modes: Generate New, Transform Reference, Graphic Only, Logo Transform, Tattoo Placement
- **65/65 original v1 style presets migrated** across 8 categories
- Primary + secondary style engine with controlled fusion methods
- Original v1 Mix & Match controls migrated into explicit prompt instructions
- Composition, edge, detail-density, and background controls
- Screen Print / DTG / DTF / faux-embroidery / tattoo-flash production modes
- Auto, limited-palette, and full-color policies
- 1–12 color target when limited-color production is intended
- Garment color / negative-space awareness
- Optional Vector Ready constraints
- Gradient and halftone controls
- Exact typography fields plus typography presets
- Logo integration controls
- Extra direction and negative direction fields
- Midjourney V8.2 / V8.1 / V7 / Niji 7 profiles
- Raw, Stylize, Chaos, Image Weight, Style Reference, Omni Reference, Seed
- Flow model selector for Nano Banana 2, Nano Banana Pro, and Nano Banana 2 Lite
- Prompt Health conflict detection + Auto Optimize
- Separate live Flow and Midjourney prompt output
- Automated prompt-engine QA through GitHub Actions

## Phase D Visual Benchmark Lab

The app includes a dedicated **Visual Benchmark Lab** for real-world image testing.

Open the normal app and click **Phase D Benchmark Lab**, or add:

```text
?benchmark=1
```

to the app URL.

The lab contains 12 fixed benchmark recipes covering:

- vector-friendly Screen Print
- typography-heavy Screen Print
- painterly full-color DTF
- surreal full-color DTG
- JDM streetwear DTF
- strict reference preservation
- blackwork tattoo art
- logo transformation
- technical typography
- dual-style fusion
- bootleg hip-hop DTG
- limited-color Risograph-style DTF

Each Flow and Midjourney result can be scored on eight visual criteria. Scores are stored locally in the browser so the two engines can be compared consistently.

See `docs/PHASE_D_VISUAL_BENCHMARK.md` for the test procedure and scoring rubric.

## Development

```bash
npm install
npm run dev
```

Automated tests:

```bash
npm test
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Architecture

```text
src/
  data/
    presets.js
    benchmarks.js
    styles.js
    styles/
      anime.js
      fine.js
      graphic.js
      heritage.js
      mascot.js
      pop.js
      posters.js
      streetwear.js
  prompt/
    compatibility.js
    flow.js
    midjourney.js
    shared.js
    styleCompiler.js
    index.js
  App.jsx
  BenchmarkLab.jsx
  main.jsx
  styles.css
  benchmark.css
tests/
  promptEngine.test.js
  benchmarkRecipes.test.js
docs/
  V1_STYLE_MIGRATION.md
  PHASE_C_QA_REPORT.md
  PHASE_D_VISUAL_BENCHMARK.md
```

## Prompt philosophy

**Midjourney compiler** keeps the prompt concise and visual, then appends Midjourney parameters at the end.

**Flow compiler** produces explicit sections for subject preservation, art direction, composition, typography, production constraints, and output rules. Flow-specific settings such as aspect ratio remain UI settings rather than being imitated with Midjourney syntax.

**Production method matters.** Screen Print defaults to limited spot-color logic, while DTF and DTG may preserve full-color raster rendering, gradients, texture, glow, and complex shading. Vector Ready remains optional for DTF/DTG.

## QA status

Phase C established automated regression coverage for the prompt engine, the 65 migrated styles, print-method compatibility, typography, style fusion, reference rules, and production constraints. CI runs tests, lint, and the Vite production build.

Phase D adds visual benchmarking because compiler correctness alone cannot prove that an image model will produce strong printable artwork. The benchmark lab is the controlled bridge between automated QA and real Flow/Midjourney generations.
