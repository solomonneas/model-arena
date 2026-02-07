import { useState } from 'react'
import { Model, BenchmarkKey } from '@/types/model'
import BarChart from '@/components/BarChart'
import { editorialTheme } from '../theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

type ChartMode = 'benchmark' | 'context' | 'pricing' | 'output_price'

const MODE_OPTIONS: Array<{ value: ChartMode; label: string }> = [
  { value: 'benchmark', label: 'Benchmark Scores' },
  { value: 'context', label: 'Context Windows' },
  { value: 'pricing', label: 'Input Pricing' },
  { value: 'output_price', label: 'Output Pricing' },
]

function BarChartView() {
  const [mode, setMode] = useState<ChartMode>('benchmark')
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>('MMLU')

  return (
    <div className="max-w-5xl mx-auto px-8 md:px-12 py-12">
      {/* HEADER */}
      <header className="text-center mb-12">
        <p
          className="v3-label mb-3"
          style={{ fontSize: '0.6rem', letterSpacing: '0.35em', color: '#C9A96E' }}
        >
          Quantitative Analysis
        </p>
        <h1
          className="v3-headline text-3xl md:text-4xl mb-4"
          style={{ fontWeight: 400, letterSpacing: '0.02em' }}
        >
          Charts & Rankings
        </h1>
        <p
          className="v3-body text-base max-w-xl mx-auto"
          style={{ color: '#7A7A7A', lineHeight: 1.8 }}
        >
          Visualize model performance through elegant bar chart representations,
          comparing benchmarks, context capacity, and pricing.
        </p>
      </header>

      {/* MODE SELECTOR */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
        <div className="flex items-center gap-3">
          <label
            className="v3-label"
            style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: '#7A7A7A' }}
          >
            Visualization
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ChartMode)}
            className="text-sm px-4 py-2 border border-[#E8E2D8] focus:border-[#C9A96E] outline-none transition-all duration-300"
            style={{
              fontFamily: "'Cormorant Garamond', Garamond, serif",
              backgroundColor: '#FFFFFF',
              color: '#1C1C1C',
              minWidth: '180px',
            }}
          >
            {MODE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {mode === 'benchmark' && (
          <div className="flex items-center gap-3">
            <label
              className="v3-label"
              style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: '#7A7A7A' }}
            >
              Benchmark
            </label>
            <select
              value={selectedBenchmark}
              onChange={(e) => setSelectedBenchmark(e.target.value as BenchmarkKey)}
              className="text-sm px-4 py-2 border border-[#E8E2D8] focus:border-[#C9A96E] outline-none transition-all duration-300"
              style={{
                fontFamily: "'Cormorant Garamond', Garamond, serif",
                backgroundColor: '#FFFFFF',
                color: '#1C1C1C',
                minWidth: '200px',
              }}
            >
              {BENCHMARK_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* CHART DISPLAY */}
      <div className="border border-[#E8E2D8] bg-white p-6 md:p-8 mb-8">
        <div className="border-b border-[#E8E2D8] pb-3 mb-6">
          <h2
            className="v3-headline text-xl"
            style={{ fontWeight: 400, letterSpacing: '0.02em' }}
          >
            {mode === 'benchmark' && (BENCHMARK_OPTIONS.find(o => o.value === selectedBenchmark)?.label || selectedBenchmark)}
            {mode === 'context' && 'Context Window Capacity'}
            {mode === 'pricing' && 'Input Token Pricing'}
            {mode === 'output_price' && 'Output Token Pricing'}
          </h2>
          <p
            className="v3-body text-sm mt-1"
            style={{ color: '#7A7A7A' }}
          >
            {mode === 'benchmark' && 'Ranked by performance score'}
            {mode === 'context' && 'Measured in thousands of tokens'}
            {mode === 'pricing' && 'Cost per million input tokens'}
            {mode === 'output_price' && 'Cost per million output tokens'}
          </p>
        </div>
        <BarChart
          models={models}
          theme={editorialTheme}
          mode={mode}
          benchmarkField={selectedBenchmark}
          maxModels={15}
          sortDirection="desc"
        />
      </div>

      {/* PRICING COMPARISON */}
      {(mode === 'pricing' || mode === 'output_price') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#E8E2D8] bg-white p-6">
            <div className="border-b border-[#E8E2D8] pb-3 mb-4">
              <h3
                className="v3-headline text-lg"
                style={{ fontWeight: 400, letterSpacing: '0.02em' }}
              >
                Most Economical Input
              </h3>
            </div>
            <BarChart
              models={models}
              theme={editorialTheme}
              mode="pricing"
              maxModels={10}
              sortDirection="asc"
            />
          </div>
          <div className="border border-[#E8E2D8] bg-white p-6">
            <div className="border-b border-[#E8E2D8] pb-3 mb-4">
              <h3
                className="v3-headline text-lg"
                style={{ fontWeight: 400, letterSpacing: '0.02em' }}
              >
                Most Economical Output
              </h3>
            </div>
            <BarChart
              models={models}
              theme={editorialTheme}
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
