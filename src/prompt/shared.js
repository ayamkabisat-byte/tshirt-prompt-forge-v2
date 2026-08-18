import { STYLE_MAP } from '../data/styles.js'
import {
  COMPOSITIONS, EDGE_MODES, GARMENT_COLORS, PRINT_METHODS,
  TATTOO_PLACEMENTS, TYPOGRAPHY_PRESETS, MIX_ELEMENTS,
} from '../data/presets.js'

const MIX_DESCRIPTIONS = {
  brutalist: 'unordered overlapping Brutalist layout with intentional visual tension and asymmetric blocking',
  microText: 'dense micro text, coordinates, warning labels, crosshairs, serial numbers, barcodes, and tiny spec-sheet detail',
  autoDecals: 'authentic automotive decals, racing labels, sponsor-style stickers, and speed-shop insignia',
  vintage: 'an overall 90s vintage print mood with controlled wear and nostalgic graphic rhythm',
  minimalist: 'clean negative space and reduced unnecessary clutter',
  glitchArt: 'controlled RGB splitting, VHS tracking noise, digital pixel breakup, and glitch artifacts',
  halftoneDots: 'exaggerated halftone dots and vintage comic-print texture',
  y2kTribal: 'Y2K chrome tribal vectors, cyber sigils, wireframes, and techno-ornamental motifs',
  bikerPatches: 'curved biker rocker patches or ribbon banners for suitable top and bottom text',
}

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

export function getPrintMethod(id) {
  return PRINT_METHODS.find((item) => item.id === id) ?? PRINT_METHODS[0]
}

export function getTattooPlacement(id) {
  return TATTOO_PLACEMENTS.find((item) => item.id === id)?.prompt ?? TATTOO_PLACEMENTS[1].prompt
}

export function quoteText(value) {
  return String(value || '').trim() ? `"${String(value).trim().replaceAll('"', '')}"` : ''
}

export function parsePaletteInput(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

export function resolvedColorCountMode(recipe) {
  if (recipe.colorCountMode && recipe.colorCountMode !== 'auto') return recipe.colorCountMode
  const method = getPrintMethod(recipe.printMethod)
  return method.defaultColorPolicy === 'limited' ? 'limited' : method.defaultColorPolicy === 'full' ? 'full' : 'auto'
}

export function buildStyleDirection(recipe, detailed = false) {
  const primary = getStyle(recipe.primaryStyle)
  const secondary = recipe.secondaryStyle && recipe.secondaryStyle !== 'none' ? getStyle(recipe.secondaryStyle) : null
  const primaryName = primary.medium || primary.label
  const secondaryName = secondary ? (secondary.medium || secondary.label) : ''
  const detailLevel = recipe.detailLevel || 'balanced'
  const backgroundMode = recipe.backgroundMode || 'isolated'
  const mixDirections = MIX_ELEMENTS
    .filter((item) => recipe.mixElements?.[item.id])
    .map((item) => MIX_DESCRIPTIONS[item.id])

  const detailDirection = {
    clean: 'Keep detail density clean, selective, and highly readable.',
    balanced: 'Balance readability with enough detail to feel premium.',
    intricate: 'Use dense intricate detailing while protecting the dominant silhouette and visual hierarchy.',
  }[detailLevel] || 'Balance readability with enough detail to feel premium.'

  const backgroundDirection = {
    isolated: 'Keep the artwork isolated with no unnecessary rectangular background box.',
    badge: 'Use a contained badge or emblem field when it supports the composition.',
    poster: 'Allow a poster-like backing field while keeping it usable as apparel artwork.',
    parchment: 'Allow an aged paper or parchment-like backing field when appropriate to the selected style.',
  }[backgroundMode] || 'Keep the artwork isolated with no unnecessary rectangular background box.'

  const primarySummary = `${primaryName}; ${primary.linework}; ${primary.shading}; ${primary.texture}; palette direction: ${primary.palette}`

  if (!secondary) {
    const result = detailed
      ? `${primarySummary}. ${detailDirection} ${backgroundDirection}`
      : `${primarySummary}, ${detailDirection.toLowerCase()} ${backgroundDirection.toLowerCase()}`
    return mixDirections.length ? `${result}${detailed ? '\n' : ', '}Additional mix elements: ${mixDirections.join('; ')}.` : result
  }

  const fusion = {
    balanced: `Blend both aesthetics evenly. Primary = ${primarySummary}. Secondary = ${secondaryName}; ${secondary.linework}; ${secondary.shading}; ${secondary.texture}; ${secondary.palette}.`,
    'primary-structure': `Use ${primaryName} for structure, silhouette, linework and composition. Apply ${secondaryName} mainly through surface treatment, ornament and secondary motifs.`,
    'primary-linework': `Use ${primary.linework} as the dominant drawing language. Borrow palette and selected decorative cues from ${secondaryName}, especially ${secondary.palette}.`,
    'primary-composition': `Use ${primaryName} for main composition and hierarchy, while selected forms are rendered with visual treatment from ${secondaryName}.`,
    'accent-25': `Keep the design approximately 75% ${primaryName} and 25% ${secondaryName}; the secondary style is only an accent.`,
    'dominant-primary': `Keep the design approximately 75% ${primaryName} and 25% ${secondaryName}; the secondary style is only an accent.`,
  }

  const result = `${fusion[recipe.fusionMode] ?? fusion.balanced} ${detailDirection} ${backgroundDirection}`
  return mixDirections.length ? `${result}${detailed ? '\n' : ', '}Additional mix elements: ${mixDirections.join('; ')}.` : result
}

export function colorDirection(recipe, verbose = false) {
  const mode = recipe.colorMode || 'auto'
  const palette = parsePaletteInput(recipe.paletteInput)
  const garment = getGarment(recipe.garmentColor)
  const useNegativeSpace = recipe.useGarmentNegativeSpace !== false

  const modeText = {
    auto: 'Use a palette that naturally fits the selected art direction.',
    manual: 'Use the supplied palette as the main color anchors.',
    monochrome: 'Use a monochrome palette with tonal variation inside one hue family.',
    complementary: 'Use a strong complementary color relationship.',
    analogous: 'Use a harmonious analogous color relationship.',
  }[mode] || 'Use a palette that naturally fits the selected art direction.'

  const parts = [
    garment.id !== 'custom' ? `Garment color: ${garment.label}.` : '',
    modeText,
    palette.length ? `Palette anchors: ${palette.join(', ')}.` : '',
    useNegativeSpace && garment.id !== 'custom' ? 'The garment color may function as intentional negative space where useful.' : '',
  ].filter(Boolean)

  return verbose ? parts.join('\n') : parts.join(' ')
}

export function productionRules(recipe, verbose = false) {
  const method = getPrintMethod(recipe.printMethod)
  const garment = getGarment(recipe.garmentColor)
  const colorPolicy = resolvedColorCountMode(recipe)
  const maxColors = Number(recipe.maxColors) || 6
  const rules = []

  if (method.id === 'screenprint') {
    rules.push(`spot-color screen-print production${colorPolicy !== 'full' ? ` with no more than ${maxColors} printable ink colors` : ''}`)
    if (garment.id !== 'custom' && recipe.useGarmentNegativeSpace !== false) rules.push(`use the ${garment.label.toLowerCase()} garment color as intentional negative space where useful`)
    if (recipe.allowGradients) {
      rules.push('avoid continuous translucent gradient printing; translate tonal transitions into controlled halftone or discrete printable separations')
    } else {
      rules.push('use solid printable color separations with no continuous gradients')
    }
  } else if (method.id === 'dtg') {
    rules.push('full-color DTG raster artwork with rich tonal range, fine detail, smooth shading, texture, glow, and gradients allowed when they serve the selected style')
    rules.push('do not flatten the artwork into spot-color vector language unless Vector Ready is intentionally enabled')
    if (colorPolicy === 'limited') rules.push(`stylistically restrict the artwork to approximately ${maxColors} dominant colors even though DTG can print full color`)
  } else if (method.id === 'dtf') {
    rules.push('full-color DTF raster artwork with crisp high-definition edges, strong opacity, rich gradients, texture, shading, and complex color transitions allowed when appropriate')
    rules.push('keep the outer silhouette clean and avoid weak semi-transparent fringe pixels around the perimeter')
    rules.push('do not force vector-style simplification unless Vector Ready is intentionally enabled')
    if (colorPolicy === 'limited') rules.push(`stylistically restrict the artwork to approximately ${maxColors} dominant colors even though DTF can print full color`)
  } else if (method.id === 'embroidery-look') {
    rules.push('flat high-resolution raster artwork that visually imitates dimensional embroidery, thread direction, stitch density, and thread sheen without showing a garment mockup')
  } else {
    rules.push('tattoo-ready flat artwork with clear line hierarchy and no photographed skin or body mockup')
  }

  if (recipe.vectorReady) {
    rules.push('Vector Ready is intentionally enabled: favor trace-friendly closed shapes, crisp edges, simplified separations, and controlled detail')
    if (!recipe.allowGradients) rules.push('avoid gradients, soft transparency, airbrush transitions, and photographic texture')
  }

  if (recipe.allowHalftone) rules.push('halftone dots may be used as an intentional graphic texture')
  else if (method.id === 'screenprint') rules.push('avoid halftone shading unless needed to simulate a requested tonal transition')

  if (recipe.subjectMode === 'tattoo') {
    rules.push(`tattoo placement intent: ${getTattooPlacement(recipe.tattooPlacement)}`)
    rules.push('present the tattoo as a flat design file, not on a photographed person')
  }

  rules.push(colorDirection(recipe, false))
  return verbose ? rules.map((rule) => `- ${rule}`).join('\n') : rules.join(', ')
}

export function typographyDirection(recipe, verbose = false) {
  const entries = []
  if (String(recipe.textTop || '').trim()) entries.push({ place: 'top', text: quoteText(recipe.textTop) })
  if (String(recipe.textSub || '').trim()) entries.push({ place: 'secondary/subtitle area', text: quoteText(recipe.textSub) })
  if (String(recipe.textBottom || '').trim()) entries.push({ place: 'bottom', text: quoteText(recipe.textBottom) })

  const preset = TYPOGRAPHY_PRESETS.find((item) => item.id === recipe.typographyPreset)?.label
  const typographyStyle = String(recipe.typographyStyle || '').trim() || (preset && recipe.typographyPreset !== 'auto' ? `${preset} lettering` : 'bold apparel lettering that matches the selected style and remains readable')
  const logoMode = recipe.logoIntegration || 'none'
  const logoText = quoteText(recipe.logoText)

  const logoInstruction = logoMode === 'text'
    ? `Integrate a secondary logo/wordmark${logoText ? ` reading ${logoText}` : ''} as part of the composition.`
    : logoMode === 'image'
      ? 'Integrate the supplied secondary logo image as a deliberate brand element without distorting its identity.'
      : ''

  if (!entries.length && !logoInstruction) return verbose
    ? 'Do not add large readable titles, random coherent words, signatures, or watermarks. Minor unreadable micro-detail is allowed only when required by the chosen style.'
    : 'no unrequested readable titles, random words, signatures or watermarks'

  if (verbose) {
    return [
      entries.length ? 'Render the following readable text exactly as written. Do not paraphrase, translate, add, or misspell it:' : '',
      ...entries.map((item) => `- ${item.place}: ${item.text}`),
      `Typography direction: ${typographyStyle}.`,
      recipe.mixElements?.bikerPatches ? '- Put suitable top and bottom text inside curved rocker patches or ribbon banners.' : '',
      logoInstruction,
    ].filter(Boolean).join('\n')
  }

  return [
    entries.map((item) => `${item.text} at the ${item.place}`).join(', '),
    entries.length ? `exact spelling, ${typographyStyle}` : '',
    recipe.mixElements?.bikerPatches ? 'use rocker patch / ribbon banner text containers' : '',
    logoInstruction,
  ].filter(Boolean).join(', ')
}
