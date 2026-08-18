import test from 'node:test'
import assert from 'node:assert/strict'
import { BENCHMARKS, VISUAL_SCORE_CRITERIA } from '../src/data/benchmarks.js'
import { analyzeRecipe, buildFlowPrompt, buildMidjourneyPrompt } from '../src/prompt/index.js'

const issueErrors = (recipe) => analyzeRecipe(recipe).filter((issue) => issue.level === 'error')

test('Phase D ships twelve unique visual benchmark recipes', () => {
  assert.equal(BENCHMARKS.length, 12)
  assert.equal(new Set(BENCHMARKS.map((item) => item.id)).size, 12)
  assert.equal(VISUAL_SCORE_CRITERIA.length, 8)
})

test('every benchmark has purpose, visual expectation, and input metadata', () => {
  for (const benchmark of BENCHMARKS) {
    assert.ok(benchmark.title.length > 5, benchmark.id)
    assert.ok(benchmark.purpose.length > 20, benchmark.id)
    assert.ok(benchmark.expected.length > 20, benchmark.id)
    assert.ok(Array.isArray(benchmark.requiresInput), benchmark.id)
  }
})

test('all Phase D recipes compile for Flow and Midjourney without hard compatibility errors', () => {
  for (const benchmark of BENCHMARKS) {
    const flow = buildFlowPrompt({ ...benchmark.recipe, flowModelLabel: 'Nano Banana 2' })
    const mj = buildMidjourneyPrompt(benchmark.recipe)
    assert.ok(flow.length > 300, `Flow too short: ${benchmark.id}`)
    assert.ok(mj.length > 150, `MJ too short: ${benchmark.id}`)
    assert.deepEqual(issueErrors(benchmark.recipe), [], `Hard compatibility error: ${benchmark.id}`)
  }
})

test('Flow benchmark prompts never contain Midjourney parameter syntax', () => {
  for (const benchmark of BENCHMARKS) {
    const flow = buildFlowPrompt({ ...benchmark.recipe, flowModelLabel: 'Nano Banana 2' })
    assert.doesNotMatch(flow, /--ar|--raw|--sref|--oref|--seed|--v\s/, benchmark.id)
  }
})

test('Midjourney benchmark prompts finish with a supported model parameter', () => {
  for (const benchmark of BENCHMARKS) {
    const mj = buildMidjourneyPrompt(benchmark.recipe)
    assert.match(mj, /--(?:v 8\.2|v 8\.1|v 7|niji 7)$/, benchmark.id)
  }
})

test('benchmark matrix covers Screen Print, DTF, DTG, Tattoo, Reference, Logo, and Dual Style', () => {
  const methods = new Set(BENCHMARKS.map((item) => item.recipe.printMethod))
  assert.ok(methods.has('screenprint'))
  assert.ok(methods.has('dtf'))
  assert.ok(methods.has('dtg'))
  assert.ok(methods.has('tattoo-flash'))
  assert.ok(BENCHMARKS.some((item) => item.recipe.subjectMode === 'reference'))
  assert.ok(BENCHMARKS.some((item) => item.recipe.subjectMode === 'logo'))
  assert.ok(BENCHMARKS.some((item) => item.recipe.secondaryStyle !== 'none'))
})

test('benchmark matrix deliberately covers both vector-friendly and rich raster output', () => {
  assert.ok(BENCHMARKS.some((item) => item.recipe.vectorReady))
  assert.ok(BENCHMARKS.some((item) => !item.recipe.vectorReady))
  assert.ok(BENCHMARKS.some((item) => item.recipe.allowGradients))
  assert.ok(BENCHMARKS.some((item) => !item.recipe.allowGradients))
  assert.ok(BENCHMARKS.some((item) => item.recipe.colorCountMode === 'limited'))
  assert.ok(BENCHMARKS.some((item) => item.recipe.colorCountMode === 'full'))
})

test('reference-dependent visual benchmarks explicitly tell the tester to provide input', () => {
  const referenceCases = BENCHMARKS.filter((item) => ['reference', 'logo'].includes(item.recipe.subjectMode))
  assert.ok(referenceCases.length >= 2)
  for (const benchmark of referenceCases) {
    assert.ok(benchmark.requiresInput.length > 0, benchmark.id)
  }
})

test('Screen Print benchmarks compile spot-color language and raster benchmarks compile full-color language', () => {
  const screenprint = BENCHMARKS.find((item) => item.id === 'screenprint-mascot-6c')
  const dtf = BENCHMARKS.find((item) => item.id === 'dtf-storybook-painterly')
  const dtg = BENCHMARKS.find((item) => item.id === 'dtg-surreal-fullcolor')

  assert.match(buildFlowPrompt(screenprint.recipe), /spot-color screen-print production/)
  assert.match(buildFlowPrompt(dtf.recipe), /full-color DTF raster artwork/)
  assert.match(buildFlowPrompt(dtg.recipe), /full-color DTG raster artwork/)
})

test('Typography-heavy benchmark keeps exact requested wording in Midjourney output', () => {
  const benchmark = BENCHMARKS.find((item) => item.id === 'technical-typography-limited')
  const mj = buildMidjourneyPrompt(benchmark.recipe)
  assert.match(mj, /"TURBO SYSTEM"/)
  assert.match(mj, /"UNIT 04 \/ HIGH BOOST"/)
  assert.match(mj, /"ENGINEERING DIVISION"/)
})
