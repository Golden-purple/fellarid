# FellaRide UI Registry

Visual patterns captured from the first React implementation. These patterns mirror the approved Stitch artifacts and are the baseline for future UI work.

### Entry / Butterfly Reveal

File: `src/App.tsx`, `src/styles.css`, `public/butterfly.png`
Last updated: 2026-09-14

| Property         | Pattern |
| ---------------- | ------- |
| Background       | `#121116` canvas with restrained violet radial atmosphere |
| Border           | `1px solid #2B2633` hairlines |
| Border radius    | `4px` controls, no decorative pills |
| Text — primary   | `#E3E0E6`, Plus Jakarta Sans |
| Text — secondary | `#B7B1BC` |
| Spacing          | Wide editorial measure, `clamp()` section spacing |
| Hover state      | `translateY(-2px)` on primary action |
| Shadow           | Controlled dark butterfly grounding shadow only |
| Accent usage     | Supplied RGB/glitch raster artwork with restrained violet atmosphere |

**Pattern notes:** The entry is an editorial split composition. The butterfly uses the supplied reconstructed raster asset with screen blending so its black grounding and grid integrate into the existing canvas; it is not a persistent background animation.

### Opportunity Row

File: `src/App.tsx`, `src/styles.css`
Last updated: 2026-09-14

| Property         | Pattern |
| ---------------- | ------- |
| Background       | Transparent canvas, `#1B1820` tint on hover |
| Border           | `1px solid #2B2633` bottom divider |
| Border radius    | None; editorial list divider treatment |
| Text — primary   | `#E3E0E6`, Plus Jakarta Sans, 21px title |
| Text — secondary | `#B7B1BC` event and interpretation copy |
| Spacing          | `24px 0 26px`, 50px rank column, 145px score column |
| Hover state      | Violet-tinted background and 12px horizontal inset |
| Shadow           | None |
| Accent usage     | `#A98FBD` for rank, score, and View opportunity action |

**Pattern notes:** The Opportunity is the primary product object. The row order is Opportunity → score → why it ranks → timing/location → source context.

### Surface Panel

File: `src/App.tsx`, `src/styles.css`
Last updated: 2026-09-14

| Property         | Pattern |
| ---------------- | ------- |
| Background       | `#1B1820`, raised panels use `#221E29` |
| Border           | `1px solid #2B2633` |
| Border radius    | `8px` |
| Text — primary   | `#E3E0E6`, Plus Jakarta Sans |
| Text — secondary | `#B7B1BC`; quiet text `#77707F` |
| Spacing          | `22px` internal padding, `14px` between panels |
| Hover state      | No hover required for static context panels |
| Shadow           | None; tonal stepping provides depth |
| Accent usage     | `#8B70A5` hairline, links, and factor values |

**Pattern notes:** Panels are used only when they establish evidence, methodology, or partnership hierarchy. They are not generic KPI cards.

### State Card

File: `src/App.tsx`, `src/styles.css`
Last updated: 2026-09-14

| Property         | Pattern |
| ---------------- | ------- |
| Background       | `#1B1820` |
| Border           | `1px solid #2B2633` |
| Border radius    | `8px` |
| Text — primary   | `#E3E0E6`, Plus Jakarta Sans |
| Text — secondary | `#B7B1BC`; state notes `#77707F` |
| Spacing          | `28px` panel padding, structural top/bottom dividers |
| Hover state      | Actions use the shared button pattern |
| Shadow           | None |
| Accent usage     | Dusty violet for state markers and primary recovery actions |

**Pattern notes:** Loading uses layout-matched skeletons, Empty explains why no Opportunity was created, and Error explains missing public evidence without technical health/status language.

### Detail Section

File: `src/App.tsx`, `src/styles.css`
Last updated: 2026-09-14

| Property         | Pattern |
| ---------------- | ------- |
| Background       | Transparent canvas with optional `#221E29` score panel |
| Border           | `1px solid #2B2633` section dividers |
| Border radius    | None for dossier sections; `8px` for factor/partnership panels |
| Text — primary   | `#E3E0E6`, Plus Jakarta Sans |
| Text — secondary | `#B7B1BC` |
| Spacing          | `22px` section top padding, `38px` content inset on desktop |
| Hover state      | Actions follow shared button/link behavior |
| Shadow           | None |
| Accent usage     | JetBrains Mono section index and factor values in `#A98FBD` |

**Pattern notes:** Detail always follows the evidence-led chain: public event evidence → FellaRide interpretation → score/factors → location/timing → provenance/limitations → partnership context.

## Shared tokens

- Canvas: `#121116` / `#141318`
- Surface: `#1B1820`
- Raised surface: `#221E29`
- Primary text: `#E3E0E6`
- Muted text: `#B7B1BC`
- Quiet label: `#77707F`
- Border: `#2B2633`
- Strong border: `#3D3647`
- Accent: `#8B70A5`
- Accent text: `#A98FBD`
- Display/body: Plus Jakarta Sans
- Labels/data: JetBrains Mono
- Controls: 4px radius
- Panels: 8px radius
- Modal-scale surfaces: 12px radius

### Butterfly Transition Overlay

File: `src/App.tsx`, `src/styles.css`, `public/butterfly.png`
Last updated: 2026-09-14

| Property         | Pattern |
| ---------------- | ------- |
| Background       | Temporary near-black radial transition veil with restrained violet radiance |
| Border           | None; scanline texture provides the temporary field structure |
| Border radius    | None; the overlay is viewport-scale |
| Text — primary   | None; the layer is decorative and `aria-hidden` |
| Text — secondary | None |
| Spacing          | Fixed viewport overlay; one flight layer with a bounded 13-fragment trail and two clipped wing layers |
| Hover state      | None; pointer events remain disabled during navigation |
| Shadow           | Controlled butterfly drop shadow plus limited cyan/magenta channel separation |
| Accent usage     | Supplied RGB/glitch raster artwork with temporary cyan and magenta trail highlights |

**Pattern notes:** The overlay is mounted only for navigation, travels diagonally across the viewport, and switches the destination at the trail expansion peak. Forward motion runs left-to-right; reverse motion runs right-to-left. The moving overlay uses the canonical `public/butterfly.png`; wing masks reuse that same image and animate around separate roots to create the flap. Forward flight applies a horizontal flip to the internal butterfly artwork only, so the reverse flight keeps the asset's original orientation while its path and timing remain unchanged. Future major-surface navigation should request this coordinator rather than duplicating butterfly markup. Reduced motion removes the flight and uses a short veil-only reveal.
