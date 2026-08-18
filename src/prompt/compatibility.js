import { STYLE_MAP } from '../data/styles.js'

export function analyzeRecipe(recipe) {
  const issues = []
  const primary = STYLE_MAP[recipe.primaryStyle]
  const secondary = recipe.secondaryStyle !== 'none' ? STYLE_MAP[recipe.secondaryStyle] : null

  if (recipe.vectorReady && recipe.edge === 'fade') {
    issues.push({ level: 'error', code: 'VECTOR_FADE', message: 'Soft Fade conflicts with Vector Ready. Use Organic or Clean Edge.' })
  }

  if (recipe.vectorReady && recipe.printMethod === 'embroidery-look') {
    issues.push({ level: 'error', code: 'VECTOR_EMBROIDERY', message: 'Faux embroidery is raster/texture-heavy and conflicts with strict Vector Ready output.' })
  }

  if (recipe.vectorReady && recipe.allowGradients) {
    issues.push({ level: 'warning', code: 'VECTOR_GRADIENT', message: 'Gradients reduce easy vector tracing. Disable gradients for clean separations.' })
  }

  if (recipe.maxColors > 8 && recipe.printMethod === 'screenprint') {
    issues.push({ level: 'warning', code: 'INK_COUNT', message: 'More than 8 spot colors can make screen-print production unnecessarily complex.' })
  }

  if (recipe.referenceFidelity === 'strict' && recipe.mjModel !== '7' && recipe.useOmniReference) {
    issues.push({ level: 'error', code: 'OMNI_VERSION', message: 'Midjourney Omni Reference requires V7. Switch MJ model to V7 or disable Omni Reference.' })
  }

  if (recipe.textTop || recipe.textBottom || recipe.textSub) {
    if (primary?.textAffinity === 'low' && !secondary) {
      issues.push({ level: 'info', code: 'TEXT_STYLE', message: `${primary.label} is not typography-led. Keep the text hierarchy simple.` })
    }
  }

  if (recipe.vectorReady && [primary, secondary].filter(Boolean).some((style) => style.vectorScore <= 2)) {
    issues.push({ level: 'warning', code: 'STYLE_VECTOR', message: 'One selected style is texture-heavy. The compiler will simplify its texture for Vector Ready mode.' })
  }

  return issues
}

export function optimizeRecipe(recipe) {
  const next = { ...recipe }
  if (next.vectorReady) {
    next.allowGradients = false
    next.edge = next.edge === 'fade' ? 'organic' : next.edge
    next.printMethod = next.printMethod === 'embroidery-look' ? 'screenprint' : next.printMethod
    if (next.maxColors > 8) next.maxColors = 8
  }
  if (next.useOmniReference) next.mjModel = '7'
  return next
}
