export const SUBJECT_MODES = [
  { id: 'new', label: 'Generate New' },
  { id: 'reference', label: 'Transform Reference' },
  { id: 'graphic', label: 'Graphic Only' },
  { id: 'logo', label: 'Logo Transform' },
]

export const COMPOSITIONS = [
  { id: 'centered', label: 'Centered Hero', prompt: 'centered hero composition with a strong readable silhouette' },
  { id: 'dynamic', label: 'Dynamic Diagonal', prompt: 'dynamic diagonal composition with clear directional movement' },
  { id: 'badge', label: 'Badge / Emblem', prompt: 'self-contained emblem composition with a strong outer silhouette' },
  { id: 'stacked', label: 'Stacked Tee Graphic', prompt: 'vertically stacked apparel composition with balanced top and bottom weight' },
  { id: 'oversized', label: 'Oversized Back Print', prompt: 'large back-print composition designed to read clearly across a wide garment area' },
]

export const EDGE_MODES = [
  { id: 'organic', label: 'Organic Contour', prompt: 'organic die-cut outer contour with no rectangular background box' },
  { id: 'clean', label: 'Clean Edge', prompt: 'razor-clean defined outer edge' },
  { id: 'distressed', label: 'Distressed', prompt: 'weathered distressed outer contour with controlled print wear' },
  { id: 'fade', label: 'Soft Fade', prompt: 'softly fading perimeter that dissolves into the background' },
]

export const PRINT_METHODS = [
  { id: 'screenprint', label: 'Screen Print' },
  { id: 'dtg', label: 'DTG' },
  { id: 'dtf', label: 'DTF' },
  { id: 'embroidery-look', label: 'Faux Embroidery Look' },
]

export const ASPECT_RATIOS = ['1:1', '4:5', '3:4', '2:3', '9:16', '16:9']

export const GARMENT_COLORS = [
  { id: 'black', label: 'Black', hex: '#111111' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'cream', label: 'Cream', hex: '#e8ddc3' },
  { id: 'navy', label: 'Navy', hex: '#111827' },
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
