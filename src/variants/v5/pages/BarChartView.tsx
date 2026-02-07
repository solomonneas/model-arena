import { useState } from 'react'
import { Model, BenchmarkKey } from '@/types/model'
import BarChart from '@/components/BarChart'
import { organicTheme } from '../theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

type ChartMode = 'benchmark' | 'context' | 'pricing' | 'output_price'

const MODE_OPTIONS: Array<{ value: ChartMode; label: string }> = [
  { value: 'benchmark', label: '🌸 Benchmarks' },
  { value: 'context', label: '🌿 Context' },
  { value: 'pricing', label: '🌱 Input Cost' },
  { value: 'output_price', label: '🍃 Output Cost' },
]

function BarChartView() {
  const [mode, setMode] = useState<ChartMode>('benchmark')
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>('MMLU')

  return (
    <div className="py-6">
      {/* HEADER */}
      <header className="text-center mb-8">
        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1rem',
            color: '#8B7355',
          }}
        >
          visualizing growth 🌻
        </p>
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#2D5016',
            marginTop: '0.5rem',
          }}
        >
          Charts & Rankings
        </h1>
        <p
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: '0.95rem',
            color: '#8B7355',
            marginTop: '0.75rem',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Watch how each model flourishes across different metrics
        </p>
      </header>

      {/* MODE SELECTOR */}
      <div
        className="mb-6 p-4 mx-auto max-w-xl"
        style={{
          backgroundColor: '#FDFAF5',
          border: '1px solid #D4C4A8',
          borderRadius: '1rem',
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {MODE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              className={`px-4 py-2 text-sm transition-all duration-300 ${
                mode === opt.value
                  ? 'bg-[#2D5016] text-white'
                  : 'bg-[#F5EFE6] text-[#8B7355] hover:bg-[#E8E2D8]'
              }`}
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                borderRadius: '0.75rem',
                border: mode === opt.value ? 'none' : '1px solid #D4C4A8',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {mode === 'benchmark' && (
          <div className="flex items-center justify-center gap-3">
            <label
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1rem',
                color: '#8B7355',
              }}
            >
              choose a benchmark:
            </label>
            <select
              value={selectedBenchmark}
              onChange={(e) => setSelectedBenchmark(e.target.value as BenchmarkKey)}
              className="text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D5016] transition-all"
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                backgroundColor: '#FFFFFF',
                color: '#3E2723',
                border: '1px solid #D4C4A8',
                borderRadius: '0.5rem',
              }}
            >
              {BENCHMARK_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* MAIN CHART */}
      <div
        className="p-5 mb-6"
        style={{
          backgroundColor: '#FDFAF5',
          border: '1px solid #D4C4A8',
          borderRadius: '1rem',
        }}
      >
        <div className="mb-4 pb-3 border-b border-[#D4C4A8]">
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#2D5016',
            }}
          >
            {mode === 'benchmark' && `🌸 ${BENCHMARK_OPTIONS.find(o => o.value === selectedBenchmark)?.label || selectedBenchmark}`}
            {mode === 'context' && '🌿 Context Window Capacity'}
            {mode === 'pricing' && '🌱 Input Token Pricing'}
            {mode === 'output_price' && '🍃 Output Token Pricing'}
          </h2>
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: '0.85rem',
              color: '#8B7355',
              marginTop: '0.25rem',
            }}
          >
            {mode === 'benchmark' && 'ranked by performance'}
            {mode === 'context' && 'measured in thousands of tokens'}
            {mode === 'pricing' && 'cost per million input tokens'}
            {mode === 'output_price' && 'cost per million output tokens'}
          </p>
        </div>
        <BarChart
          models={models}
          theme={organicTheme}
          mode={mode}
          benchmarkField={selectedBenchmark}
          maxModels={15}
          sortDirection="desc"
        />
      </div>

      {/* PRICING COMPARISON */}
      {(mode === 'pricing' || mode === 'output_price') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
            className="p-5"
            style={{
              backgroundColor: '#FDFAF5',
              border: '1px solid #D4C4A8',
              borderRadius: '1rem',
            }}
          >
            <div className="mb-4 pb-3 border-b border-[#D4C4A8]">
              <h3
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#2D5016',
                }}
              >
                🌱 Most Affordable Input
              </h3>
            </div>
            <BarChart
              models={models}
              theme={organicTheme}
              mode="pricing"
              maxModels={10}
              sortDirection="asc"
            />
          </div>
          <div
            className="p-5"
            style={{
              backgroundColor: '#FDFAF5',
              border: '1px solid #D4C4A8',
              borderRadius: '1rem',
            }}
          >
            <div className="mb-4 pb-3 border-b border-[#D4C4A8]">
              <h3
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#2D5016',
                }}
              >
                🍃 Most Affordable Output
              </h3>
            </div>
            <BarChart
              models={models}
              theme={organicTheme}
              mode="output_price"
              maxModels={10}
              sortDirection="asc"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BarChartView
