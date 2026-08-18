import { useMemo, useState } from 'react'
import { BENCHMARKS, VISUAL_SCORE_CRITERIA } from './data/benchmarks.js'
import { analyzeRecipe, buildFlowPrompt, buildMidjourneyPrompt } from './prompt/index.js'
import './benchmark.css'

const STORAGE_KEY = 'tpf-v2-visual-benchmark-scores'

function readStoredScores() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export default function BenchmarkLab() {
  const [benchmarkId, setBenchmarkId] = useState(BENCHMARKS[0].id)
  const [engine, setEngine] = useState('flow')
  const [scores, setScores] = useState(readStoredScores)
  const [copied, setCopied] = useState('')
  const [notes, setNotes] = useState('')

  const benchmark = BENCHMARKS.find((item) => item.id === benchmarkId) ?? BENCHMARKS[0]
  const issues = useMemo(() => analyzeRecipe(benchmark.recipe), [benchmark])
  const flowPrompt = useMemo(
    () => buildFlowPrompt({ ...benchmark.recipe, flowModelLabel: 'Nano Banana 2' }),
    [benchmark],
  )
  const mjPrompt = useMemo(() => buildMidjourneyPrompt(benchmark.recipe), [benchmark])
  const prompt = engine === 'flow' ? flowPrompt : mjPrompt
  const activeScores = scores[benchmark.id]?.[engine] || {}
  const numericScores = VISUAL_SCORE_CRITERIA.map((criterion) => Number(activeScores[criterion.id] || 0)).filter(Boolean)
  const total = numericScores.reduce((sum, value) => sum + value, 0)
  const completed = numericScores.length
  const maxTotal = VISUAL_SCORE_CRITERIA.length * 5

  const storeScores = (next) => {
    setScores(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Local storage is an optional convenience only.
    }
  }

  const setScore = (criterionId, value) => {
    const next = {
      ...scores,
      [benchmark.id]: {
        ...(scores[benchmark.id] || {}),
        [engine]: {
          ...(scores[benchmark.id]?.[engine] || {}),
          [criterionId]: Number(value),
        },
      },
    }
    storeScores(next)
  }

  const resetCurrentScores = () => {
    const benchmarkScores = { ...(scores[benchmark.id] || {}) }
    delete benchmarkScores[engine]
    const next = { ...scores, [benchmark.id]: benchmarkScores }
    storeScores(next)
  }

  const copyText = async (id, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      window.setTimeout(() => setCopied(''), 1500)
    } catch {
      setCopied('')
    }
  }

  const exportSummary = () => {
    const scoreLines = VISUAL_SCORE_CRITERIA.map((criterion) => `${criterion.label}: ${activeScores[criterion.id] || '-'} / 5`)
    const summary = [
      `T-Shirt Prompt Forge v2 — Phase D Visual Benchmark`,
      `Benchmark: ${benchmark.title}`,
      `Engine: ${engine === 'flow' ? 'Flow / Nano Banana 2' : 'Midjourney'}`,
      `Score: ${total} / ${maxTotal} (${completed}/${VISUAL_SCORE_CRITERIA.length} criteria completed)`,
      '',
      ...scoreLines,
      '',
      `Expected: ${benchmark.expected}`,
      `Notes: ${notes || '-'}`,
    ].join('\n')
    copyText('summary', summary)
  }

  return (
    <main className="benchmark-shell">
      <header className="benchmark-header">
        <div>
          <p className="benchmark-eyebrow">Phase D · Real-world visual QA</p>
          <h1>Visual Benchmark Lab</h1>
          <p>Run the same recipe in Flow and Midjourney, then score the visual result with one consistent production rubric.</p>
        </div>
        <a className="benchmark-back" href={window.location.pathname}>Back to Prompt Forge</a>
      </header>

      <section className="benchmark-toolbar">
        <label>
          <span>Benchmark recipe</span>
          <select value={benchmark.id} onChange={(event) => { setBenchmarkId(event.target.value); setNotes('') }}>
            {BENCHMARKS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
        <div className="benchmark-engine-tabs">
          <button className={engine === 'flow' ? 'active' : ''} onClick={() => setEngine('flow')}>Flow / Nano Banana 2</button>
          <button className={engine === 'midjourney' ? 'active' : ''} onClick={() => setEngine('midjourney')}>Midjourney</button>
        </div>
      </section>

      <section className="benchmark-overview">
        <div>
          <p className="benchmark-kicker">{benchmark.group}</p>
          <h2>{benchmark.title}</h2>
          <p>{benchmark.purpose}</p>
        </div>
        <div className="benchmark-expected">
          <strong>Visual expectation</strong>
          <span>{benchmark.expected}</span>
        </div>
      </section>

      {benchmark.requiresInput.length > 0 && (
        <section className="benchmark-input-warning">
          <strong>Manual input required before visual testing</strong>
          {benchmark.requiresInput.map((item) => <span key={item}>{item}</span>)}
        </section>
      )}

      <section className="benchmark-grid">
        <div className="benchmark-left">
          <section className="benchmark-card">
            <div className="benchmark-card-head">
              <div>
                <p className="benchmark-eyebrow">Generated prompt</p>
                <h3>{engine === 'flow' ? 'Flow / Nano Banana 2' : 'Midjourney V8.2'}</h3>
              </div>
              <button onClick={() => copyText('prompt', prompt)}>{copied === 'prompt' ? 'Copied ✓' : 'Copy Prompt'}</button>
            </div>
            <pre className="benchmark-prompt">{prompt}</pre>
          </section>

          <section className="benchmark-card">
            <div className="benchmark-card-head">
              <div>
                <p className="benchmark-eyebrow">Prompt health</p>
                <h3>{issues.length ? `${issues.length} notes` : 'No notes'}</h3>
              </div>
            </div>
            {issues.length === 0 ? (
              <p className="benchmark-clean">No compatibility notes for this benchmark.</p>
            ) : (
              <div className="benchmark-issues">
                {issues.map((issue) => <div key={issue.code} className={`benchmark-issue ${issue.level}`}><strong>{issue.code}</strong><span>{issue.message}</span></div>)}
              </div>
            )}
          </section>

          <section className="benchmark-card benchmark-recipe-card">
            <p className="benchmark-eyebrow">Recipe snapshot</p>
            <dl>
              <div><dt>Style</dt><dd>{benchmark.recipe.primaryStyle}{benchmark.recipe.secondaryStyle !== 'none' ? ` + ${benchmark.recipe.secondaryStyle}` : ''}</dd></div>
              <div><dt>Print</dt><dd>{benchmark.recipe.printMethod.toUpperCase()}</dd></div>
              <div><dt>Color policy</dt><dd>{benchmark.recipe.colorCountMode}{benchmark.recipe.colorCountMode === 'limited' ? ` · max ${benchmark.recipe.maxColors}` : ''}</dd></div>
              <div><dt>Vector Ready</dt><dd>{benchmark.recipe.vectorReady ? 'On' : 'Off'}</dd></div>
              <div><dt>Gradients</dt><dd>{benchmark.recipe.allowGradients ? 'Allowed' : 'Off'}</dd></div>
              <div><dt>Aspect ratio</dt><dd>{benchmark.recipe.aspectRatio}</dd></div>
            </dl>
          </section>
        </div>

        <aside className="benchmark-score-card">
          <div className="benchmark-score-head">
            <div>
              <p className="benchmark-eyebrow">Visual score</p>
              <h3>{total} / {maxTotal}</h3>
              <span>{completed} of {VISUAL_SCORE_CRITERIA.length} criteria scored</span>
            </div>
            <button onClick={resetCurrentScores}>Reset</button>
          </div>

          <div className="benchmark-score-list">
            {VISUAL_SCORE_CRITERIA.map((criterion) => (
              <label key={criterion.id} className="benchmark-score-row">
                <span><strong>{criterion.label}</strong><small>{criterion.description}</small></span>
                <select value={activeScores[criterion.id] || ''} onChange={(event) => setScore(criterion.id, event.target.value)}>
                  <option value="">—</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
            ))}
          </div>

          <label className="benchmark-notes">
            <span>Visual notes</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} placeholder="Example: Flow preserved the face better; MJ had stronger typography but added an unwanted background..." />
          </label>

          <button className="benchmark-export" onClick={exportSummary}>{copied === 'summary' ? 'Summary Copied ✓' : 'Copy Score Summary'}</button>
          <p className="benchmark-threshold">Suggested gate: 32–40 pass · 28–31 review · below 28 needs prompt tuning.</p>
        </aside>
      </section>
    </main>
  )
}
