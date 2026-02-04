# Model Arena

Interactive visualizations for comparing large language models across multiple benchmarks.

## Features

- **Radar Chart**: Compare models across multiple benchmark dimensions
- **Timeline**: Track model releases and performance improvements over time
- **Scatter Plot**: Explore relationships between benchmarks, pricing, and characteristics
- **Responsive Design**: Mobile-friendly interface with smooth 60fps animations

## Tech Stack

- **React 18** with TypeScript
- **D3.js** for data visualizations
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Vite** for fast development and building

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies (note: network commands blocked in sandbox)
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
model-arena/
├── data/
│   └── models.json          # Model benchmark data
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── RadarView.tsx
│   │   ├── TimelineView.tsx
│   │   └── ScatterView.tsx
│   ├── styles/
│   │   └── index.css       # Global styles with Tailwind
│   ├── types/
│   │   └── model.ts        # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Model Data Schema

Each model in `data/models.json` includes:

- `name`: Model display name
- `provider`: Company/organization
- `release_date`: ISO date string
- `parameters`: Model size (e.g., "7B", "70B")
- `context_window`: Maximum context length in tokens
- `benchmarks`: Performance scores (MMLU, HumanEval, MATH, GSM8K, HellaSwag, ARC, TruthfulQA)
- `pricing`: Input/output costs per million tokens

## Benchmarks Explained

- **MMLU**: Massive Multitask Language Understanding (general knowledge)
- **HumanEval**: Coding capability assessment
- **MATH**: Advanced mathematical reasoning
- **GSM8K**: Grade school math word problems
- **HellaSwag**: Commonsense reasoning
- **ARC**: AI2 Reasoning Challenge
- **TruthfulQA**: Truthfulness and factual accuracy

## Next Steps

1. Implement D3.js radar chart visualization
2. Build interactive timeline with release dates
3. Create scatter plot with benchmark correlations
4. Add model comparison and filtering features
5. Implement data export functionality

## License

MIT
