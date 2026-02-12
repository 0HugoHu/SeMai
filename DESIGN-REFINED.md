# 宫彩 (GongCai) — Refined Design Document
(this name is just so so, I don't really limit to the forbidden city or GuGong, can you give me some other options?)
> Project name: **gongcai** (宫彩) — "Palace Colors"
> Origin: DESIGN.md + Hugo's inline feedback, refined and rescoped by Claude

---

## 1. Project Vision

An **immersive digital color museum** for Chinese traditional colors inspired by
"中国传统色：故宫里的色彩美学". The focus is **the colors themselves** — cultural
artifacts, dynasties, and moods serve as *context for the colors*, not the other
way around.

**Core principles:**
- Colors are the protagonist; artifacts and history are the storytelling medium
- Animation, interaction, and immersion are first-class citizens
- Mouse-proximity and hover interactions — the site responds to presence, not just clicks
- Floating, magnetic, tactile — the UI should feel physical and alive
- Not another "full-background color swatch" site — be boldly different

---

## 2. What This Is NOT

- Not a cultural relics database (artifacts serve colors, not vice versa)
- Not a pure white/black ink-on-paper aesthetic (colorful, alive, vibrant)
- Not a flat grid of color swatches with a giant background fill
- Not a complex multi-section academic reference site

---

## 3. Information Architecture — Unified Explorer

### The Problem with the Original IA
The original design separated Dynasty / Material / Mood into three parallel
navigation paths. Hugo's feedback: "try to combine them in one unified way."
Material-based browsing was also rejected as too relic-focused.

### Proposed: Single Unified Explorer with Layered Filters

**One main exploration space** where all colors live together. Users can
*layer* different lenses onto the same space:
(This design is creative and cool. Ok, let's try using this way first for the draft. Also pay attention that even in the home landing page, there should be dynamic animations so the website is not fixed, but live, or it is breathing, it's better to change the breathe by mood, dynasty and color as well, imagine this is a human or creature, it has lives)
```
HOME (landing experience)
  └── EXPLORE (the main space — all colors)
        ├── Lens: Dynasty (timeline ribbon)
        ├── Lens: Mood/Emotion (情绪)
        └── Lens: Hue Family (色系)
  └── PALETTE LAB (build & export palettes)
  └── ABOUT
```

**How it works:**
- Default view: all colors float as tactile objects in a canvas
- Toggle a **Dynasty Lens**: colors rearrange into a horizontal timeline
- Toggle a **Mood Lens**: colors cluster by emotion (威严, 温润, 空灵, 深沉, etc.)
- Toggle a **Hue Lens**: colors group by color family (红系, 黄系, 青系, 紫系...)
- Lenses are mutually exclusive — switching lenses triggers a fluid rearrangement animation
- Material is stored in data but NOT a primary navigation axis

### Dynasty Scope
Not limited to 5 dynasties. The full scope:
(Now I think twice, are these too many? how to make the focus then? I do want to have all these main dynasties but how to arrange the UI?)
> 夏 · 商 · 周 · 秦 · 汉 · 三国 · 两晋 · 南北朝 · 隋 · 唐 · 五代十国 · 辽 · 宋 · 西夏 · 金 · 元 · 明 · 清

However, **practically**, color data will be concentrated in certain dynasties
(Tang, Song, Ming, Qing have the richest color traditions). Dynasties with
fewer colors will still appear but won't be forced to fill equal space.
(Yes, this fine. Also a brief introduction of the dynasty is good)
> **Open question for Hugo:** Should dynasties with very few documented
> traditional colors (e.g., 夏, 商) be shown as sparse/empty on the timeline
> (honoring historical accuracy), or omitted until data is available?

(haha we are asking the same question. ok, so still show them but should better arrange the UI, for example we can that only show the timeline, and only when the mouse if floating on specific time period, we show up these minor dynasties)

### Mood/Emotion Categories (Expanded)
Hugo wanted to expand this. Proposed mood taxonomy:

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

> **Open question for Hugo:** Any moods to add/remove/rename? Should one
> color be able to have multiple moods (likely yes)?

(Currently this is fine, yes one color can definitely represent the multipel moods. We can even make some connections or bindings like two or more can altogether create some moods. We can take this seriously by research on the relevant papers)

---

## 4. Visual Design Direction

### Rejected Approaches
- ~~Pure 宣纸 (xuan paper) black-and-white~~ — too monochrome, boring
- ~~Full-page background color fill~~ — every competitor does this
- ~~Material-texture-heavy cards~~ — too relic-focused

### Chosen Direction: "Floating Material Orbs" + Ambient Color Field

The core visual concept combines Hugo's preferred elements:

**A. The Canvas — Ambient Color Field**
- The background is NOT a single flat color
- Instead: a soft, slowly-shifting **gradient field** that reacts to which
  colors the user is near or has selected (But this affects the accuracy of the color picked? I said no single full-screen colors, but there must be some workarounds right?)
- Think: northern lights, but subtle and Eastern in palette
- The field breathes — slow, organic undulation (CSS/shader-based)
- When a specific color is focused, the field gently shifts toward that hue
  without becoming a flat fill

**B. Color Objects — Floating Tactile Forms**
- Each color is represented as a **3D-ish floating object** (not a flat card)
- Objects have material qualities:
  (I like this)
  - Silk colors → soft, slightly translucent, fabric-like sheen
  - Ceramic colors → glossy, reflective surface
  - Lacquer colors → deep, wet-looking gloss
  - Stone/mineral colors → matte, rough texture
  - Metal colors → metallic sheen
- Objects float with subtle physics (gentle bobbing, rotation)
- **Magnetic interaction**: objects respond to cursor proximity
(so far this is good, but we will make adjustments going forward)
  - Nearby objects drift toward cursor slightly
  - Hovered object grows, tilts toward viewer, reveals info
  - Objects gently push away from each other (collision avoidance)
- On click/tap: object expands into full color detail view

> **Note:** The material texture is a *visual property of the color object*,
> not a navigation category. A silk-textured purple orb tells you this color
> came from silk without needing a "filter by material" menu.

**C. Color Detail — Immersive Expansion**
When a color is selected, rather than navigating to a new page:
- The selected color object smoothly expands to fill ~60% of the viewport
- Other objects drift outward and blur slightly
- A detail panel slides in with:
  - Color name (Chinese + pinyin)
  - All color values (HEX, RGB, HSL, CMYK)
  - One-click copy for each format
  - Dynasty and mood tags
  - Brief poetic description
  - Related artifact image (from public domain sources)
  - "Similar colors" shown as smaller floating objects nearby
- Clicking away smoothly reverses the animation

**D. Dynasty Timeline — Scroll Ribbon**
When Dynasty lens is active:
- A horizontal timeline ribbon appears (scrollable)
- Colors settle onto their dynasty positions with spring physics
- The ribbon itself has a scroll/silk texture
- Eras with rich color data are wider; sparse eras are narrow
- Scroll position affects the ambient background field

**E. Mood Clusters — Gravitational Grouping**
When Mood lens is active:
- Mood labels appear as anchor points in the canvas
- Colors float toward their mood group with gravitational physics
- Each mood cluster has its own ambient micro-gradient
- Overlapping moods (colors with multiple moods) float between groups

### Mouse-Proximity Interactions (Non-Click)
Hugo specifically requested cursor-tracking interactions:

1. **Cursor light**: a soft radial glow follows the cursor, illuminating
   nearby color objects like a lantern in a dark gallery
2. **Magnetic drift**: objects within a radius drift slightly toward cursor
3. **Ripple wake**: as cursor moves quickly, objects gently wobble in its wake
4. **Ambient field pull**: the background gradient subtly shifts hue toward
   whatever cluster the cursor is near
5. **Parallax depth**: objects at different "depths" move at different rates
   relative to cursor position

---

## 5. Animation System

### Core Animations
| Animation | Trigger | Tech |
|-----------|---------|------|
| Object floating/bobbing | Idle | Framer Motion / CSS |
| Magnetic cursor attraction | Mouse move | Framer Motion + pointer events |
| Lens transition (rearrange) | Lens toggle | Framer Motion layout animations |
| Color detail expand/collapse | Click | Framer Motion AnimatePresence |
| Ambient background field | Always | CSS gradient animation or WebGL shader |
| Particle gather on load | Page load | GSAP or Three.js |
| Ripple/wake on fast cursor | Mouse move | Custom spring physics |

### Loading / Entry Animation
On first visit:
- Screen starts as a dark, quiet void
- Colored particles drift in from edges
- Particles coalesce into the floating color objects
- The ambient field fades in
- Duration: ~2-3 seconds, skippable

### Page Transitions
- No hard page navigations — SPA transitions throughout
- Lens changes: fluid layout animation (objects glide to new positions)
- Palette Lab entry: objects shrink and dock to a sidebar; workspace expands

### Performance Considerations
- Use GPU-accelerated transforms only (translate3d, opacity, scale)
- Limit simultaneous animated objects (virtualize off-screen objects)
- Provide a reduced-motion mode for accessibility
- Consider LOD: nearby objects get full animation, distant ones simplify

---

## 6. Color Picker / Detail Design

### Not a Standard Input
The color picker is designed with "ceremony" — it should feel special.

**Jade Disc (玉盘) Color Wheel:**
- A circular color display reminiscent of a jade bi disc
- The selected color sits at center
- Related traditional colors arranged around the ring
- Drag to explore neighboring colors

**Copy Station:**
```
┌─────────────────────────────────┐
│  凤信紫  Feng Xin Zi           │
│                                 │
│  HEX   #6E3E8E          [copy] │
│  RGB   110, 62, 142      [copy] │
│  HSL   277°, 39%, 40%    [copy] │
│  CMYK  23, 56, 0, 44     [copy] │
│  CSS   var(--feng-xin-zi) [copy]│
│  TW    feng-xin-zi        [copy]│
│                                 │
│  [Copy All as JSON]             │
└─────────────────────────────────┘
```

- Each row has a one-click copy button
- Visual feedback on copy (brief flash animation)
- "Copy All" exports a JSON snippet with all formats

**Live Preview Pane:**
- Small preview showing the color applied to:
  - Text on white / text on black
  - A UI button mockup
  - A simple gradient with complementary color

---

## 7. Palette Lab

A dedicated workspace for building color palettes from traditional colors.

**Features:**
- Drag colors from the explorer into a palette tray (up to 8 colors)
- Auto-suggest harmonious combinations (complementary, analogous, triadic)
  using traditional colors only
- Preview palettes applied to:
  - A simple UI mockup (buttons, cards, text)
  - A traditional pattern (geometric lattice or cloud motif)
  - A gradient strip
- Export options:
  - JSON (array of color objects)
  - CSS custom properties
  - Tailwind config snippet
  - PNG swatch image
- Save/load palettes (localStorage initially; no backend needed for MVP)

> **Descoped from original:** "织锦纹理预览" (silk texture preview) and
> "漆器效果预览" (lacquer preview) are cool but high effort. Recommend as
> post-MVP enhancement. The material textures on the color objects in the
> Explorer already hint at this.

---

## 8. Data Model

### Color Entry (refined)

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
  "artifactImage": null,
  "artifactSource": null,
  "artifactLicense": null
}
```

**Key changes from original:**
- `dynasties` is an array (a color can span multiple dynasties)
- `moods` is an array (a color can evoke multiple emotions)
- `category` is just the hue family name (红, 黄, 青, 紫, etc.)
- `rgb` and `cmyk` are arrays of numbers (easier to work with in code)
- Artifact fields are nullable (can be populated incrementally)
- `material` is retained as metadata but not used for navigation

### Data Population Strategy
1. **Phase 1 (MVP):** Populate ~50-80 colors from best-effort knowledge of
   the book + publicly known traditional Chinese colors. Mark these as
   "placeholder" in a meta field.
2. **Phase 2:** Hugo manually verifies and corrects colors against the book,
   adds descriptions.
3. **Phase 3:** Add artifact images from public domain sources.

> **Open question for Hugo:** Would you prefer the initial dataset as a
> single JSON file, or as individual JSON files per color? Single file is
> simpler; individual files make git diffs cleaner for manual editing.

---

## 9. Image Sources — Scoping

### Legal Position
Non-commercial ≠ free to use book images. We will NOT use images from the book.

### Recommended Public Domain / Open Sources

| Source | URL | Quality | API? | License | Notes |
|--------|-----|---------|------|---------|-------|
| 故宫博物院数字文物库 | digicol.dpm.org.cn | High (zoomable tiles) | No public API; scraping is gray area | Unclear; educational use likely tolerated | Best source for Forbidden City artifacts. Would need manual download or tile-stitching. |
| Wikimedia Commons | commons.wikimedia.org | Varies (many high-res) | Yes (MediaWiki API) | CC-BY-SA / Public Domain | Search: "Forbidden City", "Ming dynasty", "Qing porcelain". Large collection. |
| The Met Open Access | metmuseum.org/art/collection | Very high | Yes (public API) | CC0 (public domain) | Excellent Chinese art collection. ~4,000+ Chinese items. Best licensing. |
| Smithsonian Open Access | si.edu/openaccess | High | Yes | CC0 | Freer/Sackler Gallery has strong Chinese collection. |
| Cleveland Museum of Art | clevelandart.org/open-access | High | Yes | CC0 | Notable Chinese ceramics and paintings. |
| National Palace Museum (Taiwan) | npm.gov.tw | Very high | Limited | Educational use | Enormous Chinese artifact collection. |
| Google Arts & Culture | artsandculture.google.com | Medium-High | No | View only; no download rights | Good for discovery, not for hosting images. |

**Recommendation:** Prioritize **The Met Open Access** and **Smithsonian** for
MVP — they have CC0 licensing (true public domain), good APIs, and excellent
Chinese collections. Use Wikimedia as secondary. Add 故宫数字文物库 images
later with manual curation.

> **Open question for Hugo:** Are you comfortable with artifacts from
> non-Chinese museums (Met, Smithsonian, Cleveland)? They hold genuine Chinese
> artifacts but some people prefer sourcing from Chinese institutions only.

(This is fine)

---

## 10. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 14+** (App Router) | SSR for SEO, great DX, React ecosystem |
| Styling | **Tailwind CSS** | Utility-first, good for responsive + custom design |
| Animation | **Framer Motion** (primary) | Layout animations, gestures, AnimatePresence |
| Animation | **GSAP** (secondary) | Complex timeline sequences (loading, transitions) |
| 3D/Shader | **Three.js** or **@react-three/fiber** (optional) | Only if ambient field needs WebGL. CSS may suffice. |
| Physics | **Framer Motion** springs or custom | For magnetic/gravitational interactions |
| State | **Zustand** | Lightweight, good for color selection + palette state |
| Data | **Static JSON** (MVP) | No database needed initially. Colors are static data. |
| Data (later) | **Prisma + PostgreSQL** | Only if user accounts, saved palettes, or CMS needed |
| Deployment | **Docker** (required) | Dockerfile + docker-compose for Hugo's Unraid server |
| Fonts | **Noto Serif SC** + system sans | Elegant Chinese typography |

### Why No Database for MVP?
The color dataset is small (~200-400 entries), static, and changes rarely.
A JSON file imported at build time is simpler, faster, and requires no
database infrastructure. Palette saving uses localStorage.

Add PostgreSQL later only if needed for: user accounts, community palettes,
or a CMS for Hugo to edit colors without touching JSON.

> **Open question for Hugo:** Is localStorage-based palette saving acceptable
> for MVP, or do you need server-side persistence from day one?

(You can save all these local as it reduces the time for db and it's easier to manage. We don't need the user account now)

---

## 11. Scope & Phasing

### MVP (Phase 1) — Core Experience
- [ ] Landing page with particle-coalesce entry animation
- [ ] Unified Explorer with floating color objects
- [ ] Magnetic cursor interaction (drift + glow)
- [ ] 3 lenses: Hue Family, Dynasty (timeline), Mood
- [ ] Color detail expansion (all formats + copy)
- [ ] ~50-80 placeholder colors in static JSON
- [ ] Responsive (desktop-first, mobile-adapted)
- [ ] Docker deployment (Dockerfile + docker-compose)
- [ ] Reduced-motion accessibility mode

### Phase 2 — Palette Lab & Polish
- [ ] Palette Lab workspace (drag, auto-suggest, export)
- [ ] Richer color descriptions and verified data
- [ ] Artifact images from public domain sources
- [ ] Performance optimization (virtualization, LOD)
- [ ] Dark/light mode toggle (the ambient field handles most of this naturally)

### Phase 3 — Enrichment
- [ ] Material-texture rendering on color objects (silk sheen, ceramic gloss)
- [ ] Pattern/motif previews in Palette Lab
- [ ] PostgreSQL backend for persistent palettes
- [ ] Search functionality (by name, pinyin, hex)
- [ ] i18n (English / 中文 toggle)

### Explicitly Descoped
- User accounts / authentication
- Community features (sharing palettes publicly)
- 3D palace walkthrough mode (cool but enormous scope)
- Book content or book images
- E-commerce or monetization features

---

## 12. Open Questions for Hugo

Collected from throughout this document:

1. **Dynasty sparsity:** Show sparse/empty dynasties on timeline, or hide
   until data exists? (answered)
2. **Mood taxonomy:** Add/remove/rename any moods? Can one color have
   multiple moods? (I assumed yes.) (answered)
3. **Data format:** Single JSON file or one file per color? (I'd prefer per color to reduce the context load for future edits for you as AI)
4. **Image sources:** OK with non-Chinese museums (Met, Smithsonian)? (answered)
5. **Palette persistence:** localStorage OK for MVP, or need server-side? (answered)
6. **Color object materials:** Should the visual material texture on each
   color object match its `material` field literally, or is it more of an
   artistic choice per color? (i would say artistic choice. There's no definite material of one color, it's all based on the scenario)
7. **Mobile experience:** The magnetic cursor interactions are desktop-only.
   What should the mobile equivalent be? (Suggestion: touch-drag to explore,
   tap to select, tilt-based parallax via gyroscope.) (I agree with your suggestion)
8. **Language:** Primary language Chinese or English? Or bilingual from the start? (please support Chinese and English for now)
9. **Domain / hosting:** Do you have a domain in mind, or is this purely
   local/Unraid for now? (I can handle the hosting, you just need to build the docker)

---

## 13. Rough Wireframe Descriptions

Since you asked for visual drafts rather than just text, here are descriptions
of key screens. I can generate actual mockup images or HTML prototypes as a
next step if you want.

### A. Landing Page
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│          (dark void, particles drifting in)           │
│                                                      │
│              particles coalesce into:                 │
│                                                      │
│                    宫 彩                              │
│              中国传统色 · 数字博物馆                    │
│                                                      │
│              [ 进入 · Enter ]                         │
│                                                      │
│   (ambient gradient slowly breathes in background)    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### B. Explorer — Default View (Hue Lens)
```
┌──────────────────────────────────────────────────────┐
│  宫彩    [Hue ◉] [Dynasty ○] [Mood ○]    [Lab] [?]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│        ●          ◉              ●                   │
│    ●       ●          ●    ●         ●               │
│       ●        ◉    ●        ●          ●            │
│   ●       ●              ●       ●          ●        │
│      ●         ●   ●         ●        ●              │
│  ●        ●           ●          ●       ●           │
│       ●      ●    ●        ●         ●               │
│                                                      │
│   (floating orbs grouped loosely by hue family)      │
│   (cursor creates glow + magnetic pull as it moves)  │
│                                                      │
│  ─── 红 ──── 橙 ──── 黄 ──── 绿 ──── 青 ──── 紫 ── │
└──────────────────────────────────────────────────────┘
```

### C. Explorer — Dynasty Lens
```
┌──────────────────────────────────────────────────────┐
│  宫彩    [Hue ○] [Dynasty ◉] [Mood ○]    [Lab] [?]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ◄  秦  │   汉   │     唐     │   宋   │  元 │  明  │
│         │  ● ●   │  ● ● ● ●  │ ● ● ● │  ●  │● ● ●│
│         │   ●    │  ● ● ●    │ ● ●   │     │ ● ● │
│         │        │   ● ●     │  ●    │     │  ●  │
│                                                   ►  │
│                                                      │
│   (horizontal scroll ribbon, silk texture)            │
│   (colors float above their dynasty column)           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### D. Color Detail (Expanded)
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   (blurred orbs in background)                       │
│                                                      │
│         ┌─────────────────────────────┐              │
│         │                             │              │
│         │      ████████████████       │              │
│         │      ████ 凤信紫 ████       │              │
│         │      ████████████████       │              │
│         │                             │              │
│         │  Feng Xin Zi                │              │
│         │  明 · 庄重 · 威严            │              │
│         │                             │              │
│         │  HEX  #6E3E8E        [📋]  │              │
│         │  RGB  110, 62, 142   [📋]  │              │
│         │  HSL  277°, 39%, 40% [📋]  │              │
│         │  CMYK 23, 56, 0, 44  [📋]  │              │
│         │                             │              │
│         │  "凤鸟传信之色，源于宫廷      │              │
│         │   织锦中的紫色调。"           │              │
│         │                             │              │
│         │  Similar: ● ● ● ●          │              │
│         │  [Add to Palette]           │              │
│         └─────────────────────────────┘              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### E. Palette Lab
```
┌──────────────────────────────────────────────────────┐
│  宫彩    Palette Lab                    [← Explorer] │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Color     │   Your Palette                          │
│  Sidebar   │   ┌───┬───┬───┬───┬───┬───┬───┬───┐   │
│            │   │ ● │ ● │ ● │ ● │   │   │   │   │   │
│  ● 凤信紫  │   └───┴───┴───┴───┴───┴───┴───┴───┘   │
│  ● 月白    │                                         │
│  ● 胭脂    │   Suggestions:                          │
│  ● 鸦青    │   Complementary: ● ● ●                  │
│  ● ...     │   Analogous: ● ● ●                      │
│            │                                         │
│  (drag →)  │   Preview:                              │
│            │   ┌─────────┐  ┌──────────────────┐    │
│            │   │ UI Mock │  │  Pattern Preview  │    │
│            │   └─────────┘  └──────────────────┘    │
│            │                                         │
│            │   [Export JSON] [Export CSS] [Export PNG] │
└────────────┴─────────────────────────────────────────┘
```

---

## 14. Key Differentiators vs. Existing Sites

| Existing sites | GongCai |
|----------------|---------|
| Flat color grid or list | Floating 3D-ish objects with physics |
| Full-page background color fill | Ambient gradient field that breathes |
| Click-only interaction | Mouse proximity, magnetic drift, cursor glow |
| Separate pages for dynasty/mood/material | Unified canvas with switchable lenses |
| Static presentation | Particle animations, spring physics, parallax |
| Basic color code display | Ceremonial color detail with one-click copy |
| No palette building | Full Palette Lab with export |

---

*This document is a living design spec. Hugo should review, annotate, and
answer the open questions before implementation begins.*


(I won't provide detailed comments on the middle sections becasue I prefer for a MVP then we make small adjustments)
