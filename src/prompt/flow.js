import { buildStyleDirection, getComposition, getEdge, productionRules, typographyDirection } from './shared.js'

export function buildFlowPrompt(recipe) {
  const modeTitle = recipe.subjectMode === 'reference' || recipe.subjectMode === 'logo'
    ? 'TRANSFORM THE PROVIDED REFERENCE'
    : 'CREATE A NEW STANDALONE T-SHIRT GRAPHIC'

  const subjectRules = recipe.subjectMode === 'reference'
    ? referenceRules(recipe)
    : recipe.subjectMode === 'logo'
      ? logoRules(recipe)
      : recipe.subjectMode === 'graphic'
        ? `Create a graphic-only design. Do not include humans or faces. Core concept: ${recipe.idea || 'a bold symbolic apparel graphic'}.`
        : `Main subject / concept: ${recipe.idea || 'a distinctive central character or subject'}.`

  return [
    modeTitle,
    '',
    'GOAL',
    'Create only the finished flat artwork. It must be suitable for apparel production and easy to evaluate as a standalone design. Do not show a shirt, garment mockup, person wearing it, framed poster, desk scene, or presentation board.',
    '',
    'SUBJECT',
    subjectRules,
    '',
    'ART DIRECTION',
    buildStyleDirection(recipe, true),
    '',
    'COMPOSITION',
    `${getComposition(recipe.composition)}. ${getEdge(recipe.edge)}. Keep the main silhouette readable from a distance and maintain intentional negative space.`,
    '',
    'TYPOGRAPHY',
    typographyDirection(recipe, true),
    '',
    'COLOR & PRODUCTION',
    productionRules(recipe, true),
    '',
    'OUTPUT CONSTRAINTS',
    '- standalone flat artwork only',
    '- clean visual hierarchy and intentional apparel composition',
    '- no unrequested logos, signatures, watermarks, mockups or extra wording',
    recipe.vectorReady ? '- favor simplified closed shapes and separations that can be traced into vector artwork' : '- preserve the selected rendering texture while keeping the design printable',
    '',
    `FLOW SETTING NOTE: Select ${recipe.flowModelLabel} in Flow and set the canvas aspect ratio to ${recipe.aspectRatio}. Aspect ratio is a Flow setting, not Midjourney-style prompt syntax.`,
  ].join('\n')
}

function referenceRules(recipe) {
  const fidelity = {
    strict: 'Preserve the subject identity very closely: facial structure, distinctive markings, key proportions, signature clothing/features and recognizable silhouette. Change the rendering style and composition, not the person or character identity.',
    balanced: 'Keep the supplied subject clearly recognizable, preserving its major features and silhouette while allowing moderate stylistic reinterpretation.',
    loose: 'Use the supplied image as inspiration. Preserve only the most recognizable concept and allow broad reinterpretation.',
  }
  return `${fidelity[recipe.referenceFidelity] ?? fidelity.balanced}\nCore concept / requested action: ${recipe.idea || 'adapt the referenced subject into the selected apparel design direction'}.`
}

function logoRules(recipe) {
  return `Use the supplied logo as the strict structural reference. Preserve its exact overall silhouette, proportions, spacing, and all readable spelling. Do not redesign the logo geometry. Apply only the requested visual/material treatment: ${recipe.idea || 'a premium dimensional material treatment'}. Return the transformed logo as standalone artwork.`
}
