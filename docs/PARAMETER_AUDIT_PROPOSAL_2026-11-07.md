# Proposal audit parameter — T-Shirt Prompt Forge v2
Status: DRAFT FOR REVIEW ONLY — 2026-11-07. **Do not implement without user approval.**
Scope: 65 style presets in 8 categories, src/data/presets.js, src/prompt/{styleCompiler,shared,flow,midjourney,compatibility}.js.
This document records proposed revisions; no generator parameters or style definitions are changed by this commit.

## Product decisions confirmed
- This is an **artwork generation** tool, not a print-ready/prepress file generator. User performs DTF halftone knockout, separations, cleanup, etc. later in Photoshop.
- DTG and DTF can use high-quality **raster photography, photomontage, illustration, digital painting, mixed media, gradients, glow**. Do not default to vector merely because artwork is for apparel.
- Subject and reference identity remain authoritative. Style defines **how to render**, not necessarily **what objects to insert**.
- Recognizable stylistic signatures should be preserved where defining, not blindly deleted. Distinguish characteristic visual grammar from optional motifs. KAWS XX eyes are an important signature; do not remove casually. Evaluate IP/trademark risk before commercial use, and consider an optional more general designer-toy variant.
- Avoid unrequested visual clichés; allow AI to choose appropriate supporting motifs based on subject and style.
- Preserve 65 IDs, compatibility, existing gallery and images. Test generated prompts first; obtain approval before implementing any proposed parameter changes.

## Confirmed current engine behavior and audit concerns
1. styleCompiler.js: for subjectMode=graphic/logo uses graphicPrompt if present, otherwise prompt. This can cause style behavior to shift across modes; audit consistency, not necessarily force same text.
2. styleCompiler.js: primary and secondary rules are concatenated even when conflicting; fusion directions sometimes conflict with categorical rules. Consider conflict hierarchy: user explicit > identity/subject > primary style > secondary accent > optional motifs.
3. shared.js productionRules: screenprint limits spot colors and gradients; DTG/DTF explicitly allow raster, shading, gradients and no forced vector unless vectorReady. Retain this positive behavior, but reduce overly technical prepress language where it distracts from creativity.
4. flow.js GOAL says 'finished flat artwork', 'suitable for apparel production'; subjectRules for graphic disallows human portraits unless explicitly requested; tattoo uses 'tattoo-ready'. Distinguish flat presentation (no mockup) from flat vector rendering. Avoid making 'print-ready' a demand for actual separations/transparent knockout.
5. midjourney.js subjectLead says 'print-ready' regardless of method, which could bias toward vector/production simplification. Review phrasing, while keeping standalone no mockup.
6. presets.js has 5 subject modes, 3 reference fidelity, 7 compositions, 6 edges, 5 print methods, 3 color-count modes, 5 color modes, 9 typography presets, 3 detail levels, 4 background modes, 3 logo integration modes, 9 mix elements, 6 aspect ratios and model options. Audit interactions, do not remove controls.
7. shared.js contains an older buildStyleDirection using medium/linework/shading/texture/palette, whereas actual Flow and Midjourney import styleCompiler.js. Avoid editing the unused/legacy path without call-site review.
8. styleCompiler.js fallback 'vector-bazzier'; shared.js fallback 'clean-mascot-vector' resolves via alias. Audit invalid IDs and legacy recipe compatibility before altering.
9. 'halftone' in mix elements is an artistic effect; DTF halftone knockout is a separate prepress operation and should not be confused with it.

## Style-by-style review checklist
Notation: KEEP = defining language worth preserving; CHECK = likely overly narrow, redundant, or medium-constraining; no final replacement wording approved.

### Streetwear & Subculture (14)
- subtle-chest — KEEP understated small emblem/negative space; CHECK whether automatically requiring vector/flat rendering is appropriate.
- jdm-racing-vector — KEEP JDM car-toon as an explicitly vector-named preset; CHECK if automotive subject is inherently mandatory (yes, name says car).
- western-racing-vector — KEEP muscle/Euro motorsport vector identity; CHECK rigid 'no Japanese text' only as relevant to intended setting.
- vintage-moto-lineart — KEEP precise mechanical linework and motorcycle central; distinct from expressive custom-shop Bobber Cult.
- moto-bobber-cult — KEEP hand-lettering, custom-shop, lowbrow, pinstriping; CHECK whether all mascots/skulls/flames are required. Prior edit already in branch, revisit after test.
- bootleg-punk — CHECK clothing textures/studs/pins as required; broaden to photo xerox, ransom typography, distressed photocollage, illustration as appropriate.
- bootleg-metal — CHECK pentagrams/leather/chains as automatic content; explore subgenre-appropriate typography, dramatic photomontage and detailed fantasy/horror illustration.
- metal-manson — KEEP grotesque intricate dark linework; CHECK unnecessary mandatory skulls and how it differs from generic bootleg-metal.
- bootleg-hiphop — CHECK chains/tracksuits/sunglasses/fisheye as mandatory; enable group photographic collage, airbrush, large lettering, era-specific 80s/90s rap merch and mixed media.
- cyber-techwear — CHECK conflation of apparel functional techwear, cyberpunk city, mecha armor and HUD; clarify dominant aesthetic.
- cyber-mecha — KEEP mechanical panel construction and cel-shaded robotic detail; CHECK redundant blueprint microtext rules.
- vaporwave-acid — CHECK conflation of vaporwave and acid graphics; statues/grid/neon optional, support photography and mixed media.
- mixed-collage — KEEP cut-and-paste zine, torn edges, DIY, varied photo/print mediums; avoid compulsory ransom lettering.
- skate-laflamme — KEEP saturated comic characters, expressive ink and mischievous energy; skateboards optional. Prior edit already in branch; revisit name and imagery after test.

### Heritage & Tattoo (7)
- wayang-kulit — KEEP ornament, carved leather silhouette and regional visual grammar; CHECK whether physical rods/joints/profile mandatory for every non-puppet subject.
- japan-sukajan — KEEP souvenir-jacket embroidery composition; CHECK mandatory dragons/tigers/koi/sakura, distinguish printed artwork from embroidered-jacket mockup.
- japan-ukiyoe — KEEP Edo woodblock flat inks and line rhythm; CHECK automatically inserting waves/cherry blossoms.
- tattoo-irezumi — KEEP bold irezumi wind bars/waves/background flow; CHECK optional motif selection based on subject.
- tattoo-sailor — KEEP American traditional line/shading/palette; CHECK motif examples as optional.
- tattoo-pointillism — KEEP dots/stippling; CHECK geometric frames as optional.
- tattoo-blackwork-chicano — CHECK conflation of solid blackwork and Chicano black-and-grey fine shading; potentially separate modes, not silently change ID.

### Posters & Propaganda (7)
- poster-wanted — KEEP bounty-poster hierarchy; CHECK parchment and fixed headings when no text requested.
- poster-hope — KEEP constrained color blocks and high-contrast graphic stencil; CHECK dependence on specific recognizable political poster arrangement.
- poster-unclesam — KEEP direct recruitment appeal, gesture and lithograph when human subject; CHECK forced pointing/eye contact for nonhuman subject.
- poster-ww2 — KEEP 1940s commercial illustration/propaganda visual grammar; CHECK default patriotic symbols.
- poster-soviet — KEEP constructivist geometry and strong color/diagonal hierarchy; CHECK industrial/agricultural motifs as mandatory.
- iklan-jadul — KEEP Indonesian vintage ad and local typography; CHECK 1950s–70s vs older historical spelling/print variations.
- sticker-nyeleneh — KEEP Indonesian angkot/truck decal kitsch and humor; CHECK categorical no-human restriction if user asks for people.

### Mascot & Cartoon (4)
- parody-comic-mascot — KEEP humorous expressive mascot/halftone; CHECK if all subjects must be anthropomorphized.
- storybook-ink — KEEP pen/wash, cozy handmade quality; CHECK mandatory anthropomorphic animal framing.
- retro-rubberhose — KEEP noodle limbs/pie-cut eyes where character anatomy permits; preserve defining traits.
- vector-bazzier — KEEP clean polished vector mascot (vector is explicit); CHECK if overly generic and lacks distinct visual identity.

### Anime & Manga (4)
- anime-shonen — KEEP energetic anime cel shading; CHECK forced action poses/energy aura for still subjects.
- anime-extreme-perspective — KEEP exaggerated foreshortening and street-anime motion; CHECK obligatory fisheye for all scenes.
- anime-sumie — KEEP sumi-e expressive brushwork; CHECK conflation of Japanese brush painting with gritty manga.
- anime-ukiyoe-kaiju — KEEP woodblock kaiju identity; CHECK forcing all input objects into monster when user requests stylistic treatment only.

### Pop Art & Street Art (8)
- pop-persona — KEEP angled UI, flat red/black/white, halftone; CHECK overdependence on specific game branding.
- wpap — KEEP straight-edged polygon facets and high contrast as defining.
- pop-murakami — KEEP superflat visual grammar; CHECK mandatory smiling flowers and distinctive branded motifs.
- pop-kaws — KEEP XX-eye signature as historically defining; CHECK trademark/derivative risk and non-face subjects; optionally add separate generic designer-toy preset after approval.
- pop-kusama — KEEP repetitive polka dots/infinity nets as defining; CHECK pumpkin imagery as optional.
- pop-warhol — KEEP silkscreen/pop color separation; CHECK automatic repeated panels when single subject desired.
- street-haring — KEEP kinetic continuous thick outlines and flat figures; CHECK visual signature/IP and adaptability to objects.
- street-stencil — KEEP stencil contrast, negative space and visual commentary; CHECK concrete wall/mockup and default accent color.

### Fine Art & Abstract (8)
- cubism — KEEP multi-view fragmentation; CHECK balance of recognizability vs deconstruction.
- surrealism-general — KEEP impossible associations and dream logic; CHECK reliance on arbitrary floating objects.
- surrealism-dali — KEEP precise illusionistic surrealism; CHECK melting objects and deserts as automatic motifs.
- surrealism-magritte — KEEP paradox, obscuration, scale shifts; CHECK apples, bowler hats and clouds as automatic motifs.
- surreal-collage — KEEP physical cutout photographic montage; CHECK mandatory anatomical/retro machinery.
- abstract-geometric — CHECK Bauhaus/Kandinsky/Suprematism as conflated movements; clarify core geometry grammar.
- pure-abstract-geo — KEEP literal silhouette removal, since explicitly pure abstract; preserve distinction.
- geometric-lineart — KEEP recognizable silhouette and polygon-filled lines; preserve distinction.

### Graphic & Illustration (13)
- badge-vintage-luxury — KEEP filigree, symmetric heritage badge; CHECK forced barbershop/apothecary theme.
- badge-retro-outdoor — KEEP patch silhouette, vintage vector; CHECK ribbon and nature as optional.
- scribble-art — KEEP neon scribble subject construction; preserve difference from silhouette variant.
- scribble-kookylove — KEEP solid-black negative-space subject against neon scribble; preserve defining difference.
- comic-cover — KEEP vintage comic ink/halftone; CHECK mandatory issue number/headline when text is disabled.
- risograph — KEEP overlapping ink and misregistration; CHECK whether paper texture should be rendered as actual background rectangle.
- banknote — KEEP guilloche and engraving; CHECK if banknote layout must be forced.
- vintage-travel — KEEP WPA flat geometric poster look; CHECK requirement for actual travel place.
- retro-vintage — CHECK too generic 70s/80s sunburst/palms; define era and visual hierarchy.
- typographic — KEEP type-dominant; CHECK if no text is provided, how to avoid hallucinated words.
- typo-technical — KEEP technical spec typography; CHECK mandatory microtext and irrelevant engineering detail.
- minimalist — KEEP reductive graphic and negative space; CHECK auto forcing line-art/vector where user selects photo.
- anime-mumford — KEEP elaborate swirling linework and color separation; CHECK unnecessary neon glow/dark background for every subject.

## Proposed testing before any implementation
1. Capture actual Flow and Midjourney prompt outputs for existing recipes, including reference vs graphic mode, DTG vs DTF vs screenprint, vectorReady false vs true, isolated vs poster background, and no-text vs typography.
2. Use identical subjects across selected styles: (a) reference photograph of a girl group reinterpreted as 1980s hip-hop bootleg photo collage; (b) orchid; (c) motorcycle or car; (d) nonhuman object; (e) mascot/portrait. Compare preservation, style distinctiveness, cliché insertions, medium flexibility and print-instruction interference.
3. For every candidate, show BEFORE prompt, PROPOSED prompt, and explicit changes to style identity vs optional motifs; user approves before changing style JSON/JS.
4. Distinguish factual art-history/signature claims from creative design recommendations; validate uncertain artist names and trademark claims with sources before final copy.
5. No blanket rule to remove iconic details: some features are defining. Maintain existing 65 styles and IDs; any extra generic variants are a separate decision.

## Approval gate
No edits to src/data/styles/*, src/data/presets.js or src/prompt/* are authorized by this document. Only a future explicit user approval permits parameter changes.


## Reference-image review: Félix LaFlamme — 2026-11-08
Status: **candidate only; do not edit style presets yet**.
Evidence: user-provided screenshots of artist's official website portfolio and a printed SpongeBob-themed shirt; official website https://www.felixlaflamme.com/ and artist biography https://www.felixlaflamme.com/%C3%A0-propos; Behance artist profile https://www.behance.net/felixlaflamme.
Artist's own description cites punk-rock, skateboarding, comics, underground culture and 80s/90s. He also works on albums, merch, comics and licensed SpongeBob artwork; skateboards are a cultural influence, NOT mandatory illustration subjects.

### Characteristic visual grammar (preserve)
- Character-first, high-impact underground-cartoon illustration: exaggerated anatomy and facial expressions, grotesque-but-playful horror humor, manic eyes, teeth, tongues, skulls, mutants, monsters, transformed everyday objects and sometimes familiar pop-cultural characters. Do not force any single motif.
- Very thick, clean, confident **black outer contour** and controlled fine interior inkwork: hatch strokes, stipples, cel-like black shadow pockets and small distress speckles. Bold silhouette with dense micro-details.
- Intensely saturated, often electric/neon complementary or clashing palettes (acid green, magenta, cyan, orange, purple, yellow); strong black separation with solid fills and targeted gradient/airbrush highlights when visually useful. Avoid converting everything into vintage brown or washed-out grunge.
- Exaggerated 3-D dimensionality through perspective, contours and selective shading while retaining a 2-D comic/cartoon finish; strong foreshortening, action, splashes, goo, saliva, slime and motion accents when appropriate.
- Central standalone composition, high readability from a distance, usually subjects dominate more than typography; typography optional, energetic hand-lettering when requested. Subject does not need to be a skateboard, a skater, skull or zombie.
- Digital illustration / raster-compatible, not compulsory vector-only or flat minimal art. Keep DTG/DTF rich color/texture allowed.

### Specific evidence visible in provided screenshots
- Website character gallery: colorful tiger with watermelon; monster/demon figures; eyeball/brain/limb mashups; skateboard shoe with stylized organs; gamer and skeleton imagery; cats and other creature transformations; vivid colors and thick black outlines.
- Second screenshot: licensed SpongeBob-themed artwork featuring a large pink cartoon brain, protruding eyes, elongated tongue, slime/drips, thick black outlines, bold cyan/yellow/pink palette. This verifies **grotesque pop-culture character reinterpretation**, not only skeleton/skate aesthetics. Artist's own biography documents Paramount SpongeBob franchise work; it does not authorize users to copy SpongeBob for third-party merchandise.

### Compared with current skate-laflamme prompt
Current prompt already captures underground comics, expressive characters, bold black ink, saturated palette, dark humor and no mandatory skateboard. Still underspecifies: **specific gross-out mutant/cartoon energy; chunky exaggerated organic shapes; wet slime/goo and splashes when suitable; fine interior hatching and small texture marks; dynamic perspective; juxtaposition of cute childhood motifs and horror**. Current "skate punk" label may bias subjects toward skateboard. Candidate label (only if approved): "Félix LaFlamme — Monster Pop / Underground Comic" or more generic "Neon Gross-Out Underground Comic" while retaining original style ID for compatibility.

### Candidate direction for side-by-side testing, not committed to source
"An original, high-impact underground cartoon and punk-comic apparel illustration of the specified subject, with a bold readable central silhouette, exaggerated expressive anatomy and playful grotesque transformation when compatible with the subject, chunky confident black contour lines, intricate interior ink hatching and stippled detail, dramatic solid-black shadows, highly saturated electric contrasting colors, energetic foreshortening, and lively drips, splatters or motion accents only where they naturally fit. Mix nostalgic 1980s–1990s skate-comic attitude with irreverent dark humor and colorful childhood-cartoon exuberance. Preserve recognizable subject features; never add a skateboard, skull, slime or monster features by default. Artwork can be rich raster/digital illustration, not vector-only. Hand lettering optional unless the recipe asks for text."
Test BOTH character and object/photo-reference subjects with controlled color and composition settings; compare baseline Flow and Midjourney results. Check if signature survives with a mundane object and with no skull/skateboard. For commercial use do not automatically inject recognizable copyrighted franchise characters unless supplied with proper rights.

## Reference-image review: Bobber Cult — 2026-11-08
Status: **candidate only; do not edit style presets yet**.
Evidence: user screenshot of Instagram @bobbercult grid with custom-bike and crew merchandise, event posters, skulls, human figures, wings, lettering and badges.
- Not just generic lowbrow mascots, monster skulls, flame motifs and pinstriping. Typography/layout is often as important as figure rendering.
- Defining visual language: high-impact **custom-culture merchandise illustration**, thick black contour line with densely engraved/hatching interior detail, strong carved shadow areas, retro warm limited colors (often black/cream/red/orange/yellow, but flexible), expressive humans and motorbikes, vintage hand-painted/comic or event-poster layout.
- Lettering can be vintage serif, gothic/blackletter, hand-painted signage, psychedelic or curved display lettering, integrated into the central image; not always symmetrical badge or bike.
- Biker/motorcycle cultural context matters, but motorcycle, skull, flames or mascots not obligatory for every user-supplied subject.
- Distinction from Vintage Moto Line-Art: Bobber Cult emphasizes **narrative, custom lettering and apparel/event-merch visual hierarchy**; Vintage Moto Line-Art emphasizes **precision of the classical motorcycle and mechanical drawing**.
- Candidate approach: bold black contour + detailed interior ink + retro screenprint-inspired composition; allow photographic or painterly processing if appropriate but do not default to clean mechanical vector.
- Compare controlled samples: subject tiger, group photo or astronaut, alongside the identical subject in Vintage Moto Line-Art; examine lettering and poster vibe vs machine delineation.
