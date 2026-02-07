import { useState } from 'react'
import { Model, BenchmarkKey } from '@/types/model'
import BarChart from '@/components/BarChart'
import { synthwaveTheme } from '../theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

type ChartMode = 'benchmark' | 'context' | 'pricing' | 'output_price'

const MODE_OPTIONS: Array<{ value: ChartMode; label: string }> = [
  { value: 'benchmark', label: 'BENCHMARK SCORES' },
  { value: 'context', label: 'CONTEXT WINDOW' },
  { value: 'pricing', label: 'INPUT PRICING' },
  { value: 'output_price', label: 'OUTPUT PRICING' },
]

function BarChartView() {
  const [mode, setMode] = useState<ChartMode>('benchmark')
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>('MMLU')

  return (
    <div>
      {/* HEADER */}
      <div className="border-b border-[#2A2A4E] pb-3 mb-6">
        <h1
          className="text-2xl uppercase v2-glow-cyan"
          style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: '#00FFD4' }}
        >
          CHARTS // DATA VISUALIZATION
        </h1>
        <p
          className="text-xs mt-1 uppercase tracking-wider"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#4A4A6A' }}
        >
          ◈ RANKED VISUALIZATIONS // BENCHMARKS · CONTEXT · PRICING ◈
        </p>
      </div>

      {/* MODE SELECTOR */}
      <div className="mb-6 p-3 border border-[#2A2A4E]" style={{ backgroundColor: '#0A0A0F' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#4A4A6A' }}
          >
            MODE:
          </span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ChartMode)}
            className="text-xs px-3 py-2 border border-[#2A2A4E] focus:border-[#00FFD4] outline-none transition-colors"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              backgroundColor: '#1A1A2E',
              color: '#00FFD4',
            }}
          >
            {MODE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {mode === 'benchmark' && (
            <>
              <span
                className="text-xs uppercase tracking-wider"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#4A4A6A' }}
              >
                BENCHMARK:
              </span>
              <select
                value={selectedBenchmark}
                onChange={(e) => setSelectedBenchmark(e.target.value as BenchmarkKey)}
                className="text-xs px-3 py-2 border border-[#2A2A4E] focus:border-[#FF00FF] outline-none transition-colors"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  backgroundColor: '#1A1A2E',
                  color: '#FF00FF',
                }}
              >
                {BENCHMARK_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* CHART DISPLAY */}
      <div className="border border-[#2A2A4E] p-4" style={{ backgroundColor: '#0A0A0F' }}>
        <div className="border-b border-[#2A2A4E] pb-2 mb-4">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#4A4A6A' }}
          >
            {mode === 'benchmark' && `◈ ${BENCHMARK_OPTIONS.find(o => o.value === selectedBenchmark)?.label || selectedBenchmark} RANKING`}
            {mode === 'context' && '◈ CONTEXT WINDOW RANKING'}
            {mode === 'pricing' && '◈ INPUT PRICE RANKING'}
            {mode === 'output_price' && '◈ OUTPUT PRICE RANKING'}
          </span>
        </div>
        <BarChart
          models={models}
          theme={synthwaveTheme}
          mode={mode}
          benchmarkField={selectedBenchmark}
          maxModels={15}
          sortDirection="desc"
        />
      </div>

      {/* SECONDARY CHARTS FOR PRICING */}
      {(mode === 'pricing' || mode === 'output_price') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="border border-[#2A2A4E] p-4" style={{ backgroundColor: '#0A0A0F' }}>
            <div className="border-b border-[#2A2A4E] pb-2 mb-4">
              <span
                className="text-xs uppercase tracking-[0.2em]"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#4A4A6A' }}
              >
                ◈ LOWEST INPUT COST ◈
              </span>
            </div>
            <BarChart
              models={models}
              theme={synthwaveTheme}
              mode="pricing"
              maxModels={10}
              sortDirection="asc"
            />
          </div>
          <div className="border border-[#2A2A4E] p-4" style={{ backgroundColor: '#0A0A0F' }}>
            <div className="border-b border-[#2A2A4E] pb-2 mb-4">
              <span
                className="text-xs uppercase tracking-[0.2em]"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#4A4A6A' }}
              >
                ◈ LOWEST OUTPUT COST ◈
              </span>
            </div>
            <BarChart
              models={models}
              theme={synthwaveTheme}
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
