export const SUBJECT_MODES = [
  { id: 'new', label: 'AI Character / Generate New', desc: 'Create a new subject from text.' },
  { id: 'reference', label: 'Transform Reference', desc: 'Restyle a supplied person, character, or object.' },
  { id: 'graphic', label: 'Graphic Only', desc: 'Objects, symbols, typography; no human subject required.' },
  { id: 'logo', label: 'Logo Transform', desc: 'Preserve logo structure while changing material or style.' },
  { id: 'tattoo', label: 'Tattoo Placement', desc: 'Create a flat tattoo-ready composition.' },
]

export const REFERENCE_FIDELITY = [
  { id: 'strict', label: 'Strict' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'loose', label: 'Loose' },
]

export const TATTOO_PLACEMENTS = [
  { id: 'arm-sleeve', label: 'Full Arm Sleeve', prompt: 'designed as a continuous sleeve composition that wraps naturally around the arm' },
  { id: 'upper-arm', label: 'Upper Arm / Shoulder', prompt: 'designed to sit strongly on the upper arm and shoulder' },
  { id: 'forearm', label: 'Forearm', prompt: 'designed to fit vertically and read clearly on the forearm' },
  { id: 'full-chest', label: 'Full Chest', prompt: 'designed as a broad balanced full-chest tattoo composition' },
  { id: 'full-back', label: 'Full Back', prompt: 'designed as a large full-back centerpiece with strong overall flow' },
  { id: 'outer-thigh', label: 'Outer Thigh', prompt: 'designed to flow naturally along the outer thigh' },
  { id: 'calf', label: 'Calf', prompt: 'designed with a readable vertical flow for the calf' },
  { id: 'neck', label: 'Neck', prompt: 'designed as a compact high-impact neck tattoo' },
  { id: 'hand', label: 'Back of Hand', prompt: 'designed as a compact bold composition for the back of the hand' },
]

export const COMPOSITIONS = [
  { id: 'centered', label: 'Centered Hero', prompt: 'centered hero composition with a strong readable silhouette' },
  { id: 'dynamic', label: 'Dynamic Diagonal', prompt: 'dynamic diagonal composition with clear directional movement' },
  { id: 'badge', label: 'Badge / Emblem', prompt: 'self-contained emblem composition with a strong outer silhouette' },
  { id: 'stacked', label: 'Stacked Tee Graphic', prompt: 'vertically stacked apparel composition with balanced top and bottom weight' },
  { id: 'oversized', label: 'Oversized Back Print', prompt: 'large back-print composition designed to read clearly across a wide garment area' },
  { id: 'closeup', label: 'Close-Up Focus', prompt: 'close-up focal composition emphasizing the main face, head, or hero object' },
  { id: 'panoramic', label: 'Wide Scene', prompt: 'wide scenic composition while preserving one dominant apparel focal point' },
]

export const EDGE_MODES = [
  { id: 'organic', label: 'Organic Contour', prompt: 'organic die-cut outer contour with no rectangular background box' },
  { id: 'clean', label: 'Clean Edge', prompt: 'razor-clean defined outer edge' },
  { id: 'distressed', label: 'Distressed', prompt: 'weathered distressed outer contour with controlled print wear' },
  { id: 'distressed-light', label: 'Light Distressed', prompt: 'subtle vintage wear around the outer contour' },
  { id: 'distressed-heavy', label: 'Heavy Distressed', prompt: 'prominent ragged grunge wear around the outer contour' },
  { id: 'fade', label: 'Soft Fade', prompt: 'softly fading perimeter that dissolves into the background' },
]

export const PRINT_METHODS = [
  { id: 'screenprint', label: 'Screen Print', family: 'spot-color', defaultColorPolicy: 'limited' },
  { id: 'dtg', label: 'DTG', family: 'full-color-raster', defaultColorPolicy: 'full' },
  { id: 'dtf', label: 'DTF', family: 'full-color-raster', defaultColorPolicy: 'full' },
  { id: 'embroidery-look', label: 'Faux Embroidery Look', family: 'raster-effect', defaultColorPolicy: 'full' },
  { id: 'tattoo-flash', label: 'Tattoo Flash', family: 'artwork', defaultColorPolicy: 'auto' },
]

export const COLOR_COUNT_MODES = [
  { id: 'auto', label: 'Auto by Print Method', desc: 'Screen Print uses a limited palette; DTG/DTF default to full color.' },
  { id: 'limited', label: 'Limited Palette', desc: 'Use the maximum-color setting even for DTF/DTG.' },
  { id: 'full', label: 'Full Color', desc: 'Allow rich continuous color; best suited to DTG/DTF.' },
]

export const COLOR_MODES = [
  { id: 'auto', label: 'Auto / Match Style' },
  { id: 'manual', label: 'Manual Palette' },
  { id: 'monochrome', label: 'Monochrome' },
  { id: 'complementary', label: 'Complementary' },
  { id: 'analogous', label: 'Analogous' },
]

export const TYPOGRAPHY_PRESETS = [
  { id: 'auto', label: 'Auto / Match Style' },
  { id: 'biker', label: 'Biker Patch / Rocker' },
  { id: 'racing', label: 'Racing / Speed Shop' },
  { id: 'luxury', label: 'Luxury / Ornamental' },
  { id: 'blueprint', label: 'Technical / Blueprint' },
  { id: 'poster', label: 'Propaganda / Poster Headline' },
  { id: 'comic', label: 'Comic / Pulp' },
  { id: 'brush', label: 'Brush / Expressive' },
  { id: 'minimal', label: 'Minimal Sans' },
]

export const DETAIL_LEVELS = [
  { id: 'clean', label: 'Clean / Simple' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'intricate', label: 'Intricate / Dense' },
]

export const BACKGROUND_MODES = [
  { id: 'isolated', label: 'Isolated Artwork' },
  { id: 'badge', label: 'Contained Badge Field' },
  { id: 'poster', label: 'Poster-Like Field' },
  { id: 'parchment', label: 'Parchment / Aged Field' },
]

export const LOGO_INTEGRATIONS = [
  { id: 'none', label: 'No Extra Logo' },
  { id: 'text', label: 'Logo / Wordmark from Text' },
  { id: 'image', label: 'Logo Image Reference' },
]

export const MIX_ELEMENTS = [
  { id: 'brutalist', label: 'Brutalist Layout' },
  { id: 'microText', label: 'Micro Text & Tech' },
  { id: 'autoDecals', label: 'Auto Decals & Racing Brands' },
  { id: 'vintage', label: '90s Vintage Vibe' },
  { id: 'minimalist', label: 'Clean Negative Space' },
  { id: 'glitchArt', label: 'Glitch / VHS FX' },
  { id: 'halftoneDots', label: 'Halftone Dots' },
  { id: 'y2kTribal', label: 'Y2K Cyber Tribal' },
  { id: 'bikerPatches', label: 'Biker Rocker Patches' },
]

export const ASPECT_RATIOS = ['1:1', '4:5', '3:4', '2:3', '9:16', '16:9']

export const GARMENT_COLORS = [
  { id: 'black', label: 'Black', hex: '#111111' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'cream', label: 'Cream', hex: '#e8ddc3' },
  { id: 'charcoal', label: 'Charcoal', hex: '#2b2b2b' },
  { id: 'navy', label: 'Navy', hex: '#111827' },
  { id: 'forest', label: 'Forest Green', hex: '#173b2c' },
  { id: 'maroon', label: 'Maroon', hex: '#4a1722' },
  { id: 'natural', label: 'Natural / Off White', hex: '#ece3cf' },
  { id: 'custom', label: 'Other / Unspecified', hex: null },
]

export const FLOW_MODELS = [
  { id: 'nano-banana-2', label: 'Nano Banana 2', note: 'Standard / preferred' },
  { id: 'nano-banana-pro', label: 'Nano Banana Pro', note: 'Complex design / precision' },
  { id: 'nano-banana-2-lite', label: 'Nano Banana 2 Lite', note: 'Fast / economical' },
]

export const MIDJOURNEY_MODELS = [
  { id: '8.2', label: 'V8.2', note: 'Current default' },
  { id: '8.1', label: 'V8.1', note: 'Fast, strong prompt adherence' },
  { id: '7', label: 'V7', note: 'Use when Omni Reference is required' },
  { id: 'niji-7', label: 'Niji 7', note: 'Anime / Eastern illustration' },
]
