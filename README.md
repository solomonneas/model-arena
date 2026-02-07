# Model Arena

Interactive platform for comparing frontier AI/LLM models across benchmarks, pricing, and capabilities. Features 5 completely distinct visual design variants.

**Live:** [modelarena.solomonneas.dev](https://modelarena.solomonneas.dev) (coming soon)

## Design Variants

Each variant is a fully independent frontend with its own layout, typography, color system, and interaction patterns:

| Variant | Theme | Fonts | Aesthetic |
|---------|-------|-------|-----------|
| `/1` | **Brutalist / Raw Concrete** | Space Mono, Archivo Black | Black/white/orange, zero rounded corners, dense newspaper columns, monochrome charts |
| `/2` | **Retro-Futuristic / Synthwave Terminal** | Orbitron, IBM Plex Mono | CRT scanline overlay, neon cyan/magenta/green glows, terminal windows, blinking status bar |
| `/3` | **Luxury Editorial / High Fashion Magazine** | Playfair Display, Cormorant Garamond, DM Sans | Cream/gold, magazine spread layout, elegant 800ms+ animations, hairline-rule tables |
| `/4` | **NOC / Dark Operator / Mission Control** | JetBrains Mono, Barlow Condensed | Navy void, status color coding (green/amber/red), maximum information density, animated counters |
| `/5` | **Organic / Nature-Inspired / Living Data** | Fraunces, Nunito Sans, Caveat | Warm parchment, earth tones, paper grain texture, spring physics, circular ecosystem bubbles |

## Features

- **Radar Charts**: Multi-dimensional benchmark comparison across models
- **Timeline View**: Model release history and performance evolution
- **Scatter Plots**: Benchmark vs. pricing vs. capability analysis
- **2025-2026 Model Data**: GPT-5.2, Claude Opus 4.6, Gemini 3 Pro, Kimi K2.5, DeepSeek R1, and more
- **Variant Picker**: Landing page to browse and select design variants

## Tech Stack

- **React 18** with TypeScript
- **D3.js** for data visualizations (radar charts, scatter plots, timelines)
- **Tailwind CSS** for utility styling
- **React Router** for variant routing (`/1` through `/5`)
- **Vite** for builds
- **Google Fonts** loaded per-variant

## Getting Started

```bash
npm install
npm run dev       # Start dev server
npm run build     # Production build
```

## Project Structure

```
data/
└── models.json     # Model benchmark data
src/
├── components/     # Shared visualization components (D3-based)
├── data/          # Shared constants and config
├── types/         # TypeScript interfaces
├── pages/         # Variant picker landing
├── utils/         # Formatting and helper utilities
├── variants/
│   ├── v1/        # Brutalist
│   ├── v2/        # Synthwave Terminal
│   ├── v3/        # Luxury Editorial
│   ├── v4/        # NOC Mission Control
│   └── v5/        # Organic Nature
└── App.tsx        # Router setup
```

## License

MIT
