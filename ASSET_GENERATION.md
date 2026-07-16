# PairUp Asset Generation Production Brief

This is the complete handoff for Gemini or another image-generation model. It defines the context the model must receive, exact prompts, technical output rules, placement constraints, and acceptance checks.
## Current Integration Decision

Only the seven generated WebP portraits are approved for use in the current build. All generated SVGs remain unintegrated because their present visual quality is not acceptable. Keep the code-drawn terrain, meshes, constellation, logo, and section art until replacement SVGs are explicitly reviewed and approved.


The website layout, typography, interaction, and motion already exist. Generate only the requested visual source assets. Do not redesign the interface or add text inside artwork.

## Required Context Bundle

Attach this context to every generation session. Without it, the model will drift toward generic startup imagery.

### Visual references

1. **Majestic editorial reference:** attach the supplied blue night scene with a lone person, bone-and-black terrain, sparse stars, and printed texture. It controls atmosphere, negative space, scale, texture, and restraint. It is inspiration only; do not copy its composition, logo, terrain, or person.
2. **Current desktop screenshot:** capture the relevant PairUp section at `1440x900`. The model must see existing copy, controls, and available negative space.
3. **Current mobile screenshot:** capture the same section at `390x844`. Mobile framing must work independently rather than being an accidental desktop crop.
4. **PairUp mark:** export `src/components/BrandMark.tsx` as a clean SVG reference. Its linked geometry may inform rhythm, but the logo must not be redrawn into background art.
5. **Palette swatch:** cobalt `#24369A`, constellation blue `#28517F`, problems blue `#30377D`, coral `#E98B7F`, bone `#F1EDDA`, ink `#070912`, interaction green `#8FC3A8`.
6. **Type reference:** Newsreader for editorial display and Manrope for interface text. Assets contain no typography; this only communicates the visual character.

### Product context to provide verbatim

> PairUp is a pre-launch teammate-discovery product for MUJ university builders. It helps students find complementary people for projects, hackathons, research, startups, and creative work. The emotional sequence is isolation, discovery, connection, building, and belonging. The site should feel majestic, local, youthful, and credible, never like a generic AI startup or a college festival poster.

### Placement map required for section art

Annotate the supplied screenshot with:

- **Text-safe zone:** no faces, focal lines, or high-contrast detail.
- **Control-safe zone:** no detail beneath buttons, fields, swipe controls, or arrows.
- **Crop-safe zone:** content that must survive desktop and mobile crops.
- **Bleed zone:** forms allowed to continue beyond the viewport.

Use translucent rectangles on the screenshot. Do not make the model infer safe zones from prose alone.

## Model Role Prompt

Start every generation session with:

> Act as a senior editorial illustrator and production art director experienced in vector systems, printmaking, Indian architectural geometry, and responsive web composition. You are making a production asset for an existing interface, not a standalone poster. Follow the placement map exactly, preserve negative space, use a limited palette, and return a technically clean asset that can be animated in layers. The result should feel hand-composed and locally informed while remaining contemporary and restrained.

## Shared Art Direction

- Editorial, tactile, quiet, and slightly surreal.
- Use Jaipur/Rajasthan references structurally: jali lattice, planned-city grids, carved-stone rhythm, block-print registration, arid contours, and dappled light.
- Do not paste monuments or tourist symbols into the scene.
- Prefer broad intentional shapes over noisy micro-detail.
- Coral is a controlled focal accent, not a full-page wash.
- Bone suggests paper and light; ink creates silhouettes and depth.
- Backgrounds are flat color fields, never blue-to-black gradients.
- Preserve large areas of rest around approved copy.
- The result should look commissioned, not assembled from stock vectors.

## Universal Negative Prompt

Append this to every prompt:

> No neon, cyberpunk lighting, blue-purple AI gradients, glowing orbs, bokeh blobs, glossy 3D characters, generic glassmorphism cards, stock teamwork poses, handshakes, floating dashboards, isometric SaaS art, crypto imagery, circuit motifs, random network nodes, literal palaces, Hawa Mahal silhouettes, camels, turbans, festival-poster graphics, mandala borders, crowded ornament, text, logos, watermarks, signatures, fake UI, excessive detail, lens blur, plastic surfaces, or oversaturated color.

## Technical Output Contract

### SVG

- SVG 1.1-compatible markup with one clean `viewBox`.
- No embedded raster images, base64 data, external files, scripts, text elements, external fonts, or remote filters.
- Use paths and simple primitives grouped with meaningful IDs.
- Keep independently animated layers in separate groups.
- Flatten transforms where practical.
- Stay below 250 paths unless explicitly approved.
- Use whole-pixel viewBox dimensions and a transparent background unless specified.
- Test in Chromium and Safari after export.
- Optimize with SVGO without collapsing animation groups.

### Raster portraits

- Generate `1024x1024` PNG masters in sRGB.
- Keep face and shoulders inside the central 72% circular crop.
- Export WebP delivery files at quality 82-88, ideally below 140 KB each.
- Keep crop, light direction, contrast, and coral treatment consistent across all seven.
- Do not depict real people without consent and an approved reference photo.

### Delivery paths

```text
public/assets/generated/
design-source/generated-masters/
```

Approved optimized files go in `public/assets/generated/`; editable masters go in `design-source/generated-masters/`.

## Seven Coral Profile Portraits

These replace the seven coral swipe placeholders. They are prototype fixtures, not claims about real PairUp members.

### Shared portrait prompt

> Create a square editorial portrait of a university-age Indian builder for PairUp. Shoulders-up, centered frontal or subtle three-quarter view, calm direct expression, natural posture, contemporary everyday clothing without logos. Use a cohesive two-tone screen-print treatment: coral `#E98B7F` dominant, bone `#F1EDDA` highlights, and deep coral or ink only for essential facial separation. Add subtle paper grain and imperfect print registration while preserving natural anatomy. Keep the outer 14% low-detail for a circular crop. Plain background, no props crossing the crop, no text. Match the supplied PairUp card screenshot for contrast, crop, and scale.

Apply the shared negative prompt to every portrait.

| File | Identity direction appended to the shared prompt |
| --- | --- |
| `profile-research.webp` | Observant research-oriented student, gender-neutral styling, composed analytical gaze; distinguish through face, hair, and clothing, not props. |
| `profile-agrima.webp` | Confident young woman developer, warm direct gaze, precise and capable presence; no laptop or coding cliché. |
| `profile-video.webp` | Expressive student filmmaker/content maker, energetic eyes and relaxed posture; no camera, microphone, or studio prop. |
| `profile-ria.webp` | Thoughtful young woman product designer, calm curious expression, hairstyle clearly distinct from Agrima; no fashion-editorial exaggeration. |
| `profile-hardware.webp` | Practical hardware builder, focused and grounded; no circuit board, soldering iron, goggles, or robot. |
| `profile-shreshth.webp` | Young man product thinker, perceptive, composed, and approachable rather than corporate. |
| `profile-yash.webp` | Young man presenter/storyteller, open assured expression, energetic without looking like a speaking-event stock photo. |

### Portrait acceptance

- The seven images look like one commissioned series.
- Faces are genuinely distinct rather than recolored variants.
- Coral remains dominant in every image.
- Features remain readable at a 42px circular display size.
- Head size and eye line are consistent across all crops.
- No role clichés, words, logos, or unapproved real-person likenesses.

## Hero Layer Set

Generate independent transparent SVG layers because the website animates terrain depth and the person separately.

### `pairup-hero-terrain-rear.svg`

**Context:** full-bleed hero, furthest parallax layer.

**Prompt:**

> Create a transparent `1600x900` SVG containing only distant abstract terrain for PairUp's night hero. Use broad cobalt and muted-bone paper-cut contours inspired by arid Rajasthan horizons and carved topographic rhythm. Keep the upper 62% transparent for stars and hero copy. Begin terrain softly near the lower third, with no peak behind the centered figure. Use 8-14 broad shapes, subtle imperfect edge rhythm, and minimal contour lines. Extend forms beyond both horizontal edges so 3-5% parallax never reveals a seam. No person, stars, logo, text, frame, or background rectangle.

**Accept when:** upper field is open, mobile crop remains calm, there is no focal object, and the file has fewer than 80 paths.

### `pairup-hero-terrain-mid.svg`

**Context:** middle parallax layer behind the person.

**Prompt:**

> Create a transparent `1600x900` SVG of sculptural ink-and-bone landforms. Build fluid carved-stone valleys using broad ink forms and bone inset contours. Suggest topographic erosion, jali shadow, and hand-cut paper without copying the supplied reference. Keep x=690-910 and y=480-850 clear for the standing figure. Preserve the upper 54% as transparent negative space. Use overlapping flat shapes and sparse contour strokes, never gradients. Bleed lower forms beyond all relevant canvas edges.

**Accept when:** the person remains separate, there are no face-like accidental shapes, and the file has fewer than 130 paths.

### `pairup-hero-terrain-front.svg`

**Context:** nearest parallax layer framing the figure's feet.

**Prompt:**

> Create a transparent `1600x900` foreground SVG with two or three bold topographic waves. Use ink as the dominant mass, bone as one carved inset surface, and one restrained coral landing shape beneath the figure. Keep x=720-880 and y=500-820 unobstructed above knee height. Forms may overlap only the lower 18% of the figure at ground level. Use flat color, soft organic curves, and subtle screen-print edge imperfection. Bleed the lower edge fully off canvas.

**Accept when:** coral occupies less than 12% of the area and both desktop and mobile preserve a clear standing zone.

### `pairup-builder-silhouette.svg`

**Context:** independent central hero figure.

**Prompt:**

> Create a transparent `420x760` SVG silhouette of one university-age Indian builder standing from behind and facing an open landscape. Use a natural asymmetrical stance, contemporary long outer garment with a restrained field of bone dots, simple trousers and shoes, and shoulder-length or bob-length hair moving slightly to one side. Use one elegant ink silhouette plus sparse bone garment dots. No face, body outline, accessories, bag, device, or ground shadow. Keep limbs separated enough to read at 160px display height.

**Accept when:** the figure reads immediately at small size, has no white edge, and uses fewer than 90 paths.

## Seamless Pattern Tiles

These are functional web textures, not decorative posters. Every tile must pass a visible `3x3` repeat test without seams, dark bands, or an obvious central stamp.

### `pairup-problems-grid-tile.svg`

**Context:** sits over flat `#30377D` behind the autonomous problems carousel.

**Prompt:**

> Create a seamless `368x368` transparent SVG inspired by Jaipur's planned-city grid. Use restrained orthogonal street rhythm, occasional offset courtyards, and one tiny coral registration point per quadrant. Bone lines only, designed for 6-10% composited opacity, with 1px native stroke weight. It should feel ordered and architectural without resembling graph paper, a circuit board, or a literal map. No gradient, labels, icons, border, or central medallion.

### `pairup-constellation-jali-tile.svg`

**Context:** sits beneath dense interactive stars over flat `#28517F`.

**Prompt:**

> Create a seamless `328x192` transparent SVG jali tile based on interlocking octagonal-flower geometry and carved-stone negative space. Reduce the motif to the fewest possible lines. Use bone strokes only, designed for 4-5% opacity beneath the star field. Keep openings generous so stars remain primary. No planet-like circles, mandala center, coral, gradient, or border.

### `pairup-collision-honeycomb-tile.svg`

**Context:** sits over flat `#24369A` behind the seven-card swipe sequence.

**Prompt:**

> Create a seamless `432x304` transparent SVG inspired by repeated jharokha-window and honeycomb-facade rhythm. Abstract the architecture into alternating shallow arch openings and tiny offset coral points. Use thin bone paths designed for 8-12% opacity. It should read as a quiet spatial screen rather than a literal palace facade. No monument silhouette, ornate frame, floral border, gradient, or text.

### `pairup-profile-mesh-tile.svg`

**Context:** used only inside the near-black signup/profile card.

**Prompt:**

> Create a seamless `320x320` transparent SVG mesh using compact carved-window geometry with alternating diamond and rounded-square openings. Use muted bone strokes and sparse coral intersections. It must remain visible at 5-8% opacity without interfering with input labels or profile art. No gradient, frame, focal motif, or text.

### Pattern acceptance

- Render each tile as a `3x3` matrix and inspect every seam.
- Test against the exact production background color.
- Confirm mobile scaling does not create moire.
- Confirm the pattern remains subordinate to text and animation.
- Keep every optimized tile below 18 KB.

## Transition And Section SVGs

### `pairup-wave-transition.svg`

**Prompt:**

> Create a transparent `1600x420` section transition made from three broad topographic waves. Bridge cobalt, bone, and ink areas without a rectangular background. Use flat vector shapes, one restrained coral accent, and broad curves that survive narrow mobile cropping. Bleed beyond both horizontal edges. No gradient, noise texture, words, icons, or small details.

### `pairup-profile-card-art.svg`

**Context:** replaces the inline artwork inside the final signup profile card.

**Prompt:**

> Create a transparent `520x280` editorial SVG combining one abstract coral circular portrait window, a simple builder silhouette, three tiny skill-token shapes, and one organic connecting path. Use ink, coral, and bone only. Keep the left and lower portions quiet for existing form labels. No readable words, fake inputs, interface chrome, arrows, checkmarks, logos, gradients, or dashboard motifs.

### `pairup-momentum-lines.svg`

**Context:** pre-launch momentum section; it must not imply completed projects or live team formation.

**Prompt:**

> Create a transparent `1400x760` SVG representing pre-launch builder momentum. Begin with sparse individual marks, profile reservations, and invitation signals, then organize them into a calm directional flow toward a shared launch point. Use abstract paths and profile circles rather than a technical node graph. Use ink and bone with small coral accents. No metrics, words, fake notifications, university counts, completed teams, product screens, gradients, or claims of shipped work.

## Code-Generated Elements: Do Not Generate

Do not create image assets for:

- Dense interactive stars and brightness twinkle.
- Shooting stars that draw each team line.
- The repeating 2-5-person constellation lifecycle.
- Coral profile morph, 30% pop, blur, and disappearance.
- Swipe-card movement and red/green edge feedback.
- PairUp logo or brand mark.
- Black glass centre circle.
- UI icons, buttons, inputs, or status transitions.

These require pointer response, timing control, responsive geometry, and reduced-motion behavior, so they remain Canvas, HTML, CSS, and Lucide components.

## Generation Workflow

1. Assemble the complete context bundle.
2. Generate three low-resolution composition concepts, not three color variants.
3. Choose by layout fit, safe-zone discipline, and negative space.
4. Generate the final vector or high-resolution raster master.
5. Apply the asset-specific acceptance checks.
6. Normalize SVG groups, IDs, fills, and path count manually.
7. Optimize with SVGO while retaining animation groups.
8. Export WebP portrait derivatives.
9. Integrate one asset at a time and compare desktop and mobile framing.
10. Retain the current code-drawn fallback until the replacement passes performance and visual checks.

## Final Review Checklist

- Does the asset fit the placement map without moving approved copy?
- Does it share atmosphere with the majestic reference without copying it?
- Is the Rajasthan influence structural and restrained rather than touristic?
- Is the background a flat field rather than a blue-black gradient?
- Is coral a focal signal rather than a neon glow?
- Does the important content survive a `390px` viewport?
- Are generated words, logos, watermarks, signatures, and fake UI absent?
- Are SVG groups technically clean and animation-ready?
- Are portraits optimized and safe for circular crops?
- Does the section remain fast enough to enter without a loading delay?
