import { useMemo, useState } from 'react'
import { STYLE_CATEGORIES, FUSION_MODES } from './data/styles.js'
import {
  SUBJECT_MODES, COMPOSITIONS, EDGE_MODES, PRINT_METHODS, ASPECT_RATIOS,
  GARMENT_COLORS, FLOW_MODELS, MIDJOURNEY_MODELS,
} from './data/presets.js'
import { analyzeRecipe, buildFlowPrompt, buildMidjourneyPrompt, optimizeRecipe } from './prompt/index.js'

const DEFAULT_RECIPE = {
  subjectMode: 'reference',
  idea: '',
  referenceFidelity: 'strict',
  primaryStyle: 'clean-mascot-vector',
  secondaryStyle: 'none',
  fusionMode: 'primary-structure',
  composition: 'centered',
  edge: 'organic',
  printMethod: 'screenprint',
  garmentColor: 'black',
  maxColors: 6,
  vectorReady: true,
  allowGradients: false,
  allowHalftone: false,
  textTop: '',
  textSub: '',
  textBottom: '',
  typographyStyle: '',
  aspectRatio: '3:4',
  mjModel: '8.2',
  raw: true,
  stylize: 100,
  chaos: 0,
  imageWeight: 1.5,
  referenceUrl: '',
  styleReference: '',
  styleWeight: 100,
  useOmniReference: false,
  omniReference: '',
  omniWeight: 100,
  seed: '',
  flowModel: 'nano-banana-2',
}

export default function App() {
  const [recipe, setRecipe] = useState(DEFAULT_RECIPE)
  const [activeOutput, setActiveOutput] = useState('flow')
  const [copied, setCopied] = useState('')

  const set = (key, value) => setRecipe((current) => ({ ...current, [key]: value }))
  const issues = useMemo(() => analyzeRecipe(recipe), [recipe])
  const midjourneyPrompt = useMemo(() => buildMidjourneyPrompt(recipe), [recipe])

  const copy = async (id, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      window.setTimeout(() => setCopied(''), 1800)
    } catch {
      const area = document.createElement('textarea')
      area.value = value
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      document.body.removeChild(area)
      setCopied(id)
      window.setTimeout(() => setCopied(''), 1800)
    }
  }

  const flowModel = FLOW_MODELS.find((item) => item.id === recipe.flowModel) ?? FLOW_MODELS[0]

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Production-aware prompt compiler</p>
          <h1>T-Shirt Prompt Forge <span>v2</span></h1>
          <p className="subhead">One design recipe → two optimized prompts: Midjourney and Flow / Nano Banana 2.</p>
        </div>
        <button className="secondary-button" onClick={() => setRecipe(DEFAULT_RECIPE)}>Reset Recipe</button>
      </header>

      <section className="workspace">
        <div className="controls-column">
          <Panel title="1. Subject & Reference">
            <ButtonGrid items={SUBJECT_MODES} active={recipe.subjectMode} onChange={(value) => set('subjectMode', value)} />
            <Field label="Core concept / subject / action">
              <textarea value={recipe.idea} onChange={(e) => set('idea', e.target.value)} placeholder="Example: fierce tiger riding a vintage cafe racer motorcycle..." rows={3} />
            </Field>
            {(recipe.subjectMode === 'reference' || recipe.subjectMode === 'logo') && (
              <>
                <Field label="Reference fidelity">
                  <select value={recipe.referenceFidelity} onChange={(e) => set('referenceFidelity', e.target.value)}>
                    <option value="strict">Strict</option>
                    <option value="balanced">Balanced</option>
                    <option value="loose">Loose</option>
                  </select>
                </Field>
                <Field label="Midjourney image URL (optional)">
                  <input value={recipe.referenceUrl} onChange={(e) => set('referenceUrl', e.target.value)} placeholder="https://..." />
                </Field>
              </>
            )}
          </Panel>

          <Panel title="2. Style Engine">
            <StylePicker label="Primary style" value={recipe.primaryStyle} onChange={(value) => set('primaryStyle', value)} />
            <Field label="Secondary style">
              <select value={recipe.secondaryStyle} onChange={(e) => set('secondaryStyle', e.target.value)}>
                <option value="none">None</option>
                {STYLE_CATEGORIES.map((category) => (
                  <optgroup key={category.name} label={category.name}>
                    {category.styles.map((style) => <option key={style.id} value={style.id}>{style.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>
            {recipe.secondaryStyle !== 'none' && (
              <Field label="Fusion method">
                <select value={recipe.fusionMode} onChange={(e) => set('fusionMode', e.target.value)}>
                  {FUSION_MODES.map((mode) => <option key={mode.id} value={mode.id}>{mode.label}</option>)}
                </select>
              </Field>
            )}
          </Panel>

          <Panel title="3. Composition & Production">
            <div className="two-col">
              <Field label="Composition">
                <select value={recipe.composition} onChange={(e) => set('composition', e.target.value)}>
                  {COMPOSITIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label="Outer edge">
                <select value={recipe.edge} onChange={(e) => set('edge', e.target.value)}>
                  {EDGE_MODES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label="Print method">
                <select value={recipe.printMethod} onChange={(e) => set('printMethod', e.target.value)}>
                  {PRINT_METHODS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label="Garment color">
                <select value={recipe.garmentColor} onChange={(e) => set('garmentColor', e.target.value)}>
                  {GARMENT_COLORS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label={`Maximum printable colors: ${recipe.maxColors}`}>
                <input type="range" min="1" max="12" value={recipe.maxColors} onChange={(e) => set('maxColors', Number(e.target.value))} />
              </Field>
              <Field label="Aspect ratio">
                <select value={recipe.aspectRatio} onChange={(e) => set('aspectRatio', e.target.value)}>
                  {ASPECT_RATIOS.map((ratio) => <option key={ratio} value={ratio}>{ratio}</option>)}
                </select>
              </Field>
            </div>
            <Toggle label="Vector Ready" checked={recipe.vectorReady} onChange={(value) => set('vectorReady', value)} />
            <Toggle label="Allow Gradients" checked={recipe.allowGradients} onChange={(value) => set('allowGradients', value)} />
            <Toggle label="Allow Halftone" checked={recipe.allowHalftone} onChange={(value) => set('allowHalftone', value)} />
          </Panel>

          <Panel title="4. Typography">
            <div className="two-col">
              <Field label="Top text"><input value={recipe.textTop} onChange={(e) => set('textTop', e.target.value)} placeholder="Exact text" /></Field>
              <Field label="Subtitle"><input value={recipe.textSub} onChange={(e) => set('textSub', e.target.value)} placeholder="Exact text" /></Field>
            </div>
            <Field label="Bottom text"><input value={recipe.textBottom} onChange={(e) => set('textBottom', e.target.value)} placeholder="Exact text" /></Field>
            <Field label="Typography direction"><input value={recipe.typographyStyle} onChange={(e) => set('typographyStyle', e.target.value)} placeholder="Example: condensed italic racing lettering" /></Field>
          </Panel>

          <Panel title="5. Midjourney Controls">
            <div className="two-col">
              <Field label="Model">
                <select value={recipe.mjModel} onChange={(e) => set('mjModel', e.target.value)}>
                  {MIDJOURNEY_MODELS.map((item) => <option key={item.id} value={item.id}>{item.label} — {item.note}</option>)}
                </select>
              </Field>
              <Field label={`Stylize: ${recipe.stylize}`}><input type="range" min="0" max="1000" step="25" value={recipe.stylize} onChange={(e) => set('stylize', Number(e.target.value))} /></Field>
              <Field label={`Chaos: ${recipe.chaos}`}><input type="range" min="0" max="100" step="5" value={recipe.chaos} onChange={(e) => set('chaos', Number(e.target.value))} /></Field>
              <Field label={`Image weight: ${recipe.imageWeight}`}><input type="range" min="0" max="3" step="0.25" value={recipe.imageWeight} onChange={(e) => set('imageWeight', Number(e.target.value))} /></Field>
            </div>
            <Toggle label="Raw Mode" checked={recipe.raw} onChange={(value) => set('raw', value)} />
            <Field label="Style Reference URL / code"><input value={recipe.styleReference} onChange={(e) => set('styleReference', e.target.value)} placeholder="Optional --sref value" /></Field>
            <Field label={`Style weight: ${recipe.styleWeight}`}><input type="range" min="0" max="1000" step="25" value={recipe.styleWeight} onChange={(e) => set('styleWeight', Number(e.target.value))} /></Field>
            <Toggle label="Use Omni Reference (V7 only)" checked={recipe.useOmniReference} onChange={(value) => set('useOmniReference', value)} />
            {recipe.useOmniReference && (
              <div className="two-col">
                <Field label="Omni Reference URL"><input value={recipe.omniReference} onChange={(e) => set('omniReference', e.target.value)} placeholder="https://..." /></Field>
                <Field label={`Omni weight: ${recipe.omniWeight}`}><input type="range" min="1" max="1000" step="25" value={recipe.omniWeight} onChange={(e) => set('omniWeight', Number(e.target.value))} /></Field>
              </div>
            )}
            <Field label="Seed (optional)"><input value={recipe.seed} onChange={(e) => set('seed', e.target.value.replace(/\D/g, ''))} placeholder="Numeric seed" /></Field>
          </Panel>

          <Panel title="6. Flow / Nano Banana">
            <Field label="Flow image model">
              <select value={recipe.flowModel} onChange={(e) => set('flowModel', e.target.value)}>
                {FLOW_MODELS.map((item) => <option key={item.id} value={item.id}>{item.label} — {item.note}</option>)}
              </select>
            </Field>
            <p className="helper">Flow receives a structured natural-language art direction. Aspect ratio and output count stay as Flow UI settings rather than Midjourney-style syntax.</p>
          </Panel>
        </div>

        <aside className="output-column">
          <div className="status-card">
            <div className="status-head">
              <div><p className="eyebrow">Prompt health</p><strong>{issues.length ? `${issues.length} note${issues.length > 1 ? 's' : ''}` : 'No conflicts'}</strong></div>
              {issues.length > 0 && <button className="mini-button" onClick={() => setRecipe(optimizeRecipe(recipe))}>Auto Optimize</button>}
            </div>
            {issues.length > 0 && <div className="issue-list">{issues.map((issue) => <div key={issue.code} className={`issue ${issue.level}`}>{issue.message}</div>)}</div>}
          </div>

          <div className="output-tabs">
            <button className={activeOutput === 'flow' ? 'active' : ''} onClick={() => setActiveOutput('flow')}>Flow / Nano Banana 2</button>
            <button className={activeOutput === 'midjourney' ? 'active' : ''} onClick={() => setActiveOutput('midjourney')}>Midjourney</button>
          </div>

          <PromptCard
            title={activeOutput === 'flow' ? `Flow · ${flowModel.label}` : `Midjourney · ${recipe.mjModel === 'niji-7' ? 'Niji 7' : `V${recipe.mjModel}`}`}
            prompt={activeOutput === 'flow' ? buildFlowPrompt({ ...recipe, flowModelLabel: flowModel.label }) : midjourneyPrompt}
            copied={copied === activeOutput}
            onCopy={() => copy(activeOutput, activeOutput === 'flow' ? buildFlowPrompt({ ...recipe, flowModelLabel: flowModel.label }) : midjourneyPrompt)}
          />

          <div className="comparison-card">
            <p className="eyebrow">Compiler behavior</p>
            <div><strong>Flow</strong><span>Structured instructions, preservation rules, production constraints.</span></div>
            <div><strong>Midjourney</strong><span>Compact visual prompt with supported parameters placed at the end.</span></div>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Panel({ title, children }) {
  return <section className="panel"><h2>{title}</h2><div className="panel-body">{children}</div></section>
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>
}

function ButtonGrid({ items, active, onChange }) {
  return <div className="button-grid">{items.map((item) => <button type="button" key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>{item.label}</button>)}</div>
}

function StylePicker({ label, value, onChange }) {
  return <Field label={label}><select value={value} onChange={(e) => onChange(e.target.value)}>{STYLE_CATEGORIES.map((category) => <optgroup key={category.name} label={category.name}>{category.styles.map((style) => <option key={style.id} value={style.id}>{style.label}</option>)}</optgroup>)}</select></Field>
}

function Toggle({ label, checked, onChange }) {
  return <label className="toggle-row"><span>{label}</span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /></label>
}

function PromptCard({ title, prompt, copied, onCopy }) {
  return <div className="prompt-card"><div className="prompt-head"><div><p className="eyebrow">Generated output</p><h3>{title}</h3></div><span>{prompt.length.toLocaleString()} chars</span></div><pre>{prompt}</pre><button className="copy-button" onClick={onCopy}>{copied ? 'Copied ✓' : 'Copy Prompt'}</button></div>
}
