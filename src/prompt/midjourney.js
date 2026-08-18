import { buildStyleDirection, getComposition, getEdge, productionRules, typographyDirection } from './shared.js'

export function buildMidjourneyPrompt(recipe) {
  const parts = []

  if (recipe.referenceUrl.trim()) parts.push(recipe.referenceUrl.trim())

  const subjectLead = recipe.subjectMode === 'graphic'
    ? `standalone apparel graphic of ${recipe.idea || 'a strong symbolic graphic composition'}, no human figure`
    : recipe.subjectMode === 'logo'
      ? `standalone artistic logo transformation based on the supplied logo reference, preserve the exact recognizable silhouette, proportions and spelling, ${recipe.idea || 'premium material transformation'}`
      : `${recipe.idea || 'a distinctive central subject'}, standalone print-ready t-shirt artwork`

  parts.push(subjectLead)
  parts.push(getComposition(recipe.composition))
  parts.push(buildStyleDirection(recipe, false))

  if (recipe.subjectMode === 'reference') {
    const fidelity = recipe.referenceFidelity === 'strict'
      ? 'preserve recognizable identity, facial structure, signature markings and essential silhouette from the supplied reference'
      : recipe.referenceFidelity === 'balanced'
        ? 'keep the supplied reference recognizable while allowing moderate stylistic reinterpretation'
        : 'use the supplied reference as loose visual inspiration'
    parts.push(fidelity)
  }

  parts.push(productionRules(recipe, false))
  parts.push(getEdge(recipe.edge))
  parts.push(typographyDirection(recipe, false))
  parts.push('isolated artwork only, no t-shirt mockup, no model wearing the shirt, no presentation scene')

  const params = [`--ar ${recipe.aspectRatio}`]
  if (recipe.raw) params.push('--raw')
  if (Number.isFinite(Number(recipe.stylize))) params.push(`--s ${Number(recipe.stylize)}`)
  if (Number(recipe.chaos) > 0) params.push(`--c ${Number(recipe.chaos)}`)
  if (recipe.referenceUrl.trim() && Number(recipe.imageWeight) > 0) params.push(`--iw ${Number(recipe.imageWeight)}`)
  if (recipe.styleReference.trim()) {
    params.push(`--sref ${recipe.styleReference.trim()}`)
    if (Number(recipe.styleWeight) > 0) params.push(`--sw ${Number(recipe.styleWeight)}`)
  }
  if (recipe.useOmniReference && recipe.omniReference.trim() && recipe.mjModel === '7') {
    params.push(`--oref ${recipe.omniReference.trim()}`)
    if (Number(recipe.omniWeight) > 0) params.push(`--ow ${Number(recipe.omniWeight)}`)
  }
  if (recipe.seed.trim()) params.push(`--seed ${recipe.seed.trim()}`)
  if (recipe.mjModel === 'niji-7') params.push('--niji 7')
  else params.push(`--v ${recipe.mjModel}`)

  return `${parts.filter(Boolean).join(', ')} ${params.join(' ')}`
}
