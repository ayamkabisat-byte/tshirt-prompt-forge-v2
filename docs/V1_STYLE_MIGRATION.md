# V1 Style Migration Audit

Status: **65/65 original v1 style IDs migrated**.

## Category reconciliation

| Category | V1 count | V2 migrated |
|---|---:|---:|
| Streetwear & Subculture | 14 | 14 |
| Traditional, Tattoo & Heritage | 7 | 7 |
| Posters, Propaganda & Vintage Ads | 7 | 7 |
| Mascot & Character Art | 4 | 4 |
| Anime & Manga Art | 4 | 4 |
| Modern Pop Art & Games | 8 | 8 |
| Fine Art & Movements | 8 | 8 |
| Graphic & Print Tech | 13 | 13 |
| **Total** | **65** | **65** |

## Migration behavior

The v1 style system was not copied as labels only.

- `STYLE_DATA` became each preset's main `prompt`.
- `GRAPHIC_OVERRIDES` became `graphicPrompt` and is selected automatically by the v2 style compiler for Graphic / Logo-oriented modes when available.
- `STYLE_OVERRIDES` became per-style `rules` appended by the compiler.
- Existing v2 mix elements, detail density, background mode, print method, color controls and production rules remain separate layers so legacy style character is preserved without losing v2 controls.

## Compatibility aliases

These aliases preserve compatibility with early v2 IDs while keeping the original v1 IDs canonical:

- `clean-mascot-vector` → `vector-bazzier`
- `ukiyoe` → `japan-ukiyoe`
- `irezumi` → `tattoo-irezumi`
- `banknote-engraving` → `banknote`
- `rubber-hose` → `retro-rubberhose`
- `shonen-anime` → `anime-shonen`
- `brutalist-collage` → `mixed-collage`

## Important conflict fix retained in v2

The old `poster-wanted` preset could demand `WANTED / DEAD OR ALIVE / bounty` text while the generic no-text rule simultaneously prohibited readable text. In v2 the bounty-poster hierarchy is preserved, but readable fixed poster text is only forced when typography controls request it.

## Production note

Legacy styles are not forced into vector output. DTF and DTG may use rich raster rendering, gradients, glow, painterly texture and complex shading. `Vector Ready` remains an optional creative/production constraint.
