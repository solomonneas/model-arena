<div align="center">

# 🏟️ Model Arena

**Interactive LLM benchmark comparison dashboard with 5 distinct visual themes**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![D3.js](https://img.shields.io/badge/D3.js-7-F9A03C?style=flat-square&logo=d3.js&logoColor=white)](https://d3js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

![Model Arena](docs/screenshots/dashboard.png)

</div>

---

## ✨ Features

- **Multi-chart visualizations** — Bar charts, radar charts, scatter plots, comparison tables, and timelines
- **20+ frontier LLM models** — GPT-5.2, Claude Opus 4.6, Gemini 3 Pro, DeepSeek R1, Kimi K2.5, and more
- **8 benchmark dimensions** — MMLU, HumanEval, MATH, GSM8K, GPQA, HellaSwag, ARC, TruthfulQA
- **Cost analysis** — Compare pricing across providers with input/output token rates
- **5 visual themes** — Each with its own typography, color system, layout, and interaction patterns
- **Responsive SVG charts** — D3.js-powered visualizations that adapt to any screen size
- **In-app guided tour** — Interactive onboarding powered by driver.js
- **Built-in documentation** — Help page explaining chart types, benchmarks, and data sources
- **Zero backend** — Pure client-side React app with JSON data source

---

## 🏗️ Architecture

Model Arena is a **single-page React application** with a variant-based architecture:

```
┌─────────────────────────────────────────────┐
│                 BrowserRouter                │
│  ┌───────────┐  ┌───────────────────────┐   │
│  │  Variant   │  │   /1/* → V1App       │   │
│  │  Picker    │  │   /2/* → V2App       │   │
│  │   (/)      │  │   /3/* → V3App       │   │
│  │            │  │   /4/* → V4App       │   │
│  │            │  │   /5/* → V5App       │   │
│  └───────────┘  └──────────┬────────────┘   │
│                             │                │
│              ┌──────────────┼──────────┐     │
│              │   Shared Components     │     │
│              │  BarChart · RadarChart  │     │
│              │  ScatterPlot · Timeline │     │
│              │  ComparisonTable        │     │
│              └──────────────┬──────────┘     │
│                             │                │
│              ┌──────────────┴──────────┐     │
│              │   data/models.json      │     │
│              │   (20+ LLM benchmarks)  │     │
│              └─────────────────────────┘     │
└─────────────────────────────────────────────┘
```

- **Data layer:** Static JSON file (`data/models.json`) with benchmark scores, pricing, and metadata
- **Shared components:** D3.js-based SVG chart components consumed by all variants
- **Per-variant overrides:** Each variant has its own `App.tsx`, `theme.ts`, `styles.css`, and page-level components
- **Hooks:** `useModels` provides memoized model data and computed stats across the app

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/model-arena.git
cd model-arena

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the variant picker, then select a theme to explore.

### Build

```bash
npm run build     # TypeScript check + production build
npm run preview   # Preview the production build
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18 | Component-based UI |
| **Language** | TypeScript 5.3 | Type-safe development |
| **Build Tool** | Vite 5 | Fast HMR and optimized builds |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **Charts** | D3.js 7 | SVG data visualizations |
| **Routing** | React Router 6 | Client-side routing with variant nesting |
| **Fonts** | Google Fonts | Per-variant typography (Orbitron, Playfair Display, etc.) |

---

## 📁 Project Structure

```
model-arena/
├── data/
│   └── models.json              # LLM benchmark data (20+ models)
├── src/
│   ├── components/              # Shared visualization components
│   │   ├── BarChart.tsx          #   Grouped/stacked bar charts
│   │   ├── RadarChart.tsx        #   Multi-axis radar/spider charts
│   │   ├── ScatterPlot.tsx       #   X/Y scatter with tooltips
│   │   ├── ComparisonTable.tsx   #   Sortable data table
│   │   ├── Timeline.tsx          #   Release timeline visualization
│   │   ├── ModelCard.tsx         #   Model summary card
│   │   ├── GuidedTour.tsx        #   Interactive onboarding tour
│   │   └── ErrorBoundary.tsx     #   React error boundary
│   ├── pages/                   # Top-level pages
│   │   ├── VariantPicker.tsx     #   Landing page (variant selector)
│   │   └── DocsPage.tsx          #   In-app documentation
│   ├── hooks/
│   │   ├── useModels.ts          #   Shared model data hook
│   │   └── useResizeObserver.ts  #   Responsive chart sizing
│   ├── types/
│   │   ├── model.ts              #   Model, Benchmark, Pricing types
│   │   └── theme.ts              #   VariantTheme interface
│   ├── utils/
│   │   ├── formatters.ts         #   Number, date, price formatting
│   │   └── timeline.ts           #   Timeline layout utilities
│   ├── variants/
│   │   ├── v1/                   #   Brutalist theme
│   │   ├── v2/                   #   Synthwave Terminal theme
│   │   ├── v3/                   #   Luxury Editorial theme
│   │   ├── v4/                   #   NOC Mission Control theme
│   │   └── v5/                   #   Organic Nature theme
│   ├── App.tsx                  # Root router
│   └── main.tsx                 # Entry point
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🎨 Design Variants

Each variant is a fully independent visual experience sharing the same data and chart components:

| Variant | Theme | Typography | Aesthetic |
|---------|-------|-----------|-----------|
| **`/1`** | Brutalist / Raw Concrete | Space Mono, Archivo Black | Black/white/orange, zero border-radius, monochrome charts, dense newspaper columns |
| **`/2`** | Retro-Futuristic / Synthwave | Orbitron, IBM Plex Mono | CRT scanline overlay, neon cyan/magenta/green glows, live system clock, terminal windows |
| **`/3`** | Luxury Editorial / High Fashion | Playfair Display, Cormorant Garamond, DM Sans | Cream/gold palette, magazine spread layout, elegant 800ms+ transitions, hairline-rule tables |
| **`/4`** | NOC / Dark Operator / Mission Control | JetBrains Mono, Barlow Condensed | Navy void, green/amber/red status coding, maximum information density, live status bar |
| **`/5`** | Organic / Nature-Inspired | Fraunces, Nunito Sans, Caveat | Warm parchment, earth tones, paper grain texture, flowing wave dividers, organic feel |

---

## 📊 Chart Types

### Bar Chart
Grouped bar chart comparing models across selected benchmarks. Supports sorting by score, filtering by provider, and benchmark selection.

### Radar Chart
Multi-axis spider/radar chart overlaying multiple models on the same axes. Each axis represents a benchmark dimension (MMLU, HumanEval, MATH, etc.), making it easy to spot strengths and weaknesses at a glance.

### Scatter Plot
Two-dimensional scatter plot for exploring relationships between benchmarks, pricing, and model characteristics. Useful for finding the best value models (performance vs. cost).

### Comparison Table
Interactive sortable table with all models and their benchmark scores. Supports column sorting, search filtering, and side-by-side model comparison.

### Timeline
Chronological visualization of model releases over time, showing the progression of benchmark scores across generations. Tracks the rapid pace of LLM development from 2024–2026.

---

## 📄 License

[MIT](LICENSE) — build whatever you want with it.
