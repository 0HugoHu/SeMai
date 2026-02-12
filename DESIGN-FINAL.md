# 色脉 (SeMai) — Final Design Document

> **Project name:** 色脉 (semai) — "Color Lineage / Color Pulse"
>
> 脉 carries three meanings that define this project:
> - **Lineage** (脉络) — tracing colors through dynasties
> - **Pulse** (脉搏) — the site breathes, it is alive
> - **Flow** (经脉) — colors connect to mood, body, and emotion

---

## 1. Project Vision

An **immersive digital color museum** for Chinese traditional colors inspired by
"中国传统色：故宫里的色彩美学". The focus is **the colors themselves** — cultural
artifacts, dynasties, and moods serve as *context for the colors*, not the other
way around.

**Core principles:**
- Colors are the protagonist; artifacts and history are the storytelling medium
- The site is a living creature — it breathes, pulses, and reacts to presence
- Mouse-proximity and hover interactions — responds to presence, not just clicks
- Floating, magnetic, tactile — the UI should feel physical and alive
- Bilingual (中文 / English) from day one
- Not another "full-background color swatch" site

---

## 2. Information Architecture — Unified Explorer with Lenses

**One main exploration space** where all colors live together. Users switch
between "lenses" that rearrange the same canvas:

```
HOME (landing — alive, breathing, animated)
  └── EXPLORE (the main space — all colors)
        ├── Lens: Hue Family (色系)
        ├── Lens: Dynasty (timeline ribbon)
        └── Lens: Mood/Emotion (情绪)
  └── PALETTE LAB (build & export palettes)
  └── ABOUT
```

**How it works:**
- Default view: all colors float as tactile objects in a canvas
- Toggle **Hue Lens**: colors group by color family (红, 黄, 青, 紫...)
- Toggle **Dynasty Lens**: colors rearrange into a horizontal timeline
- Toggle **Mood Lens**: colors cluster by emotion
- Lenses are mutually exclusive — switching triggers fluid rearrangement animation
- Material is stored in data but NOT a navigation axis

**The landing page is not static.** It breathes and shifts — the ambient
animation changes character based on mood, dynasty, and color. Imagine the
site as a living creature with a pulse.

---

## 3. Dynasty Scope & Timeline Design

### Full dynasty list:
> 夏 · 商 · 周 · 秦 · 汉 · 三国 · 两晋 · 南北朝 · 隋 · 唐 · 五代十国 · 辽 · 宋 · 西夏 · 金 · 元 · 明 · 清

### UI Strategy: Progressive Disclosure
- The timeline shows a continuous time axis, not equally-spaced dynasty blocks
- **Major dynasties** (唐, 宋, 元, 明, 清 and others with rich data) are always
  visible with their color clusters
- **Minor dynasties** (夏, 商, 三国, etc.) appear as subtle markers on the
  timeline, expanding to show their colors when the mouse hovers over that
  time period
- Dynasties with more color data naturally occupy more visual space
- Each dynasty has a brief introduction tooltip/panel on hover
- This keeps the UI clean while honoring the full historical scope

---

## 4. Mood/Emotion System

### Mood Taxonomy

| Mood | Chinese | Description |
|------|---------|-------------|
| Majestic | 威严 | Imperial authority, dragon robes, vermillion walls |
| Gentle | 温润 | Jade-like warmth, celadon, soft silk |
| Solemn | 庄重 | Ritual and ceremony, deep purples and blacks |
| Ethereal | 空灵 | Misty landscapes, pale greens and silvers |
| Deep | 深沉 | Night sky, lacquer depth, indigo |
| Joyous | 喜庆 | Festival reds, golds, celebration |
| Elegant | 雅致 | Literati taste, muted tones, ink-wash adjacent |
| Natural | 天然 | Earth, wood, mineral, unprocessed pigment |

### Mood Behaviors
- **One color can have multiple moods** — a color floats between mood clusters
  when the Mood lens is active
- **Color combinations create moods** — two or more colors together can evoke a
  mood that neither has alone (future feature: research via academic papers on
  color psychology and traditional Chinese color theory)
- Moods connect to the "pulse" metaphor — the site's breathing animation shifts
  character based on the mood cluster the user is exploring

---

## 5. Visual Design Direction

### Chosen Direction: "Floating Material Orbs" + Ambient Color Field

**A. The Canvas — Ambient Color Field**
- Background is NOT a single flat color
- A soft, slowly-shifting **gradient field** that reacts to which colors the
  user is near or has selected
- Think: northern lights, but subtle and Eastern in palette
- The field breathes — slow, organic undulation (CSS/shader-based)
- When a specific color is focused, the field gently shifts toward that hue
- **Color accuracy concern:** the ambient field must not distort perception of
  the actual color values. Solutions:
  - Color objects have a neutral-bordered "true color" zone that is unaffected
    by the ambient field
  - The detail panel always shows color on a neutral (white/dark) background
  - An optional "neutral mode" toggle dims the ambient field entirely

**B. Color Objects — Floating Tactile Forms**
- Each color is a **3D-ish floating object** (not a flat card)
- Material texture is an **artistic choice per color** (not literally tied to
  the material field — a color can look like silk, ceramic, lacquer, stone, or
  metal based on what feels right):
  - Silk: soft, slightly translucent, fabric-like sheen
  - Ceramic: glossy, reflective surface
  - Lacquer: deep, wet-looking gloss
  - Stone/mineral: matte, rough texture
  - Metal: metallic sheen
- Objects float with subtle physics (gentle bobbing, rotation)
- **Magnetic interaction**: objects respond to cursor proximity
  - Nearby objects drift toward cursor slightly
  - Hovered object grows, tilts toward viewer, reveals info
  - Objects gently push away from each other (collision avoidance)
- On click/tap: object expands into full color detail view

**C. Color Detail — Immersive Expansion**
When a color is selected (no page navigation):
- The selected color object smoothly expands to fill ~60% of the viewport
- Other objects drift outward and blur slightly
- A detail panel slides in with:
  - Color name (Chinese + pinyin)
  - All color values (HEX, RGB, HSL, CMYK) with one-click copy
  - Dynasty and mood tags
  - Brief poetic description
  - Related artifact image (from public domain sources)
  - "Similar colors" shown as smaller floating objects nearby
  - [Add to Palette] button
- Clicking away smoothly reverses the animation

**D. Dynasty Timeline — Scroll Ribbon**
When Dynasty lens is active:
- A horizontal timeline ribbon appears (scrollable)
- Colors settle onto their dynasty positions with spring physics
- Major dynasties always visible; minor dynasties expand on hover
- Each dynasty has a brief intro
- Scroll position affects the ambient background field

**E. Mood Clusters — Gravitational Grouping**
When Mood lens is active:
- Mood labels appear as anchor points in the canvas
- Colors float toward their mood group with gravitational physics
- Colors with multiple moods float between groups
- Each mood cluster has its own ambient micro-gradient

---

## 6. Mouse-Proximity Interactions

Desktop interactions (non-click):

1. **Cursor lantern**: a soft radial glow follows the cursor, illuminating
   nearby color objects like a lantern in a dark gallery
2. **Magnetic drift**: objects within a radius drift slightly toward cursor
3. **Ripple wake**: as cursor moves quickly, objects gently wobble in its wake
4. **Ambient field pull**: background gradient subtly shifts hue toward
   whatever cluster the cursor is near
5. **Parallax depth**: objects at different "depths" move at different rates
   relative to cursor position

### Mobile Equivalent
- Touch-drag to explore the canvas
- Tap to select a color
- Tilt-based parallax via device gyroscope
- Swipe to switch lenses

---

## 7. Animation System

### Core Animations
| Animation | Trigger | Tech |
|-----------|---------|------|
| Object floating/bobbing | Idle | Framer Motion / CSS |
| Magnetic cursor attraction | Mouse move | Framer Motion + pointer events |
| Lens transition (rearrange) | Lens toggle | Framer Motion layout animations |
| Color detail expand/collapse | Click | Framer Motion AnimatePresence |
| Ambient background breathing | Always | CSS gradient animation or WebGL shader |
| Particle gather on load | Page load | GSAP or Three.js |
| Ripple/wake on fast cursor | Mouse move | Custom spring physics |

### Loading / Entry Animation
- Screen starts as a dark, quiet void
- Colored particles drift in from edges
- Particles coalesce into the floating color objects
- The ambient field fades in and begins breathing
- Duration: ~2-3 seconds, skippable

### Performance
- GPU-accelerated transforms only (translate3d, opacity, scale)
- Virtualize off-screen objects
- Reduced-motion mode for accessibility
- LOD: nearby objects get full animation, distant ones simplify

---

## 8. Color Picker / Detail Design

### Copy Station
```
+-----------------------------------+
|  凤信紫  Feng Xin Zi              |
|                                   |
|  HEX   #6E3E8E            [copy] |
|  RGB   110, 62, 142        [copy] |
|  HSL   277deg, 39%, 40%    [copy] |
|  CMYK  23, 56, 0, 44       [copy] |
|  CSS   var(--feng-xin-zi)  [copy] |
|  TW    feng-xin-zi          [copy]|
|                                   |
|  [Copy All as JSON]               |
+-----------------------------------+
```

- One-click copy with brief flash animation feedback
- "Copy All" exports JSON snippet with all formats

### Live Preview Pane
- Color applied to: text on white, text on black, UI button mockup,
  gradient with complementary color
- Always shown on neutral background for accuracy

---

## 9. Palette Lab

A dedicated workspace for building color palettes from traditional colors.

**Features:**
- Drag colors from the explorer into a palette tray (up to 8 colors)
- Auto-suggest harmonious combinations (complementary, analogous, triadic)
  using traditional colors only
- Preview palettes applied to:
  - A simple UI mockup (buttons, cards, text)
  - A traditional pattern (geometric lattice or cloud motif)
  - A gradient strip
- Export: JSON, CSS custom properties, Tailwind config snippet, PNG swatch
- Save/load palettes via localStorage (no backend needed)

---

## 10. Data Model

### Color Entry

```json
{
  "id": "feng-xin-zi",
  "name": "凤信紫",
  "pinyin": "Feng Xin Zi",
  "hex": "#6E3E8E",
  "rgb": [110, 62, 142],
  "cmyk": [23, 56, 0, 44],
  "hsl": [277, 39, 40],
  "dynasties": ["明"],
  "category": "紫",
  "moods": ["庄重", "威严"],
  "material": "织锦",
  "description": "源于宫廷织锦中的紫色调，凤鸟传信之色。",
  "descriptionEn": "A purple from imperial brocade, the color of phoenix messengers.",
  "artifactImage": null,
  "artifactSource": null,
  "artifactLicense": null
}
```

### Data Format
**One JSON file per color** (e.g., `data/colors/feng-xin-zi.json`) — reduces
context load for future AI-assisted editing, cleaner git diffs.

A build-time script aggregates all individual files into a single bundle.

### Data Population Strategy
1. **Phase 1 (MVP):** ~50-80 colors from best-effort knowledge + publicly known
   traditional Chinese colors. Marked as "placeholder" for Hugo to verify.
2. **Phase 2:** Hugo manually verifies against the book, adds descriptions.
3. **Phase 3:** Add artifact images from public domain sources.

---

## 11. Image Sources

### Strategy
Do NOT use images from the book. Source from public domain databases.

### Priority Sources

| Source | License | Why |
|--------|---------|-----|
| The Met Open Access | CC0 (public domain) | Best licensing, good API, ~4,000+ Chinese items |
| Smithsonian Open Access | CC0 | Freer/Sackler Gallery — strong Chinese collection |
| Wikimedia Commons | CC-BY-SA / Public Domain | Large collection, good API |
| Cleveland Museum of Art | CC0 | Notable Chinese ceramics and paintings |
| 故宫博物院数字文物库 | Unclear (educational use) | Best authenticity; manual curation, no API |

Non-Chinese museums holding genuine Chinese artifacts are acceptable.

---

## 12. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 14+** (App Router) | SSR for SEO, React ecosystem |
| Styling | **Tailwind CSS** | Utility-first, responsive, custom design |
| Animation | **Framer Motion** (primary) | Layout animations, gestures, AnimatePresence |
| Animation | **GSAP** (secondary) | Complex timeline sequences |
| 3D/Shader | **Three.js / @react-three/fiber** (if needed) | Ambient field, particle effects |
| Physics | **Framer Motion** springs / custom | Magnetic/gravitational interactions |
| State | **Zustand** | Lightweight global state |
| Data | **Static JSON** (per-color files) | No database needed |
| i18n | **next-intl** or custom | Chinese + English |
| Persistence | **localStorage** | Palette saving, preferences |
| Deployment | **Docker** | Dockerfile + docker-compose |
| Fonts | **Noto Serif SC** + system sans | Elegant Chinese typography |

No database. No user accounts. All local.

---

## 13. Scope & Phasing

### MVP (Phase 1) — Core Experience
- [ ] Landing page with particle-coalesce entry animation + breathing ambient field
- [ ] Unified Explorer with floating color objects
- [ ] Magnetic cursor interaction (drift + lantern glow)
- [ ] 3 lenses: Hue Family, Dynasty (timeline with progressive disclosure), Mood
- [ ] Color detail expansion with all formats + one-click copy
- [ ] ~50-80 placeholder colors in per-color JSON files
- [ ] Bilingual (中文 / English)
- [ ] Responsive (desktop-first, mobile-adapted with touch + gyroscope)
- [ ] Docker deployment (Dockerfile + docker-compose)
- [ ] Reduced-motion accessibility mode
- [ ] Neutral mode toggle for color accuracy

### Phase 2 — Palette Lab & Polish
- [ ] Palette Lab workspace (drag, auto-suggest, export)
- [ ] Richer color descriptions and verified data from book
- [ ] Artifact images from public domain sources
- [ ] Performance optimization (virtualization, LOD)
- [ ] Dynasty brief introductions

### Phase 3 — Enrichment
- [ ] Material-texture rendering on color objects (silk, ceramic, lacquer, etc.)
- [ ] Color combination mood research (academic papers)
- [ ] Pattern/motif previews in Palette Lab
- [ ] Search functionality (by name, pinyin, hex)
- [ ] Color relationship visualization (colors connected by mood, dynasty, hue)

### Explicitly Descoped
- User accounts / authentication
- Server-side database (PostgreSQL deferred indefinitely)
- Community features
- 3D palace walkthrough
- Book content or book images
- E-commerce / monetization

---

## 14. Key Differentiators vs. Existing Sites

| Existing sites | 色脉 (SeMai) |
|----------------|--------------|
| Flat color grid or list | Floating 3D-ish objects with physics |
| Full-page background color fill | Ambient gradient field that breathes |
| Click-only interaction | Mouse proximity, magnetic drift, cursor lantern |
| Separate pages per category | Unified canvas with switchable lenses |
| Static presentation | Particle animations, spring physics, parallax |
| Basic color code display | Ceremonial detail panel with one-click copy |
| No palette building | Full Palette Lab with export |
| Chinese only | Bilingual (中文 / English) |
| Dead/fixed pages | A living, breathing creature with a pulse |

---

## Decisions Log

All open questions resolved:

| # | Question | Decision |
|---|----------|----------|
| 1 | Dynasty sparsity | Show all on timeline; minor dynasties appear on hover (progressive disclosure) |
| 2 | Multiple moods per color | Yes. Color combos creating moods is a future research area. |
| 3 | Data format | One JSON file per color |
| 4 | Non-Chinese museum images | Acceptable |
| 5 | Palette persistence | localStorage only |
| 6 | Material texture on objects | Artistic choice per color, not literal |
| 7 | Mobile interaction | Touch-drag, tap-select, gyroscope parallax |
| 8 | Language | Bilingual: Chinese + English |
| 9 | Hosting | Hugo handles hosting; project provides Docker |

---

*Ready for implementation upon Hugo's approval.*
