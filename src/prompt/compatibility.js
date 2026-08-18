import { STYLE_MAP } from '../data/styles.js'
import { parsePaletteInput, resolvedColorCountMode } from './shared.js'

export function analyzeRecipe(recipe) {
  const issues = []
  const primary = STYLE_MAP[recipe.primaryStyle]
  const secondary = recipe.secondaryStyle && recipe.secondaryStyle !== 'none' ? STYLE_MAP[recipe.secondaryStyle] : null
  const styles = [primary, secondary].filter(Boolean)
  const palette = parsePaletteInput(recipe.paletteInput)
  const colorPolicy = resolvedColorCountMode(recipe)

  if (recipe.vectorReady && recipe.edge === 'fade') {
    issues.push({ level: 'error', code: 'VECTOR_FADE', message: 'Soft Fade conflicts with Vector Ready. Use Organic or Clean Edge.' })
  }

  if (recipe.vectorReady && recipe.printMethod === 'embroidery-look') {
    issues.push({ level: 'warning', code: 'VECTOR_EMBROIDERY', message: 'Faux embroidery is intentionally raster/texture-heavy. Turn Vector Ready off unless you only want a simplified embroidery-like graphic.' })
  }

  if (recipe.vectorReady && recipe.allowGradients) {
    issues.push({ level: 'warning', code: 'VECTOR_GRADIENT', message: 'Vector Ready + gradients is possible, but it reduces easy tracing. Disable gradients for the cleanest separations.' })
  }

  if (recipe.printMethod === 'screenprint' && colorPolicy !== 'full' && Number(recipe.maxColors) > 8) {
    issues.push({ level: 'warning', code: 'INK_COUNT', message: 'More than 8 spot colors can make screen-print production unnecessarily complex.' })
  }

  if (['dtg', 'dtf'].includes(recipe.printMethod) && !recipe.vectorReady && colorPolicy === 'full') {
    issues.push({ level: 'info', code: 'RASTER_OK', message: `${recipe.printMethod.toUpperCase()} can use full-color raster artwork; gradients, rich shading, texture, and non-vector styles are valid.` })
  }

  if (['dtg', 'dtf'].includes(recipe.printMethod) && recipe.vectorReady) {
    issues.push({ level: 'info', code: 'VECTOR_ON_RASTER', message: `Vector-style artwork is completely fine for ${recipe.printMethod.toUpperCase()} printing; it will simply be printed as raster output.` })
  }

  if (recipe.useOmniReference && recipe.mjModel !== '7') {
    issues.push({ level: 'error', code: 'OMNI_VERSION', message: 'Midjourney Omni Reference requires V7. Switch MJ model to V7 or disable Omni Reference.' })
  }

  if (recipe.colorMode === 'manual' && palette.length === 0) {
    issues.push({ level: 'warning', code: 'PALETTE_EMPTY', message: 'Manual palette mode is selected, but the palette input is empty.' })
  }

  if (colorPolicy === 'limited' && palette.length > Number(recipe.maxColors || 6)) {
    issues.push({ level: 'warning', code: 'PALETTE_LIMIT', message: 'The supplied palette has more entries than the selected maximum color count.' })
  }

  if ((recipe.textTop || recipe.textBottom || recipe.textSub) && styles.some((style) => style?.textAffinity === 'low')) {
    issues.push({ level: 'info', code: 'TEXT_STYLE', message: 'One selected style is not typography-led. Keep the main text hierarchy simple and deliberate.' })
  }

  if (recipe.mixElements?.bikerPatches && !String(recipe.textTop || '').trim() && !String(recipe.textBottom || '').trim()) {
    issues.push({ level: 'info', code: 'BIKER_PATCH_TEXT', message: 'Biker Rocker Patches is enabled, but no top or bottom text is provided yet.' })
  }

  if (recipe.referenceFidelity === 'strict' && ['pure-abstract-geo', 'abstract-geometric', 'surreal-collage'].includes(recipe.primaryStyle)) {
    issues.push({ level: 'warning', code: 'STRICT_ABSTRACT', message: 'Strict reference fidelity can fight with very abstract styles. Balanced fidelity may produce a cleaner result.' })
  }

  if (recipe.vectorReady && styles.some((style) => Number(style?.vectorScore || 3) <= 2)) {
    issues.push({ level: 'warning', code: 'STYLE_VECTOR', message: 'One selected style is texture-heavy. Vector Ready will simplify part of its original character.' })
  }

  return issues
}

export function optimizeRecipe(recipe) {
  const next = { ...recipe, mixElements: { ...(recipe.mixElements || {}) } }

  if (next.vectorReady) {
    next.edge = next.edge === 'fade' ? 'organic' : next.edge
    if (!['dtg', 'dtf'].includes(next.printMethod)) next.allowGradients = false
    if (next.printMethod === 'screenprint' && Number(next.maxColors) > 8) next.maxColors = 8
  }

  if (next.useOmniReference) next.mjModel = '7'

  const paletteCount = parsePaletteInput(next.paletteInput).length
  if (resolvedColorCountMode(next) === 'limited' && paletteCount > Number(next.maxColors || 6)) {
    next.maxColors = Math.min(paletteCount, 12)
  }

  return next
}
