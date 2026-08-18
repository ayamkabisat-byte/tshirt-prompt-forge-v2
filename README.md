# T-Shirt Prompt Forge v2

A clean rebuild of **T-Shirt Prompt Forge** focused on two image-generation workflows:

- **Midjourney** — compact visual prompts plus supported Midjourney parameters.
- **Google Flow / Nano Banana 2** — structured natural-language art direction for generation and reference-based editing.

The original `tshirtprompt` repository is intentionally left untouched.

## Why v2 exists

v2 replaces the old single-string prompt builder with a shared **Design Recipe** and two separate prompt compilers. The same design intent is translated differently for each image model instead of reusing one generic prompt.

## Current v0.1 foundation

- Subject modes: Generate New, Transform Reference, Graphic Only, Logo Transform
- Primary + secondary style engine
- Controlled style fusion methods
- Composition and edge controls
- Screen print / DTG / DTF / faux-embroidery production modes
- 1–12 printable color target
- Garment color / negative-space awareness
- Vector Ready constraints
- Exact typography fields
- Midjourney V8.2 / V8.1 / V7 / Niji 7 profiles
- Raw, Stylize, Chaos, Image Weight, Style Reference, Omni Reference, Seed
- Flow model selector for Nano Banana 2, Nano Banana Pro, and Nano Banana 2 Lite
- Prompt Health conflict detection + Auto Optimize
- Separate live Flow and Midjourney prompt output

## Development

```bash
npm install
npm run dev
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
    styles.js
  prompt/
    compatibility.js
    flow.js
    midjourney.js
    shared.js
    index.js
  App.jsx
  main.jsx
  styles.css
```

## Prompt philosophy

**Midjourney compiler** keeps the prompt concise and visual, then appends Midjourney parameters at the end.

**Flow compiler** produces explicit sections for subject preservation, art direction, composition, typography, production constraints, and output rules. Flow-specific settings such as aspect ratio remain UI settings rather than being imitated with Midjourney syntax.

## Status

This is the first runnable foundation. The next milestones are expanding the style library from v1, adding smarter style-specific constraints, shareable recipe URLs, preset management, and production-oriented validation.
