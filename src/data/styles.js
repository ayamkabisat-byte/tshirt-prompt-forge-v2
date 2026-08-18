import streetwear, { categoryName as streetwearName } from './styles/streetwear.js'
import heritage, { categoryName as heritageName } from './styles/heritage.js'
import posters, { categoryName as postersName } from './styles/posters.js'
import mascot, { categoryName as mascotName } from './styles/mascot.js'
import anime, { categoryName as animeName } from './styles/anime.js'
import pop, { categoryName as popName } from './styles/pop.js'
import fine, { categoryName as fineName } from './styles/fine.js'
import graphic, { categoryName as graphicName } from './styles/graphic.js'

export const STYLE_CATEGORIES = [
  { name: streetwearName, styles: streetwear },
  { name: heritageName, styles: heritage },
  { name: postersName, styles: posters },
  { name: mascotName, styles: mascot },
  { name: animeName, styles: anime },
  { name: popName, styles: pop },
  { name: fineName, styles: fine },
  { name: graphicName, styles: graphic },
]

const STYLE_LIST = STYLE_CATEGORIES.flatMap((category) => category.styles)
const BASE_STYLE_MAP = Object.fromEntries(STYLE_LIST.map((style) => [style.id, style]))

export const STYLE_ALIASES = {
  'clean-mascot-vector': 'vector-bazzier',
  'ukiyoe': 'japan-ukiyoe',
  'irezumi': 'tattoo-irezumi',
  'banknote-engraving': 'banknote',
  'rubber-hose': 'retro-rubberhose',
  'shonen-anime': 'anime-shonen',
  'brutalist-collage': 'mixed-collage',
}

export const STYLE_MAP = {
  ...BASE_STYLE_MAP,
  ...Object.fromEntries(Object.entries(STYLE_ALIASES).map(([alias, target]) => [alias, BASE_STYLE_MAP[target]])),
}

export const V1_STYLE_COUNT = STYLE_LIST.length

export const FUSION_MODES = [
  { id: 'balanced', label: 'Balanced 50/50' },
  { id: 'primary-structure', label: 'Primary Structure + Secondary Texture' },
  { id: 'primary-linework', label: 'Primary Linework + Secondary Palette' },
  { id: 'primary-composition', label: 'Primary Composition + Secondary Rendering' },
  { id: 'accent-25', label: 'Primary 75% + Secondary 25%' },
  { id: 'dominant-primary', label: 'Primary 75% + Secondary 25%' },
]
