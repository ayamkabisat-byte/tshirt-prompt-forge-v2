import { buildStyleDirection } from './styleCompiler.js'
import { getComposition, getEdge, productionRules, typographyDirection, getTattooPlacement } from './shared.js'

export function buildMidjourneyPrompt(recipe) {
  const parts = []
  const referenceUrls = []
  const referenceUrl = String(recipe.referenceUrl || '').trim()
  const logoReference = String(recipe.logoReference || '').trim()
  const extraPrompt = String(recipe.extraPrompt || '').trim()
  const negativePrompt = String(recipe.negativePrompt || '').trim()

  if (referenceUrl) referenceUrls.push(referenceUrl)
  if (recipe.logoIntegration === 'image' && logoReference) referenceUrls.push(logoReference)
  if (referenceUrls.length) parts.push(referenceUrls.join(' '))

  parts.push(subjectLead(recipe))
  parts.push(getComposition(recipe.composition))
  parts.push(buildStyleDirection(recipe, false))

  if (recipe.subjectMode === 'reference') {
    const fidelity = recipe.referenceFidelity === 'strict'
      ? 'preserve recognizable identity, facial structure, signature markings, key proportions and essential silhouette from the supplied reference'
      : recipe.referenceFidelity === 'balanced'
        ? 'keep the supplied reference recognizable while allowing moderate stylistic reinterpretation'
        : 'use the supplied reference as loose visual inspiration'
    parts.push(fidelity)
  }

  if (recipe.subjectMode === 'tattoo') parts.push(`tattoo placement intent: ${getTattooPlacement(recipe.tattooPlacement)}`)

  parts.push(productionRules(recipe, false))
  parts.push(getEdge(recipe.edge))
  parts.push(typographyDirection(recipe, false))
  if (extraPrompt) parts.push(extraPrompt)
  parts.push('isolated standalone artwork only, no t-shirt mockup, no model wearing the shirt, no presentation scene')

  const params = [`--ar ${recipe.aspectRatio}`]
  if (recipe.raw) params.push('--raw')
  if (Number.isFinite(Number(recipe.stylize))) params.push(`--s ${Number(recipe.stylize)}`)
  if (Number(recipe.chaos) > 0) params.push(`--c ${Number(recipe.chaos)}`)
  if (referenceUrl && Number(recipe.imageWeight) > 0) params.push(`--iw ${Number(recipe.imageWeight)}`)

  const styleReference = String(recipe.styleReference || '').trim()
  if (styleReference) {
    params.push(`--sref ${styleReference}`)
    if (Number(recipe.styleWeight) >= 0) params.push(`--sw ${Number(recipe.styleWeight)}`)
  }

  const omniReference = String(recipe.omniReference || '').trim()
  if (recipe.useOmniReference && omniReference && recipe.mjModel === '7') {
    params.push(`--oref ${omniReference}`)
    if (Number(recipe.omniWeight) > 0) params.push(`--ow ${Number(recipe.omniWeight)}`)
  }

  if (negativePrompt) params.push(`--no ${negativePrompt}`)
  const seed = String(recipe.seed || '').trim()
  if (seed) params.push(`--seed ${seed}`)
  if (recipe.mjModel === 'niji-7') params.push('--niji 7')
  else params.push(`--v ${recipe.mjModel}`)

  return `${parts.filter(Boolean).join(', ')} ${params.join(' ')}`
}

function subjectLead(recipe) {
  const idea = String(recipe.idea || '').trim() || 'a distinctive central subject'

  if (recipe.subjectMode === 'graphic') return `standalone apparel graphic of ${idea}`
  if (recipe.subjectMode === 'logo') return `standalone artistic logo transformation based on the supplied logo reference, preserve the recognizable silhouette, proportions and spelling, ${idea}`
  if (recipe.subjectMode === 'tattoo') return `standalone tattoo-ready flat design of ${idea}`
  return `${idea}, standalone print-ready t-shirt artwork`
}
