import { useMemo, useState } from 'react'
import { STYLE_CATEGORIES, STYLE_MAP, FUSION_MODES, V1_STYLE_COUNT } from './data/styles.js'
import {
  SUBJECT_MODES, REFERENCE_FIDELITY, TATTOO_PLACEMENTS,
  COMPOSITIONS, EDGE_MODES, PRINT_METHODS, COLOR_COUNT_MODES,
  COLOR_MODES, TYPOGRAPHY_PRESETS, DETAIL_LEVELS, BACKGROUND_MODES,
  LOGO_INTEGRATIONS, MIX_ELEMENTS, ASPECT_RATIOS, GARMENT_COLORS,
  FLOW_MODELS,
} from './data/presets.js'
import { analyzeRecipe, buildFlowPrompt, optimizeRecipe } from './prompt/index.js'

const DEFAULT_RECIPE = {
  subjectMode: 'reference',
  idea: '',
  referenceFidelity: 'strict',
  tattooPlacement: 'upper-arm',

  primaryStyle: 'vector-bazzier',
  secondaryStyle: 'none',
  fusionMode: 'primary-structure',
  backgroundMode: 'isolated',
  detailLevel: 'balanced',

  mixElements: {
    brutalist: false,
    microText: false,
    autoDecals: false,
    vintage: false,
    minimalist: false,
    glitchArt: false,
    halftoneDots: false,
    y2kTribal: false,
    bikerPatches: false,
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

  textTop: '',
  textSub: '',
  textBottom: '',
  typographyPreset: 'auto',
  typographyStyle: '',
  logoIntegration: 'none',
  logoText: '',

  extraPrompt: '',
  negativePrompt: '',

  flowModel: 'nano-banana-2',
}

export default function App() {
  const [recipe, setRecipe] = useState(DEFAULT_RECIPE)
  const [copied, setCopied] = useState('')
  const [primaryQuery, setPrimaryQuery] = useState('')
  const [secondaryQuery, setSecondaryQuery] = useState('')
  const [styleCategory, setStyleCategory] = useState('all')
  const [advancedStyles, setAdvancedStyles] = useState(false)
  const [activeStep, setActiveStep] = useState('subject')
  const [showAllPanels, setShowAllPanels] = useState(false)
  const [recipeNotice, setRecipeNotice] = useState('')

  const set = (key, value) => setRecipe((current) => ({ ...current, [key]: value }))
  const toggleMix = (id) => setRecipe((current) => ({
    ...current,
    mixElements: { ...current.mixElements, [id]: !current.mixElements[id] },
  }))

  const issues = useMemo(() => analyzeRecipe(recipe), [recipe])
  const flowModel = FLOW_MODELS.find((item) => item.id === recipe.flowModel) ?? FLOW_MODELS[0]
  const flowPrompt = useMemo(
    () => buildFlowPrompt({ ...recipe, flowModelLabel: flowModel.label }),
    [recipe, flowModel.label],
  )

  const primaryStyle = STYLE_MAP[recipe.primaryStyle]
  const secondaryStyle = recipe.secondaryStyle !== 'none' ? STYLE_MAP[recipe.secondaryStyle] : null
  const printMethod = PRINT_METHODS.find((item) => item.id === recipe.printMethod) ?? PRINT_METHODS[0]
  const effectiveColorPolicy = recipe.colorCountMode === 'auto'
    ? printMethod.defaultColorPolicy
    : recipe.colorCountMode
  const showMaxColors = effectiveColorPolicy !== 'full'

  const copy = async (id, value) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const area = document.createElement('textarea')
      area.value = value
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      document.body.removeChild(area)
    }
    setCopied(id)
    window.setTimeout(() => setCopied(''), 1800)
  }

  const exportRecipe = () => {
    const blob = new Blob([JSON.stringify({ format: 'tshirt-prompt-forge-recipe', version: 1, recipe }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'tshirt-forge-recipe.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setRecipeNotice('Recipe exported as JSON.')
  }

  const importRecipe = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 100000) throw new Error('Recipe file is too large.')
      const data = JSON.parse(await file.text())
      if (data?.format !== 'tshirt-prompt-forge-recipe' || data.version !== 1 || !data.recipe || typeof data.recipe !== 'object' || Array.isArray(data.recipe)) throw new Error('Invalid or unsupported recipe format.')
      if (!STYLE_MAP[data.recipe.primaryStyle] || (data.recipe.secondaryStyle !== 'none' && !STYLE_MAP[data.recipe.secondaryStyle])) throw new Error('Recipe contains an unknown style.')
      const clean = Object.fromEntries(Object.keys(DEFAULT_RECIPE).filter((key) => Object.hasOwn(data.recipe, key) && typeof data.recipe[key] === typeof DEFAULT_RECIPE[key]).map((key) => [key, data.recipe[key]]))
      clean.mixElements = { ...DEFAULT_RECIPE.mixElements, ...Object.fromEntries(Object.entries(data.recipe.mixElements || {}).filter(([key, value]) => Object.hasOwn(DEFAULT_RECIPE.mixElements, key) && typeof value === 'boolean')) }
      setRecipe({ ...DEFAULT_RECIPE, ...clean })
      setRecipeNotice('Recipe imported successfully.')
    } catch (error) {
      setRecipeNotice(error instanceof Error ? error.message : 'Unable to import recipe.')
    } finally {
      event.target.value = ''
    }
  }

  const resetRecipe = () => {
    setRecipe(DEFAULT_RECIPE)
    setPrimaryQuery('')
    setSecondaryQuery('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Production-aware prompt compiler</p>
          <h1>T-Shirt Prompt Forge <span>v2</span></h1>
          <p className="subhead">
            {V1_STYLE_COUNT} migrated v1 styles · Screen Print, DTF, DTG · Flow / Nano Banana prompt generator.
          </p>
        </div>
        <div className="topbar-actions">
          <button className="secondary-button" onClick={() => setRecipe(optimizeRecipe(recipe))}>Auto Optimize</button>
          <button className="secondary-button" type="button" onClick={exportRecipe}>Export Recipe</button>
          <label className="secondary-button recipe-import-button">Import Recipe<input type="file" accept=".json,application/json" onChange={importRecipe} /></label>
          <button className="secondary-button" onClick={resetRecipe}>Reset Recipe</button>
        </div>
      </header>

      {recipeNotice && <p className="recipe-notice" role="status">{recipeNotice}</p>}
      <section className="production-strip">
        <ProductionBadge method={recipe.printMethod} />
        <div>
          <strong>{printMethod.label}</strong>
          <span>{productionSummary(recipe.printMethod, recipe.vectorReady, effectiveColorPolicy)}</span>
        </div>
      </section>

      <nav className="forge-step-nav" aria-label="Design workflow">
        {[
          ['subject','01','Subject'],['style','02','Style'],['layout','03','Layout & Type'],
          ['production','04','Print & Color'],['output','05','Prompt & Models'],
        ].map(([id,num,label])=><button key={id} type="button" className={activeStep===id&&!showAllPanels?'active':''} aria-current={activeStep===id&&!showAllPanels?'step':undefined} onClick={()=>{setShowAllPanels(false);setActiveStep(id)}}><span>{num}</span>{label}</button>)}
        <button type="button" className={showAllPanels?'active':''} aria-pressed={showAllPanels} onClick={()=>setShowAllPanels(v=>!v)}>≡ All Controls</button>
      </nav>
      <p className="forge-step-help">Settings stay saved while you switch steps. Choose All Controls for the original full editor.</p>
      <div className="forge-step-progress" aria-label="Workflow progress">
        <span>{showAllPanels ? 'All controls visible' : `Step ${['subject','style','layout','production','output'].indexOf(activeStep) + 1} of 5`}</span>
        <div>
          <button type="button" disabled={showAllPanels || activeStep === 'subject'} onClick={() => setActiveStep((current) => ['subject','style','layout','production','output'][Math.max(0, ['subject','style','layout','production','output'].indexOf(current)-1)])}>← Previous</button>
          <button type="button" disabled={showAllPanels || activeStep === 'output'} onClick={() => setActiveStep((current) => ['subject','style','layout','production','output'][Math.min(4, ['subject','style','layout','production','output'].indexOf(current)+1)])}>Next →</button>
        </div>
      </div>
      <section className="workspace">
        <div className="controls-column">
          <Panel visible={showAllPanels || activeStep === 'subject'} number="1" title="Subject & Reference" description="Choose whether you are creating new artwork, transforming a reference, a logo, graphic-only art, or tattoo artwork.">
            <ButtonGrid items={SUBJECT_MODES} active={recipe.subjectMode} onChange={(value) => set('subjectMode', value)} />

            <Field label="Core concept / subject / action">
              <textarea
                value={recipe.idea}
                onChange={(e) => set('idea', e.target.value)}
                placeholder="Example: fierce tiger riding a vintage cafe racer motorcycle, viewed from a low angle..."
                rows={4}
              />
            </Field>

            {['reference', 'logo'].includes(recipe.subjectMode) && (
              <Field label="Reference fidelity">
                <select value={recipe.referenceFidelity} onChange={(e) => set('referenceFidelity', e.target.value)}>
                  {REFERENCE_FIDELITY.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
            )}
            {['reference', 'logo'].includes(recipe.subjectMode) && (
              <p className="helper">Attach your source image directly in Flow as a reference/ingredient. No image URL is needed in this editor.</p>
            )}

            {recipe.subjectMode === 'tattoo' && (
              <Field label="Tattoo placement">
                <select value={recipe.tattooPlacement} onChange={(e) => set('tattooPlacement', e.target.value)}>
                  {TATTOO_PLACEMENTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
            )}
          </Panel>

          <Panel visible={showAllPanels || activeStep === 'style'} number="2" title="Style Engine" description="All original v1 style IDs are available. Mix a secondary style only when it adds something useful.">
            <StyleGallery
              value={recipe.primaryStyle}
              onChange={(value) => set('primaryStyle', value)}
              query={primaryQuery}
              onQueryChange={setPrimaryQuery}
              category={styleCategory}
              onCategoryChange={setStyleCategory}
            />
            <StyleInfo style={primaryStyle} role="Primary" />
            <button type="button" className="advanced-style-toggle" aria-expanded={advancedStyles} onClick={() => setAdvancedStyles((current) => !current)}>
              {advancedStyles ? '− Hide' : '+ Show'} secondary style & fusion settings
            </button>
            {advancedStyles && (
              <div className="advanced-style-content">
                <StylePicker
                  label="Secondary style"
                  value={recipe.secondaryStyle}
                  onChange={(value) => set('secondaryStyle', value)}
                  query={secondaryQuery}
                  onQueryChange={setSecondaryQuery}
                  allowNone
                />
                {secondaryStyle && (
                  <>
                    <StyleInfo style={secondaryStyle} role="Secondary" />
                    <Field label="Fusion method">
                      <select value={recipe.fusionMode} onChange={(e) => set('fusionMode', e.target.value)}>
                        {FUSION_MODES.map((mode) => <option key={mode.id} value={mode.id}>{mode.label}</option>)}
                      </select>
                    </Field>
                  </>
                )}
              </div>
            )}

            <div className="two-col">
              <Field label="Detail density">
                <select value={recipe.detailLevel} onChange={(e) => set('detailLevel', e.target.value)}>
                  {DETAIL_LEVELS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label="Background treatment">
                <select value={recipe.backgroundMode} onChange={(e) => set('backgroundMode', e.target.value)}>
                  {BACKGROUND_MODES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel visible={showAllPanels || activeStep === 'style'} number="3" title="Mix & Match Elements" description="The original v1 mix switches are preserved, but now compile into explicit visual instructions.">
            <div className="chip-grid">
              {MIX_ELEMENTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${recipe.mixElements[item.id] ? 'active' : ''}`}
                  onClick={() => toggleMix(item.id)}
                >
                  <span>{recipe.mixElements[item.id] ? '✓' : '+'}</span>{item.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel visible={showAllPanels || activeStep === 'layout'} number="4" title="Composition & Placement" description="Define the artwork layout, outer contour and aspect ratio.">
            <div className="three-col">
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
              <Field label="Aspect ratio">
                <select value={recipe.aspectRatio} onChange={(e) => set('aspectRatio', e.target.value)}>
                  {ASPECT_RATIOS.map((ratio) => <option key={ratio} value={ratio}>{ratio}</option>)}
                </select>
              </Field>
            </div>

          </Panel>

          <Panel visible={showAllPanels || activeStep === 'production'} number="4b" title="Print & Color Engineering" description="Production rules adapt to Screen Print, DTF or DTG; no print settings are removed.">
            <div className="two-col">
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
            </div>

            <div className="two-col">
              <Field label="Color count policy">
                <select value={recipe.colorCountMode} onChange={(e) => set('colorCountMode', e.target.value)}>
                  {COLOR_COUNT_MODES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label="Color direction">
                <select value={recipe.colorMode} onChange={(e) => set('colorMode', e.target.value)}>
                  {COLOR_MODES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
            </div>

            <p className="helper production-helper">
              {effectiveColorPolicy === 'full'
                ? `${printMethod.label} is currently full-color: the compiler may preserve gradients, rich shading, glow, texture, and complex color transitions.`
                : `Limited-palette mode is active. The maximum-color control below becomes a deliberate creative/production constraint.`}
            </p>

            {showMaxColors && (
              <Field label={`Maximum colors: ${recipe.maxColors}`}>
                <input type="range" min="1" max="12" value={recipe.maxColors} onChange={(e) => set('maxColors', Number(e.target.value))} />
              </Field>
            )}

            {recipe.colorMode === 'manual' && (
              <Field label="Manual palette — comma separated color names or HEX">
                <input value={recipe.paletteInput} onChange={(e) => set('paletteInput', e.target.value)} placeholder="#111111, #f4efe2, dark red, muted gold..." />
              </Field>
            )}

            <div className="toggle-grid">
              <Toggle label="Use garment as negative space" checked={recipe.useGarmentNegativeSpace} onChange={(value) => set('useGarmentNegativeSpace', value)} />
              <Toggle label="Vector Ready" checked={recipe.vectorReady} onChange={(value) => set('vectorReady', value)} />
              <Toggle label="Allow Gradients" checked={recipe.allowGradients} onChange={(value) => set('allowGradients', value)} />
              <Toggle label="Allow Halftone" checked={recipe.allowHalftone} onChange={(value) => set('allowHalftone', value)} />
            </div>
          </Panel>

          <Panel visible={showAllPanels || activeStep === 'layout'} number="5" title="Typography & Logo Integration" description="Readable text is compiled separately from decorative micro-text, preventing the old v1 text contradictions.">
            <div className="three-col">
              <Field label="Top text"><input value={recipe.textTop} onChange={(e) => set('textTop', e.target.value)} placeholder="Exact text" /></Field>
              <Field label="Subtitle"><input value={recipe.textSub} onChange={(e) => set('textSub', e.target.value)} placeholder="Exact text" /></Field>
              <Field label="Bottom text"><input value={recipe.textBottom} onChange={(e) => set('textBottom', e.target.value)} placeholder="Exact text" /></Field>
            </div>

            <div className="two-col">
              <Field label="Typography preset">
                <select value={recipe.typographyPreset} onChange={(e) => set('typographyPreset', e.target.value)}>
                  {TYPOGRAPHY_PRESETS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label="Logo integration">
                <select value={recipe.logoIntegration} onChange={(e) => set('logoIntegration', e.target.value)}>
                  {LOGO_INTEGRATIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Custom typography direction">
              <input value={recipe.typographyStyle} onChange={(e) => set('typographyStyle', e.target.value)} placeholder="Example: condensed italic racing lettering with wide tracking" />
            </Field>

            {recipe.logoIntegration !== 'none' && (
              <div className="two-col">
                <Field label="Logo / wordmark text">
                  <input value={recipe.logoText} onChange={(e) => set('logoText', e.target.value)} placeholder="Optional exact brand name" />
                </Field>
                {recipe.logoIntegration === 'image' && (
                  <p className="helper">Attach the secondary logo image directly in Flow as an additional reference/ingredient.</p>
                )}
              </div>
            )}
          </Panel>

          <Panel visible={showAllPanels || activeStep === 'output'} number="6" title="Extra Prompt Shaping" description="Use these only for details not already covered by the structured recipe.">
            <Field label="Extra direction / emphasis">
              <textarea
                value={recipe.extraPrompt}
                onChange={(e) => set('extraPrompt', e.target.value)}
                placeholder="Example: keep the motorcycle unmistakably a 1970s cafe racer, emphasize the tiger's paws on the handlebars..."
                rows={3}
              />
            </Field>
            <Field label="Avoid / negative direction">
              <textarea
                value={recipe.negativePrompt}
                onChange={(e) => set('negativePrompt', e.target.value)}
                placeholder="Example: weak silhouette, unreadable main title, washed-out colors..."
                rows={3}
              />
            </Field>
          </Panel>

          <Panel visible={showAllPanels || activeStep === 'output'} number="7" title="Flow / Nano Banana" description="Generate structured natural-language prompts for Flow and Nano Banana models.">
            <Field label="Flow image model">
              <select value={recipe.flowModel} onChange={(e) => set('flowModel', e.target.value)}>
                {FLOW_MODELS.map((item) => <option key={item.id} value={item.id}>{item.label} — {item.note}</option>)}
              </select>
            </Field>
            <p className="helper">Set aspect ratio in the Flow UI. When transforming an image, attach the reference/ingredient there; the generated prompt tells Flow what to preserve.</p>
          </Panel>
        </div>

        <aside className="output-column">
          <div className="status-card">
            <div className="status-head">
              <div>
                <p className="eyebrow">Prompt health</p>
                <strong>{issues.length ? `${issues.length} note${issues.length > 1 ? 's' : ''}` : 'No conflicts'}</strong>
              </div>
              {issues.length > 0 && <button className="mini-button" onClick={() => setRecipe(optimizeRecipe(recipe))}>Auto Optimize</button>}
            </div>
            {issues.length > 0 && (
              <div className="issue-list">
                {issues.map((issue) => <div key={issue.code} className={`issue ${issue.level}`}>{issue.message}</div>)}
              </div>
            )}
          </div>

          <RecipeSummary recipe={recipe} primaryStyle={primaryStyle} secondaryStyle={secondaryStyle} printMethod={printMethod} effectiveColorPolicy={effectiveColorPolicy} />

          <PromptCard
            title={`Flow · ${flowModel.label}`}
            prompt={flowPrompt}
            copied={copied === 'flow'}
            onCopy={() => copy('flow', flowPrompt)}
          />

          <div className="comparison-card">
            <p className="eyebrow">Flow prompt is live</p>
            <div><strong>{flowModel.label}</strong><span>{flowPrompt.length.toLocaleString()} chars · structured art direction, subject preservation and style controls.</span></div>
            <div className="quick-copy-row">
              <button className="mini-button" onClick={() => copy('flow-quick', flowPrompt)}>{copied === 'flow-quick' ? 'Prompt Copied ✓' : 'Copy Prompt'}</button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Panel({ number, title, description, children, visible = true }) {
  if (!visible) return null
  return (
    <section className="panel">
      <div className="panel-heading">
        <span className="panel-number">{number}</span>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  )
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>
}

function ButtonGrid({ items, active, onChange }) {
  return (
    <div className="button-grid subject-grid">
      {items.map((item) => (
        <button type="button" key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)} title={item.desc || item.label}>
          <strong>{item.label}</strong>
          {item.desc && <small>{item.desc}</small>}
        </button>
      ))}
    </div>
  )
}

function StyleGallery({ value, onChange, query, onQueryChange, category, onCategoryChange }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tshirt-forge-style-favorites') || '[]')
      return Array.isArray(stored) ? stored.filter((id) => typeof id === 'string' && Boolean(STYLE_MAP[id])) : []
    } catch {
      return []
    }
  })
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [exampleIndexes, setExampleIndexes] = useState({})
  const [showExampleGallery, setShowExampleGallery] = useState(false)
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = STYLE_CATEGORIES.flatMap((group) =>
    group.styles.filter((style) =>
      (category === 'all' || group.name === category) &&
      (!favoritesOnly || favorites.includes(style.id)) &&
      (!normalizedQuery || [style.label, style.id, group.name, style.prompt, style.shortDescription].some((part) => (part || '').toLowerCase().includes(normalizedQuery)))
    )
  )
  const selectedStyle = STYLE_MAP[value]
  const toggleFavorite = (id) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      try { localStorage.setItem('tshirt-forge-style-favorites', JSON.stringify(next)) } catch { /* Storage may be unavailable. */ }
      return next
    })
  }
  return (
    <div className="style-gallery">
      <div className="style-gallery-heading">
        <div><strong>Explore {V1_STYLE_COUNT} visual styles</strong><p>Choose a style by its visual characteristics. Examples can be added later without changing prompts.</p></div>
        <span>{filtered.length} styles</span>
      </div>
      <input aria-label="Search visual styles" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search e.g. racing, halftone, geometry..." />
      <div className="style-category-tabs" role="group" aria-label="Filter style category">
        <button type="button" aria-pressed={category === 'all'} className={category === 'all' ? 'active' : ''} onClick={() => onCategoryChange('all')}>All</button>
        {STYLE_CATEGORIES.map((group) => <button type="button" key={group.name} aria-pressed={category === group.name} className={category === group.name ? 'active' : ''} onClick={() => onCategoryChange(group.name)}>{group.name}</button>)}
      </div>
      <label className="style-favorites-filter"><input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} /> ★ Favorites only ({favorites.length})</label>
      <div className="style-gallery-grid">
        {filtered.map((style) => (
          <div key={style.id} className={value === style.id ? 'style-tile active' : 'style-tile'}>
            <button type="button" className="style-tile-select" aria-pressed={value === style.id} onClick={() => onChange(style.id)}>
              <span className="style-tile-visual" aria-hidden="true">{style.examples?.length ? <img src={style.examples[exampleIndexes[style.id] || 0]} alt="" loading="lazy" /> : <span className="style-tile-placeholder"><span>✳</span><small>Example coming soon</small></span>}</span>
              <strong>{style.label}</strong>
              <small>{style.category}</small>
              <span className="style-tile-description">{style.shortDescription || describeStyle(style)}</span>
              <span className="style-tile-score">Vector {style.vectorScore ?? 3}/5 · Text {style.textAffinity ?? 'medium'}</span>
            </button>
            {style.examples?.length > 1 && <div className="style-example-controls" aria-label={`Examples for ${style.label}`}>
              <button type="button" aria-label={`Previous example for ${style.label}`} onClick={() => setExampleIndexes((current) => ({ ...current, [style.id]: ((current[style.id] || 0) - 1 + style.examples.length) % style.examples.length }))}>‹</button>
              <span>{(exampleIndexes[style.id] || 0) + 1}/{style.examples.length}</span>
              <button type="button" aria-label={`Next example for ${style.label}`} onClick={() => setExampleIndexes((current) => ({ ...current, [style.id]: ((current[style.id] || 0) + 1) % style.examples.length }))}>›</button>
            </div>}
            <button type="button" className="style-favorite-button" aria-label={favorites.includes(style.id) ? `Remove ${style.label} from favorites` : `Add ${style.label} to favorites`} aria-pressed={favorites.includes(style.id)} onClick={() => toggleFavorite(style.id)}>{favorites.includes(style.id) ? '★' : '☆'}</button>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="helper">No matching styles. Try another search, category, or turn off Favorites only.</p>}
      {selectedStyle && <div className="style-selected-detail" aria-live="polite">
        <strong>Selected: {selectedStyle.label}</strong>
        <p>{selectedStyle.shortDescription || describeStyle(selectedStyle)}</p>
        <div className="style-detail-tags"><span>Vector suitability: {selectedStyle.vectorScore ?? 3}/5</span><span>Typography affinity: {selectedStyle.textAffinity ?? 'medium'}</span></div>
        {selectedStyle.rules?.length > 0 && <p><b>Visual rules:</b> {selectedStyle.rules.join(' ')}</p>}
        {selectedStyle.examples?.length > 0 && <>
          <button type="button" className="style-examples-toggle" aria-expanded={showExampleGallery} onClick={() => setShowExampleGallery((current) => !current)}>{showExampleGallery ? 'Hide' : 'View'} example gallery ({selectedStyle.examples.length})</button>
          {showExampleGallery && <div className="style-example-gallery">{selectedStyle.examples.map((src, index) => <figure key={src + index}><img src={src} alt={`${selectedStyle.label} visual example ${index + 1}`} loading="lazy" /><figcaption>Example {index + 1}</figcaption></figure>)}</div>}
        </>}
        <small>Examples are for style discovery only; they are not automatically sent to image-generation models.</small>
      </div>}
    </div>
  )
}

function describeStyle(style) {
  const source = style.graphicPrompt || style.prompt || ''
  const sentence = source.split(/[.!?]/)[0].trim()
  if (!sentence) return 'Art direction preset for apparel graphics.'
  return sentence.length > 165 ? sentence.slice(0, 162).trimEnd() + '…' : sentence
}

function StylePicker({ label, value, onChange, query, onQueryChange, allowNone = false }) {
  const normalizedQuery = query.trim().toLowerCase()
  const filteredCategories = STYLE_CATEGORIES
    .map((category) => ({
      ...category,
      styles: category.styles.filter((style) => !normalizedQuery || `${style.label} ${style.id}`.toLowerCase().includes(normalizedQuery)),
    }))
    .filter((category) => category.styles.length)

  return (
    <div className="style-picker">
      <Field label={`${label} · ${STYLE_CATEGORIES.reduce((count, category) => count + category.styles.length, 0)} presets`}>
        <input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Filter style by name..." />
      </Field>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {allowNone && <option value="none">None</option>}
        {filteredCategories.map((category) => (
          <optgroup key={category.name} label={category.name}>
            {category.styles.map((style) => <option key={style.id} value={style.id}>{style.label}</option>)}
          </optgroup>
        ))}
      </select>
      {filteredCategories.length === 0 && <p className="helper">No style matches “{query}”. Clear the filter to see all styles.</p>}
    </div>
  )
}

function StyleInfo({ style, role }) {
  if (!style) return null
  return (
    <div className="style-info">
      <div>
        <span className="style-role">{role}</span>
        <strong>{style.label}</strong>
      </div>
      <div className="style-tags">
        <span>Vector {style.vectorScore ?? 3}/5</span>
        <span>Text {style.textAffinity ?? 'medium'}</span>
        {style.legacyV1 !== false && <span>v1 migrated</span>}
      </div>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}

function ProductionBadge({ method }) {
  const label = method === 'dtg' ? 'DTG' : method === 'dtf' ? 'DTF' : method === 'screenprint' ? 'SP' : method === 'embroidery-look' ? 'FX' : 'ART'
  return <span className={`production-badge ${method}`}>{label}</span>
}

function RecipeSummary({ recipe, primaryStyle, secondaryStyle, printMethod, effectiveColorPolicy }) {
  return (
    <div className="summary-card">
      <p className="eyebrow">Current recipe</p>
      <div className="summary-grid">
        <SummaryItem label="Primary" value={primaryStyle?.label || recipe.primaryStyle} />
        <SummaryItem label="Secondary" value={secondaryStyle?.label || 'None'} />
        <SummaryItem label="Production" value={printMethod.label} />
        <SummaryItem label="Color" value={effectiveColorPolicy === 'full' ? 'Full color' : `≤ ${recipe.maxColors} colors`} />
        <SummaryItem label="Vector" value={recipe.vectorReady ? 'Ready' : 'Optional / Raster'} />
        <SummaryItem label="Canvas" value={recipe.aspectRatio} />
      </div>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}

function PromptCard({ title, prompt, copied, onCopy }) {
  return (
    <div className="prompt-card">
      <div className="prompt-head">
        <div><p className="eyebrow">Generated output</p><h3>{title}</h3></div>
        <span>{prompt.length.toLocaleString()} chars</span>
      </div>
      <pre>{prompt}</pre>
      <button className="copy-button" onClick={onCopy}>{copied ? 'Copied ✓' : 'Copy Prompt'}</button>
    </div>
  )
}

function productionSummary(method, vectorReady, colorPolicy) {
  if (method === 'dtg') return vectorReady ? 'Full-color DTG with Vector Ready intentionally enabled.' : 'Full-color raster: gradients, fine shading, texture, glow and complex detail are allowed.'
  if (method === 'dtf') return vectorReady ? 'Full-color DTF with vector-style simplification intentionally enabled.' : 'Full-color raster: rich gradients and complex rendering are allowed; keep outer edges clean.'
  if (method === 'screenprint') return colorPolicy === 'full' ? 'Screen Print selected; full-color mode is unusual, so review production manually.' : 'Spot-color separations with a controlled printable palette.'
  if (method === 'embroidery-look') return 'Raster artwork that imitates embroidery texture and stitch direction.'
  return 'Flat tattoo-ready artwork; no photographed skin or body mockup.'
}
