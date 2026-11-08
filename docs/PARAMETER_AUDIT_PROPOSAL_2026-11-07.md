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


## Reference review: Markus Manson / Markus Wiriahadinata — 2026-11-08
**Status:** Audit proposal only. NO changes to style presets or prompt engine until user reviews generated prompts and approves.

### Sources and verification levels
- Artist profile: https://markuswiriahadinata.artstation.com/ (ArtStation search-indexed portfolio; direct page rendering may be inaccessible to crawlers). Current title "Markus Manson — Illustrator / Graphic Designer / Tattoo Artist". Listed examples: The Portugese Wolf, The Spain Jaguar, VenomizedDragon, Vlad the Impaler, Cyborg Hades, Bionic dragon, Medusa, Bone Dragon, Horus, Seth, Chimera, Dark vs Light Dragon, Cthulhu/Mythos creatures, A7X Israel Throne, Arch Enemy Snake, Will to Power, Cattle Decapitation tour series, etc.
- Artist Behance https://www.behance.net/markusmansonart names Markus Wiriahadinata; Jakarta; artist self-description notes horror, gore, dark-themed artwork; offers band merchandise illustration.
- Specific A7X project https://www.behance.net/gallery/94918617/A7X-Israel-Throne explicitly says **"Done for @a7xisrael fans club of @avengedsevenfold"**. This supports a fan-club commission, NOT an official Avenged Sevenfold band contract. Do not conflate fan artwork or thematic projects with direct band clients.
- User-provided screenshot: large ArtStation portfolio grid (66 works), showing intricate brightly highlighted monsters, organic and mechanical forms, shirt mockups, high-density linework, and some portraits / mixed subjects.
- User-provided **claimed client/band list (unverified on a project-by-project basis)**: AVENGED SEVENFOLD; ARCH ENEMY; IN FLAMES; ACDC; KORN; PAPA ROACH; DISTURBED; CALIBAN; BRING ME THE HORIZON; DYING FETUS; BORN OF OSIRIS; EMMURE; WE CAME AS ROMANS; CARNIFEX; ALL SHALL PERISH; THE DEVIL WEARS PRADA; MISS MAY I; SUICIDE SILENCE; ASKING ALEXANDRIA. Save as leads only; do not repeat all as verified direct clients.

### Observed stylistic DNA
1. **Hyper-dense flowing linework**, intricately intertwined organic or sculptural filaments: roots, tendrils, muscle, bone, creature anatomy, armor relief, flames, smoke, scales and ornamental curls. Avoid reducing to ordinary jagged outlines or generic black-metal engraving.
2. **Layered relief and dimensional carving**: powerful recognizable central silhouette, dense internal line clusters and intertwined depths; muscular or biomechanical-looking forms where the subject calls for them. This is not restricted to biomechanical creatures: animal, mythical, historical or technology subjects also appear.
3. **Extreme value contrast with luminous chromatic accents**: deep near-black shadows and electrified cyan, acid green, violet, molten orange/red, blue etc. Internal highlights and light-from-within effects are frequent; NOT mandatory for all pieces. Avoid making every image generic neon glow.
4. **Monumental creature/emblem / album-merch hierarchy**: intricate central hero form, controlled radial or dynamic directional flow, ornate supporting tendrils/flames/frames as appropriate. Dense but legible from distance. Not every design is symmetric or typographic.
5. **Subject-adaptive dark fantasy/horror sensibility**, mythological, sci-fi, cosmic horror and band-merch visual energy; skulls, demons and gore are common examples but **not required objects**.
6. **Richer-than-vector digital illustration**: many narrow tonal shifts, highlights, layered textures and detailed rendering. Do not force flat colors, vector tracing, strict spot inks, or prepress knockout because user handles final printing with Photoshop/DTF workflow.

### Current preset: issues observed (metal-manson)
Current prompt: "a brutal death-metal and dark-fantasy aesthetic inspired by intricate biomechanical and grotesque demonic illustration, highly detailed dark linework, skulls, and a menacing aggressive atmosphere."
Current rule: "Keep linework extremely intricate and brutal, with skulls or dark-fantasy motifs prominent."
- Too much focus on **skulls** and **demons**, ignoring broader portfolio incl. dragons, Medusa, mythic gods, wolves, cyborgs and other non-demonic concepts.
- "dark linework" underspecifies intertwined structure, interior relief carving, and dramatic colorful luminance.
- "brutal death-metal" anchors subgenre inaccurately as the only mode; portfolio also serves metalcore, fantasy, sci-fi and other genres.
- Missing explicit permission for richly colored raster/digital painting and shape-driven composition; may output generic death metal poster or fake photo of apparel.
- The preset has no graphicPrompt; review whether its default prompt handles the user-defined subject in graphic/logo modes after actual testing.

### Candidate replacement style direction — not for production until approved
"Create an original hyper-detailed dark-fantasy and extreme-music merchandise illustration of the user-selected subject. Construct the subject with elaborate intertwining sculptural linework, flowing organic filaments and layered relief-like forms; combine precise fine interior rendering, deeply carved shadows, and intricate overlapping anatomy, armor, textures or ornamental tendrils only when they suit the chosen subject. Establish a commanding central silhouette within a dense, dynamic composition. Use dramatic high-contrast illumination, near-black depth and strategically placed intense luminous color accents (electric cyan, violet, toxic green, molten orange or crimson) selected to fit the subject. Infuse mythological, horror, sci-fi or epic energy as appropriate without forcing skulls, demons, gore, or biomechanical elements. The result can be rich, dimensional raster illustration or digital painting; no forced vectorization, mockup, print separations or DTF knockout."

Candidate rules:
- "Prioritize intertwined hyper-detailed fine linework, relief-like dimensional layering, and readable dominant silhouette."
- "Preserve the explicitly requested subject; mythology, monsters, demons and skulls are optional motifs and should not be inserted as defaults."
- "Use bright chromatic internal lighting selectively against deep shadows when compatible with color controls; never restrict to black-only metal imagery."
- "Allow illustration density, painterly color and gradient detail when Vector Ready is off; output standalone artwork, not a shirt mockup."

### Validation plan
- Baseline vs candidate, same neutral subject, e.g. **ceramic orchid, motorcycle, eagle, human portrait, mythological creature**; change only primary style.
- Compare to Bootleg Metal: Manson should emphasize **continuous sculptural hyper-detailed creature/ornamental illustration**; Bootleg Metal may be **photographic montage, gothic lettering, gritty retro merch layout or illustration**.
- Compare to Felix LaFlamme: Markus uses **dense sculptural relief and epic/dark gravitas**, Felix uses **thick cartoon contours, playful grotesque forms and intense flat/electric pop colors**.
- For photo/reference input, test preserving identity while applying Manson's flowing, ornamental rendering language without automatically changing the person into a demon.
- Test Flow and Midjourney prompts with DTG/DTF, Vector Ready=false, no text, and explicit typography; user reviews before changes.


## Bobber Cult: visual test feedback — 2026-11-08
Status: **TEST FAILED STYLE FIDELITY**; user has explicitly asked to reassess artwork and will provide sharper Markus Manson references later. Do not alter Markus until reviewing those samples. **No preset changes made by this note.**

### Test images provided by user
1. Cartoon yellow sponge driving a complex hot-rod with snail / burger / engine details.
2. Helmeted screaming chimpanzee riding classic motorcycle, many mechanical, leather, spoke and shading details.
3. Snarling koala with forest/branches and detailed animal fur, almost traditional tattoo or engraved badge appearance.

### User critique
Bobber Cult's authentic portfolio is **simpler and more graphic** than these generated images. The current preset is too detailed, especially complex line work, layered 3D-ish shading and crowded props. Do not conflate "high-impact commercial retro merch" with "more intricate linework everywhere."

### Root-cause hypotheses in current preset
- Current prompt explicitly includes "intricate engraved-style interior linework", "selective cross-hatching and stippling", "dramatic carved shadow masses"; the graphicPrompt says "dense interior ink hatching, relief-like engraved shadows"; rules reinforce "intricate interior engraving and hatching". These strongly bias all subjects towards elaborate woodcut/engraving.
- Very complex decorative props (mechanical parts, tire tread, ornaments, background) overwhelm primary hero.
- Exaggerated creature anatomy gets rendered as realistic, aggressive tattoo-mascot shading or polished busy sticker, not simplified bold underground event merch.
- No visible custom lettering in tests; this is fine when text inputs are empty (do NOT hallucinate lettering), but layout should leave a place for optional text and the preset should emphasize lettering *when text is provided*.
- Palette often too desaturated (cream/olive/sepia). Observed artist portfolio frequently favors flat saturated red/orange/yellow/blue with solid black or cream separation. Color choice should still honor the user's palette.

### Candidate adjusted Bobber visual grammar (requires new test and explicit approval before src editing)
- Prioritize strong, **simple and instantly readable screenprint-like shapes**, bold black outer contours, stylized mid-weight inner lines and limited detail at important focal features, not dense hatch over every surface.
- Mostly **flat 2–5 punchy colors** with strong black/cream contrast; light distress only where stylistically helpful. This is an *aesthetic preference*, not a technical spot-color restriction: DTG/DTF raster allowed.
- Suggest graphic narrative, charismatic / cheeky figures, classic biker/chopper/hot-rod culture as **optional themes**; the user-selected subject remains central.
- Maintain vintage-event-poster or custom-shop typography/layout grammar when requested; **no compulsory text**, no made-up words, no huge invented decorative ornaments.
- Avoid realism, highly dimensional gradients, intricate woodcut engraving, multi-object collage overload, dense microhatching, mechanical blueprint look and polished layered tattoo-badge default.
- Emphasize **simplified contour-driven retro editorial/cartoon illustrations**, visible negative space, controlled supporting accents, selected texture and confident compositional hierarchy.
- Do not erase all details or make it generic logo-vector minimalism; restore selective expressive hand-drawn character and good graphic rhythm.

### Concise test candidate (not yet implemented)
"Create an original vintage custom-culture merchandise illustration of the requested subject, combining the attitude of underground motorcycle and hot-rod event graphics with bold, simplified hand-drawn character art. Use large confident black ink contours, expressive stylized forms, selective inner line details and solid shadow shapes. Keep the silhouette striking, the composition uncluttered, with enough negative space and a punchy retro palette of a few strong colors. Use minor print distress and a little hatching only where they clarify form; avoid dense engraving, realism, excessive machinery or ornate tattoo-like rendering. Integrate distinctive custom poster lettering only when specific text is provided, and never force bikes, skulls, flames or pinstriping. Standalone illustrated artwork, not a garment mockup; raster and DTG/DTF are welcome."

### Proposed test method
Use identical three subjects and identical parameters from the failed images. Compare old vs candidate while controlling seed/model if possible; assess density, number of decorative motifs, readability at small size, degree of simplification, presence/absence of compulsory bikes/skulls, and resemblance to **actual Bobber Cult reference works** rather than to generic biker illustrations.

### Artist review next
User intends to provide full-resolution Markus Manson artworks rather than portfolio screenshots. Wait for those references before modifying that artist's preset further.


## Bobber Cult V4 visual feedback and engine interaction — 2026-11-08
**Status:** REVIEW ONLY; do not change presets or shared prompt engine until approved. Feedback from three user-generated V4 images after commit 92f48f5:
1. "V-TWIN MACHINE": legible lettering, black/cream/orange palette and good hierarchy improved; still too much dimensional mechanical micro-detail and generic biker emblem ornament.
2. Praying hands: readable, limited color but drifts to generic American-traditional/devotional tattoo flash, with excessive flaming halo, line-filled shading and decorative extras.
3. SpongeBob/character on chopper: lettering is closer to merch but overloaded with bike hardware, jellyfish, waves, chains, star, flames, border and bubbles; leaves little open space and treats the familiar cartoon+motorcycle as a sum of motifs rather than a strong single graphic idea.
**Artist-original reference reminder from ten image samples:** 
- Not every Bobber Cult piece has complete thick outlines: silhouettes can be built from spot-color fills, negative space, posterized photographic cutouts or limited black ink accents.
- Lettering often dominates/anchors event posters and badges; examples include "LOS SANTOS MC", "OLD & PROUD", "MECHANICS FEST", "GOOD VIBES BAD REVOLUTION", "BUDDY & GARAGE", "BOBBER CULT CO.", "STRANDED CHOPPERS". Several use 2–4 leading color groups; not all pieces are pure vector, and photomontage is part of portfolio.
- Many compositions use **one central visual idea plus a purposeful title and only a few supporting elements**, rather than every icon, flame, tire, wing or gothic ornament at once.
- Some real samples DO have intricate ink scratches, stippling, motorcycle detail, or decorated typography; simplification should concern the **overall hierarchy, color structure, tonal steps, and number of competing ideas**, not automatically eliminate all texture, contour or realistic/photographic mediums.
**Root cause confirmed by code inspection:** V4 style prompt says limited spot colors and flat shadows, BUT `src/prompt/shared.js:productionRules` in DTG mode asks for "full-color DTG raster artwork with rich tonal range, fine detail, smooth shading, texture, glow, and gradients allowed", in DTF mode asks for "rich gradients, texture, shading, and complex color transitions allowed" and warns "do not force vector-style simplification unless Vector Ready is intentionally enabled". `src/prompt/flow.js` OUTPUT CONSTRAINTS explicitly says to "preserve useful gradients, texture, shading, glow, and complex color treatment" for raster DTG/DTF. Also `styleCompiler.js` default `balanced` detail says "enough detail to feel premium". These are **permissions**, not binding requirements, but their positive phrasing may bias image generation against deliberately simple Bobber visual aesthetics. A style-only patch has limited impact if combined prompt keeps rewarding added detail.
**Next proposed changes, not approved yet:**
- Minimal, concise Bobber core direction (less repetitive text): "Vintage custom-merch art direction: one memorable focal idea; integrated vintage display lettering if supplied; strong graphic hierarchy; 2–3 impactful color groups plus black or cream, as artistically appropriate; minimal tonal steps; optional partial contours; simplified attitude-driven figures, posterized portrait cutouts or typography-led emblems. Honor user-provided subject, avoid adding unrequested subculture symbols or unrelated props. Screenprint-looking art is allowed regardless of actual file/print method; do not force vector files or prepress separations."
- Consider optional medium pathways within same style (character illustration, lettering-driven emblem, posterized photographic collage) determined by user input rather than forced mascot/tattoo illustration.
- For character reinterpretations, preserve recognizable features while simplifying/homogenizing attitude and graphical shapes; strong fidelity may prevent transformation, so **test** Strict vs Balanced before modifying reference handling globally.
- Audit `productionRules` and `flow.js` so DTG/DTF define printing capabilities, not demand sophisticated gradients/glow; any correction must be generalized and regression-tested across all 65 styles (Markus and others should still retain detail when appropriate).
- Make simplification measurable in prompt tests: 1 primary concept, up to 1–2 supporting motifs, very few tonal steps, no automatic contour around every shape; avoid hard color rules when user explicitly chooses full palette.
- Test same three subjects with unchanged model, seed if available and controlled parameters; compare outputs old vs proposed; do not infer one design's fidelity from random image alone.
