# Visual Style Library — asset guide

The UI Style Library is a presentation layer. It does not change the 65 migrated style IDs, design recipe, style compiler, or Flow/Midjourney output.

## Pilot first: one style

Start by adding **one example artwork for one selected style**. Confirm the gallery presentation at desktop and mobile sizes before producing the remaining 64 style examples. Further examples for a style are optional.

## Adding example artwork later

1. Add a licensed or self-created image under `public/style-examples/` (prefer optimized WebP).
2. Add `examples: ['/style-examples/<filename-1>.webp', '/style-examples/<filename-2>.webp']` to the matching style object in `src/data/styles/<category>.js`.
3. The gallery shows the first example by default, with previous/next controls for multiple examples and a full selected-style gallery. Without an image, it shows a neutral placeholder.
4. Optionally add `shortDescription` to the style object. Otherwise the gallery derives a readable first sentence from `graphicPrompt` or `prompt`.

Example:
```js
{
  id: 'jdm-racing-vector',
  label: 'JDM & Racing Car Vector',
  shortDescription: 'Bold vector racing art with crisp outlines and glossy reflections.',
  examples: ['/style-examples/jdm-racing-vector-01.webp', '/style-examples/jdm-racing-vector-02.webp'],
  // Existing prompt fields remain unchanged.
}
```

Images are for **UI discovery only**. They are not silently attached as image references to Flow or Midjourney.

## Regression checklist

- Search and select any of the 65 styles across all eight categories.
- Change primary style while Secondary Style & Fusion is collapsed; secondary settings must remain in the recipe.
- Expand the secondary settings and test fusion.
- Test Flow and Midjourney prompt output after selecting different styles.
- Test mobile layout, keyboard focus, Prompt Health, Auto Optimize, and Benchmark Lab.
- Run `npm test`, `npm run lint`, and `npm run build`.

## Image preparation

- Use only artwork you own or have permission to display.
- Use a consistent portrait **2:3** canvas. Recommended export: **800 × 1200 px**, optimized WebP. The UI uses the same 2:3 frame without cropping the artwork.
- Prefer distinct, representative examples instead of slight variations.
- Keep the style ID unchanged; image filenames are independent of prompt rules.
- The gallery does not upload images or send examples to AI models. Add image assets through the repository for now.
