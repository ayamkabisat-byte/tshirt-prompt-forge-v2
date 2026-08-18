import { STYLE_MAP } from '../data/styles.js'
import { COMPOSITIONS, EDGE_MODES, GARMENT_COLORS } from '../data/presets.js'

export function getStyle(id) {
  return STYLE_MAP[id] ?? STYLE_MAP['clean-mascot-vector']
}

export function getComposition(id) {
  return COMPOSITIONS.find((item) => item.id === id)?.prompt ?? COMPOSITIONS[0].prompt
}

export function getEdge(id) {
  return EDGE_MODES.find((item) => item.id === id)?.prompt ?? EDGE_MODES[0].prompt
}

export function getGarment(id) {
  return GARMENT_COLORS.find((item) => item.id === id) ?? GARMENT_COLORS[0]
}

export function quoteText(value) {
  return value?.trim() ? `"${value.trim().replaceAll('"', '')}"` : ''
}

export function buildStyleDirection(recipe, detailed = false) {
  const primary = getStyle(recipe.primaryStyle)
  const secondary = recipe.secondaryStyle !== 'none' ? getStyle(recipe.secondaryStyle) : null

  if (!secondary) {
    return detailed
      ? `${primary.medium}. Use ${primary.linework}; ${primary.shading}; ${primary.texture}; palette direction: ${primary.palette}.`
      : `${primary.medium}, ${primary.linework}, ${primary.shading}, ${primary.texture}, ${primary.palette}`
  }

  const secondarySummary = `${secondary.medium}; ${secondary.linework}; ${secondary.shading}; ${secondary.texture}; ${secondary.palette}`
  const primarySummary = `${primary.medium}; ${primary.linework}; ${primary.shading}; ${primary.texture}; ${primary.palette}`

  const fusion = {
    balanced: `Blend the primary and secondary aesthetics evenly: primary = ${primarySummary}. secondary = ${secondarySummary}.`,
    'primary-structure': `Use ${primary.medium} for structure, silhouette, linework and composition. Apply ${secondary.medium} only through surface texture, ornament and secondary motifs.`,
    'primary-linework': `Use ${primary.linework} as the dominant drawing language. Borrow the palette and selected decorative cues from ${secondary.medium}, especially ${secondary.palette}.`,
    'primary-composition': `Use ${primary.medium} for the main composition and hierarchy, but render forms using selected visual treatment from ${secondary.medium}.`,
    'accent-25': `Keep the design approximately 75% ${primary.medium} and 25% ${secondary.medium}; the secondary style should act only as an accent and must not overpower the primary identity.`,
  }

  return fusion[recipe.fusionMode] ?? fusion.balanced
}

export function productionRules(recipe, verbose = false) {
  const garment = getGarment(recipe.garmentColor)
  const rules = []

  if (recipe.printMethod === 'screenprint') {
    rules.push(`screen-print production with no more than ${recipe.maxColors} printable spot colors`)
    if (garment.id !== 'custom') rules.push(`designed for a ${garment.label.toLowerCase()} garment, using the garment color as negative space where useful`)
  } else if (recipe.printMethod === 'dtg') {
    rules.push('DTG apparel production with controlled detail and clean printable separation')
  } else if (recipe.printMethod === 'dtf') {
    rules.push('DTF apparel production with a clear outer contour and controlled high-detail rendering')
  } else {
    rules.push('flat artwork that visually imitates embroidery stitches without showing a garment mockup')
  }

  if (recipe.vectorReady) {
    rules.push('vector-trace friendly closed shapes, crisp edges and strong color separation')
    rules.push('no semi-transparent shading, no soft airbrush transitions and no photographic texture')
  }

  if (!recipe.allowGradients) rules.push('no gradients')
  if (recipe.allowHalftone) rules.push('halftone dots may be used only as discrete printable texture')
  else rules.push('avoid halftone shading')

  return verbose ? rules.map((rule) => `- ${rule}`).join('\n') : rules.join(', ')
}

export function typographyDirection(recipe, verbose = false) {
  const entries = []
  if (recipe.textTop.trim()) entries.push({ place: 'top', text: quoteText(recipe.textTop) })
  if (recipe.textSub.trim()) entries.push({ place: 'secondary/subtitle area', text: quoteText(recipe.textSub) })
  if (recipe.textBottom.trim()) entries.push({ place: 'bottom', text: quoteText(recipe.textBottom) })

  if (!entries.length) return verbose
    ? 'Do not add titles, letters, words, signatures, logos, or watermarks unless they naturally appear as unreadable micro-detail requested by the style.'
    : 'no added words, letters, logos, signatures or watermarks'

  if (verbose) {
    return [
      'Render the following text exactly as written. Do not paraphrase, translate, add, or misspell it:',
      ...entries.map((item) => `- ${item.place}: ${item.text}`),
      `Typography direction: ${recipe.typographyStyle || 'bold apparel lettering that matches the visual style and remains readable'}.`,
    ].join('\n')
  }

  return `${entries.map((item) => `${item.text} at the ${item.place}`).join(', ')}, exact spelling, ${recipe.typographyStyle || 'readable apparel typography'}`
}
