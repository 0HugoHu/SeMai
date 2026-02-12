# 色脉 SeMai

An immersive digital color museum for Chinese traditional colors, inspired by *"中国传统色：故宫里的色彩美学"*.

**脉** carries three meanings that define this project:
- **Lineage** (脉络) — tracing colors through dynasties
- **Pulse** (脉搏) — the site breathes, it is alive
- **Flow** (经脉) — colors connect to mood, body, and emotion

## Features

- **Unified Explorer** with switchable lenses — Hue (色系), Dynasty (朝代), Mood (情绪)
- **65+ traditional Chinese colors** with accurate HEX, RGB, HSL, and CMYK values
- **Floating color orbs** with material-based visuals (silk, ceramic, lacquer, stone, metal)
- **Breathing ambient background** with cursor lantern glow
- **Color Vein (脉) layout** — a stem-and-branch visual metaphor for hue families
- **Dynasty timeline** with historical context on hover
- **Palette Lab** — build, preview, and export palettes (JSON / CSS / Tailwind)
- **Bilingual** (中文 / English)
- **Immerse / Neutral mode** toggle

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) — layout animations, spring physics
- [Zustand](https://zustand.docs.pmnd.rs/) — global state management
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) — ambient background, particle effects
- TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Docker

```bash
docker compose up -d
```

The site will be available at port 3000.

## Project Structure

```
src/
  app/           # Next.js App Router pages and global styles
  components/    # React components
    AmbientBackground.tsx   # Breathing gradient canvas + cursor lantern
    ColorDetail.tsx         # Color info overlay card
    ColorOrb.tsx            # Floating material-textured color orb
    Explorer.tsx            # Main explorer with lens layouts
    Header.tsx              # Navigation bar with lens toggles
    LandingPage.tsx         # Animated landing with particle coalescence
    PaletteLab.tsx          # Palette builder and export
  data/
    colors/      # 65 individual color JSON files
    colors.ts    # Aggregation module
  hooks/         # Custom React hooks
  lib/
    colorUtils.ts  # Color math, dynasty/mood data, classification
    store.ts       # Zustand store (view, lens, palette, locale)
    types.ts       # TypeScript interfaces
```

## License

ISC
