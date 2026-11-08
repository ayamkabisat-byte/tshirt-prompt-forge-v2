import test from 'node:test'
import assert from 'node:assert/strict'
import { STYLE_CATEGORIES, V1_STYLE_COUNT } from '../src/data/styles.js'
import { analyzeRecipe, buildFlowPrompt, buildMidjourneyPrompt, optimizeRecipe } from '../src/prompt/index.js'

function recipe(overrides = {}) {
  return {
    subjectMode: 'reference',
    idea: 'fierce tiger riding a vintage cafe racer motorcycle',
    referenceFidelity: 'strict',
    tattooPlacement: 'upper-arm',
    primaryStyle: 'vector-bazzier',
    secondaryStyle: 'none',
    fusionMode: 'primary-structure',
    backgroundMode: 'isolated',
    detailLevel: 'balanced',
    mixElements: {
      brutalist: false, microText: false, autoDecals: false, vintage: false,
      minimalist: false, glitchArt: false, halftoneDots: false,
      y2kTribal: false, bikerPatches: false,
    },
    composition: 'centered',
    edge: 'organic',
    printMethod: 'screenprint',
    garmentColor: 'black',
    colorCountMode: 'auto',
    colorMode: 'auto',
    paletteInput: '',
    maxColors: 6,
    useGarmentNegativeSpace: true,
    vectorReady: true,
    allowGradients: false,
    allowHalftone: false,
    aspectRatio: '3:4',
    textTop: '', textSub: '', textBottom: '',
    typographyPreset: 'auto', typographyStyle: '',
    logoIntegration: 'none', logoText: '', logoReference: '',
    extraPrompt: '', negativePrompt: '',
    mjModel: '8.2', raw: true, stylize: 100, chaos: 0,
    imageWeight: 1.5, referenceUrl: '', styleReference: '', styleWeight: 100,
    useOmniReference: false, omniReference: '', omniWeight: 100, seed: '',
    flowModel: 'nano-banana-2',
    ...overrides,
  }
}

const issueCodes = (r) => analyzeRecipe(r).map((issue) => issue.code)

test('v1 style migration contains exactly 65 unique canonical presets', () => {
  const styles = STYLE_CATEGORIES.flatMap((category) => category.styles)
  assert.equal(V1_STYLE_COUNT, 65)
  assert.equal(styles.length, 65)
  assert.equal(new Set(styles.map((style) => style.id)).size, 65)
})

test('all 65 styles compile in both reference and graphic modes', () => {
  const styles = STYLE_CATEGORIES.flatMap((category) => category.styles)
  for (const style of styles) {
    const ref = recipe({ primaryStyle: style.id })
    const graphic = recipe({ primaryStyle: style.id, subjectMode: 'graphic' })
    assert.ok(buildFlowPrompt(ref).length > 200, `Flow reference failed: ${style.id}`)
    assert.ok(buildMidjourneyPrompt(ref).length > 100, `MJ reference failed: ${style.id}`)
    assert.ok(buildFlowPrompt(graphic).length > 200, `Flow graphic failed: ${style.id}`)
    assert.ok(buildMidjourneyPrompt(graphic).length > 100, `MJ graphic failed: ${style.id}`)
  }
})

test('Flow prompt never leaks Midjourney parameter syntax', () => {
  const output = buildFlowPrompt(recipe())
  assert.doesNotMatch(output, /--ar|--raw|--sref|--oref|--v\s/)
  assert.match(output, /FLOW SETTING NOTE/)
})

test('Midjourney parameters are kept at the end', () => {
  const output = buildMidjourneyPrompt(recipe())
  assert.match(output, /--ar 3:4 --raw --s 100 --v 8\.2$/)
})

test('exact typography uses double quotes while concept text is not quoted', () => {
  const output = buildMidjourneyPrompt(recipe({ textTop: 'WILD ROAD', textBottom: 'TOKYO 1978' }))
  assert.match(output, /"WILD ROAD"/)
  assert.match(output, /"TOKYO 1978"/)
  assert.doesNotMatch(output, /"fierce tiger riding a vintage cafe racer motorcycle"/)
})

test('Wanted Poster does not force readable bounty wording when typography is empty', () => {
  const output = buildMidjourneyPrompt(recipe({ primaryStyle: 'poster-wanted' }))
  assert.doesNotMatch(output, /\bWANTED\b|DEAD OR ALIVE/)
  assert.match(output, /no unrequested readable titles/)
})

test('screen print uses limited spot-color production language', () => {
  const output = buildFlowPrompt(recipe({ printMethod: 'screenprint', maxColors: 6 }))
  assert.match(output, /no more than 6 printable ink colors/)
  assert.match(output, /solid printable color separations/)
})

test('DTF permits raster artwork without requiring gradients when Vector Ready is off', () => {
  const r = recipe({ printMethod: 'dtf', vectorReady: false, allowGradients: true, primaryStyle: 'surrealism-dali' })
  const output = buildFlowPrompt(r)
  assert.match(output, /full-color DTF raster artwork/)
  assert.match(output, /none of these effects are mandatory/)
  assert.doesNotMatch(output, /no more than \d+ printable ink colors/)
  assert.ok(issueCodes(r).includes('RASTER_OK'))
})

test('DTG allows full-color raster but respects the chosen style density', () => {
  const output = buildFlowPrompt(recipe({ printMethod: 'dtg', vectorReady: false, allowGradients: true, primaryStyle: 'storybook-ink' }))
  assert.match(output, /full-color DTG raster artwork/)
  assert.match(output, /follow the chosen art style for color count, detail density, shading and tonal steps/)
})

test('DTF limited palette remains available as an artistic choice', () => {
  const output = buildFlowPrompt(recipe({ printMethod: 'dtf', vectorReady: false, colorCountMode: 'limited', maxColors: 5 }))
  assert.match(output, /approximately 5 dominant colors/)
})

test('Screen Print + Full Color is warned and auto-optimized to limited', () => {
  const r = recipe({ printMethod: 'screenprint', colorCountMode: 'full' })
  assert.ok(issueCodes(r).includes('SCREENPRINT_FULL_COLOR'))
  assert.equal(optimizeRecipe(r).colorCountMode, 'limited')
})

test('screen-print optimizer never re-expands above eight inks from a long palette', () => {
  const r = recipe({
    printMethod: 'screenprint', colorCountMode: 'limited', colorMode: 'manual', maxColors: 4,
    paletteInput: 'a,b,c,d,e,f,g,h,i,j',
  })
  const optimized = optimizeRecipe(r)
  assert.equal(optimized.maxColors, 8)
  assert.ok(issueCodes(optimized).includes('PALETTE_LIMIT'))
})

test('Vector Ready + Soft Fade is a hard conflict and optimizer repairs it', () => {
  const r = recipe({ vectorReady: true, edge: 'fade' })
  assert.ok(issueCodes(r).includes('VECTOR_FADE'))
  assert.equal(optimizeRecipe(r).edge, 'organic')
})

test('Omni Reference requires V7 and a non-empty Omni URL', () => {
  const r = recipe({ useOmniReference: true, mjModel: '8.2', omniReference: '' })
  const codes = issueCodes(r)
  assert.ok(codes.includes('OMNI_VERSION'))
  assert.ok(codes.includes('OMNI_EMPTY'))
  assert.equal(optimizeRecipe(r).mjModel, '7')
})

test('strict fidelity warns when either primary or secondary style is highly abstract', () => {
  const r = recipe({ primaryStyle: 'vector-bazzier', secondaryStyle: 'pure-abstract-geo', referenceFidelity: 'strict' })
  assert.ok(issueCodes(r).includes('STRICT_ABSTRACT'))
})

test('manual palette validation catches empty and over-limit palettes', () => {
  assert.ok(issueCodes(recipe({ colorMode: 'manual', paletteInput: '' })).includes('PALETTE_EMPTY'))
  const over = recipe({ colorMode: 'manual', colorCountMode: 'limited', maxColors: 3, paletteInput: 'red,blue,green,white' })
  assert.ok(issueCodes(over).includes('PALETTE_LIMIT'))
})

test('biker patches and logo-image integration expose missing-input warnings', () => {
  const r = recipe({ mixElements: { ...recipe().mixElements, bikerPatches: true }, logoIntegration: 'image', logoReference: '' })
  const codes = issueCodes(r)
  assert.ok(codes.includes('BIKER_PATCH_TEXT'))
  assert.ok(codes.includes('LOGO_REFERENCE_EMPTY'))
})

test('Vector-style artwork remains valid for DTF', () => {
  const r = recipe({ printMethod: 'dtf', vectorReady: true, primaryStyle: 'vector-bazzier' })
  assert.ok(issueCodes(r).includes('VECTOR_ON_RASTER'))
  assert.match(buildFlowPrompt(r), /Vector Ready is intentionally enabled/)
})

test('Graphic mode uses graphic-specific style override', () => {
  const output = buildFlowPrompt(recipe({ subjectMode: 'graphic', primaryStyle: 'jdm-racing-vector' }))
  assert.match(output, /no human figures/)
})

test('dual-style compiler applies secondary style using the selected fusion mode', () => {
  const output = buildFlowPrompt(recipe({ primaryStyle: 'vintage-moto-lineart', secondaryStyle: 'japan-ukiyoe', fusionMode: 'primary-linework' }))
  assert.match(output, /Borrow mainly palette and selected decorative cues from the secondary style/)
  assert.match(output, /Ukiyo-e|woodblock/)
})

test('Bobber Cult V5 remains simple across Flow and Midjourney graphic modes', () => {
  const r = recipe({
    primaryStyle: 'moto-bobber-cult', subjectMode: 'graphic',
    idea: 'a happy cartoon sea sponge transformed into a vintage crew-shirt graphic',
    printMethod: 'dtf', vectorReady: false, colorCountMode: 'auto',
    detailLevel: 'balanced',
  })
  for (const output of [buildFlowPrompt(r), buildMidjourneyPrompt(r)]) {
    assert.match(output, /ONE memorable version|ONE striking visual idea/)
    assert.match(output, /minimal tonal steps/)
    assert.match(output, /do not add gradients|must not add gradients/i)
    assert.doesNotMatch(output, /preserve useful gradients, texture, shading, glow/)
    assert.doesNotMatch(output, /intricate engraved-style interior linework/)
  }
})

test('DTG and DTF do not force raster gradients or complexity on minimal Bobber Cult', () => {
  for (const printMethod of ['dtg', 'dtf']) {
    const output = buildFlowPrompt(recipe({
      primaryStyle: 'moto-bobber-cult', subjectMode: 'reference',
      printMethod, vectorReady: false, detailLevel: 'balanced',
    }))
    assert.match(output, /none of these effects are mandatory/)
    assert.match(output, /(?:do not|must not) add gradients, glow or extra rendering/)
    assert.match(output, /do not add ornamental details just to make it feel premium/)
    assert.match(output, /Final print preparation is handled separately/)
  }
})

test('Markus Manson can keep complex illustrated linework with DTG or DTF', () => {
  for (const printMethod of ['dtg', 'dtf']) {
    const r = recipe({
      primaryStyle: 'metal-manson', subjectMode: 'graphic',
      idea: 'mythic nine-tailed fox', printMethod, vectorReady: false,
      detailLevel: 'intricate', colorCountMode: 'full',
    })
    for (const output of [buildFlowPrompt(r), buildMidjourneyPrompt(r)]) {
      assert.match(output, /controlled high-density directional linework/)
      assert.match(output, /deep structural blacks/)
      assert.match(output, /dense intricate detailing/)
      assert.doesNotMatch(output, /no more than \\d+ printable ink colors/)
    }
  }
})
