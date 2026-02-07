import { Link, useLocation } from 'react-router-dom'
import { useModels } from '@/hooks/useModels'

interface DocSection {
  id: string
  title: string
}

const sections: DocSection[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'chart-types', title: 'Chart Types Explained' },
  { id: 'data-sources', title: 'Model Data Sources' },
  { id: 'benchmarks', title: 'How Benchmarks Work' },
  { id: 'reading-viz', title: 'Reading the Visualizations' },
  { id: 'faq', title: 'FAQ' },
]

function DocsPage() {
  const { models, providers, benchmarkKeys } = useModels()
  const location = useLocation()

  // Detect which variant prefix we're under (e.g. "/1", "/2", etc.)
  const variantMatch = location.pathname.match(/^\/(\d)/)
  const variantPrefix = variantMatch ? `/${variantMatch[1]}` : ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-lg opacity-70">
          Everything you need to know about Model Arena — chart types, benchmarks,
          data sources, and how to interpret the visualizations.
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="border rounded-lg p-4" style={{ borderColor: 'currentColor', opacity: 0.2, borderWidth: 1 }}>
        <div style={{ opacity: 5 }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-60">
            Contents
          </h2>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ====== Overview ====== */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-bold">Overview</h2>
        <p>
          Model Arena is an interactive dashboard for comparing frontier large language models
          (LLMs) across standardized benchmarks, pricing, and capabilities. It currently tracks{' '}
          <strong>{models.length} models</strong> from{' '}
          <strong>{providers.length} providers</strong> across{' '}
          <strong>{benchmarkKeys.length} benchmark dimensions</strong>.
        </p>
        <p>
          The application is a single-page React app powered by D3.js for data visualization.
          All model data is sourced from a static JSON file, making it easy to update and extend.
          Five distinct visual themes let you experience the same data through radically different
          design aesthetics.
        </p>
        <p>
          Use the navigation bar to switch between chart types, or visit the{' '}
          <Link to={variantPrefix || '/'} className="underline font-medium">
            home page
          </Link>{' '}
          for an overview of all models.
        </p>
      </section>

      {/* ====== Chart Types Explained ====== */}
      <section id="chart-types" className="space-y-6">
        <h2 className="text-2xl font-bold">Chart Types Explained</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Bar Chart</h3>
          <p>
            Grouped bar charts display benchmark scores for multiple models side by side.
            Each bar represents a model's score on a specific benchmark, making it easy to
            compare absolute performance. Bars are color-coded by provider. Use the controls
            to filter by benchmark or sort by score.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Radar Chart</h3>
          <p>
            The radar (spider) chart plots each model's scores across all {benchmarkKeys.length}{' '}
            benchmarks simultaneously. Each axis radiates from the center, with scores
            increasing outward. A model with balanced performance forms a regular polygon,
            while a model with specific strengths creates a distinctive shape. Overlay
            multiple models to compare their profiles at a glance.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Scatter Plot</h3>
          <p>
            The scatter plot maps models onto a two-dimensional space. By default, it plots
            benchmark performance against pricing, helping you identify the best value models.
            Models in the upper-left quadrant offer high performance at lower cost. Hover over
            data points for detailed model information.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Comparison Table</h3>
          <p>
            A sortable, searchable data table listing all models with their full benchmark
            scores, pricing, context window, and metadata. Click column headers to sort.
            The table is the most information-dense view, ideal for detailed side-by-side
            comparisons.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Timeline</h3>
          <p>
            The timeline visualizes model release dates on a chronological axis, showing
            how performance has evolved over time. Each point represents a model release,
            sized or colored by benchmark performance. This view highlights the rapid pace
            of LLM development and generational improvements.
          </p>
        </div>
      </section>

      {/* ====== Model Data Sources ====== */}
      <section id="data-sources" className="space-y-4">
        <h2 className="text-2xl font-bold">Model Data Sources</h2>
        <p>
          All model data is stored in <code className="text-sm px-1 py-0.5 rounded bg-black/5">data/models.json</code> and
          includes the following for each model:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Identity:</strong> Name, provider, release date, parameter count</li>
          <li><strong>Capabilities:</strong> Context window, max output tokens, supported modalities</li>
          <li><strong>Benchmarks:</strong> Scores across {benchmarkKeys.length} standardized evaluations</li>
          <li><strong>Pricing:</strong> Input and output token costs per million tokens (USD)</li>
          <li><strong>Features:</strong> Thinking mode support, tool use capability, training cutoff</li>
          <li><strong>Metadata:</strong> Description, tags, and unique identifiers</li>
        </ul>
        <p>
          Benchmark scores are sourced from official model papers, provider announcements,
          and community evaluations. Scores are normalized to percentages (0–100) for
          consistent comparison across models.
        </p>
      </section>

      {/* ====== How Benchmarks Work ====== */}
      <section id="benchmarks" className="space-y-4">
        <h2 className="text-2xl font-bold">How Benchmarks Work</h2>
        <p>
          Each benchmark evaluates a different capability. Here's what they measure:
        </p>

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold">MMLU (Massive Multitask Language Understanding)</h4>
            <p className="text-sm opacity-80">
              Tests knowledge across 57 academic subjects including STEM, humanities, and social sciences.
              Widely considered the standard benchmark for general knowledge.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">HumanEval</h4>
            <p className="text-sm opacity-80">
              Measures code generation ability by asking models to complete Python functions.
              Scores reflect the percentage of functions that pass unit tests.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">MATH</h4>
            <p className="text-sm opacity-80">
              Tests mathematical problem-solving across difficulty levels from algebra to
              competition-level mathematics.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">GSM8K</h4>
            <p className="text-sm opacity-80">
              Grade school math word problems requiring multi-step reasoning. Tests
              fundamental arithmetic and logical reasoning.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">GPQA (Graduate-Level Google-Proof Q&A)</h4>
            <p className="text-sm opacity-80">
              Expert-level questions in biology, physics, and chemistry that cannot be
              easily answered by searching the web.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">HellaSwag</h4>
            <p className="text-sm opacity-80">
              Tests commonsense reasoning by asking models to predict the most plausible
              continuation of a scenario.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">ARC (AI2 Reasoning Challenge)</h4>
            <p className="text-sm opacity-80">
              Science questions from standardized tests, split into Easy and Challenge
              sets. Tests scientific reasoning and world knowledge.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">TruthfulQA</h4>
            <p className="text-sm opacity-80">
              Measures whether a model generates truthful answers to questions designed
              to elicit common misconceptions and falsehoods.
            </p>
          </div>
        </div>
      </section>

      {/* ====== Reading the Visualizations ====== */}
      <section id="reading-viz" className="space-y-4">
        <h2 className="text-2xl font-bold">Reading the Visualizations</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Color Coding</h3>
          <p>
            Models are color-coded by provider throughout all chart types. This makes it easy
            to track a provider's models across different views. The same color for "OpenAI"
            in the bar chart will appear in the radar chart, scatter plot, and timeline.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Interactive Elements</h3>
          <p>
            All charts support hover tooltips showing detailed information about individual
            data points. Charts resize responsively when the browser window changes.
            Tables support click-to-sort on column headers.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Interpreting Scores</h3>
          <p>
            All benchmark scores are percentages (0–100). Higher is better. A score above 90
            is considered exceptional, 80–90 is strong, and 70–80 is competitive.
            The "average benchmark" score shown on model cards is the arithmetic mean
            across all {benchmarkKeys.length} benchmarks.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing Context</h3>
          <p>
            Pricing is shown in USD per million tokens. Input tokens (your prompts) and
            output tokens (model responses) are typically priced differently.
            Some models offer free tiers, indicated by a $0.00 price.
          </p>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section id="faq" className="space-y-6">
        <h2 className="text-2xl font-bold">FAQ</h2>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">How often is the data updated?</h4>
            <p className="text-sm opacity-80">
              Model data is updated manually as new models are released or benchmark scores
              are revised. Check the "last updated" indicator for the most recent data refresh.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Why are some benchmark scores missing?</h4>
            <p className="text-sm opacity-80">
              Some providers don't publish results for all benchmarks. When a score is
              unavailable, it may appear as 0 or be excluded from calculations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">What are the 5 variants?</h4>
            <p className="text-sm opacity-80">
              Each variant is a complete visual redesign of the same dashboard — same data,
              same charts, different aesthetics. They demonstrate how design choices affect
              data perception. Visit the{' '}
              <Link to="/" className="underline">variant picker</Link> to explore all five.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Can I add my own models?</h4>
            <p className="text-sm opacity-80">
              Yes! Edit <code className="text-sm px-1 py-0.5 rounded bg-black/5">data/models.json</code> and
              add entries following the existing schema. The app will automatically
              include them in all charts and tables.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">How are average scores calculated?</h4>
            <p className="text-sm opacity-80">
              The average benchmark score is the arithmetic mean of all {benchmarkKeys.length}{' '}
              benchmark scores for a given model. This provides a single number for quick
              comparison, though individual benchmarks should be examined for detailed analysis.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Is Model Arena open source?</h4>
            <p className="text-sm opacity-80">
              Yes, Model Arena is released under the MIT license. Feel free to fork,
              modify, and use it for your own projects.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DocsPage
