# Visual Style Library — asset guide

The UI Style Library is a presentation layer. It does not change the 65 migrated style IDs, design recipe, style compiler, or Flow/Midjourney output.

## Adding example artwork later

1. Add a licensed or self-created image under `public/style-examples/` (prefer optimized WebP).
2. Add `examples: ['/style-examples/<filename>.webp']` to the matching style object in `src/data/styles/<category>.js`.
3. The gallery automatically shows the first example. Without an image, it shows a neutral placeholder.
4. Optionally add `shortDescription` to the style object. Otherwise the gallery derives a readable first sentence from `graphicPrompt` or `prompt`.

Example:
```js
{
  id: 'jdm-racing-vector',
  label: 'JDM & Racing Car Vector',
  shortDescription: 'Bold vector racing art with crisp outlines and glossy reflections.',
  examples: ['/style-examples/jdm-racing-vector.webp'],
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
