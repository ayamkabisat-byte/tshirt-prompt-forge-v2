import { STYLE_MAP } from '../data/styles.js'
import { MIX_ELEMENTS } from '../data/presets.js'

const MIX = {
  brutalist: 'unordered overlapping Brutalist layout with intentional visual tension and asymmetric blocking',
  microText: 'dense micro text, coordinates, warning labels, crosshairs, serial numbers, barcodes, and tiny spec-sheet detail',
  autoDecals: 'automotive decals, racing labels, sponsor-style stickers, and speed-shop insignia',
  vintage: '90s vintage print mood with controlled wear and nostalgic graphic rhythm',
  minimalist: 'clean negative space and reduced unnecessary clutter',
  glitchArt: 'controlled RGB splitting, VHS tracking noise, pixel breakup, and digital glitch artifacts',
  halftoneDots: 'exaggerated halftone dots and vintage comic-print texture',
  y2kTribal: 'Y2K chrome tribal vectors, cyber sigils, wireframes, and techno-ornamental motifs',
  bikerPatches: 'curved biker rocker patches or ribbon banners for suitable top and bottom text',
}

export function getStyle(id) {
  return STYLE_MAP[id] ?? STYLE_MAP['vector-bazzier']
}

export function buildStyleDirection(recipe, detailed = false) {
  const primary = getStyle(recipe.primaryStyle)
  const secondary = recipe.secondaryStyle && recipe.secondaryStyle !== 'none' ? getStyle(recipe.secondaryStyle) : null
  const graphicMode = ['graphic', 'logo'].includes(recipe.subjectMode)
  const describe = (style) => graphicMode && style.graphicPrompt ? style.graphicPrompt : style.prompt
  const primaryPrompt = describe(primary)
  const secondaryPrompt = secondary ? describe(secondary) : ''

  let result = primaryPrompt
  if (secondary) {
    const fusion = {
      balanced: `Blend both aesthetics evenly. Primary: ${primaryPrompt} Secondary: ${secondaryPrompt}`,
      'primary-structure': `Use the primary style for structure, silhouette, linework and composition: ${primaryPrompt} Apply the secondary style mainly through surface treatment, ornament and supporting motifs: ${secondaryPrompt}`,
      'primary-linework': `Use the primary style as the dominant drawing and form language: ${primaryPrompt} Borrow mainly palette and selected decorative cues from the secondary style: ${secondaryPrompt}`,
      'primary-composition': `Use the primary style for overall composition and hierarchy: ${primaryPrompt} Render selected forms with the secondary visual treatment: ${secondaryPrompt}`,
      'accent-25': `Keep the result approximately 75% primary and 25% secondary. Primary: ${primaryPrompt} Secondary accent: ${secondaryPrompt}`,
      'dominant-primary': `Keep the result approximately 75% primary and 25% secondary. Primary: ${primaryPrompt} Secondary accent: ${secondaryPrompt}`,
    }
    result = fusion[recipe.fusionMode] ?? fusion.balanced
  }

  const detail = {
    clean: 'Keep detail density clean, selective, and highly readable.',
    balanced: 'Balance readability with enough detail to feel premium.',
    intricate: 'Use dense intricate detailing while protecting the dominant silhouette and visual hierarchy.',
  }[recipe.detailLevel || 'balanced']
  const background = {
    isolated: 'Keep the artwork isolated with no unnecessary rectangular background box.',
    badge: 'Use a contained badge or emblem field when it supports the composition.',
    poster: 'Allow a poster-like backing field while keeping it usable as apparel artwork.',
    parchment: 'Allow an aged paper or parchment-like backing field when appropriate to the selected style.',
  }[recipe.backgroundMode || 'isolated']

  const mix = MIX_ELEMENTS.filter((item) => recipe.mixElements?.[item.id]).map((item) => MIX[item.id]).filter(Boolean)
  const rules = [...new Set([...(primary.rules || []), ...(secondary?.rules || [])])]
  const suffix = [detail, background]
  if (mix.length) suffix.push(`Additional mix elements: ${mix.join('; ')}.`)
  if (rules.length) suffix.push(`Style-specific rules: ${rules.join(' ')}`)
  return detailed ? `${result}\n${suffix.join('\n')}` : `${result}, ${suffix.join(' ')}`
}
