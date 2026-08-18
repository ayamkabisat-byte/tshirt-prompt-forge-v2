import { buildStyleDirection, getComposition, getEdge, productionRules, typographyDirection } from './shared.js'

export function buildFlowPrompt(recipe) {
  const modeTitle = recipe.subjectMode === 'reference' || recipe.subjectMode === 'logo'
    ? 'TRANSFORM THE PROVIDED REFERENCE'
    : recipe.subjectMode === 'tattoo'
      ? 'CREATE A NEW TATTOO-READY FLAT ARTWORK'
      : 'CREATE A NEW STANDALONE T-SHIRT GRAPHIC'

  const extraPrompt = String(recipe.extraPrompt || '').trim()
  const negativePrompt = String(recipe.negativePrompt || '').trim()
  const flowModelLabel = recipe.flowModelLabel || recipe.flowModel || 'Nano Banana 2'

  return [
    modeTitle,
    '',
    'GOAL',
    'Create only the finished flat artwork. It must be suitable for apparel production and easy to evaluate as a standalone design. Do not show a shirt, garment mockup, person wearing it, framed poster, desk scene, or presentation board.',
    '',
    'SUBJECT',
    subjectRules(recipe),
    '',
    'ART DIRECTION',
    buildStyleDirection(recipe, true),
    '',
    'COMPOSITION',
    `${getComposition(recipe.composition)}. ${getEdge(recipe.edge)}. Keep the main silhouette readable from a distance and preserve an intentional apparel-focused hierarchy.`,
    '',
    'TYPOGRAPHY',
    typographyDirection(recipe, true),
    '',
    'COLOR & PRODUCTION',
    productionRules(recipe, true),
    extraPrompt ? `\nEXTRA DIRECTION\n${extraPrompt}` : '',
    negativePrompt ? `\nAVOID\n- ${negativePrompt}` : '',
    '',
    'OUTPUT CONSTRAINTS',
    '- standalone artwork only',
    '- clean visual hierarchy and intentional apparel composition',
    '- no unrequested logos, signatures, watermarks, mockups, or extra wording',
    recipe.vectorReady
      ? '- Vector Ready is intentionally enabled: keep shapes and separations trace-friendly where compatible with the chosen print method'
      : ['dtg', 'dtf'].includes(recipe.printMethod)
        ? '- raster artwork is allowed; preserve useful gradients, texture, shading, glow, and complex color treatment instead of flattening everything into vector shapes'
        : '- preserve the selected rendering texture while keeping the design printable',
    '',
    `FLOW SETTING NOTE: Select ${flowModelLabel} in Flow and set the canvas aspect ratio to ${recipe.aspectRatio}.`,
  ].filter(Boolean).join('\n')
}

function subjectRules(recipe) {
  const idea = String(recipe.idea || '').trim()

  if (recipe.subjectMode === 'reference') {
    const fidelity = {
      strict: 'Preserve the subject identity very closely: facial structure, distinctive markings, key proportions, signature clothing/features, and recognizable silhouette. Change the rendering style and composition, not the core identity.',
      balanced: 'Keep the supplied subject clearly recognizable, preserving major features and silhouette while allowing moderate stylistic reinterpretation.',
      loose: 'Use the supplied image as inspiration. Preserve only the most recognizable concept and allow broad reinterpretation.',
    }
    return `${fidelity[recipe.referenceFidelity] ?? fidelity.balanced}\nCore concept / requested action: ${idea || 'adapt the referenced subject into the selected apparel design direction'}.`
  }

  if (recipe.subjectMode === 'logo') {
    return `Use the supplied logo as the strict structural reference. Preserve its overall silhouette, proportions, spacing, and readable spelling. Do not redesign the logo geometry. Apply only the requested material or visual treatment: ${idea || 'a premium dimensional material transformation'}. Return the transformed logo as standalone artwork.`
  }

  if (recipe.subjectMode === 'graphic') {
    return `Create a graphic-only design. Do not include a human portrait unless explicitly requested. Core concept: ${idea || 'a bold symbolic apparel graphic'}.`
  }

  if (recipe.subjectMode === 'tattoo') {
    return `Create a tattoo-oriented flat design. Main concept: ${idea || 'a strong tattoo centerpiece'}. It must read as tattoo artwork, not as a photographed tattoo on skin.`
  }

  return `Main subject / concept: ${idea || 'a distinctive central character or subject'}.`
}
